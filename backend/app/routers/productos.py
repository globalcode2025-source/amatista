from pathlib import Path
from uuid import uuid4
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from app import models
from app.database import get_db
from app.schemas import ProductoRead

router = APIRouter(prefix="/productos", tags=["Productos"])
MEDIA_DIR = Path(__file__).resolve().parent.parent.parent / "uploads" / "productos"

def save_file(upload: UploadFile) -> str:
    if not upload.content_type or not upload.content_type.startswith("image/"):
        raise HTTPException(status_code=422, detail="El archivo debe ser una imagen.")
    MEDIA_DIR.mkdir(parents=True, exist_ok=True)
    path = MEDIA_DIR / f"{uuid4()}{Path(upload.filename or '').suffix.lower()}"
    with path.open("wb") as output:
        while chunk := upload.file.read(1024 * 1024): output.write(chunk)
    return f"/productos-media/{path.name}"

def delete_file(media: str) -> None:
    if media.startswith("/productos-media/"):
        path = MEDIA_DIR / media.removeprefix("/productos-media/")
        if path.exists(): path.unlink()

@router.get("", response_model=list[ProductoRead])
def list_productos(db: Session = Depends(get_db)): return list(db.scalars(select(models.Producto).order_by(models.Producto.nombre)).all())

@router.post("", response_model=ProductoRead, status_code=status.HTTP_201_CREATED)
def create_producto(nombre: str = Form(...), categoria: str = Form(...), precio: float = Form(...), stock: int = Form(...), descripcion: str = Form(...), imagen_file: UploadFile = File(...), db: Session = Depends(get_db)):
    producto = models.Producto(id=str(uuid4()), nombre=nombre, categoria=categoria, precio=precio, stock=stock, descripcion=descripcion, imagen=save_file(imagen_file)); db.add(producto); db.commit(); db.refresh(producto); return producto

@router.patch("/{producto_id}", response_model=ProductoRead)
def update_producto(producto_id: str, nombre: str | None = Form(None), categoria: str | None = Form(None), precio: float | None = Form(None), stock: int | None = Form(None), descripcion: str | None = Form(None), imagen_file: UploadFile | None = File(None), db: Session = Depends(get_db)):
    producto = db.get(models.Producto, producto_id)
    if not producto: raise HTTPException(status_code=404, detail="Producto no encontrado")
    for field, value in {"nombre": nombre, "categoria": categoria, "precio": precio, "stock": stock, "descripcion": descripcion}.items():
        if value is not None: setattr(producto, field, value)
    if imagen_file: delete_file(producto.imagen); producto.imagen = save_file(imagen_file)
    db.commit(); db.refresh(producto); return producto

@router.delete("/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_producto(producto_id: str, db: Session = Depends(get_db)):
    producto = db.get(models.Producto, producto_id)
    if not producto: raise HTTPException(status_code=404, detail="Producto no encontrado")
    delete_file(producto.imagen); db.delete(producto); db.commit()
