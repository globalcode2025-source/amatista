from __future__ import annotations

from datetime import date
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app import models
from app.database import get_db
from app.schemas import CostoProduccionCreate, CostoProduccionRead, MaterialCostoRead

router = APIRouter(prefix="/costos", tags=["Costos de producción"])


def read(costo: models.CostoProduccion) -> CostoProduccionRead:
    total = sum(material.valor for material in costo.materiales)
    unitario = total / costo.cantidad_producida
    
    # Calcular precio según tipo
    if costo.tipo == 'producto' and costo.producto:
        precio = costo.producto.precio
        nombre = costo.producto.nombre
    else:
        # Para talleres, precio y nombre se calcularán más adelante cuando tengamos relación con eventos
        precio = 0
        nombre = "Evento"
    
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
    if costo.tipo == 'producto':
        costo = db.scalar(select(models.CostoProduccion).options(selectinload(models.CostoProduccion.producto), selectinload(models.CostoProduccion.materiales).selectinload(models.MaterialCosto.proveedor)).where(models.CostoProduccion.id == costo_id))
    else:
        costo = db.scalar(select(models.CostoProduccion).options(selectinload(models.CostoProduccion.materiales).selectinload(models.MaterialCosto.proveedor)).where(models.CostoProduccion.id == costo_id))
    if costo is None:
        raise HTTPException(404, "Costo de producción no encontrado.")
    return costo


@router.get("", response_model=list[CostoProduccionRead])
def list_costos(db: Session = Depends(get_db)) -> list[CostoProduccionRead]:
    costos = db.scalars(select(models.CostoProduccion).options(selectinload(models.CostoProduccion.producto), selectinload(models.CostoProduccion.materiales).selectinload(models.MaterialCosto.proveedor)).order_by(models.CostoProduccion.fecha.desc())).all()
    return [read(costo) for costo in costos]


@router.post("", response_model=CostoProduccionRead, status_code=status.HTTP_201_CREATED)
def create_costo(payload: CostoProduccionCreate, db: Session = Depends(get_db)) -> CostoProduccionRead:
    validate(payload, db)
    costo = models.CostoProduccion(id=str(uuid4()), producto_id=payload.productoId, tipo=payload.tipo, fecha=date.today(), cantidad_producida=payload.cantidadProducida)
    costo.materiales = [models.MaterialCosto(id=str(uuid4()), proveedor_id=material.proveedorId, descripcion=material.descripcion.strip(), cantidad=material.cantidad.strip(), valor=material.valor) for material in payload.materiales]
    db.add(costo); db.commit()
    return read(load(costo.id, db))


@router.put("/{costo_id}", response_model=CostoProduccionRead)
def update_costo(costo_id: str, payload: CostoProduccionCreate, db: Session = Depends(get_db)) -> CostoProduccionRead:
    validate(payload, db)
    costo = load(costo_id, db)
    costo.producto_id = payload.productoId; costo.cantidad_producida = payload.cantidadProducida
    costo.materiales.clear(); db.flush()
    costo.materiales = [models.MaterialCosto(id=str(uuid4()), proveedor_id=material.proveedorId, descripcion=material.descripcion.strip(), cantidad=material.cantidad.strip(), valor=material.valor) for material in payload.materiales]
    db.commit()
    return read(load(costo_id, db))


@router.delete("/{costo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_costo(costo_id: str, db: Session = Depends(get_db)) -> None:
    db.delete(load(costo_id, db)); db.commit()
