from __future__ import annotations

from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.schemas import GastoCreate, GastoRead, GastoUpdate

router = APIRouter(prefix="/gastos", tags=["Gastos"])


@router.get("", response_model=list[GastoRead])
def list_gastos(q: str | None = Query(default=None), db: Session = Depends(get_db)) -> list[models.Gasto]:
    stmt = select(models.Gasto).order_by(models.Gasto.fecha.desc(), models.Gasto.concepto.asc())
    if q and q.strip():
        term = f"%{q.strip()}%"
        stmt = stmt.where(or_(models.Gasto.concepto.ilike(term), models.Gasto.categoria.ilike(term)))
    return list(db.scalars(stmt).all())


@router.post("", response_model=GastoRead, status_code=status.HTTP_201_CREATED)
def create_gasto(payload: GastoCreate, db: Session = Depends(get_db)) -> models.Gasto:
    gasto = models.Gasto(id=str(uuid4()), **payload.model_dump())
    db.add(gasto)
    db.commit()
    db.refresh(gasto)
    return gasto


@router.patch("/{gasto_id}", response_model=GastoRead)
def update_gasto(gasto_id: str, payload: GastoUpdate, db: Session = Depends(get_db)) -> models.Gasto:
    gasto = db.get(models.Gasto, gasto_id)
    if gasto is None:
        raise HTTPException(status_code=404, detail="Gasto no encontrado")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(gasto, field, value)
    db.commit()
    db.refresh(gasto)
    return gasto


@router.delete("/{gasto_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_gasto(gasto_id: str, db: Session = Depends(get_db)) -> None:
    gasto = db.get(models.Gasto, gasto_id)
    if gasto is None:
        raise HTTPException(status_code=404, detail="Gasto no encontrado")
    db.delete(gasto)
    db.commit()
