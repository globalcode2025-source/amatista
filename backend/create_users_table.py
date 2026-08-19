from app.database import engine, SessionLocal
from app.models import Usuario
from sqlalchemy import text
from uuid import uuid4
import bcrypt

# Crear la tabla
Usuario.metadata.create_all(bind=engine)
print("Tabla usuarios creada exitosamente")

# Crear usuario admin por defecto
db = SessionLocal()
try:
    # Verificar si ya existe un usuario admin
    result = db.execute(text("SELECT COUNT(*) FROM usuarios WHERE email = 'admin@amatista.com'")).scalar()
    
    if result == 0:
        # Contraseña por defecto: admin123
        password = "admin123"
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        usuario = Usuario(
            id=str(uuid4()),
            email="admin@amatista.com",
            password_hash=password_hash,
            nombre="Administrador",
            activo=True
        )
        
        db.add(usuario)
        db.commit()
        print("Usuario admin creado exitosamente")
        print("Email: admin@amatista.com")
        print("Contraseña: admin123")
        print("Por favor cambia la contraseña después del primer login")
    else:
        print("Usuario admin ya existe")
finally:
    db.close()