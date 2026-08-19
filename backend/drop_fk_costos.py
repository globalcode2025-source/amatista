from app.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE costos_produccion DROP CONSTRAINT IF EXISTS costos_produccion_producto_id_fkey"))
    conn.commit()
    print("Foreign key eliminada exitosamente")