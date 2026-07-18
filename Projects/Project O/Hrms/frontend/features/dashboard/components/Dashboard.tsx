"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Users, Clock, CalendarDays, TrendingUp } from 'lucide-react';
import apiClient from '@/lib/api/client';

interface DashboardStats {
  total_employees: number;
  on_leave_today: number;
  late_arrivals: number;
  performance_avg: number;
}

export function Dashboard() {
  const [data, setData] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get<DashboardStats>('dashboard/stats/');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: 'Total Employees', value: data?.total_employees?.toString() || '0', icon: Users, trend: '+12 this month' },
    { label: 'On Leave Today', value: data?.on_leave_today?.toString() || '0', icon: CalendarDays, trend: 'Normal' },
    { label: 'Late Arrivals', value: data?.late_arrivals?.toString() || '0', icon: Clock, trend: '-4 from yesterday' },
    { label: 'Performance Avg', value: data?.performance_avg?.toString() || '0.0', icon: TrendingUp, trend: '+0.2 from last quarter' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground mt-1">Here is what is happening in your organization today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className="p-2 bg-secondary rounded-full">
                <stat.icon className="h-4 w-4 text-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <span className={stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-muted-foreground'}>
                  {stat.trend}
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Attendance Trends</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[300px] flex items-center justify-center text-muted-foreground border-dashed border-2 rounded-lg m-6 mt-0">
            [Chart Area: Employee Attendance over 30 days]
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">New Employee Onboarded</p>
                    <p className="text-xs text-muted-foreground">Sarah Jenkins joined Engineering</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {i}h ago
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
