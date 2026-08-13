# Backend

Backend en Python para Amatista.

## Stack

- FastAPI
- SQLAlchemy 2
- PostgreSQL por defecto, con base `bd_amatista`
- Migraciones con Alembic

## Arranque

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Base de datos

La app toma la cadena de conexión desde `DATABASE_URL` si existe. Si no, usa PostgreSQL local con:

- host: `localhost`
- port: `5432`
- user: `postgres`
- password: `postgres`
- database: `bd_amatista`

Para crear la estructura inicial en PostgreSQL:

```bash
alembic upgrade head
```
