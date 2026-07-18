"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Users, Calendar, Briefcase, FileText, Settings, LogOut, ShieldAlert } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

import { useAuthStore } from '@/features/auth/store/authStore';
import { authService } from '@/features/auth/services/authService';

const standardNavItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Employees', href: '/employees' },
  { icon: Calendar, label: 'Attendance', href: '/attendance' },
  { icon: Briefcase, label: 'Leave', href: '/leave' },
  { icon: FileText, label: 'Payroll', href: '/payroll' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

const superAdminNavItems = [
  { icon: ShieldAlert, label: 'SaaS Overview', href: '/super-admin' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (err) {
      console.error('Logout error on backend:', err);
    } finally {
      localStorage.removeItem('refresh_token');
      clearAuth();
      router.push('/login');
    }
  };

  const navItems = user?.role === 'SUPER_ADMIN' ? superAdminNavItems : standardNavItems;

  return (
    <aside className="w-64 h-screen glass-panel fixed left-0 top-0 border-r flex flex-col justify-between py-6 z-50">
      <div>
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
            H
          </div>
          <div>
            <h1 className="font-semibold text-sm tracking-tight">HRMS Enterprise</h1>
            {user && (
              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono font-medium block w-max mt-0.5">
                {user.role === 'SUPER_ADMIN' ? 'Super Admin' : user.role === 'ADMIN' ? 'Admin' : 'Employee'}
              </span>
            )}
          </div>
        </div>
        
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary/15 text-primary" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-3 space-y-2">
        {user && (
          <div className="px-3 py-2 border-b border-border/50 mb-2">
            <p className="text-xs font-semibold truncate">{user.first_name} {user.last_name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
          </div>
        )}
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
