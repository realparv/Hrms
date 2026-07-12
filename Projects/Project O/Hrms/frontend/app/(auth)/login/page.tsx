"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/shared/components/ui/theme-toggle';
import { authService } from '@/features/auth/services/authService';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'SUPER_ADMIN') {
        router.push('/super-admin');
      } else {
        router.push('/');
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      
      // Store auth state
      setAuth(response.user, response.tokens.access_token);
      
      // Save refresh token for logout usage (optional but useful)
      localStorage.setItem('refresh_token', response.tokens.refresh_token);

      // Role-based redirection
      if (response.user.role === 'SUPER_ADMIN') {
        router.push('/super-admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const message = err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'Invalid email or password.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A] p-4 relative overflow-hidden">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl -z-10 rounded-full" />
      
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl shadow-premium">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-primary mx-auto flex items-center justify-center text-primary-foreground font-bold text-2xl mb-6">
            H
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-2 text-sm">Enter your credentials to access your workspace</p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-xs bg-destructive/15 text-destructive rounded-lg border border-destructive/20 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="name@company.com"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Password</label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Don't have a company account?{' '}
          <Link href="/signup/organization" className="text-primary hover:underline font-medium">
            Register your Organization
          </Link>
          <div className="mt-2 text-xs">
            Or, are you an employee?{' '}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign Up as Employee
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
