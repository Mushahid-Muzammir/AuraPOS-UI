import React, { useState, useEffect } from 'react';
import { notificationService, Notification } from '../../utils/notificationService';

const NotificationContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  const getNotificationStyles = (type: Notification['type']) => {
    const baseStyles = "p-4 rounded-lg shadow-lg border-l-4 flex items-start gap-3 max-w-md";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-500 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-500 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-500 text-yellow-800`;
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-500 text-blue-800`;
      default:
        return baseStyles;
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getNotificationStyles(notification.type)} animate-slide-in`}
        >
          <span className="text-xl">{getIcon(notification.type)}</span>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{notification.title}</h4>
            <p className="text-sm opacity-90">{notification.message}</p>
          </div>
          <button
            onClick={() => notificationService.remove(notification.id)}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;
