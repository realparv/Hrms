import apiClient from '@/lib/api/client';
import { SalaryStructure, Payslip, GeneratePayslipResponse } from '../types';

export const payrollService = {
  async getSalaryStructures(): Promise<SalaryStructure[]> {
    const response = await apiClient.get<SalaryStructure[]>('payroll/salary-structures/');
    return response.data;
  },

  async updateSalaryStructure(id: number, data: Partial<SalaryStructure>): Promise<SalaryStructure> {
    const response = await apiClient.patch<SalaryStructure>(`payroll/salary-structures/${id}/`, data);
    return response.data;
  },

  async getPayslips(params?: { month?: number; year?: number }): Promise<Payslip[]> {
    const response = await apiClient.get<Payslip[]>('payroll/payslips/', { params });
    return response.data;
  },

  async generatePayslips(month: number, year: number): Promise<GeneratePayslipResponse> {
    const response = await apiClient.post<GeneratePayslipResponse>('payroll/payslips/generate_payslips/', { month, year });
    return response.data;
  },

  async markPaid(payslipId: number): Promise<Payslip> {
    const response = await apiClient.post<Payslip>(`payroll/payslips/${payslipId}/mark_paid/`);
    return response.data;
  },
};
