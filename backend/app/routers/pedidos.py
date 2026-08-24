from collections import Counter
from datetime import date, datetime
from uuid import uuid4
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload

from app import models
from app.database import get_db
from app.schemas import LineaVentaInput, LineaVentaRead, PagoVentaCreate, PagoVentaRead, PedidoCreate, PedidoRead, PedidoUpdate

router = APIRouter(prefix="/pedidos", tags=["Ventas"])
COLUMBIA_TZ = ZoneInfo("America/Bogota")


def serialize(pedido: models.Pedido) -> PedidoRead:
    total_pagado = sum(pago.monto for pago in pedido.pagos)
    debe = max(pedido.total - total_pagado, 0)
    
    # Calcular estado de venta basado en si debe == 0
    estado_venta = "Completado" if debe < 0.005 else "Pendiente"
    
    return PedidoRead(
        id=pedido.id, clienteId=pedido.cliente_id, codigo=pedido.codigo, fecha=pedido.fecha,
        formaPago=pedido.formaPago, direccionEnvio=pedido.direccionEnvio,
        total=pedido.total, notas=pedido.notas, totalPagado=total_pagado, debe=debe,
        estado=pedido.estado,  # Estado del pedido (logística)
        estadoVenta=estado_venta,  # Estado de la venta (financiero)
        clienteNombre=pedido.cliente.nombre,
        clienteTelefono=pedido.cliente.telefono,
        clienteCiudad=pedido.cliente.ciudad,
        productos=[LineaVentaRead(productoId=linea.producto_id, nombre=linea.producto.nombre, precioUnitario=linea.precio_unitario, cantidad=linea.cantidad, subtotal=linea.subtotal) for linea in pedido.lineas],
    )


def product_quantities(items: list[LineaVentaInput]) -> Counter[str]:
    if not items:
        raise HTTPException(422, "Agrega al menos un producto a la venta.")
    quantities = Counter[str]()
    for item in items:
        if item.cantidad <= 0:
            raise HTTPException(422, "La cantidad de cada producto debe ser mayor que cero.")
        quantities[item.productoId] += item.cantidad
    return quantities


def replace_lines(pedido: models.Pedido, items: list[LineaVentaInput], db: Session) -> None:
    quantities = product_quantities(items)
    products = {
        product.id: product
        for product in db.scalars(select(models.Producto).where(models.Producto.id.in_(quantities)).with_for_update()).all()
    }
    missing = set(quantities) - set(products)
    if missing:
        raise HTTPException(404, "Uno de los productos seleccionados ya no existe.")
    previous_quantities = Counter(line.producto_id for line in pedido.lineas for _ in range(line.cantidad))
    for product_id, quantity in quantities.items():
        available = products[product_id].stock + previous_quantities[product_id]
        if available < quantity:
            raise HTTPException(422, f"{products[product_id].nombre} no está disponible en la cantidad solicitada. Stock actual: {available}.")

    for line in pedido.lineas:
        line.producto.stock += line.cantidad
    pedido.lineas.clear()
    db.flush()

    total = 0.0
    for product_id, quantity in quantities.items():
        product = products[product_id]
        product.stock -= quantity
        subtotal = product.precio * quantity
        total += subtotal
        pedido.lineas.append(models.LineaVenta(id=str(uuid4()), producto_id=product.id, precio_unitario=product.precio, cantidad=quantity, subtotal=subtotal))
    pedido.total = total


def payment_code() -> str:
    return f"PAG-{datetime.now(COLUMBIA_TZ).strftime('%Y%m%d')}-{str(uuid4())[:6].upper()}"


def add_payment(pedido: models.Pedido, monto: float) -> models.PagoVenta:
    total_pagado = sum(pago.monto for pago in pedido.pagos)
    saldo = pedido.total - total_pagado
    if monto <= 0:
        raise HTTPException(422, "El pago debe ser mayor que $0.")
    if monto > saldo + 0.005:
        raise HTTPException(422, "El pago no puede superar el saldo pendiente.")
    today_in_colombia = datetime.now(COLUMBIA_TZ).date()
    pago = models.PagoVenta(id=str(uuid4()), pedido_id=pedido.id, codigo=payment_code(), fecha=today_in_colombia, monto=monto)
    pedido.pagos.append(pago)
    return pago


