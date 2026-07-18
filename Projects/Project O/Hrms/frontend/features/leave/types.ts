export interface LeaveRequest {
  id: string;
  employee_details: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    employee_id: string;
  };
  leave_type: 'SICK' | 'CASUAL' | 'ANNUAL' | 'HALF_DAY';
  start_date: string;
  end_date: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  admin_remarks: string | null;
  created_at: string;
}
