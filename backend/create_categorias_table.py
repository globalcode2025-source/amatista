from app.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS categorias (
            id VARCHAR(40) NOT NULL PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL UNIQUE
        )
    """))
    conn.commit()
    print("Tabla categorias creada exitosamente")