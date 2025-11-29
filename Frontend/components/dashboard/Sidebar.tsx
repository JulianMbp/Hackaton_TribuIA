'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Building2
} from 'lucide-react';

interface SidebarProps {
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Inicio', href: '/dashboard' },
    { icon: Briefcase, label: 'Ofertas publicadas', href: '/dashboard/ofertas' },
    { icon: Users, label: 'Postulaciones', href: '/dashboard/postulaciones' },
    { icon: Calendar, label: 'Entrevistas', href: '/dashboard/entrevistas' },
    { icon: MessageSquare, label: 'Chat', href: '/dashboard/chat' },
    { icon: Settings, label: 'Configuración', href: '/dashboard/configuracion' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">CrewAI</h2>
            <p className="text-xs text-neutral-600">Panel Empresa</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-neutral-200">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};
