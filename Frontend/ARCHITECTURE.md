# Arquitectura del Frontend - CrewAI

## 📐 Visión General

El frontend de CrewAI está construido con una arquitectura modular, escalable y mantenible siguiendo las mejores prácticas de desarrollo moderno.

## 🏗️ Principios de Arquitectura

### 1. Separación de Responsabilidades
- **Presentación**: Componentes UI (`/components`)
- **Lógica de Negocio**: Services y Hooks (`/lib`)
- **Estado Global**: Context API (`/lib/contexts`)
- **Rutas**: Next.js App Router (`/app`)

### 2. Modularidad
Cada módulo es independiente y reutilizable:
- Componentes atómicos en `/components/common`
- Componentes compuestos en subdirectorios específicos
- Servicios desacoplados en `/lib/api`

### 3. Type Safety
- TypeScript en todo el código
- Tipos centralizados en `/lib/types`
- Interfaces explícitas para props

## 🔄 Flujo de Datos

```
Usuario → Componente → Hook/Service → API Client → Backend
                ↓
         Context (Estado Global)
                ↓
         Otros Componentes
```

### Ejemplo: Enviar Respuesta en Entrevista

1. Usuario escribe en `ChatBox.tsx`
2. `ChatBox` llama a `onSendMessage` (prop)
3. Hook `useInterview` recibe el mensaje
4. `InterviewWebSocket` envía por WebSocket
5. Backend procesa y responde
6. WebSocket recibe respuesta
7. Hook actualiza estado `messages`
8. `ChatBox` re-renderiza con nuevo mensaje

## 📦 Capas de la Aplicación

### Capa 1: Presentación (Components)

#### Components/Common
Componentes base reutilizables:
- `Button`: Botones primary/secondary
- `Input`: Inputs con validación
- `Card`: Contenedores visuales
- `FileUpload`: Drag & drop files
- `Loading`: Estados de carga
- `Notification`: Toast messages

#### Components/Interview
Componentes específicos de entrevista:
- `ChatBox`: Contenedor completo del chat
- `ChatMessage`: Bubble individual
- `TypingIndicator`: Animación de "typing..."

#### Components/Layout
Estructura de la aplicación:
- `Header`: Navegación superior
- `Sidebar`: Menú lateral
- `DashboardLayout`: Layout del dashboard

### Capa 2: Lógica de Negocio (Lib)

#### API Layer (`/lib/api`)

**client.ts**: HTTP Client
```typescript
class ApiClient {
  get<T>()
  post<T>()
  put<T>()
  delete<T>()
  uploadFile<T>()
}
```

**services.ts**: Business Logic
```typescript
authService
candidatoService
entrevistaService
resultadoService
cargoService
```

**websocket.ts**: Real-time Communication
```typescript
class InterviewWebSocket {
  connect()
  sendMessage()
  onMessage()
  disconnect()
}
```

#### Contexts (`/lib/contexts`)

**AuthContext**: Gestión de autenticación
- Estado de usuario
- Login/Logout
- Token management

**NotificationContext**: Sistema de notificaciones
- Toast messages
- Auto-dismiss
- Multiple notifications

#### Hooks (`/lib/hooks`)

**useInterview**: Gestión de entrevista
- WebSocket connection
- Message history
- Typing state
- Send/Receive messages

**useFileUpload**: Upload de archivos
- Drag & drop
- Validation
- Progress tracking

### Capa 3: Páginas (App Router)

```
/app
├── auth/              # Autenticación
├── dashboard/         # Panel empresas
├── candidate/         # Registro candidatos
├── interview/[id]     # Entrevista en vivo
└── results/[id]       # Resultados
```

## 🔐 Gestión de Estado

### Estado Local
- `useState` para estado de componente
- `useRef` para referencias DOM

### Estado Global
- **AuthContext**: Usuario autenticado
- **NotificationContext**: Notificaciones activas

### Estado Remoto
- API calls via services
- WebSocket para real-time

## 🌐 Comunicación con Backend

### REST API
```typescript
// Estructura de respuesta
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Uso
const response = await candidatoService.getAll()
if (response.success) {
  setCandidatos(response.data)
}
```

### WebSocket
```typescript
// Conexión
const ws = new InterviewWebSocket(entrevistaId)
ws.connect()

// Escuchar mensajes
ws.onMessage((message) => {
  setMessages(prev => [...prev, message])
})

// Enviar mensaje
ws.sendMessage(content)
```

## 🎨 Sistema de Diseño

