export interface SalaryStructure {
  id: number;
  employee: number;
  employee_details: {
    first_name: string;
    last_name: string;
    email: string;
    employee_id: string;
    designation_id?: string;
  };
  base_salary: string;
  hra: string;
  da: string;
  special_allowances: string;
  pf_deduction: string;
  tax_deduction: string;
  gross_salary: string;
  total_deductions: string;
  net_salary: string;
  created_at: string;
  updated_at: string;
}

export interface Payslip {
  id: number;
  employee: number;
  employee_details: {
    first_name: string;
    last_name: string;
    email: string;
    employee_id: string;
    designation_id?: string;
  };
  month: number;
  year: number;
  base_salary: string;
  hra: string;
  da: string;
  special_allowances: string;
  pf_deduction: string;
  tax_deduction: string;
  gross_salary: string;
  total_deductions: string;
  net_salary: string;
  status: 'PENDING' | 'PROCESSED' | 'PAID';
  payment_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface GeneratePayslipResponse {
  message: string;
  count: number;
}
