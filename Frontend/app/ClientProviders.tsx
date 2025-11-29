'use client';

import { useNotification } from '@/lib/contexts/NotificationContext';
import { NotificationContainer } from '@/components/common/Notification';

export default function ClientProviders() {
  const { notifications, removeNotification } = useNotification();

  return <NotificationContainer notifications={notifications} onClose={removeNotification} />;
}