### Tokens de Color
```css
--color-bg: #F7F7F7
--color-bg-secondary: #E8E8E8
--color-border: #C9C9C9
--color-text-primary: #000000
--color-text-secondary: #333333
```

### Componentes Base
Todos los componentes usan clases de Tailwind configuradas en `tailwind.config.ts`:
- `btn-primary`: Botón principal
- `btn-secondary`: Botón secundario
- `input-base`: Input estándar
- `card-base`: Card container

### Animaciones
```css
.smooth-hover: transition-all duration-200
.animate-pulse: Loading animation
.typing-dot: Bounce animation
```

## 🛡️ Seguridad

### Autenticación
1. JWT almacenado en `localStorage`
2. Token enviado en headers: `Authorization: Bearer <token>`
3. Middleware valida token en rutas protegidas

### Rutas Protegidas
```typescript
// middleware.ts
const protectedRoutes = ['/dashboard']

if (isProtectedRoute && !token) {
  redirect('/auth/login')
}
```

### Validación de Datos
- Validación en formularios
- Sanitización de inputs
- Type checking con TypeScript

## 📊 Manejo de Errores

### Niveles de Error

1. **Network Errors**: Capturados en API client
```typescript
try {
  const response = await fetch(...)
} catch (error) {
  return { success: false, error: 'Error de conexión' }
}
```

2. **API Errors**: Procesados en services
```typescript
if (!response.ok) {
  return { success: false, error: data.error }
}
```

3. **UI Errors**: Mostrados con notificaciones
```typescript
showNotification('error', 'Error al cargar datos')
```

## 🚀 Optimizaciones

### Performance
- Lazy loading de componentes pesados
- Memoización con `useMemo` y `useCallback`
- Debouncing en inputs de búsqueda
- Image optimization con Next.js

### UX
- Loading skeletons
- Optimistic updates
- Auto-retry en WebSocket
- Progress indicators

## 🧪 Testing Strategy (Recomendado)

```typescript
// Unit Tests
- Componentes individuales
- Hooks personalizados
- Utility functions

// Integration Tests
- Flujos completos
- API integration
- Context providers

// E2E Tests
- User flows
- Critical paths
```

## 📱 Responsive Design

### Mobile First
```typescript
// Base styles: Mobile
className="w-full"

// Tablet
className="md:w-1/2"

// Desktop
className="lg:w-1/3"
```

### Breakpoints
- `sm`: 640px - Tablets pequeñas
- `md`: 768px - Tablets
- `lg`: 1024px - Laptops
- `xl`: 1280px - Desktops

## 🔄 Ciclo de Vida

### Montaje de Componente
```typescript
useEffect(() => {
  // Initial load
  loadData()
}, [])
```

### Actualización
```typescript
useEffect(() => {
  // React to changes
  if (candidatoId) {
    loadCandidato(candidatoId)
  }
}, [candidatoId])
```

### Desmontaje
```typescript
useEffect(() => {
  return () => {
    // Cleanup
    ws.disconnect()
  }
}, [])
```

## 📈 Escalabilidad

### Agregar Nueva Funcionalidad

1. **Crear tipos** en `/lib/types`
2. **Crear servicio** en `/lib/api/services.ts`
3. **Crear hook** (si es necesario) en `/lib/hooks`
4. **Crear componentes** en `/components`
5. **Crear página** en `/app`

### Ejemplo: Agregar "Comentarios"

```typescript
// 1. Type
interface Comentario {
  id: string
  texto: string
  candidatoId: string
}

// 2. Service
export const comentarioService = {
  create: (data) => apiClient.post('/api/comentarios', data)
}

// 3. Hook
export const useComentarios = (candidatoId) => {
  const [comentarios, setComentarios] = useState([])
  // ...
}

// 4. Component
export const ComentariosList = () => {
  const { comentarios } = useComentarios()
  // ...
}

// 5. Page
// app/dashboard/candidatos/[id]/comentarios/page.tsx
```

## 🎯 Best Practices Implementadas

1. **DRY (Don't Repeat Yourself)**
   - Componentes reutilizables
   - Hooks compartidos
   - Utilities centralizadas

2. **SOLID Principles**
   - Single Responsibility
   - Open/Closed
   - Dependency Inversion

3. **Clean Code**
   - Nombres descriptivos
   - Funciones pequeñas
   - Comentarios significativos

4. **Type Safety**
   - TypeScript strict mode
   - No any types
   - Interfaces explícitas

---

Esta arquitectura permite:
- ✅ Escalabilidad
- ✅ Mantenibilidad
- ✅ Testabilidad
- ✅ Performance
- ✅ Developer Experience
