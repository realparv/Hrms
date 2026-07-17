"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Sidebar } from '@/shared/components/layout/Sidebar';
import { ThemeToggle } from '@/shared/components/ui/theme-toggle';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated || !user) {
        router.push('/login');
      } else {
        // Redirection guards based on role
        if (user.role === 'SUPER_ADMIN' && !pathname.startsWith('/super-admin')) {
          router.push('/super-admin');
        } else if (user.role !== 'SUPER_ADMIN' && pathname.startsWith('/super-admin')) {
          router.push('/');
        }
      }
    }
  }, [mounted, isAuthenticated, user, pathname, router]);

  // Prevent flash of unauthenticated content
  if (!mounted || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Double check role alignment to prevent quick flashes on redirection
  if (user.role === 'SUPER_ADMIN' && !pathname.startsWith('/super-admin')) {
    return null;
  }
  if (user.role !== 'SUPER_ADMIN' && pathname.startsWith('/super-admin')) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 flex flex-col">
        <header className="flex justify-end items-center mb-6">
          <ThemeToggle />
        </header>
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
