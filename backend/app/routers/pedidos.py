from collections import Counter
from datetime import date, datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload

from app import models
from app.database import get_db
from app.schemas import LineaVentaInput, LineaVentaRead, PedidoCreate, PedidoRead, PedidoUpdate

router = APIRouter(prefix="/pedidos", tags=["Ventas"])


def serialize(pedido: models.Pedido) -> PedidoRead:
    return PedidoRead(
        id=pedido.id, clienteId=pedido.cliente_id, codigo=pedido.codigo, fecha=pedido.fecha,
        formaPago=pedido.formaPago, direccionEnvio=pedido.direccionEnvio,
        total=pedido.total, notas=pedido.notas,
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


@router.get("", response_model=list[PedidoRead])
def list_pedidos(q: str | None = Query(None), db: Session = Depends(get_db)):
    stmt = select(models.Pedido).options(selectinload(models.Pedido.lineas).selectinload(models.LineaVenta.producto)).order_by(models.Pedido.fecha.desc(), models.Pedido.codigo.desc())
    if q and q.strip():
        term = f"%{q.strip()}%"
        stmt = stmt.where(models.Pedido.codigo.ilike(term))
    return [serialize(pedido) for pedido in db.scalars(stmt).all()]


@router.post("", response_model=PedidoRead, status_code=status.HTTP_201_CREATED)
def create_pedido(payload: PedidoCreate, db: Session = Depends(get_db)):
    if not db.get(models.Cliente, payload.clienteId):
        raise HTTPException(404, "Cliente no encontrado")
    pedido = models.Pedido(
        id=str(uuid4()), cliente_id=payload.clienteId,
        codigo=f"AMT-{datetime.now().strftime('%Y%m%d')}-{str(uuid4())[:6].upper()}",
        fecha=date.today(), formaPago=payload.formaPago, direccionEnvio="", total=0, notas=payload.notas,
    )
    db.add(pedido)
    db.flush()
    replace_lines(pedido, payload.productos, db)
    db.commit()
    db.refresh(pedido)
    pedido = db.scalar(select(models.Pedido).options(selectinload(models.Pedido.lineas).selectinload(models.LineaVenta.producto)).where(models.Pedido.id == pedido.id))
    return serialize(pedido)


@router.patch("/{pedido_id}", response_model=PedidoRead)
def update_pedido(pedido_id: str, payload: PedidoUpdate, db: Session = Depends(get_db)):
    pedido = db.scalar(select(models.Pedido).options(selectinload(models.Pedido.lineas).selectinload(models.LineaVenta.producto)).where(models.Pedido.id == pedido_id))
    if not pedido:
        raise HTTPException(404, "Venta no encontrada")
    if payload.clienteId and not db.get(models.Cliente, payload.clienteId):
        raise HTTPException(404, "Cliente no encontrado")
    if payload.productos is not None:
        replace_lines(pedido, payload.productos, db)
    for key, value in payload.model_dump(exclude_unset=True, exclude={"productos"}).items():
        setattr(pedido, "cliente_id" if key == "clienteId" else key, value)
    db.commit()
    db.refresh(pedido)
    pedido = db.scalar(select(models.Pedido).options(selectinload(models.Pedido.lineas).selectinload(models.LineaVenta.producto)).where(models.Pedido.id == pedido_id))
    return serialize(pedido)


@router.delete("/{pedido_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pedido(pedido_id: str, db: Session = Depends(get_db)):
    pedido = db.scalar(select(models.Pedido).options(selectinload(models.Pedido.lineas).selectinload(models.LineaVenta.producto)).where(models.Pedido.id == pedido_id))
    if not pedido:
        raise HTTPException(404, "Venta no encontrada")
    for line in pedido.lineas:
        line.producto.stock += line.cantidad
    db.delete(pedido)
    db.commit()
