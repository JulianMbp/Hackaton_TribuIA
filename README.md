# CrewAI – Plataforma de Reclutamiento con IA

Repositorio monorepo para una plataforma de reclutamiento impulsada por IA que combina:

- Un **backend** de orquestación sobre Supabase (Node.js + Express).
- Un **frontend principal** en Next.js para empresas y candidatos.
- Una **aplicación web FastVLM-WebGPU** para captioning de video en tiempo real.
- **Workflows n8n** para ingestión y evaluación inteligente de candidatos.

La plataforma busca automatizar el ciclo completo de reclutamiento: publicación de cargos, registro de candidatos, entrevistas con IA, scoring automático y visualización de resultados. [attached_file:2][attached_file:3]

---

## 🏗 Módulos del repositorio

├── Backend/ # API REST sobre Supabase
├── crewai-recruitment/ # Frontend Next.js (App Router)
│ └── frontend/
├── fastvlm-webgpu/ # Webapp de captioning con WebGPU + FastVLM
└── Hackaton_TribuIA/ # Workflows n8n y colecciones Postman


Cada módulo puede ejecutarse de forma independiente, pero están pensados para integrarse entre sí mediante REST APIs, WebSockets y webhooks. [attached_file:2][attached_file:3]

---

## 🧩 1. Backend – Orquestador de Reclutamiento sobre Supabase

API REST construida con **Node.js + Express** que orquesta el flujo de reclutamiento entre empresas y candidatos usando **PostgreSQL (Supabase)** como base de datos principal. [attached_file:2]  
Se integra con **Supabase Storage** y un workflow de **n8n** para recibir CVs en PDF, procesarlos con IA y registrar automáticamente candidatos, CVs e historial de postulaciones. [attached_file:2]

### Tecnologías y características clave

- Node.js + Express como servidor HTTP principal.  
- PostgreSQL (Supabase) vía cliente `pg` y pool con manejo robusto de errores y reintentos.  
- Autenticación JWT con middlewares `authenticateToken` y `requireRole` (roles: empresa / candidato).  
- Ruteo modular por recurso: `auth`, `empresas`, `candidatos`, `cargos`, `cvs`, `entrevistas`, `preguntas`, `respuestas`, `puntajes`, `historial`, `notificaciones`, `postulaciones`.  
- Manejo centralizado de errores que clasifica códigos típicos de PostgreSQL (timeouts, tabla/columna inexistente, FK/unique violations, etc.). [attached_file:2]

### Estructura del Backend

Backend/
├── src/
│ ├── index.js # Servidor Express, middlewares y registro de rutas
│ ├── db.js # Pool PostgreSQL (Supabase) + helper query()
│ ├── routes/ # Rutas por recurso (auth, empresas, candidatos, ...)
│ ├── controllers/ # Lógica de negocio de cada recurso
│ ├── middleware/ # JWT auth, control de roles, manejo de errores
│ └── utils/ # Utilidades (JWT, Supabase Storage, etc.)
├── sql/
│ └── tablas-supabase.sql # Definición de tablas y relaciones
├── docker-compose.yml
├── Dockerfile
├── .env (local) # Variables de entorno
└── package.json

[attached_file:2][image:1]

### Variables de entorno mínimas

PORT=3000
DATABASE_URL=postgres://usuario:password@host:puerto/dbname

JWT_SECRET=un_super_secreto_para_jwt
JWT_EXPIRES_IN=7d

Webhook de n8n para procesar CVs
N8N_WEBHOOK_URL=http://localhost:5678/webhook/candidate_intake

Supabase Storage
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...


Si `JWT_SECRET` o `DATABASE_URL` no están definidos, el backend muestra advertencias en consola sin tumbar el servidor en desarrollo. [attached_file:2]

### Cómo ejecutar el Backend

**Local (Node):**

cd Backend
npm install

Desarrollo
npm run dev

Producción
npm start


API disponible en `http://localhost:3000/api`. [attached_file:2]

**Con Docker / docker-compose:**

cd Backend
docker-compose up --build


Levanta el backend en un contenedor listo para producción, conectándolo a Supabase o a un contenedor PostgreSQL definido en el `docker-compose.yml`. [attached_file:2]

### Flujos principales de la API

- **Autenticación y perfil**
  - `POST /api/auth/login-empresa`, `POST /api/auth/login-candidato` → login con email/password, soporte bcrypt, respuesta con JWT y datos básicos.  
  - `GET /api/auth/me` → perfil del usuario autenticado según rol. [attached_file:2]

- **Gestión de entidades**
  - CRUDs completos para `/api/empresas`, `/api/candidatos`, `/api/cargos`, `/api/cvs`, `/api/entrevistas`, `/api/preguntas`, `/api/respuestas`, `/api/puntajes`, `/api/historial`, `/api/notificaciones`.  
  - Algunas rutas usan `JOIN` para enriquecer la respuesta con datos de empresa/cargo y caen en consultas simples si el esquema difiere. [attached_file:2]

