from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.schemas import TestimonioCreate, TestimonioEstadoUpdate, TestimonioRead


router = APIRouter(prefix="/testimonios", tags=["Testimonios"])
ESTADOS_MODERABLES = {"Aceptado", "Rechazado"}
TIPOS_VALIDOS = {"Producto", "Servicio al cliente", "Taller"}


@router.get("", response_model=list[TestimonioRead])
def list_testimonios(db: Session = Depends(get_db)) -> list[models.Testimonio]:
    return list(db.scalars(select(models.Testimonio).order_by(models.Testimonio.id.desc())).all())


@router.get("/public", response_model=list[TestimonioRead])
def list_testimonios_publicos(db: Session = Depends(get_db)) -> list[models.Testimonio]:
    return list(db.scalars(select(models.Testimonio).where(models.Testimonio.estado == "Aceptado").order_by(models.Testimonio.id.desc())).all())


@router.post("", response_model=TestimonioRead, status_code=status.HTTP_201_CREATED)
def create_testimonio(payload: TestimonioCreate, db: Session = Depends(get_db)) -> models.Testimonio:
    if payload.tipo not in TIPOS_VALIDOS:
        raise HTTPException(status_code=422, detail="El tipo debe ser Producto, Servicio al cliente o Taller.")

    testimonio = models.Testimonio(id=str(uuid4()), estado="Pendiente", **payload.model_dump())
    db.add(testimonio)
    db.commit()
    db.refresh(testimonio)
    return testimonio


@router.patch("/{testimonio_id}/estado", response_model=TestimonioRead)
def update_estado(testimonio_id: str, payload: TestimonioEstadoUpdate, db: Session = Depends(get_db)) -> models.Testimonio:
    if payload.estado not in ESTADOS_MODERABLES:
        raise HTTPException(status_code=422, detail="Solo se puede aceptar o rechazar un testimonio.")

    testimonio = db.get(models.Testimonio, testimonio_id)
    if testimonio is None:
        raise HTTPException(status_code=404, detail="Testimonio no encontrado.")

    testimonio.estado = payload.estado
    db.commit()
    db.refresh(testimonio)
    return testimonio
