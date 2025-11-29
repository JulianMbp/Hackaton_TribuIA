# 🔐 Sistema de Login - CrewAI Frontend

## 📋 Descripción General

Se ha implementado un sistema completo de autenticación dual con interfaz moderna y responsiva. El sistema permite a los usuarios elegir entre **Empresa** o **Candidato**, cada uno con su propio flujo de login.

---

## 🎯 Características Implementadas

### ✅ Pantalla Principal de Selección de Rol
- **Ruta**: `/` (página principal)
- **Archivo**: `app/page.tsx`
- Dos tarjetas interactivas con animaciones hover
- Diseño responsivo para móvil, tablet y desktop
- Iconos de Lucide React (Building2, UserCircle2)

### ✅ Login para Empresa
- **Ruta**: `/auth/login/empresa`
- **Archivo**: `app/auth/login/empresa/page.tsx`
- **Campos**:
  - Email
  - Contraseña
- **Funcionalidades**:
  - Link "¿Olvidaste tu contraseña?"
  - Botón "Ingresar" que redirige a `/dashboard`
  - Link de registro
  - Banner informativo (modo demo)

### ✅ Login para Candidato
- **Ruta**: `/auth/login/candidato`
- **Archivo**: `app/auth/login/candidato/page.tsx`
- **Campos**:
  - Email
  - Documento / Identificación
- **Funcionalidades**:
  - Botón "Ingresar" que redirige a `/panel-candidato`
  - Link de ayuda
  - Banner informativo (modo demo)

### ✅ Panel del Candidato
- **Ruta**: `/panel-candidato`
- **Archivo**: `app/panel-candidato/page.tsx`
- **Características**:
  - Dashboard con estadísticas (entrevistas pendientes, completadas, total)
  - Lista de entrevistas con estados
  - Botón de logout
  - Diseño responsivo

### ✅ Servicio de Autenticación (Mock)
- **Archivo**: `lib/services/authService.ts`
- **Funciones principales**:
  - `loginEmpresa()` - Mock login para empresas
  - `loginCandidato()` - Mock login para candidatos
  - `storeAuthData()` - Guardar datos en localStorage
  - `getAuthData()` - Recuperar datos del localStorage
  - `clearAuthData()` - Limpiar sesión
  - `isAuthenticated()` - Verificar si está autenticado
  - `getUserRole()` - Obtener rol del usuario

---

## 📂 Estructura de Archivos Creados/Modificados

```
frontend/
├── app/
│   ├── page.tsx                              ✨ MODIFICADO - Selección de rol
│   ├── auth/
│   │   └── login/
│   │       ├── empresa/
│   │       │   └── page.tsx                  ✨ NUEVO - Login empresa
│   │       └── candidato/
│   │           └── page.tsx                  ✨ NUEVO - Login candidato
│   └── panel-candidato/
│       └── page.tsx                          ✨ NUEVO - Dashboard candidato
├── lib/
│   └── services/
│       └── authService.ts                    ✨ NUEVO - Servicio de auth mock
└── package.json                              ✨ MODIFICADO - lucide-react añadido
```

---

## 🛣️ Flujo de Navegación

```
┌─────────────────┐
│   / (Inicio)    │
│ Selección Rol   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌──────────────┐
│ Empresa │ │  Candidato   │
└────┬────┘ └──────┬───────┘
     │             │
     ▼             ▼
┌──────────┐  ┌───────────────┐
│/dashboard│  │/panel-candidato│
└──────────┘  └───────────────┘
```

---

## 🎨 Diseño y Estilos

