from app.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    # Hacer producto_id nullable
    conn.execute(text("ALTER TABLE costos_produccion ALTER COLUMN producto_id DROP NOT NULL"))
    conn.commit()
    print("Columna producto_id ahora es nullable")