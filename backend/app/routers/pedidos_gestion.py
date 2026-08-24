from __future__ import annotations

from typing import Optional
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app import models
from app.database import get_db
from app.schemas import PedidoRead

router = APIRouter(prefix="/pedidos-gestion", tags=["Gestión de Pedidos"])


def serialize_pedido(pedido: models.Pedido) -> PedidoRead:
    """Serializa un pedido para incluir todos los campos necesarios."""
    total_pagado = sum(pago.monto for pago in pedido.pagos)
    debe = max(pedido.total - total_pagado, 0)
    
    # Estado de venta: Completado si debe == 0, de lo contrario Pendiente
    estado_venta = "Completado" if debe < 0.005 else "Pendiente"
    
    return PedidoRead(
        id=pedido.id,
        clienteId=pedido.cliente_id,
        codigo=pedido.codigo,
        fecha=pedido.fecha,
        formaPago=pedido.formaPago,
        direccionEnvio=pedido.direccionEnvio,
        total=pedido.total,
        notas=pedido.notas,
        estado=pedido.estado,  # Estado del pedido (logística)
        estadoVenta=estado_venta,  # Estado de la venta (financiero)
        totalPagado=total_pagado,
        debe=debe,
        clienteNombre=pedido.cliente.nombre if pedido.cliente else None,
        clienteTelefono=pedido.cliente.telefono if pedido.cliente else None,
        clienteCiudad=pedido.cliente.ciudad if pedido.cliente else None,
        productos=[
            {
                "productoId": linea.producto_id,
                "nombre": linea.producto.nombre if linea.producto else "Producto desconocido",
                "precioUnitario": linea.precio_unitario,
                "cantidad": linea.cantidad,
                "subtotal": linea.subtotal
            }
            for linea in pedido.lineas
        ]
    )


@router.get("", response_model=list[PedidoRead])
def list_pedidos(
    estado: Optional[str] = Query(None, description="Filtrar por estado: Pendiente, Proceso, Despachado, Entregado"),
    search: Optional[str] = Query(None, description="Buscar por nombre cliente, código o producto"),
    db: Session = Depends(get_db)
) -> list[PedidoRead]:
    """
    Lista todos los pedidos con opciones de filtrado y búsqueda.
    """
    stmt = select(models.Pedido).options(
        selectinload(models.Pedido.cliente),
        selectinload(models.Pedido.lineas).selectinload(models.LineaVenta.producto),
        selectinload(models.Pedido.pagos)
    ).order_by(models.Pedido.fecha.desc(), models.Pedido.codigo.desc())
    
    # Filtrar por estado si se proporciona
    if estado:
        stmt = stmt.where(models.Pedido.estado == estado)
    
    pedidos = list(db.scalars(stmt).all())
    
    # Filtrar por búsqueda si se proporciona
    if search:
        search_lower = search.lower()
        pedidos = [
            p for p in pedidos 
            if search_lower in p.cliente.nombre.lower() 
            or search_lower in p.codigo.lower()
            or any(search_lower in linea.producto.nombre.lower() for linea in p.lineas if linea.producto)
        ]
    
    return [serialize_pedido(pedido) for pedido in pedidos]


@router.get("/{pedido_id}", response_model=PedidoRead)
def get_pedido(pedido_id: str, db: Session = Depends(get_db)) -> PedidoRead:
    """
    Obtiene un pedido específico por ID.
    """
    pedido = db.scalar(
        select(models.Pedido)
        .options(
            selectinload(models.Pedido.cliente),
            selectinload(models.Pedido.lineas).selectinload(models.LineaVenta.producto),
            selectinload(models.Pedido.pagos)
        )
        .where(models.Pedido.id == pedido_id)
    )
    
    if pedido is None:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    
    return serialize_pedido(pedido)


@router.patch("/{pedido_id}/estado", response_model=PedidoRead)
def update_pedido_estado(
    pedido_id: str, 
    estado: str = Query(..., description="Nuevo estado: Pendiente, Proceso, Despachado, Entregado"),
    db: Session = Depends(get_db)
) -> PedidoRead:
    """
    Actualiza el estado de un pedido.
    Los estados Proceso, Despachado y Entregado se pueden cambiar manualmente.
    """
    estados_validos = ["Pendiente", "Proceso", "Despachado", "Entregado"]
    if estado not in estados_validos:
        raise HTTPException(status_code=400, detail=f"Estado inválido. Debe ser uno de: {', '.join(estados_validos)}")
    
    pedido = db.get(models.Pedido, pedido_id)
    if pedido is None:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    
    pedido.estado = estado
    db.commit()
    db.refresh(pedido)
    
    # Recargar con relaciones
    pedido = db.scalar(
        select(models.Pedido)
        .options(
            selectinload(models.Pedido.cliente),
            selectinload(models.Pedido.lineas).selectinload(models.LineaVenta.producto),
            selectinload(models.Pedido.pagos)
        )
        .where(models.Pedido.id == pedido_id)
    )
    
    return serialize_pedido(pedido)