# Manual de Usuario - Amatista

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Panel Administrativo](#panel-administrativo)
4. [Página Pública](#página-pública)
5. [Backend y API](#backend-y-api)
6. [Instalación y Configuración](#instalación-y-configuración)
7. [Seguridad](#seguridad)
8. [Solución de Problemas](#solución-de-problemas)

---

## Introducción

Amatista es un sistema integral de gestión para una empresa dedicada a la venta de velas artesanales, wax melts y talleres de Kintsugi. El sistema permite administrar productos, eventos, ventas, clientes, gastos, costos de producción y más, todo desde una interfaz web moderna y fácil de usar.

### ¿Qué es Amatista?

Amatista es una aplicación web dividida en dos partes principales:

- **Panel Administrativo**: Donde los administradores gestionan todo el negocio (inventario, ventas, clientes, eventos, finanzas)
- **Sitio Público**: Donde los clientes pueden ver productos, eventos, galería y dejar testimonios

### ¿Dónde se agrega la información?

Toda la información se gestiona desde el **Panel Administrativo**, accesible en `/admin` después de iniciar sesión. Desde allí puedes:

- Agregar/editar productos en la sección **Productos**
- Crear y gestionar eventos en la sección **Eventos**
- Registrar ventas y pedidos en **Ventas** y **Pedidos**
- Administrar clientes en **Clientes**
- Subir imágenes a la galería en **Galería**
- Aprobar testimonios en **Testimonios**
- Registrar gastos en **Gastos**
- Calcular costos de producción en **Costos**

### ¿Dónde se ve la información?

La información agregada en el panel administrativo se muestra automáticamente en:

- **Sitio Público** (`/`): Productos, eventos, galería, testimonios aprobados
- **Dashboard** (`/admin`): Métricas y estadísticas en tiempo real
- **Secciones específicas del admin**: Cada sección tiene su tabla de datos correspondiente

---

## Arquitectura del Sistema

### Estructura del Proyecto

```
amatista/
├── backend/              # API FastAPI (Python)
│   ├── app/
│   │   ├── main.py      # Punto de entrada de la API
│   │   ├── database.py  # Configuración de base de datos
│   │   ├── models.py    # Modelos SQLAlchemy
│   │   ├── schemas.py   # Esquemas Pydantic
│   │   └── routers/     # Endpoints de la API
│   │       ├── auth.py  # Autenticación
│   │       ├── productos.py
│   │       ├── eventos.py
│   │       ├── clientes.py
│   │       ├── pedidos.py
│   │       ├── gastos.py
│   │       ├── costos.py
│   │       └── ...
│   └── requirements.txt
├── frontend/             # Aplicación React
│   ├── src/
│   │   ├── admin/       # Panel administrativo
│   │   │   ├── pages/   # Páginas del admin
│   │   │   ├── components/
│   │   │   └── types.ts
│   │   ├── components/  # Componentes públicos
│   │   ├── pages/       # Páginas públicas
│   │   └── services/    # Servicios API
│   └── package.json
└── MANUAL_USUARIO.md     # Este documento
```

### Tecnologías

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python, SQLAlchemy
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT (JSON Web Tokens)

---

## Panel Administrativo

### Acceso al Panel

1. Navega a `/login` en tu navegador
2. Ingresa tus credenciales de administrador
3. Serás redirigido automáticamente al Dashboard en `/admin`

**Nota**: Por seguridad, no es posible acceder directamente a rutas de administración (`/admin/*`) sin estar autenticado. Si intentas acceder sin login, serás redirigido a `/login`.

### Dashboard

El Dashboard es la página principal del panel administrativo. Muestra métricas clave en tiempo real:

- **Ventas totales**: Suma de todas las ventas registradas
- **Pedidos pendientes**: Cantidad de pedidos en estado "Pendiente"
- **Productos activos**: Cantidad de productos disponibles
- **Eventos próximos**: Cantidad de eventos con estado "Próximo"
- **Gastos por tipo**: Desglose de gastos por categoría
- **Costos por tipo**: Desglose de costos de producción (Producto vs Taller)
- **Gráficos de tendencias**: Visualización de datos temporales

### Secciones del Panel Administrativo

#### 1. Ventas (`/admin/ventas`)

Gestiona las ventas realizadas.

**Funcionalidades:**
- Ver lista de todas las ventas
- Agregar nueva venta
- Editar venta existente
- Eliminar venta
- Filtrar por fecha, cliente, estado

**Campos:**
- Fecha
- Cliente
- Productos vendidos
- Total
- Estado (Completado, Pendiente, Cancelado)

#### 2. Pedidos (`/admin/pedidos`)

Gestiona los pedidos individuales con seguimiento detallado.

**Funcionalidades:**
- Ver lista de pedidos
- Crear nuevo pedido
- Ver detalles de un pedido específico
- Actualizar estado del pedido
- Agregar seguimiento (tracking)

**Estados de pedido:**
- Pendiente
- En proceso
- Enviado
- Entregado
- Cancelado

**Campos:**
- Número de pedido
- Cliente
- Fecha
- Productos
- Dirección de envío
- Estado
- Seguimiento

#### 3. Clientes (`/admin/clientes`)

Gestiona la base de datos de clientes.

**Funcionalidades:**
- Ver lista de clientes
- Agregar nuevo cliente
- Editar información del cliente
- Ver historial de compras
- Eliminar cliente

**Campos:**
- Nombre completo
- Teléfono
- Email
- Ciudad
- Dirección
- Notas adicionales

#### 4. Productos (`/admin/productos`)

Gestiona el catálogo de productos (velas, wax melts).

**Funcionalidades:**
- Ver lista de productos
- Agregar nuevo producto
- Editar producto
- Eliminar producto
- Gestionar stock
- Asignar categoría

**Campos:**
- Nombre
- Descripción
- Precio
- Categoría (Vela, Wax Melt, Kit)
- Stock disponible
- Imagen
- Estado (Activo, Inactivo)

#### 5. Eventos (`/admin/eventos`)

Gestiona los talleres y eventos (Kintsugi, etc.).

**Funcionalidades:**
- Ver lista de eventos
- Crear nuevo evento
- Editar evento
- Ver asistentes registrados
- Gestionar cupos
- Actualizar estado automáticamente

**Campos:**
- Nombre del evento
- Tipo (Taller, Workshop)
- Fecha y hora
- Ubicación
- Duración
- Descripción
- Precio
- Cupos totales
- Cupos disponibles
- Estado (Próximo, Realizado, Cancelado)
- Imagen

**Nota**: El sistema actualiza automáticamente el estado de los eventos a "Realizado" cuando la fecha y hora pasan.

#### 6. Galería (`/admin/galeria`)

Gestiona las imágenes del sitio.

**Funcionalidades:**
- Ver todas las imágenes
- Subir nuevas imágenes
- Eliminar imágenes
- Asignar categoría

**Campos:**
- URL de la imagen
- Categoría (Productos, Eventos, Taller, General)
- Descripción

#### 7. Testimonios (`/admin/testimonios`)

Gestiona los testimonios de clientes.

**Funcionalidades:**
- Ver todos los testimonios
- Aprobar/rechazar testimonios
- Eliminar testimonios
- Ver testimonios pendientes de aprobación

**Campos:**
- Nombre del cliente
- Tipo (Producto, Servicio al cliente, Taller)
- Descripción/Texto
- Estado (Aprobado, Pendiente, Rechazado)

**Nota**: Los clientes pueden dejar testimonios desde el sitio público. Estos aparecen como "Pendientes" hasta que un administrador los aprueba.

#### 8. Gastos (`/admin/gastos`)

Registra y gestiona los gastos operativos.

**Funcionalidades:**
- Ver lista de gastos
- Agregar nuevo gasto
- Editar gasto
- Eliminar gasto
- Filtrar por tipo y fecha

**Campos:**
- Fecha
- Descripción
- Monto
- Tipo (Operativo, Marketing, Personal, Otro)
- Proveedor (opcional)

#### 9. Costos (`/admin/costos`)

Calcula y gestiona los costos de producción.

**Funcionalidades:**
- Ver costos de producción
- Crear nuevo costo de producción
- Asociar materiales y sus costos
- Calcular costo unitario y total
- Calcular margen de ganancia
- Filtrar por tipo (Producto vs Taller)

**Campos:**
- Fecha
- Tipo (Producto, Taller)
- Producto/Evento asociado
- Cantidad producida
- Materiales utilizados (con costos)
- Costo total
- Costo unitario
- Precio de venta
- Margen unitario
- Margen porcentual

**Cálculos automáticos:**
- Costo total = Suma de costos de materiales
- Costo unitario = Costo total / Cantidad producida
- Margen unitario = Precio de venta - Costo unitario
- Margen porcentual = (Margen unitario / Precio de venta) × 100

#### 10. Proveedores (`/admin/proveedores`)

Gestiona la información de proveedores.

**Funcionalidades:**
- Ver lista de proveedores
- Agregar nuevo proveedor
- Editar proveedor
- Eliminar proveedor

**Campos:**
- Nombre de la empresa
- Contacto
- Teléfono
- Email
- Dirección
- Tipo de productos/servicios

#### 11. Cuidados (`/admin/cuidados`)

Gestiona las instrucciones de cuidado de productos.

**Funcionalidades:**
- Ver instrucciones de cuidado
- Agregar nueva instrucción
- Editar instrucción
- Eliminar instrucción

**Campos:**
- Título
- Descripción
- Producto asociado (opcional)

#### 12. Suscriptores (`/admin/suscriptores`)

Gestiona la lista de suscriptores al newsletter.

**Funcionalidades:**
- Ver lista de suscriptores
- Agregar suscriptor manualmente
- Eliminar suscriptor
- Exportar lista

**Campos:**
- Email
- Fecha de suscripción
- Estado (Activo, Inactivo)

### Navegación Móvil

En dispositivos móviles, la barra de navegación lateral se oculta y aparece un botón de hamburguesa (☰) en la esquina superior izquierda. Al hacer clic, se despliega el menú completo con un overlay oscuro de fondo.

---

## Página Pública

### Home (`/`)

La página principal del sitio incluye:

1. **Navegación**: Menú principal con enlaces a secciones
2. **Hero**: Sección destacada con mensaje principal
3. **Marquee**: Barra dorada con texto en movimiento (VELAS ARTESANALES · WAX MELTS · TALLER DE KINTSUGI · EL RETIRO, ANTIOQUIA · ENVÍOS A TODA COLOMBIA)
4. **Productos**: Catálogo de velas y wax melts
5. **Eventos**: Próximos talleres y eventos
6. **Galería**: Imágenes de productos y eventos
7. **Testimonios**: Reseñas de clientes (solo aprobados)
8. **Historia**: Historia de Amatista
9. **Ubicación**: Información de ubicación y contacto
10. **Cuidado**: Instrucciones de cuidado de productos
11. **Footer**: Información adicional y enlaces

**Animaciones**: El sitio incluye animaciones de scroll reveal para una experiencia moderna. Las secciones aparecen suavemente al hacer scroll hacia abajo.

### Catálogo (`/catalogo`)

Página dedicada exclusivamente al catálogo de productos con filtros y búsqueda avanzada.

### Dejar Testimonio

Los clientes pueden dejar testimonios desde la sección de Testimonios en la página pública. Los testimonios:
- Se envían como "Pendientes"
- Requieren aprobación del administrador para aparecer públicamente
- Incluyen nombre, tipo y descripción

---

## Backend y API

### Endpoints Principales

La API está disponible en `http://localhost:8000` (en desarrollo).

#### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener información del usuario actual

#### Productos

- `GET /api/productos` - Listar todos los productos
- `POST /api/productos` - Crear producto
- `GET /api/productos/{id}` - Obtener producto por ID
- `PUT /api/productos/{id}` - Actualizar producto
- `DELETE /api/productos/{id}` - Eliminar producto

#### Eventos

- `GET /api/eventos` - Listar todos los eventos
- `POST /api/eventos` - Crear evento
- `GET /api/eventos/{id}` - Obtener evento por ID
- `PUT /api/eventos/{id}` - Actualizar evento
- `DELETE /api/eventos/{id}` - Eliminar evento
- `GET /api/eventos/{id}/asistentes` - Obtener asistentes de un evento

#### Clientes

- `GET /api/clientes` - Listar todos los clientes
- `POST /api/clientes` - Crear cliente
- `GET /api/clientes/{id}` - Obtener cliente por ID
- `PUT /api/clientes/{id}` - Actualizar cliente
- `DELETE /api/clientes/{id}` - Eliminar cliente

#### Pedidos

- `GET /api/pedidos` - Listar todos los pedidos
- `POST /api/pedidos` - Crear pedido
- `GET /api/pedidos/{id}` - Obtener pedido por ID
- `PUT /api/pedidos/{id}` - Actualizar pedido
- `DELETE /api/pedidos/{id}` - Eliminar pedido

#### Gastos

- `GET /api/gastos` - Listar todos los gastos
- `POST /api/gastos` - Crear gasto
- `GET /api/gastos/{id}` - Obtener gasto por ID
- `PUT /api/gastos/{id}` - Actualizar gasto
- `DELETE /api/gastos/{id}` - Eliminar gasto

#### Costos

- `GET /api/costos` - Listar todos los costos
- `POST /api/costos` - Crear costo
- `GET /api/costos/{id}` - Obtener costo por ID
- `PUT /api/costos/{id}` - Actualizar costo
- `DELETE /api/costos/{id}` - Eliminar costo

#### Testimonios

- `GET /api/testimonios` - Listar todos los testimonios (admin)
- `GET /api/testimonios/publicos` - Listar testimonios aprobados (público)
- `POST /api/testimonios` - Crear testimonio
- `PUT /api/testimonios/{id}` - Actualizar testimonio
- `DELETE /api/testimonios/{id}` - Eliminar testimonio

### Autenticación

La API utiliza JWT (JSON Web Tokens) para autenticación:

1. El usuario inicia sesión con `/api/auth/login`
2. Recibe un token JWT
3. El token se guarda en `localStorage` del navegador
4. Cada request protegido incluye el token en el header: `Authorization: Bearer {token}`
5. El token se valida en cada request al endpoint `/api/auth/me`

---

## Instalación y Configuración

### Requisitos Previos

- Python 3.8+
- Node.js 18+
- PostgreSQL 12+
- Git

### Instalación del Backend

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/globalcode2025-source/amatista.git
   cd amatista/backend
   ```

2. **Crear entorno virtual:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

3. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configurar base de datos:**
   - Crear una base de datos PostgreSQL
   - Configurar la URL de conexión en `backend/app/database.py`

5. **Ejecutar migraciones:**
   ```bash
   # Las tablas se crean automáticamente al iniciar la aplicación
   ```

6. **Iniciar el servidor:**
   ```bash
   uvicorn app.main:app --reload
   ```

   La API estará disponible en `http://localhost:8000`

### Instalación del Frontend

1. **Navegar al directorio frontend:**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:5173`

### Configuración de Variables de Entorno

Crea un archivo `.env` en el directorio `backend` con las siguientes variables:

```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/amatista
SECRET_KEY=tu_clave_secreta_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## Seguridad

### Protección de Rutas

- Todas las rutas de administración (`/admin/*`) están protegidas
- Se requiere autenticación JWT para acceder
- Los tokens se validan en cada request
- Si el token es inválido o expira, se redirige al login

### Mejores Prácticas

1. **Contraseñas:** Usa contraseñas fuertes para la base de datos y tokens JWT
2. **HTTPS:** En producción, siempre usa HTTPS
3. **CORS:** Configura CORS apropiadamente para producción
4. **Rate Limiting:** Considera implementar rate limiting en la API
5. **Validación:** Todos los inputs se validan en backend con Pydantic
6. **SQL Injection:** SQLAlchemy protege contra SQL injection
7. **XSS:** React escapa automáticamente el contenido para prevenir XSS

### Logs

- Los logs de SQLAlchemy están deshabilitados en producción (`echo=False`)
- No hay `console.log` en el frontend por seguridad
- Considera implementar un sistema de logging estructurado para producción

---

## Solución de Problemas

### Problemas Comunes

#### 1. No puedo acceder al panel administrativo

**Solución:**
- Verifica que hayas iniciado sesión en `/login`
- Verifica que el token JWT esté en `localStorage`
- Verifica que el token no esté expirado
- Revisa la consola del navegador para errores

#### 2. La API no responde

**Solución:**
- Verifica que el backend esté corriendo en `http://localhost:8000`
- Verifica que la base de datos esté accesible
- Revisa los logs del backend para errores
- Verifica que el puerto 8000 no esté en uso

#### 3. Las imágenes no cargan

**Solución:**
- Verifica que las URLs de las imágenes sean correctas
- Verifica que las imágenes existan en el servidor
- Revisa la configuración de archivos estáticos en el backend

#### 4. Los eventos no actualizan su estado automáticamente

**Solución:**
- Verifica que el script de actualización de eventos esté corriendo
- Revisa la fecha y hora del servidor
- Verifica que la zona horaria sea correcta

#### 5. El marquee se mueve demasiado rápido

**Solución:**
- Ajusta el parámetro `speedSeconds` en el componente Marquee
- Valores más altos = animación más lenta (ej: 40s, 60s)

#### 6. Las animaciones de scroll no funcionan

**Solución:**
- Verifica que el componente `Reveal` esté importado correctamente
- Verifica que `prefers-reduced-motion` no esté activado en el navegador
- Revisa la consola para errores de JavaScript

### Contacto de Soporte

Si encuentras un problema no documentado aquí, por favor:

1. Revisa los logs del backend y frontend
2. Verifica la consola del navegador para errores
3. Revisa la documentación de FastAPI y React
4. Contacta al equipo de desarrollo con detalles del problema

---

## Actualizaciones y Mantenimiento

### Actualizar el Sistema

1. **Backend:**
   ```bash
   cd backend
   git pull origin main
   pip install -r requirements.txt --upgrade
   ```

2. **Frontend:**
   ```bash
   cd frontend
   git pull origin main
   npm install
   ```

### Backups

- Realiza backups regulares de la base de datos
- Guarda copias de las imágenes subidas
- Documenta cualquier configuración personalizada

---

## Conclusión

Este manual cubre los aspectos fundamentales para usar y mantener el sistema Amatista. Para preguntas adicionales o soporte técnico, contacta al equipo de desarrollo.

**Versión del sistema:** 1.0  
**Fecha de actualización:** Agosto 2026
