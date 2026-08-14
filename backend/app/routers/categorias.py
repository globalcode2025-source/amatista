from __future__ import annotations

from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.schemas import CategoriaCreate, CategoriaRead

router = APIRouter(prefix="/categorias", tags=["Categorías"])


@router.get("", response_model=list[CategoriaRead])
def list_categorias(db: Session = Depends(get_db)) -> list[CategoriaRead]:
    categorias = db.scalars(select(models.Categoria).order_by(models.Categoria.nombre)).all()
    return [CategoriaRead(id=categoria.id, nombre=categoria.nombre) for categoria in categorias]


@router.post("", response_model=CategoriaRead, status_code=status.HTTP_201_CREATED)
def create_categoria(payload: CategoriaCreate, db: Session = Depends(get_db)) -> CategoriaRead:
    # Verificar si ya existe una categoría con ese nombre
    existing = db.scalar(select(models.Categoria).where(models.Categoria.nombre == payload.nombre))
    if existing:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Ya existe una categoría con ese nombre")
    
    categoria = models.Categoria(id=str(uuid4()), nombre=payload.nombre)
    db.add(categoria)
    db.commit()
    db.refresh(categoria)
    return CategoriaRead(id=categoria.id, nombre=categoria.nombre)


@router.delete("/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_categoria(categoria_id: str, db: Session = Depends(get_db)) -> None:
    categoria = db.get(models.Categoria, categoria_id)
    if categoria is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Categoría no encontrada")
    
    # Verificar si hay productos usando esta categoría
    productos_count = db.scalar(select(models.Producto).where(models.Producto.categoria == categoria.nombre).with_only_columns(models.Producto.id))
    if productos_count is not None and productos_count > 0:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "No se puede eliminar la categoría porque hay productos que la usan")
    
    db.delete(categoria)
    db.commit()