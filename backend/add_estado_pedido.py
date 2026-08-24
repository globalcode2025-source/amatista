from app.database import engine
from sqlalchemy import text

def add_estado_pedido():
    try:
        with engine.connect() as conn:
            # Verificar si la columna ya existe
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'pedidos' AND column_name = 'estado'
            """))
            
            if result.fetchone():
                print("La columna 'estado' ya existe en la tabla pedidos")
                return
            
            # Agregar la columna estado
            conn.execute(text("""
                ALTER TABLE pedidos 
                ADD COLUMN estado VARCHAR(50) NOT NULL DEFAULT 'Pendiente'
            """))
            
            conn.commit()
            print("Columna 'estado' agregada exitosamente a la tabla pedidos")
            
    except Exception as e:
        print(f"Error al agregar columna estado: {e}")
        raise

if __name__ == "__main__":
    add_estado_pedido()