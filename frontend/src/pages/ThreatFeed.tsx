import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, Activity, Server, Globe, ShieldAlert } from 'lucide-react';

interface Threat {
  id: string;
  url: string;
  sourceIp: string;
  timestamp: Date;
  severity: 'high' | 'critical' | 'medium';
  location: string;
}

export default function ThreatFeed() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'critical'>('all');
  const [attackCounter, setAttackCounter] = useState(24792);

  // Generate initial threats
  useEffect(() => {
    const locations = ['United States', 'Germany', 'Russia', 'China', 'Brazil', 'Japan', 'India', 'United Kingdom'];
    const domains = [
      'secure-paypal-login.com.updates-sec.ru',
      'verify-netflix-billing.net',
      'chase-online-banking-signin.com-web.info',
      'metamask-restore-wallet.key-phrase.co',
      'amazon-shipping-refunds.com/login',
      'google-account-recovery-verify.g-auth.cn',
      'apple-icloud-findmy-lost.support-ios-web.id',
      'steam-community-free-skins.xyz'
    ];
    const initialThreats: Threat[] = Array.from({ length: 5 }).map((_, idx) => {
      const severity: 'high' | 'critical' | 'medium' = idx % 3 === 0 ? 'critical' : idx % 2 === 0 ? 'high' : 'medium';
      return {
        id: `threat-${idx}-${Math.random().toString(36).substring(2, 5)}`,
        url: domains[idx % domains.length],
        sourceIp: `198.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}`,
        timestamp: new Date(Date.now() - idx * 1000 * 60 * 3), // mins ago
        severity,
        location: locations[idx % locations.length]
      };
    });
    setThreats(initialThreats);

    // Keep adding live threat simulation
    const interval = setInterval(() => {
      const severityRoll = Math.random();
      const severity: 'high' | 'critical' | 'medium' = severityRoll > 0.7 ? 'critical' : severityRoll > 0.3 ? 'high' : 'medium';
      
      const newThreat: Threat = {
        id: `threat-${Math.random().toString(36).substring(2, 9)}`,
        url: domains[Math.floor(Math.random() * domains.length)],
        sourceIp: `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}`,
        timestamp: new Date(),
        severity,
        location: locations[Math.floor(Math.random() * locations.length)]
      };
      
      setThreats(prev => [newThreat, ...prev.slice(0, 19)]); // Keep last 20
      setAttackCounter(c => c + Math.floor(Math.random() * 5) + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-cyber-red bg-cyber-red/10 border-cyber-red/30';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      default: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
    }
  };

  const filteredThreats = activeTab === 'all' 
    ? threats 
    : threats.filter(t => t.severity === 'critical');

  return (
    <div className="space-y-6">
      {/* Live Threat Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 border-l-4 border-l-cyber-red relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <ShieldAlert className="w-24 h-24 text-cyber-red" />
          </div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-cyber-muted text-xs font-semibold uppercase tracking-wider">Simulated Attack Counter</p>
              <h3 className="text-3xl font-extrabold text-cyber-text mt-2 font-mono tracking-tight">
                {attackCounter.toLocaleString()}
              </h3>
            </div>
            <span className="flex h-2.5 w-2.5 mt-1">
              <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-cyber-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyber-red"></span>
            </span>
          </div>
          <p className="text-xs text-cyber-muted mt-3">Worldwide block actions registered today</p>
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-cyber-neon relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Activity className="w-24 h-24 text-cyber-neon" />
          </div>
          <p className="text-cyber-muted text-xs font-semibold uppercase tracking-wider">Scanner Speed</p>
          <h3 className="text-3xl font-extrabold text-cyber-neon mt-2 font-mono">0.04s</h3>
          <p className="text-xs text-cyber-muted mt-3">Average time to analyze URL features</p>
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-cyber-green relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Server className="w-24 h-24 text-cyber-green" />
          </div>
          <p className="text-cyber-muted text-xs font-semibold uppercase tracking-wider">Feed Status</p>
          <h3 className="text-3xl font-extrabold text-cyber-green mt-2 flex items-center gap-2">
            ONLINE
          </h3>
          <p className="text-xs text-cyber-muted mt-3">Connected to global heuristics network</p>
        </div>
      </div>

      {/* Threat List Feed */}
      <div className="glass-panel overflow-hidden">
        {/* Panel Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-cyber-border/60 gap-4 bg-cyber-darker/30">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-cyber-red animate-pulse" />
              Global Phishing Blocklist Stream (Simulation)
            </h3>
            <p className="text-xs text-cyber-muted mt-1">Real-time heuristics analysis and network capture logs</p>
          </div>

          <div className="flex bg-cyber-darker p-1 rounded-lg border border-cyber-border">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'all' ? 'bg-cyber-neon/15 text-cyber-neon' : 'text-cyber-muted hover:text-cyber-text'
              }`}
            >
              All Alerts
            </button>
            <button
              onClick={() => setActiveTab('critical')}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'critical' ? 'bg-cyber-red/15 text-cyber-red' : 'text-cyber-muted hover:text-cyber-text'
              }`}
            >
              Critical Only
            </button>
          </div>
        </div>

        {/* Live List */}
        <div className="divide-y divide-cyber-border/30 max-h-[500px] overflow-y-auto custom-scrollbar">
          <AnimatePresence initial={false}>
            {filteredThreats.map((threat) => (
              <motion.div
                key={threat.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-cyber-darker/20 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="mt-1 flex-shrink-0">
                    <span className="flex h-2 w-2 rounded-full bg-cyber-neon shadow-[0_0_8px_#00f0ff] animate-ping" />
                  </div>
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <p className="text-sm font-mono text-cyber-text/90 font-medium break-all selection:bg-cyber-neon/20 select-all">
                      {threat.url}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-cyber-muted">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5" />
                        Origin: {threat.location}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Server className="w-3.5 h-3.5" />
                        Host IP: {threat.sourceIp}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right text-xs text-cyber-muted">
                    {threat.timestamp.toLocaleTimeString()}
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border ${getSeverityStyles(threat.severity)}`}>
                    {threat.severity}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
