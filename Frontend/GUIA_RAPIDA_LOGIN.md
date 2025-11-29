# 🚀 Guía Rápida - Sistema de Login CrewAI

## 📱 Acceso Rápido

**URL del proyecto**: http://localhost:3000

---

## 🎯 Flujo de Navegación Completo

### 1️⃣ Página Principal
**Ruta**: `/` (http://localhost:3000)

Verás dos tarjetas grandes e interactivas:

```
┌─────────────────────────────────────┐
│                                     │
│    🏢  SOY EMPRESA                  │
│    Gestiona entrevistas...          │
│    [Acceder al panel →]             │
│                                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│                                     │
│    👤  SOY CANDIDATO                │
│    Accede a tus entrevistas...      │
│    [Acceder al panel →]             │
│                                     │
└─────────────────────────────────────┘
```

**Acciones**:
- ✅ Haz click en **"Soy Empresa"** → Te lleva al login de empresa
- ✅ Haz click en **"Soy Candidato"** → Te lleva al login de candidato
- ✅ Los botones son **completamente responsive**
- ✅ Animaciones suaves al hacer hover

---

### 2️⃣ Login Empresa
**Ruta**: `/auth/login/empresa`

**Formulario**:
```
📧 Email: [cualquier email]
🔒 Contraseña: [cualquier password]

[Ingresar al Panel] ← Botón responsive
```

**Características**:
- ✅ **No valida credenciales** (modo demo)
- ✅ Puedes ingresar con **cualquier email y contraseña**
- ✅ Muestra spinner de carga al hacer submit
- ✅ Redirige automáticamente a `/dashboard`
- ✅ Link "¿Olvidaste tu contraseña?"
- ✅ Link para registrarse
- ✅ Botón "Volver" a la página principal

**Cómo probarlo**:
1. Ingresa cualquier email (ej: `empresa@test.com`)
2. Ingresa cualquier password (ej: `123456`)
3. Click en **"Ingresar al Panel"**
4. ✨ Serás redirigido a `/dashboard` (Panel de Empresa)

---

### 3️⃣ Login Candidato
**Ruta**: `/auth/login/candidato`

**Formulario**:
```
📧 Email: [cualquier email]
📄 Documento: [cualquier número]

[Acceder a Mis Entrevistas] ← Botón responsive
```

**Características**:
- ✅ **No valida credenciales** (modo demo)
- ✅ Puedes ingresar con **cualquier email y documento**
- ✅ Muestra spinner de carga al hacer submit
- ✅ Redirige automáticamente a `/panel-candidato`
- ✅ Ayuda contextual para el documento
- ✅ Link de contacto con empresa
- ✅ Botón "Volver" a la página principal

**Cómo probarlo**:
1. Ingresa cualquier email (ej: `candidato@test.com`)
2. Ingresa cualquier documento (ej: `12345678`)
3. Click en **"Acceder a Mis Entrevistas"**
4. ✨ Serás redirigido a `/panel-candidato` (Panel de Candidato)

---

### 4️⃣ Panel de Empresa (Dashboard)
**Ruta**: `/dashboard`

**Ya existente en el proyecto** - Panel completo para gestión de entrevistas

---

### 5️⃣ Panel de Candidato
**Ruta**: `/panel-candidato`

**Nuevo panel creado** con:

```
┌────────────────────────────────────────┐
│  👤 Panel de Candidato  [Cerrar Sesión]│
└────────────────────────────────────────┘

📊 Estadísticas:
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Pendientes  │ │ Completadas │ │ Total       │
│     1       │ │      1      │ │     2       │
└─────────────┘ └─────────────┘ └─────────────┘

📅 Mis Entrevistas:

┌──────────────────────────────────────────┐
│ Desarrollador Full Stack                 │
│ Tech Solutions Inc.                      │
│ 📅 01 Dic 2025  [Pendiente]  [Iniciar] │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ Frontend Developer                       │
│ Digital Agency                           │
│ 📅 25 Nov 2025  [Completada]            │
└──────────────────────────────────────────┘
```

**Características**:
- ✅ Header con nombre y botón de logout
- ✅ 3 cards de estadísticas (Pendientes, Completadas, Total)
- ✅ Lista de entrevistas con datos mock
- ✅ Estados visuales (Pendiente/Completada)
- ✅ Botón "Iniciar Entrevista" para entrevistas pendientes
- ✅ Botón "Cerrar Sesión" funcional
- ✅ **Totalmente responsive** (mobile, tablet, desktop)

**Acciones disponibles**:
- 🔴 **Cerrar Sesión** → Limpia localStorage y vuelve a `/`
- 🟢 **Iniciar Entrevista** → Redirige a `/interview/[id]`

---

## 🎨 Características de Diseño Responsive

### Botones Mejorados:
Todos los botones ahora tienen:

✅ **Hover Effects**:
- Cambio de color suave
- Escala aumenta ligeramente (`scale-[1.02]` o `scale-105`)
- Elevación visual

✅ **Click Effects**:
- Escala disminuye al hacer click (`scale-[0.98]` o `scale-95`)
- Feedback táctil instantáneo

✅ **Loading States**:
- Spinner animado mientras procesa
- Botón deshabilitado durante carga
- Color gris cuando está disabled

✅ **Responsive Text**:
- `text-sm` en móvil
- `text-base` en desktop
- Padding adaptativo (`px-3` → `px-4` → `px-6`)

### Breakpoints:
```
Mobile:   < 640px   (sm)
Tablet:   640-768px (md)
Desktop:  > 768px   (lg)
```

---

## 🔄 Diagrama de Flujo Completo

```
        [Página Principal]
                │
        ┌───────┴───────┐
        │               │
    [Empresa]      [Candidato]
        │               │
        ▼               ▼
[Login Empresa]  [Login Candidato]
        │               │
(cualquier          (cualquier
 email/pass)         email/doc)
        │               │
        ▼               ▼
   [/dashboard]   [/panel-candidato]
        │               │
   (Panel ya       (Panel nuevo
   existente)       creado)
        │               │
        └───────┬───────┘
                │
         [Cerrar Sesión]
                │
                ▼
        [Vuelve a /]
```

---

## ⚡ Testing Rápido

### Test Completo del Sistema:

#### 1. Test Login Empresa:
```bash
1. Abre http://localhost:3000
2. Click en "Soy Empresa"
3. Email: test@empresa.com
4. Password: 123456
5. Click "Ingresar al Panel"
6. ✅ Deberías estar en /dashboard
```

#### 2. Test Login Candidato:
```bash
1. Abre http://localhost:3000
2. Click en "Soy Candidato"
3. Email: test@candidato.com
4. Documento: 12345678
5. Click "Acceder a Mis Entrevistas"
6. ✅ Deberías estar en /panel-candidato
```

#### 3. Test Responsividad:
```bash
1. Abre DevTools (F12)
2. Activa modo responsive
3. Prueba diferentes tamaños:
   - Mobile: 375px
   - Tablet: 768px
   - Desktop: 1920px
4. ✅ Todo se debe adaptar correctamente
```

#### 4. Test Logout:
```bash
1. Estando en /panel-candidato
2. Click en "Cerrar Sesión"
3. ✅ Deberías volver a /
4. Verifica localStorage (F12 > Application)
5. ✅ auth_token y auth_user deben estar eliminados
```

---

## 🎯 Características de los Botones

### Página Principal:
```css
Botón Empresa/Candidato:
- Hover: Eleva -8px, escala 1.02
- Click: Escala 0.98
- Border cambia a negro
- Sombra aumenta
```

### Páginas de Login:
```css
Botón Submit:
- Hover: Fondo más oscuro, escala 1.02
- Click: Escala 0.98
- Loading: Spinner + texto "Ingresando..."
- Disabled: Gris, cursor not-allowed
```

### Panel Candidato:
```css
Botón Cerrar Sesión:
- Hover: Fondo gris, escala 1.05
- Texto oculto en móvil, visible en tablet+

Botón Iniciar Entrevista:
- Hover: Fondo más oscuro, escala 1.05
- Texto adaptativo según tamaño pantalla
```

---

## 📝 Datos Mock Disponibles

### Panel Candidato:
```javascript
Entrevista 1:
- Cargo: "Desarrollador Full Stack"
- Empresa: "Tech Solutions Inc."
- Fecha: "2025-12-01"
- Estado: "pendiente"

Entrevista 2:
- Cargo: "Frontend Developer"
- Empresa: "Digital Agency"
- Fecha: "2025-11-25"
- Estado: "completada"
```

---

## 🔧 Comandos Útiles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Ver compilación de producción
npm run start

# Verificar código
npm run lint
```

---

## 🎉 Resumen de URLs

| URL | Descripción | Login Requerido |
|-----|-------------|-----------------|
| `/` | Selección de rol | No |
| `/auth/login/empresa` | Login empresa | No |
| `/auth/login/candidato` | Login candidato | No |
| `/dashboard` | Panel empresa | Simulado |
| `/panel-candidato` | Panel candidato | Simulado |
| `/auth/register` | Registro empresa | No |

---

## ⚠️ Recordatorios Importantes

1. **Modo Demo**: Las credenciales NO se validan
2. **Cualquier dato funciona**: Email/password/documento son solo visuales
3. **localStorage**: La sesión se guarda temporalmente
4. **Responsive**: Todos los botones funcionan en mobile/tablet/desktop
5. **Redirecciones automáticas**: Después del login te lleva al panel correspondiente

---

## 🚀 Siguiente Paso: Conectar con Turso DB

Cuando quieras conectar con la base de datos real:
1. Ver archivo `lib/services/authService.ts`
2. Reemplazar funciones mock
3. Configurar variables de entorno
4. Descomentar código de Turso DB

---

**Estado**: ✅ Completamente Funcional y Responsive
**Última actualización**: 2025-11-28
**Versión**: 1.0.0
