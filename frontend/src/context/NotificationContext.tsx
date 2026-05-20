import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AlertNotification {
  id: string;
  type: 'info' | 'warning' | 'danger';
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: AlertNotification[];
  unreadCount: number;
  addNotification: (type: 'info' | 'warning' | 'danger', message: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AlertNotification[]>(() => {
    // Initial system notifications
    return [
      {
        id: 'init-1',
        type: 'info',
        message: 'ML Heuristic Engine loaded Random Forest model (97.4% precision).',
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
        read: false,
      },
      {
        id: 'init-2',
        type: 'info',
        message: 'PhishGuard Secure Sandbox database initialized successfully.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
      }
    ];
  });

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const addNotification = (type: 'info' | 'warning' | 'danger', message: string) => {
    const newNotif: AlertNotification = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      message,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearAll
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