@router.get("", response_model=list[PedidoRead])
def list_pedidos(q: str | None = Query(None), db: Session = Depends(get_db)):
    stmt = select(models.Pedido).options(selectinload(models.Pedido.lineas).selectinload(models.LineaVenta.producto), selectinload(models.Pedido.pagos)).order_by(models.Pedido.fecha.desc(), models.Pedido.codigo.desc())
    if q and q.strip():
        term = f"%{q.strip()}%"
        stmt = stmt.where(models.Pedido.codigo.ilike(term))
    return [serialize(pedido) for pedido in db.scalars(stmt).all()]


@router.post("", response_model=PedidoRead, status_code=status.HTTP_201_CREATED)
def create_pedido(payload: PedidoCreate, db: Session = Depends(get_db)):
    if not db.get(models.Cliente, payload.clienteId):
        raise HTTPException(404, "Cliente no encontrado")
    today_in_colombia = datetime.now(COLUMBIA_TZ)
    pedido = models.Pedido(
        id=str(uuid4()), cliente_id=payload.clienteId,
        codigo=f"AMT-{today_in_colombia.strftime('%Y%m%d')}-{str(uuid4())[:6].upper()}",
        fecha=today_in_colombia.date(), formaPago=payload.formaPago, direccionEnvio="", total=0, notas=payload.notas,
        estado="Pendiente"  # Estado inicial por defecto
    )
    db.add(pedido)
    db.flush()
    replace_lines(pedido, payload.productos, db)
    if payload.pagoInicial:
        add_payment(pedido, payload.pagoInicial)
    db.commit()
    db.refresh(pedido)
    pedido = db.scalar(select(models.Pedido).options(selectinload(models.Pedido.lineas).selectinload(models.LineaVenta.producto), selectinload(models.Pedido.pagos)).where(models.Pedido.id == pedido.id))
    return serialize(pedido)


@router.patch("/{pedido_id}", response_model=PedidoRead)
def update_pedido(pedido_id: str, payload: PedidoUpdate, db: Session = Depends(get_db)):
    pedido = db.scalar(select(models.Pedido).options(selectinload(models.Pedido.lineas).selectinload(models.LineaVenta.producto), selectinload(models.Pedido.pagos)).where(models.Pedido.id == pedido_id))
    if not pedido:
        raise HTTPException(404, "Venta no encontrada")
    if payload.clienteId and not db.get(models.Cliente, payload.clienteId):
        raise HTTPException(404, "Cliente no encontrado")
    if payload.productos is not None:
        replace_lines(pedido, payload.productos, db)
        if pedido.total + 0.005 < sum(pago.monto for pago in pedido.pagos):
            raise HTTPException(422, "El total de la venta no puede ser menor que lo ya pagado.")
    for key, value in payload.model_dump(exclude_unset=True, exclude={"productos"}).items():
        setattr(pedido, "cliente_id" if key == "clienteId" else key, value)
    db.commit()
    db.refresh(pedido)
    pedido = db.scalar(select(models.Pedido).options(selectinload(models.Pedido.lineas).selectinload(models.LineaVenta.producto), selectinload(models.Pedido.pagos)).where(models.Pedido.id == pedido_id))
    return serialize(pedido)


@router.get("/{pedido_id}/pagos", response_model=list[PagoVentaRead])
def list_pagos(pedido_id: str, db: Session = Depends(get_db)) -> list[models.PagoVenta]:
    if not db.get(models.Pedido, pedido_id):
        raise HTTPException(404, "Venta no encontrada")
    return db.scalars(select(models.PagoVenta).where(models.PagoVenta.pedido_id == pedido_id).order_by(models.PagoVenta.fecha.desc(), models.PagoVenta.codigo.desc())).all()


@router.post("/{pedido_id}/pagos", response_model=PagoVentaRead, status_code=status.HTTP_201_CREATED)
def create_pago(pedido_id: str, payload: PagoVentaCreate, db: Session = Depends(get_db)) -> models.PagoVenta:
    pedido = db.scalar(select(models.Pedido).options(selectinload(models.Pedido.pagos)).where(models.Pedido.id == pedido_id))
    if not pedido:
        raise HTTPException(404, "Venta no encontrada")
    pago = add_payment(pedido, payload.monto)
    db.commit()
    db.refresh(pago)
    return pago


@router.delete("/{pedido_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pedido(pedido_id: str, db: Session = Depends(get_db)):
    pedido = db.scalar(select(models.Pedido).options(selectinload(models.Pedido.lineas).selectinload(models.LineaVenta.producto)).where(models.Pedido.id == pedido_id))
    if not pedido:
        raise HTTPException(404, "Venta no encontrada")
    for line in pedido.lineas:
        line.producto.stock += line.cantidad
    db.delete(pedido)
    db.commit()
