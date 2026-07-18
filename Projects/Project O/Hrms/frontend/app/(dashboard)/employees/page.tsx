"use client";

import { EmployeeTable } from '@/features/employees/components/EmployeeTable';

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
        <p className="text-muted-foreground mt-1">
          Manage your organization's employees, view their details, and handle operations.
        </p>
      </div>

      <EmployeeTable />
    </div>
  );
}
