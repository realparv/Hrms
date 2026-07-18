import apiClient from '@/lib/api/client';
import { Attendance } from '../types';

export const attendanceService = {
  getAttendance: async (): Promise<Attendance[]> => {
    const response = await apiClient.get('/attendance/');
    return response.data;
  },

  clockIn: async (): Promise<Attendance> => {
    const response = await apiClient.post('/attendance/clock_in/');
    return response.data;
  },

  clockOut: async (): Promise<Attendance> => {
    const response = await apiClient.post('/attendance/clock_out/');
    return response.data;
  },
};
