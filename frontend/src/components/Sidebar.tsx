import { NavLink } from 'react-router-dom';
import { Shield, Activity, History, Settings, Info } from 'lucide-react';
import { cn } from '../lib/utils';

const Sidebar = () => {
  const navItems = [
    { icon: Shield, label: 'Scanner', path: '/' },
    { icon: Activity, label: 'Live Threat Feed', path: '/feed' },
    { icon: History, label: 'Scan History', path: '/history' },
    { icon: Info, label: 'About', path: '/about' },
  ];

  return (
    <aside className="w-64 h-screen border-r border-cyber-border bg-cyber-darker flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-cyber-border">
        <div className="flex items-center gap-2 text-cyber-neon font-bold text-xl tracking-wider">
          <Shield className="w-6 h-6 animate-pulse-slow" />
          <span>PHISHGUARD</span>
        </div>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group",
                isActive 
                  ? "bg-cyber-neon/10 text-cyber-neon shadow-[inset_4px_0_0_0_#00f0ff]" 
                  : "text-cyber-muted hover:bg-cyber-card hover:text-cyber-text"
              )
            }
          >
            <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-cyber-border">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-cyber-muted hover:bg-cyber-card hover:text-cyber-text transition-colors">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
