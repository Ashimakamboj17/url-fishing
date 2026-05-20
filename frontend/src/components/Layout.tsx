import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { User, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import AuthModal from './AuthModal';
import NotificationDropdown from './NotificationDropdown';

const Layout = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getHeaderTitle = () => {
    switch (location.pathname) {
      case '/': return 'Threat Scanner';
      case '/feed': return 'Live Threat Feed';
      case '/history': return 'Scan History';
      case '/about': return 'Model Metrics & About';
      default: return 'Cyber Security Hub';
    }
  };

  const handleUserClick = () => {
    if (!isAuthenticated) {
      setIsAuthOpen(true);
    } else {
      setIsProfileOpen(!isProfileOpen);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-cyber-dark text-cyber-text font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background ambient light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyber-neon/10 rounded-full blur-[120px] pointer-events-none" />
        
        <header className="h-16 border-b border-cyber-border/50 flex items-center justify-between px-8 z-10 backdrop-blur-sm bg-cyber-dark/80">
          <h2 className="text-xl font-semibold tracking-wide text-cyber-text">{getHeaderTitle()}</h2>
          <div className="flex items-center gap-4 relative">
            
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 text-cyber-muted hover:text-cyber-neon transition-colors relative cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-red opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyber-red border border-cyber-dark"></span>
                  </span>
                )}
              </button>
              
              <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
            </div>

            {/* User Profile / Login */}
            <div className="relative">
              <div 
                onClick={handleUserClick}
                className="w-9 h-9 rounded-full bg-cyber-border/50 flex items-center justify-center cursor-pointer hover:border-cyber-neon border border-transparent transition-all duration-300 shadow-[inset_0_0_8px_rgba(255,255,255,0.05)] hover:shadow-[0_0_12px_rgba(0,240,255,0.3)]"
              >
                {isAuthenticated && user ? (
                  <span className="text-sm font-bold text-cyber-neon uppercase">{user.email.charAt(0)}</span>
                ) : (
                  <User className="w-4 h-4 text-cyber-muted hover:text-cyber-neon transition-colors" />
                )}
              </div>

              {isProfileOpen && isAuthenticated && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-3 w-56 glass-panel bg-cyber-card/95 border border-cyber-border rounded-xl shadow-2xl p-4 z-50 flex flex-col gap-3">
                    <div className="text-xs text-cyber-muted border-b border-cyber-border pb-2 break-all">
                      Logged in as:<br/>
                      <span className="font-semibold text-cyber-text font-mono text-[10px]">{user?.email}</span>
                    </div>
                    <button 
                      onClick={() => { logout(); setIsProfileOpen(false); }}
                      className="w-full text-left text-xs font-semibold tracking-wider text-cyber-red hover:text-red-400 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      LOGOUT / SIGN OUT
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-8 z-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default Layout;

