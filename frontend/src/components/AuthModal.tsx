import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      onClose();
      // Reset forms
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-cyber-darker/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md p-8 glass-panel border border-cyber-neon/30 bg-cyber-card/95 z-10 overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.15)]"
      >
        {/* Neon Glow Lines */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-neon to-transparent" />
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-cyber-muted hover:text-cyber-neon rounded-lg hover:bg-cyber-dark transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-cyber-neon/10 rounded-xl border border-cyber-neon/20 mb-3 text-cyber-neon">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-wide text-cyber-text">
            {isSignUp ? 'CREATE ACCOUNT' : 'SECURE SIGN IN'}
          </h2>
          <p className="text-sm text-cyber-muted mt-1">
            {isSignUp ? 'Join PhishGuard cyber security ecosystem' : 'Access your personalized threat scanner dashboard'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-cyber-border mb-6">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setError(null); }}
            className={`flex-1 pb-3 text-sm font-semibold tracking-wider transition-colors border-b-2 cursor-pointer ${
              !isSignUp 
                ? 'text-cyber-neon border-cyber-neon' 
                : 'text-cyber-muted border-transparent hover:text-cyber-text'
            }`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setError(null); }}
            className={`flex-1 pb-3 text-sm font-semibold tracking-wider transition-colors border-b-2 cursor-pointer ${
              isSignUp 
                ? 'text-cyber-neon border-cyber-neon' 
                : 'text-cyber-muted border-transparent hover:text-cyber-text'
            }`}
          >
            REGISTER
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-cyber-red/10 border border-cyber-red/30 rounded-lg text-sm text-cyber-red">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-cyber-muted uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-muted pointer-events-none" />
              <input
                type="email"
                required
                placeholder="operator@phishguard.sec"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-cyber !pl-12"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-cyber-muted uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-muted pointer-events-none" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-cyber !pl-12 font-mono"
              />
            </div>
          </div>

          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-cyber-muted uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-muted pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-cyber !pl-12 font-mono"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 mt-6 py-3.5 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              isSignUp ? 'INITIALIZE ACCOUNT' : 'DECRYPT & ACCESS'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
