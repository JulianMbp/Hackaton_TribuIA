# 🏢 Panel de Empresa Completo - CrewAI

## 📦 Archivos Creados

```
components/dashboard/
├── Sidebar.tsx              ✅ CREADO
├── MetricCard.tsx           ✅ CREADO
├── CandidatesTable.tsx      ✅ CREADO
└── CreateOfferModal.tsx     ⏳ PENDIENTE

app/dashboard/
└── page.tsx                 ⏳ ACTUALIZAR
```

## 🎨 Componentes Ya Creados

### 1. Sidebar (`components/dashboard/Sidebar.tsx`)
- Navegación completa con iconos
- Items: Dashboard, Ofertas, Postulaciones, Entrevistas, Chat, Configuración
- Botón de logout
- Diseño responsive

### 2. MetricCard (`components/dashboard/MetricCard.tsx`)
- Tarjetas de métricas reutilizables
- Soporte para iconos personalizados
- Indicadores de cambio (positivo/negativo/neutral)
- Colores configurables

### 3. CandidatesTable (`components/dashboard/CandidatesTable.tsx`)
- Tabla completa con datos mock
- Búsqueda en tiempo real
- Filtros por estado
- Paginación funcional
- Estados: Nuevo, En proceso, Entrevista, Rechazado, Contratado
- Botón "Ver perfil" para cada candidato

## 🚀 Código Para Actualizar Dashboard

Reemplaza el contenido de `/app/dashboard/page.tsx` con:

```typescript
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { CandidatesTable, Candidate } from '@/components/dashboard/CandidatesTable';
import {
  Briefcase,
  Users,
  Calendar,
  UserCheck,
  Plus,
  Bell,
  User
} from 'lucide-react';

// Datos Mock
const mockCandidates: Candidate[] = [
  {
    id: '1',
    nombre: 'Juan Pérez',
    puesto: 'Desarrollador Full Stack',
    estado: 'nuevo',
    fecha: '2025-11-25',
  },
  {
    id: '2',
    nombre: 'María García',
    puesto: 'Frontend Developer',
    estado: 'en_proceso',
    fecha: '2025-11-23',
  },
  {
    id: '3',
    nombre: 'Carlos López',
    puesto: 'Backend Developer',
    estado: 'entrevista',
    fecha: '2025-11-20',
  },
  {
    id: '4',
    nombre: 'Ana Martínez',
    puesto: 'UX/UI Designer',
    estado: 'contratado',
    fecha: '2025-11-18',
  },
  {
    id: '5',
    nombre: 'Luis Rodríguez',
    puesto: 'DevOps Engineer',
    estado: 'rechazado',
    fecha: '2025-11-15',
  },
  {
    id: '6',
    nombre: 'Laura Sánchez',
    puesto: 'Product Manager',
    estado: 'entrevista',
    fecha: '2025-11-28',
  },
  {
    id: '7',
    nombre: 'Diego Torres',
    puesto: 'Data Scientist',
    estado: 'nuevo',
    fecha: '2025-11-27',
  },
  {
    id: '8',
    nombre: 'Patricia Ramos',
    puesto: 'QA Engineer',
    estado: 'en_proceso',
    fecha: '2025-11-26',
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [showCreateOfferModal, setShowCreateOfferModal] = useState(false);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
              <p className="text-sm text-neutral-600 mt-1">
                Bienvenido de vuelta, administrador
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-neutral-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User */}
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-100 rounded-lg cursor-pointer transition-colors">
                <div className="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-neutral-900">Empresa Demo</p>
                  <p className="text-xs text-neutral-600">empresa@demo.com</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          {/* Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Ofertas Activas"
              value="12"
              icon={Briefcase}
              change="+3 esta semana"
              changeType="positive"
              color="bg-blue-500"
            />
            <MetricCard
              title="Candidatos esta semana"
              value="48"
              icon={Users}
              change="+15%"
              changeType="positive"
              color="bg-green-500"
            />
            <MetricCard
              title="Entrevistas Agendadas"
              value="8"
              icon={Calendar}
              change="2 hoy"
              changeType="neutral"
              color="bg-purple-500"
            />
            <MetricCard
              title="Candidatos Contratados"
              value="24"
              icon={UserCheck}
              change="+4 este mes"
              changeType="positive"
              color="bg-orange-500"
            />
          </div>

          {/* Botón Crear Oferta */}
          <div className="mb-6">
            <button
              onClick={() => setShowCreateOfferModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-medium transition-all transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Crear Nueva Oferta
            </button>
          </div>

          {/* Tabla de Candidatos */}
          <CandidatesTable candidates={mockCandidates} />

          {/* Modal Mock (Placeholder) */}
          {showCreateOfferModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  Crear Nueva Oferta
                </h2>
                <p className="text-neutral-600 mb-6">
                  Esta funcionalidad estará disponible próximamente.
                </p>
                <button
                  onClick={() => setShowCreateOfferModal(false)}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
```

## 📝 Datos Mock Incluidos

```typescript
// 8 candidatos de ejemplo con diferentes estados
- Juan Pérez - Desarrollador Full Stack - Nuevo
- María García - Frontend Developer - En proceso
- Carlos López - Backend Developer - Entrevista
- Ana Martínez - UX/UI Designer - Contratado
- Luis Rodríguez - DevOps Engineer - Rechazado
- Laura Sánchez - Product Manager - Entrevista
- Diego Torres - Data Scientist - Nuevo
- Patricia Ramos - QA Engineer - En proceso
```

## ✅ Características Implementadas

### Sidebar
- ✅ Logo y nombre de la empresa
- ✅ 6 opciones de navegación con iconos
- ✅ Botón de logout funcional
- ✅ Indicador de página activa

### Métricas
- ✅ 4 tarjetas de métricas
- ✅ Iconos personalizados
- ✅ Indicadores de cambio
- ✅ Colores diferenciados

### Tabla de Candidatos
- ✅ Búsqueda en tiempo real
- ✅ Filtros por estado (6 opciones)
- ✅ Paginación (10 por página)
- ✅ Estados visuales con colores
- ✅ Botón "Ver perfil"
- ✅ Avatar con inicial
- ✅ Responsive

### Header
- ✅ Título y descripción
- ✅ Notificaciones con badge
- ✅ Perfil de usuario

### Botón Principal
- ✅ "Crear Nueva Oferta"
- ✅ Modal placeholder

## 🎨 Diseño
- ✅ Responsive (mobile, tablet, desktop)
- ✅ Tailwind CSS
- ✅ Iconos Lucide React
- ✅ Transiciones suaves
- ✅ Hover effects

## ⚠️ Nota Importante

El modal de "Crear Nueva Oferta" está como placeholder. Para implementarlo completamente, necesitarías crear un componente adicional con formulario.

## 🚀 Próximos Pasos

1. Copia el código del dashboard en `app/dashboard/page.tsx`
2. Los componentes ya están creados en `components/dashboard/`
3. Prueba accediendo desde el login de empresa
4. Todo debería funcionar automáticamente

## 📍 URLs del Sistema

- `/` → Selección de rol
- `/auth/login/empresa` → Login empresa
- `/dashboard` → Panel completo (nuevo)
- `/panel-candidato` → Panel candidato

---

**Estado**: ✅ Listo para implementar
**Última actualización**: 2025-11-28
