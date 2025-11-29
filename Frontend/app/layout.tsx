import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { NotificationProvider } from '@/lib/contexts/NotificationContext';
import { ThemeProvider } from '@/lib/contexts/ThemeContext';
import { NotificationContainer } from '@/components/common/Notification';
import ClientProviders from './ClientProviders';

export const metadata: Metadata = {
  title: 'CrewAI - Plataforma de Entrevistas Inteligentes',
  description: 'Sistema de reclutamiento con agentes de IA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider>
          <NotificationProvider>
            <AuthProvider>
              <ClientProviders />
              {children}
            </AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
