import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, AlertTriangle, ExternalLink, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

const API_URL = 'http://localhost:8000/api';

interface HistoryItem {
  id: number;
  url: string;
  verdict: string;
  confidence_score: number;
  scan_date: string;
}

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/history?limit=100`);
      setHistory(res.data);
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setLoading(false);
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'Safe': return <ShieldCheck className="w-5 h-5 text-cyber-green" />;
      case 'Phishing': return <ShieldAlert className="w-5 h-5 text-cyber-red" />;
      case 'Suspicious': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default: return null;
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'Safe': return 'text-cyber-green bg-cyber-green/10 border-cyber-green/20';
      case 'Phishing': return 'text-cyber-red bg-cyber-red/10 border-cyber-red/20';
      case 'Suspicious': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      default: return 'text-cyber-muted bg-cyber-dark border-cyber-border';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Scan History</h1>
        <div className="text-sm text-cyber-muted flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Last 100 scans</span>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-cyber-border bg-cyber-dark/50">
                <th className="py-4 px-6 font-medium text-cyber-muted">URL Scanned</th>
                <th className="py-4 px-6 font-medium text-cyber-muted w-40">Verdict</th>
                <th className="py-4 px-6 font-medium text-cyber-muted w-32">Confidence</th>
                <th className="py-4 px-6 font-medium text-cyber-muted w-48">Date/Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-cyber-muted">
                    Loading history...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-cyber-muted">
                    No scan history available.
                  </td>
                </tr>
              ) : (
                history.map((item, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={item.id} 
                    className="border-b border-cyber-border/50 hover:bg-cyber-darker/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-mono text-sm">
                      <div className="flex items-center gap-2 max-w-[400px]">
                        <span className="truncate">{item.url}</span>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-cyber-muted hover:text-cyber-neon flex-shrink-0">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border", getVerdictColor(item.verdict))}>
                        {getVerdictIcon(item.verdict)}
                        {item.verdict}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-sm">
                      {item.confidence_score.toFixed(1)}%
                    </td>
                    <td className="py-4 px-6 text-sm text-cyber-muted">
                      {new Date(item.scan_date).toLocaleString()}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
