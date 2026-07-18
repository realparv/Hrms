import apiClient from '@/lib/api/client';
import { Attendance } from '../types';

export const attendanceService = {
  async getAttendance(): Promise<Attendance[]> {
    const response = await apiClient.get<Attendance[]>('attendance/');
    return response.data;
  },

  async clockIn(): Promise<Attendance> {
    const response = await apiClient.post<Attendance>('attendance/clock_in/');
    return response.data;
  },

  async clockOut(): Promise<Attendance> {
    const response = await apiClient.post<Attendance>('attendance/clock_out/');
    return response.data;
  },
};
