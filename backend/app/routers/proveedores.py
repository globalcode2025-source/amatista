from __future__ import annotations

from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.schemas import ProveedorCreate, ProveedorRead, ProveedorUpdate

router = APIRouter(prefix="/proveedores", tags=["Proveedores"])


def serialize(proveedor: models.Proveedor) -> ProveedorRead:
    return ProveedorRead(id=proveedor.id, nombreEmpresa=proveedor.nombre_empresa, nit=proveedor.nit, direccion=proveedor.direccion, celular=proveedor.celular, municipio=proveedor.municipio)


@router.get("", response_model=list[ProveedorRead])
def list_proveedores(q: str | None = Query(default=None), db: Session = Depends(get_db)) -> list[ProveedorRead]:
    stmt = select(models.Proveedor).order_by(models.Proveedor.nombre_empresa.asc())
    if q and q.strip():
        term = f"%{q.strip()}%"
        stmt = stmt.where(or_(models.Proveedor.nombre_empresa.ilike(term), models.Proveedor.nit.ilike(term), models.Proveedor.celular.ilike(term), models.Proveedor.municipio.ilike(term)))
    return [serialize(proveedor) for proveedor in db.scalars(stmt).all()]


@router.post("", response_model=ProveedorRead, status_code=status.HTTP_201_CREATED)
def create_proveedor(payload: ProveedorCreate, db: Session = Depends(get_db)) -> ProveedorRead:
    proveedor = models.Proveedor(id=str(uuid4()), nombre_empresa=payload.nombreEmpresa, nit=payload.nit, direccion=payload.direccion, celular=payload.celular, municipio=payload.municipio)
    db.add(proveedor); db.commit(); db.refresh(proveedor)
    return serialize(proveedor)


@router.patch("/{proveedor_id}", response_model=ProveedorRead)
def update_proveedor(proveedor_id: str, payload: ProveedorUpdate, db: Session = Depends(get_db)) -> ProveedorRead:
    proveedor = db.get(models.Proveedor, proveedor_id)
    if proveedor is None:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    fields = {"nombreEmpresa": "nombre_empresa", "nit": "nit", "direccion": "direccion", "celular": "celular", "municipio": "municipio"}
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(proveedor, fields[key], value)
    db.commit(); db.refresh(proveedor)
    return serialize(proveedor)


@router.delete("/{proveedor_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_proveedor(proveedor_id: str, db: Session = Depends(get_db)) -> None:
    proveedor = db.get(models.Proveedor, proveedor_id)
    if proveedor is None:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    db.delete(proveedor); db.commit()