- **Postulación con CV + n8n**
  - `POST /api/postulaciones`: recibe `cargo_id` y archivo `cv` (PDF), lo sube a Supabase Storage y llama al webhook `N8N_WEBHOOK_URL`.  
  - El workflow de n8n descarga el CV, extrae texto, usa IA para interpretar el perfil y registra candidato, CV e historial de aplicación. Si n8n falla, responde con éxito parcial indicando que el CV sí se subió. [attached_file:2]

---

## 💻 2. Frontend Next.js – Plataforma de Entrevistas Inteligentes

Frontend moderno y profesional para empresas y candidatos, construido con **Next.js 15 (App Router)**, **TypeScript** y **Tailwind CSS**. [attached_file:3]  
Se conecta al backend vía REST y WebSocket para gestionar autenticación, entrevistas con IA, resultados y dashboards de empresas. [attached_file:3]

### Tecnologías

- Next.js 15 (App Router) + TypeScript.  
- Tailwind CSS para estilos.  
- React Context API para autenticación y notificaciones.  
- REST API + WebSocket para entrevistas en tiempo real.  
- Recharts para visualización de resultados. [attached_file:3]

### Estructura principal

crewai-recruitment/frontend/
├── app/ # Rutas App Router
│ ├── auth/ # Login / registro
│ ├── dashboard/ # Dashboard de empresa y cargos
│ ├── candidate/ # Registro de candidatos
│ ├── interview/[id]/ # Pantalla de entrevista
│ ├── results/[id]/ # Resultados de entrevista
│ ├── layout.tsx
│ └── page.tsx
├── components/ # UI reusable (cards, chat, layout, etc.)
├── lib/ # API client, contexts, hooks, utils
├── public/
└── package.json

[attached_file:3]

### Instalación y ejecución

cd crewai-recruitment/frontend
npm install

cp .env.example .env

Configura las URLs del backend
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_WS_URL=ws://localhost:3000
npm run dev # desarrollo
npm run build # build producción
npm start # servir build


La app se sirve en `http://localhost:3000`. [attached_file:3]

---

## 🎥 3. fastvlm-webgpu – Live Video Captioning con WebGPU

SPA en **Vite + React + TypeScript** que usa **WebGPU** y el modelo `FastVLM` para generar subtítulos de una sola frase en tiempo real a partir de la cámara del usuario. [attached_file:3]  
Diseñada para integrarse con la experiencia de entrevista (por ejemplo, dar feedback sobre comunicación, lenguaje corporal, etc.). [attached_file:3]

### Características

- Carga en navegador de `onnx-community/FastVLM-0.5B-ONNX` con `transformers.js` y ejecución en WebGPU.  
- Loop de inferencia que captura frames del `<video>` y llama a `runInference` respetando un `FRAME_CAPTURE_DELAY`.  
- UI glassmorphism con componentes `GlassContainer`, `GlassButton`, `DraggableContainer`, `PromptInput`, `LiveCaption`, etc.  
- Manejo detallado de errores de cámara y compatibilidad WebGPU. [attached_file:3]

### Uso rápido

cd fastvlm-webgpu
npm install

Desarrollo
npm run dev

Build
npm run build
npm run preview


App accesible en `http://localhost:5173` por defecto. Requiere navegador con WebGPU y conexión HTTPS al desplegarla en producción. [attached_file:3][image:1]

---

## 🔄 4. Workflows n8n – Ingesta y Evaluación de Candidatos

Dentro de `Hackaton_TribuIA/` se incluyen workflows de **n8n** y colecciones Postman para:

- Recibir CVs (`RecibirCandidatoWorkflow.json`).
- Filtrar candidatos y generar preguntas (`Filter Candidate`).
- Evaluar respuestas de entrevistas (`Evaluate Answers`). [attached_file:3]

### Requisitos y setup

- Instancia de n8n (por ejemplo `http://localhost:5678`).  
- Variables/credenciales en n8n:
  - `SUPABASE_URL`, `SUPABASE_ANON_KEY`
  - `OPENAI_API_KEY`
  - `SERPER_API_KEY`  
- Workflows y colecciones Postman en la carpeta `workflows/`. [attached_file:3]

Los workflows exponen webhooks que el backend consume (por ejemplo, desde `/api/postulaciones`) para automatizar todo el pipeline de extracción de información y scoring de candidatos. [attached_file:2][attached_file:3]

---

## 📄 Licencia

Este proyecto está licenciado únicamente para **uso educativo**. Ver el archivo [LICENSE](LICENSE) para más detalles.

**IMPORTANTE:** Este software está destinado exclusivamente para fines educativos y de aprendizaje. No está permitido su uso comercial, distribución comercial, o cualquier otro uso que no sea estrictamente educativo.
