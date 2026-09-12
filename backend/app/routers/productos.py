from datetime import date
from uuid import uuid4
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from app import models
from app.database import get_db
from app.schemas import ProductoRead
from app.services.cloudinary import upload_image, delete_image

router = APIRouter(prefix="/productos", tags=["Productos"])

@router.get("", response_model=list[ProductoRead])
def list_productos(db: Session = Depends(get_db)): return list(db.scalars(select(models.Producto).order_by(models.Producto.nombre)).all())

@router.post("", response_model=ProductoRead, status_code=status.HTTP_201_CREATED)
def create_producto(nombre: str = Form(...), categoria: str = Form(...), precio: float = Form(...), descuento: float | None = Form(None), precio_descuento: float | None = Form(None), fecha_inicio_descuento: date | None = Form(None), fecha_fin_descuento: date | None = Form(None), stock: int = Form(...), descripcion: str = Form(...), imagen_file: UploadFile = File(...), db: Session = Depends(get_db)):
    imagen_url = upload_image(imagen_file, folder="productos")
    producto = models.Producto(id=str(uuid4()), nombre=nombre, categoria=categoria, precio=precio, descuento=descuento, precio_descuento=precio_descuento, fecha_inicio_descuento=fecha_inicio_descuento, fecha_fin_descuento=fecha_fin_descuento, stock=stock, descripcion=descripcion, imagen=imagen_url); db.add(producto); db.commit(); db.refresh(producto); return producto

@router.patch("/{producto_id}", response_model=ProductoRead)
def update_producto(producto_id: str, nombre: str | None = Form(None), categoria: str | None = Form(None), precio: float | None = Form(None), descuento: float | None = Form(None), precio_descuento: float | None = Form(None), fecha_inicio_descuento: date | None = Form(None), fecha_fin_descuento: date | None = Form(None), stock: int | None = Form(None), descripcion: str | None = Form(None), imagen_file: UploadFile | None = File(None), db: Session = Depends(get_db)):
    producto = db.get(models.Producto, producto_id)
    if not producto: raise HTTPException(status_code=404, detail="Producto no encontrado")
    for field, value in {"nombre": nombre, "categoria": categoria, "precio": precio, "descuento": descuento, "precio_descuento": precio_descuento, "fecha_inicio_descuento": fecha_inicio_descuento, "fecha_fin_descuento": fecha_fin_descuento, "stock": stock, "descripcion": descripcion}.items():
        if value is not None: setattr(producto, field, value)
    if imagen_file:
        delete_image(producto.imagen)
        producto.imagen = upload_image(imagen_file, folder="productos")
    db.commit(); db.refresh(producto); return producto

@router.delete("/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_producto(producto_id: str, db: Session = Depends(get_db)):
    producto = db.get(models.Producto, producto_id)
    if not producto: raise HTTPException(status_code=404, detail="Producto no encontrado")
    delete_image(producto.imagen); db.delete(producto); db.commit()
