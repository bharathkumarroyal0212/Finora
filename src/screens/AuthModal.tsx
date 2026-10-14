import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Check, X, Sparkles } from 'lucide-react';
import { FinoraLogo } from '../components/common/FinoraLogo';
import { useFinance } from '../context/FinanceContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin'
}) => {
  const { login } = useFinance();
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState<string>('ramesh@example.com');
  const [password, setPassword] = useState<string>('••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (authMode === 'forgot') {
        setMessage('Password reset instructions sent to your email.');
        setTimeout(() => {
          setAuthMode('signin');
          setMessage(null);
        }, 2000);
      } else {
        login(email);
        onClose();
      }
    }, 600);
  };

  const handleQuickLogin = () => {
    login('ramesh@example.com');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm bg-[#0B1431] border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl text-white relative max-h-[92dvh] overflow-y-auto no-scrollbar">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center mb-5 pt-2">
          <FinoraLogo size="md" variant="light" showTagline />
          <h3 className="text-lg font-bold text-white mt-3.5">
            {authMode === 'signin' && 'Sign In to FINORA'}
            {authMode === 'signup' && 'Create Your Account'}
            {authMode === 'forgot' && 'Reset Password'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to access your financial dashboard
          </p>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <Check size={16} />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-900/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#5145D8]"
              />
            </div>
          </div>

          {authMode !== 'forgot' && (
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-900/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#5145D8]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          {authMode === 'signin' && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setAuthMode('forgot')}
                className="text-[11px] text-[#C8A96B] hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#DFBA73] to-[#C8A96B] text-[#0B1431] font-bold text-xs tracking-wide shadow-lg shadow-[#C8A96B]/20 transition-all hover:brightness-105 active:scale-[0.98]"
          >
            {isLoading ? 'Processing...' : authMode === 'signin' ? 'Sign In' : authMode === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>

        {/* Quick Sign In Option */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={handleQuickLogin}
            className="w-full py-2.5 px-3 bg-[#5145D8]/20 hover:bg-[#5145D8]/30 border border-[#5145D8]/50 text-[#C8A96B] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles size={14} />
            <span>Quick Sign In</span>
          </button>
        </div>

        {/* Toggle between Signin / Signup */}
        <div className="mt-4 text-center text-xs text-slate-400">
          {authMode === 'signin' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className="text-white font-bold hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className="text-white font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
