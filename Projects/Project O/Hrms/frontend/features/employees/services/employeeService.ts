import apiClient from '@/lib/api/client';
import { Employee } from '../types';

export const employeeService = {
  async getEmployees(params?: { search?: string; department?: string }): Promise<Employee[]> {
    const response = await apiClient.get<Employee[]>('employees/', { params });
    return response.data;
  },

  async getEmployee(id: string): Promise<Employee> {
    const response = await apiClient.get<Employee>(`employees/${id}/`);
    return response.data;
  },
};
