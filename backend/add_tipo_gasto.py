from app.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE gastos ADD COLUMN IF NOT EXISTS tipo VARCHAR(20) DEFAULT 'General'"))
    conn.commit()
    print("Columna 'tipo' agregada exitosamente a gastos")