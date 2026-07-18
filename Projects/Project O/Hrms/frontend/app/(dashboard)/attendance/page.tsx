"use client";

import { AttendanceDashboard } from '@/features/attendance/components/AttendanceDashboard';

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
        <p className="text-muted-foreground mt-1">
          Track employee attendance, timesheets, and late arrivals.
        </p>
      </div>

      <AttendanceDashboard />
    </div>
  );
}
