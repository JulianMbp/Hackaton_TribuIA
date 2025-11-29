# 🚀 Guía de Inicio Rápido - CrewAI Frontend

## Instalación en 3 Pasos

### 1️⃣ Instalar Dependencias
```bash
cd crewai-recruitment/frontend
npm install
```

### 2️⃣ Configurar Entorno
```bash
# Crear archivo .env
cp .env.example .env

# Editar .env con la URL de tu backend
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

### 3️⃣ Ejecutar
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📋 Checklist Pre-desarrollo

- [ ] Node.js 18+ instalado
- [ ] Backend de CrewAI corriendo
- [ ] Variables de entorno configuradas
- [ ] Dependencias instaladas

## 🎯 Flujos Principales

### Flujo 1: Empresa Registra y Gestiona
```
1. /auth/register → Registrar empresa
2. /dashboard → Ver estadísticas
3. /dashboard/cargos → Crear cargo
4. /dashboard/candidatos → Ver candidatos
```

### Flujo 2: Candidato Aplica
```
1. /candidate/register → Registro + CV
2. /interview/:id → Entrevista IA
3. /results/:id → Ver resultados
```

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm start

# Linting
npm run lint

# Limpiar caché
rm -rf .next
```

## 🐛 Solución Rápida de Problemas

### El servidor no inicia
```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### WebSocket no conecta
- Verifica que el backend esté corriendo
- Revisa la URL en `.env`
- Asegúrate que el backend tenga CORS configurado

### Estilos no cargan
```bash
# Reinicia el servidor
# Ctrl+C y luego:
npm run dev
```

## 📱 Prueba Rápida

### 1. Registrar Empresa
```
Email: test@empresa.com
Password: 123456
```

### 2. Crear Cargo
```
Nombre: Desarrollador Full Stack
Descripción: Desarrollo web con React y Node.js
Criterios:
- React
- Node.js
- TypeScript
- PostgreSQL
```

### 3. Registrar Candidato
```
Nombre: Juan Pérez
Email: juan@test.com
Cargo: [Seleccionar el cargo creado]
CV: [Subir archivo PDF de prueba]
```

## 🎨 Personalización Rápida

### Cambiar Colores
Edita `tailwind.config.ts`:
```typescript
colors: {
  neutral: {
    50: '#TU_COLOR',
    // ...
  }
}
```

### Cambiar Logo
```typescript
// components/layout/Header.tsx
<h1>TU_LOGO</h1>
```

## 📊 Estructura de URLs

| Ruta | Descripción | Requiere Auth |
|------|-------------|---------------|
| `/` | Raíz (redirige a login) | No |
| `/auth/login` | Login empresas | No |
| `/auth/register` | Registro empresas | No |
| `/candidate/register` | Registro candidatos | No |
| `/dashboard` | Dashboard principal | Sí |
| `/dashboard/cargos` | Gestión de cargos | Sí |
| `/interview/:id` | Entrevista en vivo | No |
| `/results/:id` | Resultados | No |

## 🔑 Variables de Entorno

```env
# Backend URL (required)
NEXT_PUBLIC_API_URL=http://localhost:8000

# WebSocket URL (required)
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

## 💡 Tips de Desarrollo

1. **Hot Reload**: Los cambios se ven automáticamente
2. **TypeScript**: El editor te ayudará con autocompletado
3. **Console**: Abre DevTools para ver logs
4. **Network**: Monitorea las llamadas API en la pestaña Network

## 🚦 Primeros Pasos Recomendados

### Para Desarrolladores

1. Lee `README.md` para overview completo
2. Lee `ARCHITECTURE.md` para entender la estructura
3. Explora `/components/common` para componentes base
4. Revisa `/lib/api/services.ts` para endpoints
5. Inspecciona `/lib/types/index.ts` para tipos

### Para Diseñadores

1. Revisa `app/globals.css` para estilos globales
2. Explora componentes en `/components`
3. Ajusta colores en `tailwind.config.ts`
4. Modifica tipografía en `app/globals.css`

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hooks](https://react.dev/reference/react)

## 🎉 ¡Listo para Desarrollar!

Tu frontend está completamente configurado y listo para usar.

**Siguiente paso**: Inicia el backend y comienza a probar los flujos.

---

¿Problemas? Revisa la documentación completa en `README.md`
