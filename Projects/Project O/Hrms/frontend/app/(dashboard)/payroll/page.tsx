"use client";

import { useAuthStore } from '@/features/auth/store/authStore';
import { AdminPayrollDashboard } from '@/features/payroll/components/AdminPayrollDashboard';
import { EmployeePayrollDashboard } from '@/features/payroll/components/EmployeePayrollDashboard';
import { FileText } from 'lucide-react';

export default function PayrollPage() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll</h1>
          <p className="text-muted-foreground mt-1">
            {user.role === 'EMPLOYEE' ? 'View your salary details and payslips' : 'Manage salary structures and generate payslips'}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-secondary/50 text-secondary-foreground rounded-xl border border-border/50 shadow-sm">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Payroll Module Active</span>
        </div>
      </div>

      {['SUPER_ADMIN', 'ADMIN'].includes(user.role) ? (
        <AdminPayrollDashboard />
      ) : (
        <EmployeePayrollDashboard />
      )}
    </div>
  );
}
