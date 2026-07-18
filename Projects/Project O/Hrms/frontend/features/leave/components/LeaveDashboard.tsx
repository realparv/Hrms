"use client";

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { leaveService } from '../services/leaveService';
import { LeaveRequest } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Plus, CheckCircle, XCircle } from 'lucide-react';

export function LeaveDashboard() {
  const user = useAuthStore((state) => state.user);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [leaveType, setLeaveType] = useState('SICK');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const data = await leaveService.getLeaveRequests();
      setLeaves(data);
    } catch (error) {
      console.error('Failed to fetch leave requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await leaveService.applyLeave({
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason,
      });
      setShowForm(false);
      setStartDate('');
      setEndDate('');
      setReason('');
      fetchLeaves();
    } catch (error) {
      console.error('Failed to apply for leave:', error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await leaveService.approveLeave(id);
      fetchLeaves();
    } catch (error) {
      console.error('Failed to approve leave:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await leaveService.rejectLeave(id);
      fetchLeaves();
    } catch (error) {
      console.error('Failed to reject leave:', error);
    }
  };

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  return (
    <div className="space-y-6">
      {!isAdmin && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Request Leave
          </button>
        </div>
      )}

      {showForm && !isAdmin && (
        <Card className="glass-panel border-0 shadow-premium bg-card/60">
          <CardHeader>
            <CardTitle>Submit Leave Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleApplyLeave} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium mb-1">Leave Type</label>
                <select 
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  required
                >
                  <option value="SICK">Sick Leave</option>
                  <option value="CASUAL">Casual Leave</option>
                  <option value="ANNUAL">Annual Leave</option>
                  <option value="HALF_DAY">Half Day</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input 
                    type="date" 
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <textarea 
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background resize-none"
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Leave Requests Table */}
      <Card className="glass-panel border-0 shadow-premium bg-card/60 overflow-hidden">
        <CardHeader>
          <CardTitle>{isAdmin ? 'Leave Requests Queue' : 'My Leave Requests'}</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-muted-foreground border-y border-border">
              <tr>
                {isAdmin && <th className="px-6 py-4 font-medium">Employee</th>}
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Duration</th>
                <th className="px-6 py-4 font-medium">Reason</th>
                <th className="px-6 py-4 font-medium">Status</th>
                {isAdmin && <th className="px-6 py-4 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 4} className="px-6 py-12 text-center text-muted-foreground">
                    Loading leave requests...
                  </td>
                </tr>
              ) : leaves.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 4} className="px-6 py-12 text-center text-muted-foreground">
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                leaves.map((request) => (
                  <tr key={request.id} className="hover:bg-secondary/30 transition-colors">
                    {isAdmin && (
                      <td className="px-6 py-4 font-medium whitespace-nowrap">
                        {request.employee_details?.first_name} {request.employee_details?.last_name}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.leave_type.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.start_date} to {request.end_date}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={request.reason}>
                      {request.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${
                        request.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500' :
                        request.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {request.status === 'PENDING' && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-md transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
