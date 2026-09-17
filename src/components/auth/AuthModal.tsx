import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Mail, Lock, User, ArrowRight, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { Persona } from '../../types';

export const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, login, signup } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [persona, setPersona] = useState<Persona>('student');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (isSignUp) {
        if (!email || !password || !name) {
          setError('Please fill in all required fields.');
          setIsLoading(false);
          return;
        }
        await signup({
          email,
          name,
          persona,
        });
      } else {
        if (!email || !password) {
          setError('Please enter your email and password.');
          setIsLoading(false);
          return;
        }
        await login(email, persona);
      }
      setShowAuthModal(false);
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-[#E5E5DE] bg-[#FBFBF9] p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#E5E5DE] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#183B32] text-white">
              <Sparkles className="h-4 w-4 text-[#A3E635]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E2022]">
                {isSignUp ? 'Create CareerBridge Account' : 'Welcome to CareerBridge'}
              </h2>
              <p className="text-[11px] text-[#5A6065]">
                {isSignUp ? 'Set up your authenticated career profile' : 'Sign in to access your roadmaps & progress'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAuthModal(false)}
            className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#EFEFED] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-3 text-xs text-[#991B1B]">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-[#1E2022] mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-[#8C949D]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bipin Kumar"
                  className="w-full rounded-xl border border-[#E5E5DE] bg-white py-2 pl-9 pr-3 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:ring-1 focus:ring-[#183B32]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1E2022] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#8C949D]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#E5E5DE] bg-white py-2 pl-9 pr-3 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:ring-1 focus:ring-[#183B32]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E2022] mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#8C949D]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#E5E5DE] bg-white py-2 pl-9 pr-3 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:ring-1 focus:ring-[#183B32]"
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-[#1E2022] mb-1.5">Primary Focus Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPersona('student')}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                    persona === 'student'
                      ? 'border-[#183B32] bg-[#E2ECE9] text-[#183B32]'
                      : 'border-[#E5E5DE] bg-white text-[#5A6065] hover:border-[#CCD0D5]'
                  }`}
                >
                  <span>🎓 Student</span>
                  {persona === 'student' && <CheckCircle2 className="h-3.5 w-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setPersona('livelihood')}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                    persona === 'livelihood'
                      ? 'border-[#D96B27] bg-[#FFF4EC] text-[#D96B27]'
                      : 'border-[#E5E5DE] bg-white text-[#5A6065] hover:border-[#CCD0D5]'
                  }`}
                >
                  <span>💼 Job Seeker</span>
                  {persona === 'livelihood' && <CheckCircle2 className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#183B32] py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#15342C] disabled:opacity-50 transition-colors mt-2"
          >
            <span>{isLoading ? 'Processing...' : isSignUp ? 'Create Account & Continue' : 'Sign In to Account'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        <div className="mt-5 border-t border-[#E5E5DE] pt-3 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-xs text-[#183B32] font-semibold hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
};
