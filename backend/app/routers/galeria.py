from __future__ import annotations

from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, Query, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.schemas import GaleriaCreate, GaleriaRead, GaleriaUpdate
from app.services.cloudinary import upload_image, delete_image

router = APIRouter(prefix="/galeria", tags=["Galería"])


def _save_upload_file(upload: UploadFile) -> str:
    return upload_image(upload, folder="galeria")


def _delete_media_file(media_path: str | None) -> None:
    if media_path:
        delete_image(media_path)


@router.get("", response_model=list[GaleriaRead])
def list_galeria(
    q: str | None = Query(default=None, description="Filtra por título, tipo, media o descripción"),
    db: Session = Depends(get_db),
) -> list[models.Galeria]:
    stmt = select(models.Galeria).order_by(models.Galeria.titulo.asc())
    if q:
        term = f"%{q.strip()}%"
        stmt = stmt.where(
            or_(
                models.Galeria.titulo.ilike(term),
                models.Galeria.tipo.ilike(term),
                models.Galeria.media.ilike(term),
                models.Galeria.descripcion.ilike(term),
            )
        )
    return list(db.scalars(stmt).all())


@router.get("/{galeria_id}", response_model=GaleriaRead)
def get_galeria(galeria_id: str, db: Session = Depends(get_db)) -> models.Galeria:
    galeria = db.get(models.Galeria, galeria_id)
    if galeria is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Elemento de galería no encontrado")
    return galeria


@router.post("", response_model=GaleriaRead, status_code=status.HTTP_201_CREATED)
def create_galeria(
    titulo: str = Form(...),
    tipo: str = Form(...),
    descripcion: str = Form(...),
    media_file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> models.Galeria:
    media = _save_upload_file(media_file)
    galeria = models.Galeria(id=str(uuid4()), titulo=titulo, tipo=tipo, media=media, descripcion=descripcion)
    db.add(galeria)
    db.commit()
    db.refresh(galeria)
    return galeria


@router.patch("/{galeria_id}", response_model=GaleriaRead)
def update_galeria(
    galeria_id: str,
    titulo: str | None = Form(default=None),
    tipo: str | None = Form(default=None),
    descripcion: str | None = Form(default=None),
    media_file: UploadFile | None = File(default=None),
    db: Session = Depends(get_db),
) -> models.Galeria:
    galeria = db.get(models.Galeria, galeria_id)
    if galeria is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Elemento de galería no encontrado")

    if titulo is not None:
        galeria.titulo = titulo
    if tipo is not None:
        galeria.tipo = tipo
    if descripcion is not None:
        galeria.descripcion = descripcion
    if media_file is not None:
        _delete_media_file(galeria.media)
        galeria.media = _save_upload_file(media_file)

    db.commit()
    db.refresh(galeria)
    return galeria


@router.delete("/{galeria_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_galeria(galeria_id: str, db: Session = Depends(get_db)) -> None:
    galeria = db.get(models.Galeria, galeria_id)
    if galeria is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Elemento de galería no encontrado")

    _delete_media_file(galeria.media)
    db.delete(galeria)
    db.commit()