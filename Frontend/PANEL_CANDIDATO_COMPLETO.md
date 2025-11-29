# 👤 Panel del Candidato Completo - CrewAI

## 🎨 Diseño de 3 Columnas

```
┌────────────────────────────────────────────────────────────────┐
│  Header con navegación y perfil                                │
├────────────┬─────────────────────────┬──────────────────────────┤
│            │                         │                          │
│ Postula-   │   Propuestas           │   Mi Perfil              │
│ ciones     │   de Trabajo           │                          │
│ (25%)      │   (50%)                │   (25%)                  │
│            │                         │                          │
│ - Estado   │   Grid de              │   - Foto                 │
│ - Fecha    │   Vacantes             │   - Nombre               │
│ - Empresa  │                        │   - Skills               │
│            │   [Filtros]            │   - Progreso             │
│ [Filtrar]  │   [Buscar]             │                          │
│            │                         │   [Editar]               │
└────────────┴─────────────────────────┴──────────────────────────┘
```

## 📱 Responsive

- **Desktop (>1024px)**: 3 columnas (25% | 50% | 25%)
- **Tablet (768-1024px)**: 2 columnas (Propuestas + Postulaciones | Perfil abajo)
- **Mobile (<768px)**: 1 columna (Propuestas → Postulaciones → Perfil)

## 🎯 Componentes a Crear

### 1. MisPostulaciones.tsx
```typescript
interface Postulacion {
  id: string;
  puesto: string;
  empresa: string;
  estado: 'pendiente' | 'entrevista' | 'rechazado' | 'aceptado';
  fecha: string;
  logo?: string;
}
```

### 2. PropuestasTrabajo.tsx
```typescript
interface Vacante {
  id: string;
  titulo: string;
  empresa: string;
  modalidad: 'remoto' | 'hibrido' | 'presencial';
  ubicacion: string;
  salario: string;
  categoria: string;
  descripcion: string;
}
```

### 3. PerfilCandidato.tsx
```typescript
interface PerfilData {
  nombre: string;
  rol: string;
  experiencia: string;
  foto?: string;
  skills: string[];
  completitud: number; // 0-100
}
```

## 📦 Datos Mock

### Postulaciones (8 ejemplos)
```typescript
[
  { puesto: 'Frontend Developer', empresa: 'Tech Corp', estado: 'pendiente' },
  { puesto: 'React Developer', empresa: 'StartupXYZ', estado: 'entrevista' },
  { puesto: 'Full Stack Dev', empresa: 'Digital Solutions', estado: 'rechazado' },
  { puesto: 'UI Developer', empresa: 'Creative Agency', estado: 'aceptado' },
  ...
]
```

### Vacantes (12 ejemplos)
```typescript
[
  { titulo: 'Senior Frontend Developer', empresa: 'Google', modalidad: 'remoto', salario: '$80k-$120k' },
  { titulo: 'React Native Dev', empresa: 'Meta', modalidad: 'hibrido', salario: '$90k-$130k' },
  ...
]
```

## 🎨 Colores por Estado

```css
pendiente: bg-yellow-100 text-yellow-700
entrevista: bg-blue-100 text-blue-700
rechazado: bg-red-100 text-red-700
aceptado: bg-green-100 text-green-700
```

## 🔍 Filtros

**Postulaciones:**
- Todos
- Pendiente
- Entrevista
- Rechazado
- Aceptado

**Propuestas:**
- Modalidad: Todos, Remoto, Híbrido, Presencial
- Categoría: Desarrollo, Diseño, Marketing, etc.
- Búsqueda por palabra clave

## ✨ Características UX

- Hover effects en tarjetas
- Transiciones suaves (300ms)
- Skeleton loading states
- Empty states cuando no hay datos
- Badges de estado con colores
- Iconos de Lucide React
- Botones con feedback visual

## 🚀 Rutas

- `/panel-candidato` → Vista principal con 3 columnas
- `/panel-candidato/postulacion/[id]` → Detalle de postulación
- `/panel-candidato/vacante/[id]` → Detalle de vacante
- `/panel-candidato/perfil` → Editar perfil

## 📝 To-Do

- [x] Estructura de carpetas
- [x] Interfaces TypeScript
- [ ] Componente MisPostulaciones
- [ ] Componente PropuestasTrabajo
- [ ] Componente PerfilCandidato
- [ ] Layout responsive
- [ ] Datos mock
- [ ] Filtros funcionales
- [ ] Búsqueda en tiempo real

## 🎯 Próximos Pasos

1. Crear componentes base
2. Integrar en /panel-candidato/page.tsx
3. Agregar datos mock
4. Implementar filtros
5. Testing responsive
6. Optimizar para mobile

---

**Estado**: 🚧 En progreso
**Última actualización**: 2025-11-28
