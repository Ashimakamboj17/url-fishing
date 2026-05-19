import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldAlert, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { cn } from '../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_URL = `${API_BASE}/api`;

interface ScanResult {
  url: string;
  verdict: string;
  confidence_score: number;
  features: Record<string, number>;
}

export default function Dashboard() {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [stats, setStats] = useState({ total: 0, safe: 0, phishing: 0, suspicious: 0 });

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/stats`);
      setStats({
        total: res.data.total_scans,
        safe: res.data.safe_urls,
        phishing: res.data.phishing_detected,
        suspicious: res.data.suspicious_urls,
      });
    } catch (e) {
      console.error("Failed to fetch stats", e);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
  }, []);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setIsScanning(true);
    setResult(null);
    
    try {
      const res = await axios.post(`${API_URL}/scan`, { url });
      setResult(res.data);
      fetchStats(); // Update stats after scan
    } catch (error) {
      console.error("Scanning failed", error);
    } finally {
      setIsScanning(false);
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'Safe': return 'text-cyber-green';
      case 'Phishing': return 'text-cyber-red';
      case 'Suspicious': return 'text-orange-500';
      default: return 'text-cyber-muted';
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'Safe': return <ShieldCheck className="w-12 h-12 text-cyber-green" />;
      case 'Phishing': return <ShieldAlert className="w-12 h-12 text-cyber-red" />;
      case 'Suspicious': return <AlertTriangle className="w-12 h-12 text-orange-500" />;
      default: return null;
    }
  };

  const chartData = [
    { name: 'Safe', value: stats.safe, color: '#00ff66' },
    { name: 'Phishing', value: stats.phishing, color: '#ff003c' },
    { name: 'Suspicious', value: stats.suspicious, color: '#f97316' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 py-8"
      >
        <h1 className="text-4xl font-bold tracking-tight">
          Detect Phishing Threats <span className="text-cyber-neon">Instantly</span>
        </h1>
        <p className="text-cyber-muted max-w-2xl mx-auto text-lg">
          Advanced machine learning and heuristic analysis to protect your digital workspace.
        </p>
      </motion.div>

      {/* Scanner Input */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-3xl mx-auto"
      >
        <form onSubmit={handleScan} className="relative group">
          <div className="absolute inset-0 bg-cyber-neon/20 rounded-xl blur-md transition-all group-hover:bg-cyber-neon/30 opacity-50"></div>
          <div className="relative flex items-center bg-cyber-darker rounded-xl border border-cyber-border p-2 shadow-2xl">
            <Search className="w-6 h-6 text-cyber-muted ml-4" />
            <input
              type="url"
              placeholder="Enter URL to scan (e.g., https://example.com)"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-transparent border-none text-lg px-4 py-4 focus:outline-none text-cyber-text placeholder:text-cyber-muted/50 font-mono"
            />
            <button 
              type="submit" 
              disabled={isScanning}
              className="btn-primary flex items-center gap-2 h-full mr-2"
            >
              {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Scan Now'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel p-8 max-w-4xl mx-auto overflow-hidden"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="flex-shrink-0 bg-cyber-dark p-6 rounded-full border border-cyber-border relative">
                {/* Glow behind icon based on verdict */}
                <div className={cn(
                  "absolute inset-0 rounded-full blur-xl opacity-30",
                  result.verdict === 'Safe' ? "bg-cyber-green" : 
                  result.verdict === 'Phishing' ? "bg-cyber-red" : "bg-orange-500"
                )}></div>
                <div className="relative z-10">
                  {getVerdictIcon(result.verdict)}
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-cyber-muted uppercase tracking-wider text-sm font-semibold mb-1">Analysis Result</h3>
                  <div className="flex items-end gap-4">
                    <h2 className={cn("text-4xl font-bold tracking-tight", getVerdictColor(result.verdict))}>
                      {result.verdict}
                    </h2>
                    <span className="text-xl text-cyber-muted pb-1">
                      ({result.confidence_score}% confidence)
                    </span>
                  </div>
                </div>
                
                <div className="bg-cyber-darker p-4 rounded-lg border border-cyber-border break-all font-mono text-sm text-cyber-text/80">
                  {result.url}
                </div>

                {/* Features Breakdown */}
                <div className="pt-4 border-t border-cyber-border/50">
                  <h4 className="text-sm font-medium text-cyber-muted mb-3">Key Features Detected:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(result.features).slice(0, 6).map(([key, val]) => (
                      <div key={key} className="bg-cyber-dark p-3 rounded border border-cyber-border/50 flex justify-between items-center">
                        <span className="text-xs text-cyber-muted truncate" title={key}>{key.replace('count_', '').replace('is_', '').replace('_', ' ')}</span>
                        <span className="text-cyber-neon font-mono text-sm">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto pt-8"
      >
        <div className="glass-panel p-6 flex flex-col justify-center">
          <h3 className="text-cyber-muted text-sm font-medium">Total Scans</h3>
          <p className="text-3xl font-bold text-cyber-text mt-2">{stats.total}</p>
        </div>
        <div className="glass-panel p-6 flex flex-col justify-center border-b-4 border-b-cyber-green">
          <h3 className="text-cyber-muted text-sm font-medium">Safe URLs</h3>
          <p className="text-3xl font-bold text-cyber-green mt-2">{stats.safe}</p>
        </div>
        <div className="glass-panel p-6 flex flex-col justify-center border-b-4 border-b-cyber-red">
          <h3 className="text-cyber-muted text-sm font-medium">Threats Blocked</h3>
          <p className="text-3xl font-bold text-cyber-red mt-2">{stats.phishing}</p>
        </div>
        <div className="glass-panel p-6 flex justify-center items-center h-32 relative overflow-hidden">
          {stats.total > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={30}
                  outerRadius={45}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#111116', border: '1px solid #1f1f2e', borderRadius: '8px' }}
                  itemStyle={{ color: '#e0e0e0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          {stats.total === 0 && <span className="text-cyber-muted text-sm">No data yet</span>}
        </div>
      </motion.div>
    </div>
  );
}
