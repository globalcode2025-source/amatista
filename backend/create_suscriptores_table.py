from app.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS suscriptores (
            id VARCHAR(40) NOT NULL PRIMARY KEY,
            correo VARCHAR(255) NOT NULL UNIQUE,
            fecha DATE NOT NULL
        )
    """))
    conn.commit()
    print("Tabla suscriptores creada exitosamente")