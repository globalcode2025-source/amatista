from __future__ import annotations

from datetime import date, datetime, time
from pathlib import Path
from uuid import uuid4
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session, joinedload

from app import models
from app.database import get_db
from app.schemas import AsistenteEventoCreate, AsistenteEventoRead, EventoRead, PagoAsistenteCreate

router = APIRouter(prefix="/eventos", tags=["Eventos"])
MEDIA_DIR = Path(__file__).resolve().parent.parent.parent / "uploads" / "eventos"
ALLOWED_TYPES = {"Imagen": "image/", "Video": "video/"}
COLUMBIA_TZ = ZoneInfo("America/Bogota")


def _save_upload_file(upload: UploadFile, tipo: str) -> str:
    expected_prefix = ALLOWED_TYPES[tipo]
    if not upload.content_type or not upload.content_type.startswith(expected_prefix):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"El archivo debe ser de tipo {tipo.lower()}.")

    MEDIA_DIR.mkdir(parents=True, exist_ok=True)
    suffix = Path(upload.filename or "").suffix.lower()
    destination = MEDIA_DIR / f"{uuid4()}{suffix}"
    with destination.open("wb") as buffer:
        while chunk := upload.file.read(1024 * 1024):
            buffer.write(chunk)
    return f"/eventos-media/{destination.name}"


def _delete_media_file(media_path: str | None) -> None:
    if not media_path or not media_path.startswith("/eventos-media/"):
        return
    file_path = MEDIA_DIR / media_path.removeprefix("/eventos-media/")
    if file_path.exists():
        file_path.unlink()


def _validate_values(tipo: str, cupos: int, cupos_disponibles: int, duracion: int, precio: float) -> None:
    if tipo not in ALLOWED_TYPES:
        raise HTTPException(status_code=422, detail="El tipo debe ser Imagen o Video.")
    if cupos < 1 or not 0 <= cupos_disponibles <= cupos:
        raise HTTPException(status_code=422, detail="Los cupos disponibles deben estar entre 0 y el total de cupos.")
    if duracion < 1 or precio < 0:
        raise HTTPException(status_code=422, detail="La duración debe ser mayor a cero y el precio no puede ser negativo.")


def _refresh_event_statuses(db: Session) -> None:
    today_in_colombia = datetime.now(COLUMBIA_TZ).date()
    updated = db.query(models.Evento).filter(
        models.Evento.estado == "Próximo",
        models.Evento.fecha == today_in_colombia,
    ).update({models.Evento.estado: "Realizado"}, synchronize_session=False)
    if updated:
        db.commit()


@router.get("", response_model=list[EventoRead])
def list_eventos(q: str | None = Query(default=None), db: Session = Depends(get_db)) -> list[models.Evento]:
    _refresh_event_statuses(db)
    stmt = select(models.Evento).order_by(models.Evento.fecha.asc(), models.Evento.hora.asc())
    if q and q.strip():
        term = f"%{q.strip()}%"
        stmt = stmt.where(or_(models.Evento.nombre.ilike(term), models.Evento.ubicacion.ilike(term), models.Evento.descripcion.ilike(term)))
    return list(db.scalars(stmt).all())


@router.get("/{evento_id}", response_model=EventoRead)
def get_evento(evento_id: str, db: Session = Depends(get_db)) -> models.Evento:
    _refresh_event_statuses(db)
    evento = db.get(models.Evento, evento_id)
    if evento is None:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    return evento


