# CrewAI Frontend - Plataforma de Entrevistas Inteligentes

Frontend moderno y profesional para CrewAI, una plataforma de reclutamiento con agentes de IA.

## 🚀 Tecnologías

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Estado**: React Context API
- **Comunicación**: REST API + WebSocket
- **Gráficos**: Recharts
- **Base de datos**: Turso (vía backend)

## 📁 Estructura del Proyecto

```
crewai-recruitment/frontend/
├── app/                          # Next.js App Router
│   ├── auth/                     # Autenticación
│   │   ├── login/               # Pantalla de login
│   │   └── register/            # Pantalla de registro
│   ├── dashboard/               # Dashboard empresas
│   │   ├── cargos/             # Gestión de cargos
│   │   └── page.tsx            # Dashboard principal
│   ├── candidate/               # Módulo candidatos
│   │   └── register/           # Registro de candidatos
│   ├── interview/[id]/         # Pantalla de entrevista
│   ├── results/[id]/           # Resultados de entrevista
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Página raíz
│   ├── globals.css             # Estilos globales
│   └── ClientProviders.tsx     # Providers del cliente
│
├── components/                  # Componentes reutilizables
│   ├── common/                 # Componentes base
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── FileUpload.tsx
│   │   ├── Input.tsx
│   │   ├── Loading.tsx
│   │   └── Notification.tsx
│   ├── interview/              # Componentes de entrevista
│   │   ├── ChatBox.tsx
│   │   ├── ChatMessage.tsx
│   │   └── TypingIndicator.tsx
│   └── layout/                 # Componentes de layout
│       ├── DashboardLayout.tsx
│       ├── Header.tsx
│       └── Sidebar.tsx
│
├── lib/                         # Lógica de negocio
│   ├── api/                    # Servicios API
│   │   ├── client.ts          # Cliente HTTP
│   │   ├── config.ts          # Configuración API
│   │   ├── services.ts        # Servicios de negocio
│   │   └── websocket.ts       # Cliente WebSocket
│   ├── contexts/               # Context Providers
│   │   ├── AuthContext.tsx
│   │   └── NotificationContext.tsx
│   ├── hooks/                  # Hooks personalizados
│   │   ├── useFileUpload.ts
│   │   └── useInterview.ts
│   ├── types/                  # TypeScript types
│   │   └── index.ts
│   └── utils/                  # Utilidades
│
├── public/                      # Archivos estáticos
├── middleware.ts               # Middleware de autenticación
├── tailwind.config.ts          # Configuración Tailwind
├── tsconfig.json               # Configuración TypeScript
├── next.config.js              # Configuración Next.js
├── package.json                # Dependencias
└── README.md                   # Este archivo
```

## 🎨 Características del Diseño

### Paleta de Colores Neutros
- **#F7F7F7** - Background principal
- **#E8E8E8** - Background secundario
- **#C9C9C9** - Bordes
- **#333333** - Texto secundario
- **#000000** - Texto principal

### Componentes Principales

#### 1. **Autenticación**
- Login de empresas
- Registro de empresas
- Gestión de sesiones con Context API

#### 2. **Dashboard Empresas**
- Vista general con estadísticas
- Lista de candidatos
- Historial de entrevistas
- Accesos rápidos

#### 3. **Registro de Candidatos**
- Formulario intuitivo
- Upload de CV (drag & drop)
- Selección de cargo
- Validación en tiempo real

#### 4. **Entrevista con IA**
- Chat en tiempo real (WebSocket)
- Indicador de typing
- Burbujas diferenciadas
- Auto-scroll
- Estado de conexión

#### 5. **Resultados**
- Puntuación total y por categorías
- Gráficos de barras
- Recomendación del sistema
- Fortalezas y áreas de mejora
- Resumen detallado

#### 6. **Gestión de Cargos**
- Crear nuevos perfiles
- Definir criterios técnicos
- Listar cargos existentes

## 🛠️ Instalación

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Backend de CrewAI ejecutándose

