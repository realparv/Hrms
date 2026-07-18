"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Building2, CreditCard, Users, Activity } from 'lucide-react';
import { superAdminService, OrganizationStat } from '@/features/super-admin/services/superAdminService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<OrganizationStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await superAdminService.getOrganizationStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load organization statistics.');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const totalOrganizations = stats.length;
  const totalUsers = stats.reduce((acc, curr) => acc + curr.member_count, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">SaaS Global Overview</h2>
        <p className="text-muted-foreground mt-1">Super Admin view of all organizations and billing.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glass-panel border-0 shadow-premium bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? <div className="h-8 w-16 bg-muted animate-pulse rounded" /> : totalOrganizations}
            </div>
            <p className="text-xs text-emerald-500 mt-1 flex items-center">
              Active clients across the platform
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-panel border-0 shadow-premium bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Active Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? <div className="h-8 w-24 bg-muted animate-pulse rounded" /> : totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-emerald-500 mt-1 flex items-center">
              Employees registered across all tenants
            </p>
          </CardContent>
        </Card>

        <Card className="glass-panel border-0 shadow-premium bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Recurring Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$42,500</div>
            <p className="text-xs text-emerald-500 mt-1 flex items-center">
              +15% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-1">
        <Card className="glass-panel border-0 shadow-premium bg-card/60 overflow-hidden">
          <CardHeader>
            <CardTitle>Organization Member Distribution</CardTitle>
            <CardDescription>Visualizing active employee counts across different organizations.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[400px] w-full bg-muted/20 animate-pulse rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Loading chart data...</span>
              </div>
            ) : error ? (
              <div className="h-[400px] w-full rounded-lg flex items-center justify-center text-destructive bg-destructive/10">
                {error}
              </div>
            ) : stats.length === 0 ? (
              <div className="h-[400px] w-full rounded-lg flex items-center justify-center text-muted-foreground bg-muted/10">
                No active organizations found.
              </div>
            ) : (
              <div className="h-[400px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 30,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: 'var(--shadow-premium)',
                        color: 'hsl(var(--foreground))'
                      }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Bar 
                      dataKey="member_count" 
                      name="Active Members" 
                      fill="url(#colorGradient)" 
                      radius={[4, 4, 0, 0]} 
                      animationDuration={1500}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8983f7" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#a3dafb" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