@router.post("", response_model=EventoRead, status_code=status.HTTP_201_CREATED)
def create_evento(
    nombre: str = Form(...), tipo: str = Form(...), descripcion: str = Form(...), fecha: date = Form(...), hora: time = Form(...),
    ubicacion: str = Form(...), duracion: int = Form(...), frase: str = Form(...), queTrae: str = Form(...), cupos: int = Form(...),
    cuposDisponibles: int = Form(...), precio: float = Form(...), media_file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> models.Evento:
    _validate_values(tipo, cupos, cuposDisponibles, duracion, precio)
    evento = models.Evento(id=str(uuid4()), nombre=nombre, tipo=tipo, media=_save_upload_file(media_file, tipo), descripcion=descripcion,
        fecha=fecha, hora=hora, ubicacion=ubicacion, duracion=duracion, frase=frase, queTrae=queTrae, cupos=cupos,
        cuposDisponibles=cuposDisponibles, precio=precio, estado="Próximo")
    db.add(evento)
    db.commit()
    db.refresh(evento)
    return evento


@router.patch("/{evento_id}", response_model=EventoRead)
def update_evento(
    evento_id: str, nombre: str | None = Form(None), tipo: str | None = Form(None), descripcion: str | None = Form(None),
    fecha: date | None = Form(None), hora: time | None = Form(None), ubicacion: str | None = Form(None), duracion: int | None = Form(None),
    frase: str | None = Form(None), queTrae: str | None = Form(None), cupos: int | None = Form(None), cuposDisponibles: int | None = Form(None),
    precio: float | None = Form(None), estado: str | None = Form(None), media_file: UploadFile | None = File(None), db: Session = Depends(get_db),
) -> models.Evento:
    evento = db.get(models.Evento, evento_id)
    if evento is None:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    values = {"nombre": nombre, "tipo": tipo, "descripcion": descripcion, "fecha": fecha, "hora": hora, "ubicacion": ubicacion,
        "duracion": duracion, "frase": frase, "queTrae": queTrae, "cupos": cupos, "cuposDisponibles": cuposDisponibles, "precio": precio, "estado": estado}
    final_tipo = tipo if tipo is not None else evento.tipo
    _validate_values(final_tipo, cupos if cupos is not None else evento.cupos, cuposDisponibles if cuposDisponibles is not None else evento.cuposDisponibles,
                     duracion if duracion is not None else evento.duracion, precio if precio is not None else evento.precio)
    for field, value in values.items():
        if value is not None:
            setattr(evento, field, value)
    if media_file is not None:
        new_media = _save_upload_file(media_file, final_tipo)
        _delete_media_file(evento.media)
        evento.media = new_media
    db.commit()
    db.refresh(evento)
    return evento


@router.delete("/{evento_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_evento(evento_id: str, db: Session = Depends(get_db)) -> None:
    evento = db.get(models.Evento, evento_id)
    if evento is None:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    db.query(models.AsistenteEvento).filter(models.AsistenteEvento.evento_id == evento_id).delete()
    _delete_media_file(evento.media)
    db.delete(evento)
    db.commit()


def _asistente_read(asistente: models.AsistenteEvento, precio_evento: float) -> AsistenteEventoRead:
    cliente = asistente.cliente
    debe = max(precio_evento - asistente.pago, 0)
    return AsistenteEventoRead(
        id=asistente.id,
        clienteId=cliente.id if cliente else None,
        nombreCompleto=cliente.nombre if cliente else asistente.nombreCompleto,
        telefono=cliente.telefono if cliente else asistente.telefono,
        email=cliente.email if cliente else asistente.email,
        pago=asistente.pago,
        debe=debe,
        estado="Pagado" if debe == 0 else "Pendiente",
    )


@router.get("/{evento_id}/asistentes", response_model=list[AsistenteEventoRead])
def list_asistentes(evento_id: str, db: Session = Depends(get_db)) -> list[AsistenteEventoRead]:
    _refresh_event_statuses(db)
    evento = db.get(models.Evento, evento_id)
    if evento is None:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    asistentes = db.scalars(select(models.AsistenteEvento).options(joinedload(models.AsistenteEvento.cliente)).where(models.AsistenteEvento.evento_id == evento_id).order_by(models.AsistenteEvento.id)).all()
    return [_asistente_read(asistente, evento.precio) for asistente in asistentes]


@router.post("/{evento_id}/asistentes", response_model=AsistenteEventoRead, status_code=status.HTTP_201_CREATED)
def create_asistente(evento_id: str, payload: AsistenteEventoCreate, db: Session = Depends(get_db)) -> AsistenteEventoRead:
    _refresh_event_statuses(db)
    evento = db.get(models.Evento, evento_id)
    if evento is None:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    if payload.pago < 0 or payload.pago > evento.precio:
        raise HTTPException(status_code=422, detail="El pago debe estar entre $0 y el valor del evento.")
    if evento.cuposDisponibles < 1:
        raise HTTPException(status_code=422, detail="El evento no tiene cupos disponibles.")
    cliente = db.get(models.Cliente, payload.clienteId)
    if cliente is None:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    exists = db.scalar(select(models.AsistenteEvento.id).where(models.AsistenteEvento.evento_id == evento_id, models.AsistenteEvento.cliente_id == cliente.id))
    if exists:
        raise HTTPException(status_code=409, detail="Este cliente ya está registrado en el evento.")
    asistente = models.AsistenteEvento(
        id=str(uuid4()),
        evento_id=evento_id,
        cliente_id=cliente.id,
        nombreCompleto=cliente.nombre,
        telefono=cliente.telefono,
        email=cliente.email,
        pago=payload.pago,
    )
    evento.cuposDisponibles -= 1
    db.add(asistente)
    db.commit()
    db.refresh(asistente, attribute_names=["cliente"])
    return _asistente_read(asistente, evento.precio)


@router.post("/{evento_id}/asistentes/{asistente_id}/pagos", response_model=AsistenteEventoRead)
def add_pago_asistente(evento_id: str, asistente_id: str, payload: PagoAsistenteCreate, db: Session = Depends(get_db)) -> AsistenteEventoRead:
    evento = db.get(models.Evento, evento_id)
    asistente = db.scalar(select(models.AsistenteEvento).options(joinedload(models.AsistenteEvento.cliente)).where(models.AsistenteEvento.id == asistente_id, models.AsistenteEvento.evento_id == evento_id))
    if evento is None or asistente is None:
        raise HTTPException(status_code=404, detail="Asistente no encontrado")
    debe = max(evento.precio - asistente.pago, 0)
    if payload.pago <= 0 or payload.pago > debe:
        raise HTTPException(status_code=422, detail="El pago debe ser mayor a $0 y no puede superar el saldo pendiente.")
    asistente.pago += payload.pago
    db.commit()
    db.refresh(asistente, attribute_names=["cliente"])
    return _asistente_read(asistente, evento.precio)
