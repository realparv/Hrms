"use client";

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { attendanceService } from '../services/attendanceService';
import { Attendance } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Clock, CheckCircle, XCircle, LayoutDashboard, List } from 'lucide-react';
import { LiveClock } from './LiveClock';
import { AttendanceCalendar } from './AttendanceCalendar';
import { cn } from '@/shared/utils/cn';

export function AttendanceDashboard() {
  const user = useAuthStore((state) => state.user);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'MY_ATTENDANCE' | 'ORG_LOGS'>('MY_ATTENDANCE');

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const data = await attendanceService.getAttendance();
      setAttendances(data);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleClockIn = async () => {
    try {
      await attendanceService.clockIn();
      fetchAttendance();
    } catch (error) {
      console.error('Clock in failed:', error);
    }
  };

  const handleClockOut = async () => {
    try {
      await attendanceService.clockOut();
      fetchAttendance();
    } catch (error) {
      console.error('Clock out failed:', error);
    }
  };

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
  const today = new Date().toISOString().split('T')[0];
  
  // Filter attendances for the currently logged-in user if they are an admin looking at their own log
  // (Assuming backend returns all for admin, we need to filter for the calendar if they are viewing 'MY_ATTENDANCE')
  const myAttendances = isAdmin 
    ? attendances.filter(a => a.employee_details?.email === user?.email)
    : attendances;

  const todaysAttendance = myAttendances.find(a => a.date === today);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Admin Tabs */}
      {isAdmin && (
        <div className="flex p-1 bg-secondary/50 rounded-lg w-max mb-6">
          <button
            onClick={() => setActiveTab('MY_ATTENDANCE')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all",
              activeTab === 'MY_ATTENDANCE' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            My Attendance
          </button>
          <button
            onClick={() => setActiveTab('ORG_LOGS')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all",
              activeTab === 'ORG_LOGS' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="w-4 h-4" />
            Organization Logs
          </button>
        </div>
      )}

      {activeTab === 'MY_ATTENDANCE' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Time Clock Section */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="glass-panel border-0 shadow-premium bg-card/60">
              <CardContent className="pt-6">
                <LiveClock />
                
                <div className="h-px bg-border my-6 w-full" />
                
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border/50 mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                    <p className="text-lg font-bold">
                      {!todaysAttendance ? 'Not Clocked In' : todaysAttendance.clock_out ? 'Clocked Out' : 'Clocked In'}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${!todaysAttendance ? 'bg-secondary text-muted-foreground' : todaysAttendance.clock_out ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    <Clock className="w-6 h-6" />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleClockIn}
                    disabled={!!todaysAttendance}
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-30 disabled:hover:bg-emerald-500 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Clock In Now
                  </button>
                  <button
                    onClick={handleClockOut}
                    disabled={!todaysAttendance || !!todaysAttendance.clock_out}
                    className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 disabled:opacity-30 disabled:hover:bg-rose-500 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20"
                  >
                    <XCircle className="w-5 h-5" />
                    Clock Out
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <AttendanceCalendar attendances={myAttendances} />
          </div>
        </div>
      ) : (
        /* Organization Logs Table */
        <Card className="glass-panel border-0 shadow-premium bg-card/60 overflow-hidden">
          <CardHeader>
            <CardTitle>Organization Attendance</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-secondary/50 text-muted-foreground border-y border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Employee</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Clock In</th>
                  <th className="px-6 py-4 font-medium">Clock Out</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      Loading attendance records...
                    </td>
                  </tr>
                ) : attendances.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No attendance records found.
                    </td>
                  </tr>
                ) : (
                  attendances.map((record) => (
                    <tr key={record.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4 font-medium">
                        {record.employee_details?.first_name} {record.employee_details?.last_name}
                      </td>
                      <td className="px-6 py-4">{record.date}</td>
                      <td className="px-6 py-4 font-mono">
                        {record.clock_in ? new Date(record.clock_in).toLocaleTimeString() : '--'}
                      </td>
                      <td className="px-6 py-4 font-mono">
                        {record.clock_out ? new Date(record.clock_out).toLocaleTimeString() : '--'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${
                          record.status === 'PRESENT' ? 'bg-emerald-500/10 text-emerald-500' :
                          record.status === 'ABSENT' ? 'bg-rose-500/10 text-rose-500' :
                          'bg-amber-500/10 text-amber-500'
                        }`}>
                          {record.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