### Colores Principales
- **Neutral 900** (#171717) - Botones y texto principal
- **Neutral 50-100** - Fondos degradados
- **White** - Tarjetas y contenedores
- **Blue** - Banners informativos
- **Green/Yellow** - Estados de entrevistas

### Componentes Reutilizados
- `<Input />` - Campo de entrada personalizado
- `<Button />` - Botón con estados loading
- Iconos de **lucide-react**

### Responsividad
- **Mobile**: Diseño vertical de 1 columna
- **Tablet**: Grid de 2 columnas
- **Desktop**: Layout optimizado con max-width

---

## 🔧 Instalación y Uso

### Dependencias Nuevas
```bash
npm install lucide-react
```

### Ejecutar el Proyecto
```bash
npm run dev
```

### Compilar para Producción
```bash
npm run build
```

---

## 🚀 Rutas Disponibles

| Ruta                      | Descripción                    | Estado  |
|---------------------------|--------------------------------|---------|
| `/`                       | Selección de rol               | ✅ OK   |
| `/auth/login/empresa`     | Login empresa                  | ✅ OK   |
| `/auth/login/candidato`   | Login candidato                | ✅ OK   |
| `/dashboard`              | Panel empresa (existente)      | ✅ OK   |
| `/panel-candidato`        | Panel candidato                | ✅ OK   |
| `/auth/register`          | Registro empresa (existente)   | ✅ OK   |

---

## ⚠️ Modo Demo

**IMPORTANTE**: El sistema actual NO está conectado a la base de datos. Todo funciona en modo demo:

- No se validan credenciales
- Cualquier email/password funciona
- Los datos no se persisten en base de datos
- La sesión se guarda temporalmente en `localStorage`

### Banner Informativo
Todas las páginas de login incluyen un banner azul que indica:
> "Modo Demo: Este login aún no está conectado a la base de datos. Puedes ingresar con cualquier email y contraseña."

---

## 🔮 Preparación para Turso Database

El archivo `lib/services/authService.ts` incluye comentarios y estructura preparada para la futura integración con Turso DB:

```typescript
// TODO: Implementar cuando Turso DB esté configurado
//
// import { createClient } from '@libsql/client';
//
// const tursoClient = createClient({
//   url: process.env.TURSO_DATABASE_URL!,
//   authToken: process.env.TURSO_AUTH_TOKEN!,
// });
```

### Pasos para Conectar con Turso (Futuro)

1. **Instalar libsql client**:
   ```bash
   npm install @libsql/client
   ```

2. **Configurar variables de entorno** (`.env.local`):
   ```
   TURSO_DATABASE_URL=your_database_url
   TURSO_AUTH_TOKEN=your_auth_token
   ```

3. **Reemplazar funciones mock** en `authService.ts`:
   - `loginEmpresa()` → `loginEmpresaDB()`
   - `loginCandidato()` → `loginCandidatoDB()`

4. **Crear tablas en Turso**:
   ```sql
   CREATE TABLE empresas (
     id TEXT PRIMARY KEY,
     nombre TEXT NOT NULL,
     email TEXT UNIQUE NOT NULL,
     password TEXT NOT NULL
   );

   CREATE TABLE candidatos (
     id TEXT PRIMARY KEY,
     nombre TEXT NOT NULL,
     email TEXT UNIQUE NOT NULL,
     documento TEXT UNIQUE NOT NULL
   );
   ```

---

## 🎯 Testing Manual

### Test 1: Navegación Básica
1. Ir a `http://localhost:3000`
2. Verificar que aparecen las dos tarjetas
3. Click en "Soy Empresa" → Debe ir a `/auth/login/empresa`
4. Botón "Volver" → Regresa a `/`

### Test 2: Login Empresa
1. Ir a `/auth/login/empresa`
2. Ingresar cualquier email y password
3. Click "Ingresar"
4. Debe redirigir a `/dashboard`

### Test 3: Login Candidato
1. Ir a `/auth/login/candidato`
2. Ingresar cualquier email y documento
3. Click "Ingresar"
4. Debe redirigir a `/panel-candidato`

### Test 4: Responsividad
1. Cambiar tamaño de ventana
2. Verificar que todo se adapta correctamente
3. Probar en modo móvil (< 768px)

---

## 📱 Capturas del Sistema

### Página Principal (Selección de Rol)
- Dos tarjetas grandes con iconos
- Animaciones hover suaves
- Diseño centrado y espaciado

### Login Empresa
- Formulario limpio con iconos
- Input de email y password
- Link de "Olvidaste tu contraseña"
- Banner informativo de modo demo

### Login Candidato
- Formulario con email y documento
- Ayuda contextual (sin puntos ni guiones)
- Link de contacto con empresa
- Banner informativo de modo demo

### Panel Candidato
- Header con logout
- 3 cards de estadísticas
- Lista de entrevistas con estados
- Botones de acción

---

## 🐛 Errores Conocidos y Soluciones

### ✅ Compilación Exitosa
- ✅ Sin errores de TypeScript
- ✅ Sin warnings de React Hooks
- ✅ Todas las rutas funcionan correctamente
- ✅ Build production exitoso

### ⚠️ Advertencia de Cross-Origin (No crítico)
```
⚠ Cross origin request detected...
```
**Solución**: Esto es solo informativo en desarrollo. Se puede ignorar o configurar `allowedDevOrigins` en `next.config.js`.

---

## 📝 Notas Adicionales

### Stack Tecnológico Utilizado
- ✅ **React 18** + TypeScript
- ✅ **Next.js 15** (App Router)
- ✅ **TailwindCSS** para estilos
- ✅ **lucide-react** para iconos
- ✅ Componentes existentes del proyecto

### Mejores Prácticas Aplicadas
- Componentes client-side (`'use client'`)
- Tipado estricto con TypeScript
- Código limpio y comentado
- Responsive design mobile-first
- Accesibilidad (labels, ARIA)
- SEO-friendly

### Extensibilidad
El código está preparado para:
- Agregar validación de formularios (React Hook Form, Zod)
- Integrar con backend real
- Añadir autenticación JWT
- Implementar recuperación de contraseña
- Agregar 2FA (autenticación de dos factores)

---

## 🎉 Resumen de Entregables

| Entregable                           | Estado |
|--------------------------------------|--------|
| Pantalla de selección de rol         | ✅ OK  |
| Componente LoginEmpresa              | ✅ OK  |
| Componente LoginCandidato            | ✅ OK  |
| Panel candidato                      | ✅ OK  |
| Servicio de autenticación mock       | ✅ OK  |
| Rutas configuradas                   | ✅ OK  |
| Navegación funcional                 | ✅ OK  |
| Diseño responsivo                    | ✅ OK  |
| Código limpio y organizado           | ✅ OK  |
| Preparado para Turso DB              | ✅ OK  |

---

## 🚀 Próximos Pasos Sugeridos

1. **Configurar Turso Database**
2. **Implementar funciones de DB reales**
3. **Añadir validación de formularios**
4. **Implementar JWT para sesiones**
5. **Crear página "Olvidaste tu contraseña"**
6. **Agregar tests unitarios**
7. **Implementar rate limiting**
8. **Añadir captcha en login**

---

**Proyecto**: CrewAI Frontend
**Fecha**: 2025-11-28
**Estado**: ✅ Completado y Funcionando
