"use client";

import { LeaveDashboard } from '@/features/leave/components/LeaveDashboard';

export default function LeavePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Leave Management</h2>
        <p className="text-muted-foreground mt-1">
          Manage employee leave requests, balances, and holidays.
        </p>
      </div>

      <LeaveDashboard />
    </div>
  );
}