### Pasos

1. **Clonar el repositorio**
```bash
cd crewai-recruitment/frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita `.env` con la URL de tu backend:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📡 Integración con Backend

### Endpoints REST Requeridos

#### Autenticación
- `POST /api/auth/login` - Login empresa
- `POST /api/auth/register` - Registro empresa
- `GET /api/auth/me` - Obtener datos de empresa

#### Candidatos
- `GET /api/candidatos` - Listar candidatos
- `GET /api/candidatos/:id` - Obtener candidato
- `POST /api/candidatos` - Crear candidato
- `POST /api/candidatos/upload-cv` - Subir CV

#### Entrevistas
- `GET /api/entrevistas` - Listar entrevistas
- `GET /api/entrevistas/:id` - Obtener entrevista
- `POST /api/entrevistas` - Crear entrevista
- `POST /api/entrevistas/:id/start` - Iniciar entrevista
- `POST /api/entrevistas/:id/complete` - Finalizar entrevista
- `POST /api/entrevistas/:id/responder` - Enviar respuesta

#### Resultados
- `GET /api/resultados/entrevista/:entrevistaId` - Obtener resultados

#### Cargos
- `GET /api/cargos` - Listar cargos
- `POST /api/cargos` - Crear cargo

### WebSocket

#### Conexión
```
ws://backend-url/ws/interview/:entrevistaId?token=<jwt-token>
```

#### Mensajes
```typescript
// Enviado por el candidato
{
  role: 'candidate',
  content: 'Mi respuesta...',
  preguntaId?: 'uuid',
  timestamp: 'ISO-8601'
}

// Recibido del agente
{
  role: 'agent',
  content: 'Pregunta del agente...',
  preguntaId?: 'uuid',
  timestamp: 'ISO-8601'
}
```

## 🚦 Flujo de Usuario

### Para Empresas
1. Registro/Login → `/auth/login` o `/auth/register`
2. Dashboard → `/dashboard`
3. Crear cargo → `/dashboard/cargos`
4. Ver candidatos y resultados

### Para Candidatos
1. Registro → `/candidate/register`
2. Subir CV
3. Entrevista → `/interview/:id`
4. Ver resultados → `/results/:id`

## 🔐 Autenticación

- JWT almacenado en `localStorage`
- Middleware de Next.js para rutas protegidas
- Context API para estado global de autenticación
- Redirección automática según estado de sesión

## 📱 Responsive Design

- **Mobile-first approach**
- Breakpoints de Tailwind:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px

## 🎯 Características Técnicas

### Optimizaciones
- Lazy loading de componentes
- Memoización de cálculos costosos
- Auto-scroll inteligente en chat
- Reconexión automática de WebSocket
- Validación en tiempo real

### Accesibilidad
- Etiquetas semánticas
- ARIA labels donde es necesario
- Navegación por teclado
- Contraste de colores adecuado

### UX Enhancements
- Loading states
- Error handling
- Toast notifications
- Smooth transitions
- Typing indicators
- Progress bars

## 🧪 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Ejecutar build
npm start

# Linting
npm run lint
```

## 🐛 Troubleshooting

### WebSocket no conecta
- Verifica que el backend esté corriendo
- Revisa la URL en `.env`
- Verifica que el token sea válido

### Estilos no se aplican
- Ejecuta `npm run dev` de nuevo
- Verifica que Tailwind esté configurado correctamente

### Error de CORS
- Configura CORS en el backend para permitir `localhost:3000`

## 📦 Build para Producción

```bash
npm run build
npm start
```

Para desplegar en Vercel, Netlify u otros:
- Configura las variables de entorno
- El proyecto está listo para deploy automático

## 🤝 Contribuciones

Este es un proyecto profesional construido con las mejores prácticas de desarrollo frontend.

## 📄 Licencia

Proyecto CrewAI - 2024

---

**Desarrollado con ❤️ usando Next.js, TypeScript y Tailwind CSS**
