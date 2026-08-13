from __future__ import annotations

from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.schemas import ClienteCreate, ClienteRead, ClienteUpdate

router = APIRouter(prefix="/clientes", tags=["Clientes"])


@router.get("", response_model=list[ClienteRead])
def list_clientes(q: str | None = Query(default=None), db: Session = Depends(get_db)) -> list[models.Cliente]:
    stmt = select(models.Cliente).order_by(models.Cliente.nombre.asc())
    if q and q.strip():
        term = f"%{q.strip()}%"
        stmt = stmt.where(or_(models.Cliente.nombre.ilike(term), models.Cliente.telefono.ilike(term), models.Cliente.email.ilike(term), models.Cliente.ciudad.ilike(term)))
    return list(db.scalars(stmt).all())


@router.get("/{cliente_id}", response_model=ClienteRead)
def get_cliente(cliente_id: str, db: Session = Depends(get_db)) -> models.Cliente:
    cliente = db.get(models.Cliente, cliente_id)
    if cliente is None:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente


@router.post("", response_model=ClienteRead, status_code=status.HTTP_201_CREATED)
def create_cliente(payload: ClienteCreate, db: Session = Depends(get_db)) -> models.Cliente:
    cliente = models.Cliente(id=str(uuid4()), **payload.model_dump())
    db.add(cliente)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Ya existe un cliente con ese correo electrónico.") from None
    db.refresh(cliente)
    return cliente


@router.patch("/{cliente_id}", response_model=ClienteRead)
def update_cliente(cliente_id: str, payload: ClienteUpdate, db: Session = Depends(get_db)) -> models.Cliente:
    cliente = db.get(models.Cliente, cliente_id)
    if cliente is None:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(cliente, field, value)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Ya existe un cliente con ese correo electrónico.") from None
    db.refresh(cliente)
    return cliente


@router.delete("/{cliente_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cliente(cliente_id: str, db: Session = Depends(get_db)) -> None:
    cliente = db.get(models.Cliente, cliente_id)
    if cliente is None:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    db.delete(cliente)
    db.commit()
