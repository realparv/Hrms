"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Building2, User } from 'lucide-react';
import { ThemeToggle } from '@/shared/components/ui/theme-toggle';
import apiClient from '@/lib/api/client';

export default function OrganizationSignupPage() {
  const router = useRouter();

  // Form State
  const [companyName, setCompanyName] = useState('');
  const [domain, setDomain] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Status State
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !domain || !firstName || !lastName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await apiClient.post('saas/organizations/signup/', {
        company_name: companyName,
        domain,
        first_name: firstName,
        last_name: lastName,
        email,
        password
      });

      setSuccess('Organization registered successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2500);
    } catch (err: any) {
      console.error('Organization signup error:', err);
      // Format validation errors nicely
      const errData = err.response?.data;
      if (errData) {
        const errorMsgs = [];
        for (const key in errData) {
          errorMsgs.push(`${key}: ${errData[key]}`);
        }
        setError(errorMsgs.join(' | '));
      } else {
        setError('An error occurred during registration. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A] p-4 relative overflow-hidden py-12">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl -z-10 rounded-full" />
      
      <div className="w-full max-w-2xl glass-panel p-8 md:p-12 rounded-2xl shadow-premium">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Set up your Organization</h1>
          <p className="text-muted-foreground mt-2">Start your 14-day free trial. No credit card required.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 text-xs bg-destructive/15 text-destructive rounded-lg border border-destructive/20 font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 text-xs bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-500/20 font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Building2 className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Company Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Name</label>
                <input 
                  type="text" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Acme Corp"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Workspace URL</label>
                <div className="flex rounded-lg border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary/20">
                  <input 
                    type="text" 
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-transparent border-none focus:outline-none"
                    placeholder="acme"
                    required
                  />
                  <div className="px-3 py-2.5 bg-secondary text-muted-foreground text-sm border-l">
                    .hrms.com
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <User className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Administrator Profile</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <input 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" 
                  placeholder="Jane" 
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" 
                  placeholder="Doe" 
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Work Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" 
                placeholder="jane@acmecorp.com" 
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" 
                placeholder="••••••••" 
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Workspace...' : 'Create Workspace'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
