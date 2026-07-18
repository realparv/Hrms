export interface Employee {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string | null;
  gender: string;
  marital_status: string;
  joining_date: string;
  employment_type: string;
  probation_end_date: string | null;
  confirmation_date: string | null;
  department_id: string | null;
  designation_id: string | null;
  manager: string | null;
  resignation_date: string | null;
  last_working_day: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
