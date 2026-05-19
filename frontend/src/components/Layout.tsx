import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { User, Bell } from 'lucide-react';

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-cyber-dark text-cyber-text font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background ambient light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyber-neon/10 rounded-full blur-[120px] pointer-events-none" />
        
        <header className="h-16 border-b border-cyber-border/50 flex items-center justify-between px-8 z-10 backdrop-blur-sm bg-cyber-dark/80">
          <h2 className="text-xl font-medium tracking-wide">Dashboard</h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-cyber-muted hover:text-cyber-neon transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyber-red rounded-full border border-cyber-dark"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-cyber-border flex items-center justify-center cursor-pointer hover:border-cyber-neon border border-transparent transition-colors">
              <User className="w-4 h-4 text-cyber-muted" />
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-8 z-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
