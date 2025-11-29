# Backend – Orquestador de Reclutamiento sobre Supabase

API REST construida con Node.js + Express que orquesta el flujo de reclutamiento entre empresas y candidatos usando PostgreSQL (Supabase) como base de datos principal. [attached_file:2]  
El sistema se integra con Supabase Storage y un workflow de n8n para recibir CVs en PDF, procesarlos con IA y registrar automáticamente candidatos, CVs e historial de postulaciones. [attached_file:2]

---

## 1. Tecnologías y características

- Node.js + Express como servidor HTTP principal de la API. [attached_file:2]  
- PostgreSQL (instancia de Supabase) accesible mediante el cliente `pg` y un pool de conexiones con manejo robusto de errores y reintentos. [attached_file:2]  
- Autenticación basada en JWT con middlewares `authenticateToken` y `requireRole` para proteger rutas y filtrar por rol (empresa o candidato). [attached_file:2]  
- Módulos separados por recurso: `auth`, `empresas`, `candidatos`, `cargos`, `cvs`, `entrevistas`, `preguntas`, `respuestas`, `puntajes`, `historial` y `notificaciones`, además de `postulaciones` para el flujo de envío de CV. [attached_file:2]  
- Manejo centralizado de errores que clasifica códigos típicos de PostgreSQL (timeouts, tabla/columna inexistente, violaciones de clave foránea o única, etc.). [attached_file:2]

---

## 2. Estructura del proyecto

- Carpeta `src/` con el servidor Express, routers, middleware de autenticación, controladores y el módulo de conexión a la base de datos. [attached_file:2][image:1]  
- Script SQL en `sql/` para crear las tablas de negocio: `empresas`, `candidatos`, `cvs`, `cargos`, `entrevistas`, `preguntas`, `respuestas`, `puntajes`, `historial_aplicaciones` y `notificaciones`, conectadas mediante claves foráneas para mantener la trazabilidad completa del proceso de reclutamiento. [attached_file:2]  
- Archivos de infraestructura como `Dockerfile`, `docker-compose.yml`, `.env` de ejemplo y colecciones de Postman para probar rápidamente los endpoints del backend. [attached_file:2][image:1]

---

## 3. Configuración previa

1. Crear la base de datos en Supabase y ejecutar el script de creación de tablas incluido en la carpeta `sql/`. [attached_file:2]  
2. En la carpeta `Backend`, crear un archivo `.env` con variables similares a las siguientes (ajusta los nombres según tu entorno real): [attached_file:2]  

3. Si `JWT_SECRET` o `DATABASE_URL` no están definidos, el backend muestra advertencias claras en consola para facilitar el diagnóstico sin detener el servidor en entornos de desarrollo. [attached_file:2]

---

## 4. Cómo ejecutar el backend

### Opción A: entorno local con Node

1. Instalar dependencias:  
cd Backend
npm install
2. Ejecutar en desarrollo (con recarga si está configurado):  
npm run dev
3. Ejecutar en modo producción:  
npm start


El servidor quedará escuchando en `http://localhost:3000` (o el puerto definido en `PORT`) y la API base estará disponible en `http://localhost:3000/api`. [attached_file:2]

### Opción B: usando Docker / docker-compose

1. Revisar `Dockerfile` y `docker-compose.yml` para confirmar la configuración de `PORT`, `DATABASE_URL` y resto de variables de entorno. [attached_file:2][image:1]  
2. Construir y levantar los servicios:  

# docker-compose up --build


Esta opción permite levantar el backend en un contenedor listo para producción, conectándolo a la base de datos de Supabase o a un contenedor PostgreSQL definido en el propio `docker-compose.yml`. [attached_file:2]

---

## 5. Flujos principales de la API

- **Autenticación y perfil**  
- `POST /api/auth/login-empresa` y `POST /api/auth/login-candidato` validan email y contraseña contra las tablas `empresas` y `candidatos`, soportan contraseñas hasheadas con bcrypt y devuelven un JWT con `id`, `email`, `nombre` y `role`. [attached_file:2]  
- `GET /api/auth/me` usa el middleware `authenticateToken` para devolver el perfil completo del usuario autenticado con las columnas adecuadas según sea empresa o candidato. [attached_file:2]

- **Gestión de entidades de reclutamiento**  
- Endpoints CRUD organizados por recurso: `/api/empresas`, `/api/candidatos`, `/api/cargos`, `/api/cvs`, `/api/entrevistas`, `/api/preguntas`, `/api/respuestas`, `/api/puntajes`, `/api/historial` y `/api/notificaciones`. [attached_file:2]  
- Algunas consultas incluyen `JOIN` para enriquecer la respuesta con información de empresa o cargo, con una ruta de fallback a consultas simples si el esquema real no coincide exactamente con el esperado. [attached_file:2]

- **Postulación con CV y n8n**  
- `POST /api/postulaciones` recibe `cargo_id` y un archivo `cv` (PDF) mediante `multipart/form-data`, valida los datos, sube el archivo a Supabase Storage y obtiene la URL pública del CV. [attached_file:2]  
- La API llama al webhook configurado en `N8N_WEBHOOK_URL`, que se encarga de descargar el archivo, extraer texto, procesarlo con IA y registrar candidato, CV e historial de aplicación; si el webhook falla, se responde con éxito parcial indicando que el CV fue subido pero la postulación no pudo procesarse automáticamente. [attached_file:2]

Con esta guía, cualquier miembro del equipo puede configurar las variables de entorno, levantar el backend en local o en Docker y comenzar a consumir los endpoints desde Postman o desde el frontend del proyecto. [attached_file:2][image:1]

---

## 📄 Licencia

Este proyecto está licenciado únicamente para **uso educativo**. Ver el archivo [LICENSE](../LICENSE) en la raíz del repositorio para más detalles.

**IMPORTANTE:** Este software está destinado exclusivamente para fines educativos y de aprendizaje. No está permitido su uso comercial, distribución comercial, o cualquier otro uso que no sea estrictamente educativo.
