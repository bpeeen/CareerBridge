import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, signup } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!email.trim() || !validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (isSignUp) {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please re-enter.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        await signup({
          email: email.trim(),
          password,
          name: name.trim(),
        });
      } else {
        await login(email.trim(), password);
      }
    } catch (err: any) {
      const msg = err?.message || 'Authentication failed. Please check your details.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#FBFBF9] px-4 py-8 font-sans">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#183B32] px-3.5 py-1.5 text-xs font-semibold text-white mb-2 shadow-xs">
            <div className="h-2 w-2 rounded-full bg-[#A3E635] animate-pulse" />
            <span>CareerBridge</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E2022]">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-xs text-[#5A6065]">
            {isSignUp
              ? 'Join CareerBridge to build your personalized career roadmap'
              : 'Log in to access your skills, roadmap, and opportunities'}
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-2xl border border-[#E5E5DE] bg-white p-6 shadow-sm">
          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-3 text-xs text-[#991B1B]">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-medium text-[#1E2022] mb-1">
                  Name <span className="text-[#D96B27]">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-[#8C949D]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] py-2 pl-9 pr-3 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:bg-white focus:ring-1 focus:ring-[#183B32] transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#1E2022] mb-1">
                Email <span className="text-[#D96B27]">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#8C949D]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] py-2 pl-9 pr-3 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:bg-white focus:ring-1 focus:ring-[#183B32] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1E2022] mb-1">
                Password <span className="text-[#D96B27]">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#8C949D]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] py-2 pl-9 pr-10 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:bg-white focus:ring-1 focus:ring-[#183B32] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-[#8C949D] hover:text-[#1E2022]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {isSignUp && (
                <p className="mt-1 text-[10px] text-[#5A6065]">Must be at least 6 characters long.</p>
              )}
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-medium text-[#1E2022] mb-1">
                  Confirm password <span className="text-[#D96B27]">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#8C949D]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-[#E5E5DE] bg-[#FBFBF9] py-2 pl-9 pr-10 text-xs text-[#1E2022] outline-hidden focus:border-[#183B32] focus:bg-white focus:ring-1 focus:ring-[#183B32] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-[#8C949D] hover:text-[#1E2022]"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#183B32] py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#15342C] disabled:opacity-60 transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>{isSignUp ? 'Creating your account...' : 'Signing you in...'}</span>
                </>
              ) : (
                <span>{isSignUp ? 'Create account' : 'Log in'}</span>
              )}
            </button>
          </form>

          {/* Toggle link */}
          <div className="mt-5 border-t border-[#E5E5DE] pt-4 text-center">
            {isSignUp ? (
              <p className="text-xs text-[#5A6065]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setError(null);
                  }}
                  className="font-semibold text-[#183B32] hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#5A6065]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setError(null);
                  }}
                  className="font-semibold text-[#183B32] hover:underline cursor-pointer"
                >
                  Create account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
