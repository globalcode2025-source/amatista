from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routers.galeria import router as galeria_router
from app.routers.eventos import router as eventos_router
from app.routers.clientes import router as clientes_router
from app.routers.productos import router as productos_router
from app.routers.pedidos import router as pedidos_router
from app.routers.testimonios import router as testimonios_router
from app.routers.gastos import router as gastos_router
from app.routers.proveedores import router as proveedores_router
from app.routers.costos import router as costos_router
from app.routers.cuidados import router as cuidados_router
from app.routers.categorias import router as categorias_router
from app.routers.suscriptores import router as suscriptores_router

app = FastAPI(title="Amatista API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MEDIA_DIR = Path(__file__).resolve().parent.parent / "uploads" / "galeria"
MEDIA_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/media", StaticFiles(directory=MEDIA_DIR), name="media")
EVENTOS_MEDIA_DIR = Path(__file__).resolve().parent.parent / "uploads" / "eventos"
EVENTOS_MEDIA_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/eventos-media", StaticFiles(directory=EVENTOS_MEDIA_DIR), name="eventos-media")
PRODUCTOS_MEDIA_DIR = Path(__file__).resolve().parent.parent / "uploads" / "productos"
PRODUCTOS_MEDIA_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/productos-media", StaticFiles(directory=PRODUCTOS_MEDIA_DIR), name="productos-media")
app.include_router(galeria_router, prefix="/api")
app.include_router(eventos_router, prefix="/api")
app.include_router(clientes_router, prefix="/api")
app.include_router(productos_router, prefix="/api")
app.include_router(pedidos_router, prefix="/api")
app.include_router(testimonios_router, prefix="/api")
app.include_router(gastos_router, prefix="/api")
app.include_router(proveedores_router, prefix="/api")
app.include_router(costos_router, prefix="/api")
app.include_router(cuidados_router, prefix="/api")
app.include_router(categorias_router, prefix="/api")
app.include_router(suscriptores_router, prefix="/api")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
