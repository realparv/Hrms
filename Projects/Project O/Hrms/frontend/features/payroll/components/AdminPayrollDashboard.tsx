"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IndianRupee, Download, Play, CheckCircle2, AlertCircle, 
  Search, Users, CalendarDays, MoreHorizontal, FileText
} from 'lucide-react';
import { payrollService } from '../services/payrollService';
import { SalaryStructure, Payslip } from '../types';
import { ConfigureSalaryModal } from './ConfigureSalaryModal';

export function AdminPayrollDashboard() {
  const [structures, setStructures] = useState<SalaryStructure[]>([]);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'run' | 'structures'>('run');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<SalaryStructure | null>(null);
  
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [structuresData, payslipsData] = await Promise.all([
        payrollService.getSalaryStructures(),
        payrollService.getPayslips({ month: selectedMonth, year: selectedYear })
      ]);
      setStructures(structuresData);
      setPayslips(payslipsData);
    } catch (error) {
      console.error('Failed to fetch payroll data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunPayroll = async () => {
    setIsProcessing(true);
    try {
      await payrollService.generatePayslips(selectedMonth, selectedYear);
      await fetchData();
    } catch (error) {
      console.error('Failed to run payroll:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPayout = payslips.reduce((sum, p) => sum + parseFloat(p.net_salary), 0);
  const pendingCount = payslips.filter(p => p.status !== 'PAID').length;

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-card to-primary/5 border-0 shadow-premium relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <IndianRupee className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-1">Total Payout</h3>
            <p className="text-4xl font-bold tracking-tight">₹{totalPayout.toLocaleString('en-IN')}</p>
            <p className="text-xs text-primary font-medium mt-2">For {selectedMonth}/{selectedYear}</p>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl bg-card border-0 shadow-premium relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-500">
            <Users className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-1">Employees Processed</h3>
            <p className="text-4xl font-bold tracking-tight">{payslips.length}</p>
            <p className="text-xs text-emerald-500 font-medium mt-2">Generated this month</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl bg-card border-0 shadow-premium relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 text-amber-500">
            <AlertCircle className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-1">Pending Payments</h3>
            <p className="text-4xl font-bold tracking-tight">{pendingCount}</p>
            <p className="text-xs text-amber-500 font-medium mt-2">Requires dispatch</p>
          </div>
        </div>
      </div>

      {/* Tabs and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex bg-secondary/50 p-1 rounded-xl border border-border/50">
          <button 
            onClick={() => setActiveTab('run')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'run' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Payslips & Processing
          </button>
          <button 
            onClick={() => setActiveTab('structures')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'structures' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Salary Structures
          </button>
        </div>

        {activeTab === 'run' && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-secondary/30 border border-border/50 rounded-xl">
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
              <select 
                className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'short' })}</option>
                ))}
              </select>
              <select 
                className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer border-l border-border/50 pl-2 ml-1"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {[currentDate.getFullYear() - 1, currentDate.getFullYear(), currentDate.getFullYear() + 1].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={handleRunPayroll}
              disabled={isProcessing}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-primary to-blue-500 text-primary-foreground rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
              {isProcessing ? 'Processing...' : 'Run Payroll'}
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="glass-panel rounded-2xl border-0 shadow-premium overflow-hidden bg-card/60 min-h-[400px]">
        {loading ? (
           <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
             <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
             <p className="mt-4 font-medium text-muted-foreground">Loading payroll data...</p>
           </div>
        ) : activeTab === 'run' ? (
          payslips.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold">No payslips generated</h3>
              <p className="text-muted-foreground mt-2 max-w-sm">
                Click "Run Payroll" to automatically generate payslips for all active employees for this month based on their assigned salary structures.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-secondary/30 text-muted-foreground border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Employee</th>
                    <th className="px-6 py-4 font-medium">Basic + Allowances</th>
                    <th className="px-6 py-4 font-medium">Deductions</th>
                    <th className="px-6 py-4 font-medium font-bold text-foreground">Net Pay</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <AnimatePresence>
                    {payslips.map((payslip, i) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        key={payslip.id} className="hover:bg-secondary/20 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold">{payslip.employee_details.first_name} {payslip.employee_details.last_name}</div>
                          <div className="text-xs text-muted-foreground">{payslip.employee_details.employee_id}</div>
                        </td>
                        <td className="px-6 py-4 font-mono">₹{parseFloat(payslip.gross_salary).toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 font-mono text-destructive">-₹{parseFloat(payslip.total_deductions).toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{parseFloat(payslip.net_salary).toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                            payslip.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                            payslip.status === 'PROCESSED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                            'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }`}>
                            {payslip.status === 'PAID' && <CheckCircle2 className="w-3 h-3" />}
                            {payslip.status === 'PROCESSED' && <Play className="w-3 h-3" />}
                            {payslip.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-muted-foreground hover:text-primary transition-colors hover:bg-primary/10 rounded-lg">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-secondary/30 text-muted-foreground border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Employee</th>
                  <th className="px-6 py-4 font-medium">Basic</th>
                  <th className="px-6 py-4 font-medium">HRA + DA</th>
                  <th className="px-6 py-4 font-medium">Deductions</th>
                  <th className="px-6 py-4 font-medium font-bold text-foreground">Monthly CTC</th>
                  <th className="px-6 py-4 text-right">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {structures.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No salary structures defined.</td>
                  </tr>
                ) : structures.map((struct) => (
                  <tr key={struct.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold">{struct.employee_details.first_name} {struct.employee_details.last_name}</div>
                      <div className="text-xs text-muted-foreground">{struct.employee_details.employee_id}</div>
                    </td>
                    <td className="px-6 py-4 font-mono">₹{parseFloat(struct.base_salary).toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 font-mono">
                      ₹{(parseFloat(struct.hra) + parseFloat(struct.da)).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 font-mono text-destructive">
                      -₹{parseFloat(struct.total_deductions).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{parseFloat(struct.gross_salary).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedStructure(struct)}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Configure
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfigureSalaryModal 
        isOpen={!!selectedStructure} 
        onClose={() => setSelectedStructure(null)} 
        structure={selectedStructure}
        onSuccess={() => {
          fetchData(); // Refresh the structures after save
        }}
      />
    </div>
  );
}
