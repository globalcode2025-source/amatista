from __future__ import annotations

from datetime import date
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.schemas import SuscriptorCreate, SuscriptorRead

router = APIRouter(prefix="/suscriptores", tags=["Suscriptores"])


@router.get("", response_model=list[SuscriptorRead])
def list_suscriptores(db: Session = Depends(get_db)) -> list[SuscriptorRead]:
    suscriptores = db.scalars(select(models.Suscriptor).order_by(models.Suscriptor.fecha.desc())).all()
    return [SuscriptorRead(id=suscriptor.id, correo=suscriptor.correo, fecha=suscriptor.fecha) for suscriptor in suscriptores]


@router.post("", response_model=SuscriptorRead, status_code=status.HTTP_201_CREATED)
def create_suscriptor(payload: SuscriptorCreate, db: Session = Depends(get_db)) -> SuscriptorRead:
    # Verificar si ya existe un suscriptor con ese correo
    existing = db.scalar(select(models.Suscriptor).where(models.Suscriptor.correo == payload.correo))
    if existing:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Ya existe un suscriptor con ese correo")
    
    suscriptor = models.Suscriptor(id=str(uuid4()), correo=payload.correo, fecha=date.today())
    db.add(suscriptor)
    db.commit()
    db.refresh(suscriptor)
    return SuscriptorRead(id=suscriptor.id, correo=suscriptor.correo, fecha=suscriptor.fecha)