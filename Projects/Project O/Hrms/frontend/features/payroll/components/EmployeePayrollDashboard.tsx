"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IndianRupee, Download, CheckCircle2, FileText, Wallet, Receipt
} from 'lucide-react';
import { payrollService } from '../services/payrollService';
import { SalaryStructure, Payslip } from '../types';
import { downloadPayslip } from '../utils/generatePDF';

export function EmployeePayrollDashboard() {
  const [structure, setStructure] = useState<SalaryStructure | null>(null);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [structuresData, payslipsData] = await Promise.all([
        payrollService.getSalaryStructures(),
        payrollService.getPayslips()
      ]);
      if (structuresData.length > 0) setStructure(structuresData[0]);
      setPayslips(payslipsData);
    } catch (error) {
      console.error('Failed to fetch payroll data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-8 rounded-3xl bg-gradient-to-br from-card to-emerald-500/5 border-0 shadow-premium relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet className="w-32 h-32 text-emerald-500" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-500" /> Net Monthly Take-home
            </h3>
            <p className="text-5xl font-bold tracking-tight text-foreground mt-4">
              ₹{structure ? parseFloat(structure.net_salary).toLocaleString('en-IN') : '0'}
            </p>
            <p className="text-sm text-muted-foreground font-medium mt-2">After applicable taxes and deductions</p>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl bg-card border-0 shadow-premium relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Receipt className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Salary Breakdown</h3>
            {structure ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Basic Pay</span>
                  <span className="font-mono font-medium">₹{parseFloat(structure.base_salary).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">HRA & Allowances</span>
                  <span className="font-mono font-medium">₹{(parseFloat(structure.hra) + parseFloat(structure.da) + parseFloat(structure.special_allowances)).toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-px bg-border/50 my-2"></div>
                <div className="flex justify-between items-center text-sm text-destructive">
                  <span>Total Deductions (PF/Tax)</span>
                  <span className="font-mono font-medium">-₹{parseFloat(structure.total_deductions).toLocaleString('en-IN')}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Your salary structure has not been configured yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Payslip History */}
      <h2 className="text-xl font-bold tracking-tight mt-8 mb-4">Payslip History</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {payslips.map((payslip, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              key={payslip.id}
              className="glass-panel p-6 rounded-2xl bg-card border-0 shadow-premium hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-bold text-lg">
                      {new Date(0, payslip.month - 1).toLocaleString('default', { month: 'long' })} {payslip.year}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">Payslip #{payslip.id.toString().padStart(5, '0')}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                    payslip.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                    payslip.status === 'PROCESSED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                    'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {payslip.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Net Pay</p>
                  <p className="text-2xl font-bold font-mono tracking-tight text-foreground">
                    ₹{parseFloat(payslip.net_salary).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-border/50">
                <button 
                  onClick={() => downloadPayslip(payslip)}
                  className="flex items-center justify-center gap-2 w-full py-2 bg-secondary/50 text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </motion.div>
          ))}
          {payslips.length === 0 && (
            <div className="col-span-full p-12 text-center border-2 border-dashed border-border rounded-2xl">
              <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No payslips have been generated for you yet.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
