from __future__ import annotations

from datetime import date, datetime
from uuid import uuid4
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app import models
from app.database import get_db
from app.schemas import CostoProduccionCreate, CostoProduccionRead, MaterialCostoRead

router = APIRouter(prefix="/costos", tags=["Costos de producción"])
COLUMBIA_TZ = ZoneInfo("America/Bogota")


def read(costo: models.CostoProduccion, db: Session, productos: dict = None, eventos: dict = None) -> CostoProduccionRead:
    total = sum(material.valor for material in costo.materiales)
    unitario = total / costo.cantidad_producida
    
    # Calcular precio según tipo
    if costo.tipo == 'producto':
        producto = (productos or {}).get(costo.producto_id) if costo.producto_id else None
        precio = producto.precio if producto else 0
        nombre = producto.nombre if producto else "Producto desconocido"
    else:
        # Para talleres, buscar el evento
        evento = (eventos or {}).get(costo.producto_id) if costo.producto_id else None
        precio = evento.precio if evento else 0
        nombre = evento.nombre if evento else "Evento desconocido"
    
    margen = precio - unitario
    return CostoProduccionRead(id=costo.id, fecha=costo.fecha, productoId=costo.producto_id, productoNombre=nombre, precioProducto=precio, cantidadProducida=costo.cantidad_producida, costoTotal=total, costoUnitario=unitario, margenUnitario=margen, margenPorcentaje=(margen / precio * 100) if precio else 0, materiales=[MaterialCostoRead(id=material.id, proveedorId=material.proveedor_id, proveedorNombre=material.proveedor.nombre_empresa, descripcion=material.descripcion, cantidad=material.cantidad, valor=material.valor) for material in costo.materiales])


def validate(payload: CostoProduccionCreate, db: Session) -> None:
    if payload.cantidadProducida < 1:
        raise HTTPException(422, "La cantidad producida debe ser mayor que cero.")
    if not payload.materiales:
        raise HTTPException(422, "Agrega al menos un material.")
    
    # Validar según tipo
    if payload.tipo == 'producto':
        if db.get(models.Producto, payload.productoId) is None:
            raise HTTPException(404, "Producto no encontrado.")
    elif payload.tipo == 'taller':
        # Para talleres, buscar en la tabla de eventos
        if db.get(models.Evento, payload.productoId) is None:
            raise HTTPException(404, "Evento no encontrado.")
    
    for material in payload.materiales:
        if not material.descripcion.strip() or not material.cantidad.strip() or material.valor < 0:
            raise HTTPException(422, "Completa la descripción, cantidad y valor de cada material.")
        if db.get(models.Proveedor, material.proveedorId) is None:
            raise HTTPException(404, "Uno de los proveedores no existe.")


def load(costo_id: str, db: Session) -> models.CostoProduccion:
    costo = db.scalar(select(models.CostoProduccion).options(selectinload(models.CostoProduccion.materiales).selectinload(models.MaterialCosto.proveedor)).where(models.CostoProduccion.id == costo_id))
    if costo is None:
        raise HTTPException(404, "Costo de producción no encontrado.")
    return costo


@router.get("", response_model=list[CostoProduccionRead])
def list_costos(db: Session = Depends(get_db)) -> list[CostoProduccionRead]:
    costos = db.scalars(select(models.CostoProduccion).options(selectinload(models.CostoProduccion.materiales).selectinload(models.MaterialCosto.proveedor)).order_by(models.CostoProduccion.fecha.desc())).all()
    
    # Cargar todos los productos y eventos necesarios para evitar N+1 queries
    producto_ids = [c.producto_id for c in costos if c.producto_id and c.tipo == 'producto']
    evento_ids = [c.producto_id for c in costos if c.producto_id and c.tipo == 'taller']
    
    productos = {p.id: p for p in db.scalars(select(models.Producto).where(models.Producto.id.in_(producto_ids))).all()} if producto_ids else {}
    eventos = {e.id: e for e in db.scalars(select(models.Evento).where(models.Evento.id.in_(evento_ids))).all()} if evento_ids else {}
    
    return [read(costo, db, productos, eventos) for costo in costos]


@router.post("", response_model=CostoProduccionRead, status_code=status.HTTP_201_CREATED)
def create_costo(payload: CostoProduccionCreate, db: Session = Depends(get_db)) -> CostoProduccionRead:
    validate(payload, db)
    today_in_colombia = datetime.now(COLUMBIA_TZ).date()
    costo = models.CostoProduccion(id=str(uuid4()), producto_id=payload.productoId, tipo=payload.tipo, fecha=today_in_colombia, cantidad_producida=payload.cantidadProducida)
    costo.materiales = [models.MaterialCosto(id=str(uuid4()), proveedor_id=material.proveedorId, descripcion=material.descripcion.strip(), cantidad=material.cantidad.strip(), valor=material.valor) for material in payload.materiales]
    db.add(costo); db.commit()
    return read(load(costo.id, db), db)


@router.put("/{costo_id}", response_model=CostoProduccionRead)
def update_costo(costo_id: str, payload: CostoProduccionCreate, db: Session = Depends(get_db)) -> CostoProduccionRead:
    validate(payload, db)
    costo = load(costo_id, db)
    costo.producto_id = payload.productoId; costo.cantidad_producida = payload.cantidadProducida
    costo.materiales.clear(); db.flush()
    costo.materiales = [models.MaterialCosto(id=str(uuid4()), proveedor_id=material.proveedorId, descripcion=material.descripcion.strip(), cantidad=material.cantidad.strip(), valor=material.valor) for material in payload.materiales]
    db.commit()
    return read(load(costo_id, db), db)


@router.delete("/{costo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_costo(costo_id: str, db: Session = Depends(get_db)) -> None:
    db.delete(load(costo_id, db)); db.commit()
