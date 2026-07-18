export interface Attendance {
  id: string;
  employee_details: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    employee_id: string;
  };
  date: string;
  clock_in: string | null;
  clock_out: string | null;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LATE';
  ip_address: string | null;
  notes: string | null;
}
