import apiClient from '@/lib/api/client';
import { LeaveRequest } from '../types';

export const leaveService = {
  async getLeaveRequests(): Promise<LeaveRequest[]> {
    const response = await apiClient.get<LeaveRequest[]>('leaves/');
    return response.data;
  },

  async applyLeave(data: { leave_type: string; start_date: string; end_date: string; reason: string }): Promise<LeaveRequest> {
    const response = await apiClient.post<LeaveRequest>('leaves/', data);
    return response.data;
  },

  async approveLeave(id: string): Promise<LeaveRequest> {
    const response = await apiClient.post<LeaveRequest>(`leaves/${id}/approve/`);
    return response.data;
  },

  async rejectLeave(id: string, remarks?: string): Promise<LeaveRequest> {
    const response = await apiClient.post<LeaveRequest>(`leaves/${id}/reject/`, { remarks });
    return response.data;
  },
};
