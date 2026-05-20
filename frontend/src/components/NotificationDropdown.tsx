import { useNotifications } from '../context/NotificationContext';
import { ShieldAlert, ShieldCheck, AlertTriangle, Trash2, Check, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'danger':
        return <ShieldAlert className="w-4 h-4 text-cyber-red" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-cyber-green" />;
    }
  };

  const formatTime = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <>
      {/* Click outside backdrop to close */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="absolute right-0 mt-2 w-80 glass-panel bg-cyber-card/95 border border-cyber-border rounded-xl shadow-2xl z-50 overflow-hidden"
        style={{ top: '100%' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyber-border bg-cyber-darker/50">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyber-text">Threat Alerts</span>
          <div className="flex gap-2">
            {notifications.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={markAllAsRead}
                  title="Mark all as read"
                  className="p-1 text-cyber-muted hover:text-cyber-neon transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  title="Clear all"
                  className="p-1 text-cyber-muted hover:text-cyber-red transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-h-64 overflow-y-auto divide-y divide-cyber-border/40 custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-cyber-muted">
              No threat alerts or logs.
            </div>
          ) : (
            notifications.map((n) => (
              <div 
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`p-3 flex gap-3 hover:bg-cyber-darker/60 transition-colors cursor-pointer ${
                  !n.read ? 'bg-cyber-neon/5 border-l-2 border-cyber-neon' : ''
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className={`text-xs ${!n.read ? 'text-cyber-text font-medium' : 'text-cyber-muted'}`}>
                    {n.message}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-cyber-muted mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(n.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </>
  );
}
