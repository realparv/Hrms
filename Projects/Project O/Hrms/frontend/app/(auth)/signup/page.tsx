"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, User } from 'lucide-react';
import { ThemeToggle } from '@/shared/components/ui/theme-toggle';
import { authService } from '@/features/auth/services/authService';
import apiClient from '@/lib/api/client';

interface Organization {
  id: string;
  name: string;
  domain_url: string;
}

export default function EmployeeSignupPage() {
  const router = useRouter();

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedOrgId, setSelectedOrgId] = useState('');
  
  // App State
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load organizations on mount
  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const response = await apiClient.get<Organization[]>('saas/organizations/');
        setOrganizations(response.data);
        if (response.data.length > 0) {
          setSelectedOrgId(response.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load organizations:', err);
      }
    };
    fetchOrgs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !selectedOrgId) {
      setError('Please fill in all fields.');
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await authService.register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        organization_id: selectedOrgId
      });

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2500);
    } catch (err: any) {
      console.error('Employee registration error:', err);
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
      
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl shadow-premium">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Employee Registration</h1>
          <p className="text-muted-foreground mt-2">Sign up and join your organization's workspace</p>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <User className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Your Profile Details</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium">First Name</label>
              <input 
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" 
                placeholder="Jane" 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">Last Name</label>
              <input 
                type="text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" 
                placeholder="Doe" 
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" 
              placeholder="jane@company.com" 
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" 
              placeholder="••••••••" 
              required
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-medium">Select Organization</label>
            <select
              value={selectedOrgId}
              onChange={(e) => setSelectedOrgId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            >
              {organizations.length === 0 ? (
                <option value="">No organizations available</option>
              ) : (
                organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} ({org.domain_url})
                  </option>
                ))
              )}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'Registering...' : 'Register'}
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
