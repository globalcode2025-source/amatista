from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy.engine import URL

# Ruta de la carpeta backend
BASE_DIR = Path(__file__).resolve().parent.parent

# Cargar backend/.env
load_dotenv(BASE_DIR / ".env")


def get_database_url() -> str:
    url = URL.create(
        drivername="postgresql+psycopg",
        username=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        host=os.getenv("POSTGRES_HOST", "localhost"),
        port=int(os.getenv("POSTGRES_PORT", "5432")),
        database=os.getenv("POSTGRES_DB"),
    )

    return url.render_as_string(hide_password=False)