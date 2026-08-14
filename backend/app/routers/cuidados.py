from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.schemas import CuidadoCreate, CuidadoRead, CuidadoUpdate

router = APIRouter(prefix="/cuidados", tags=["Cuidados"])


@router.get("", response_model=list[CuidadoRead])
def list_cuidados(db: Session = Depends(get_db)):
    stmt = select(models.Cuidado).order_by(models.Cuidado.orden.asc(), models.Cuidado.pregunta.asc())
    return db.scalars(stmt).all()


@router.post("", response_model=CuidadoRead, status_code=status.HTTP_201_CREATED)
def create_cuidado(payload: CuidadoCreate, db: Session = Depends(get_db)):
    cuidado = models.Cuidado(
        id=str(uuid4()),
        pregunta=payload.pregunta,
        respuesta=payload.respuesta,
        orden=payload.orden,
    )
    db.add(cuidado)
    db.commit()
    db.refresh(cuidado)
    return cuidado


@router.get("/{cuidado_id}", response_model=CuidadoRead)
def get_cuidado(cuidado_id: str, db: Session = Depends(get_db)):
    cuidado = db.get(models.Cuidado, cuidado_id)
    if not cuidado:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cuidado no encontrado")
    return cuidado


@router.patch("/{cuidado_id}", response_model=CuidadoRead)
def update_cuidado(cuidado_id: str, payload: CuidadoUpdate, db: Session = Depends(get_db)):
    cuidado = db.get(models.Cuidado, cuidado_id)
    if not cuidado:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cuidado no encontrado")
    
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(cuidado, key, value)
    
    db.commit()
    db.refresh(cuidado)
    return cuidado


@router.delete("/{cuidado_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cuidado(cuidado_id: str, db: Session = Depends(get_db)):
    cuidado = db.get(models.Cuidado, cuidado_id)
    if not cuidado:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cuidado no encontrado")
    
    db.delete(cuidado)
    db.commit()
    return None