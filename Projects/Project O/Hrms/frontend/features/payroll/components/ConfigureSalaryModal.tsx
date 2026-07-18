"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, IndianRupee } from 'lucide-react';
import { SalaryStructure } from '../types';
import { payrollService } from '../services/payrollService';

interface ConfigureSalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  structure: SalaryStructure | null;
  onSuccess: () => void;
}

export function ConfigureSalaryModal({ isOpen, onClose, structure, onSuccess }: ConfigureSalaryModalProps) {
  const [formData, setFormData] = useState({
    base_salary: '0',
    hra: '0',
    da: '0',
    special_allowances: '0',
    pf_deduction: '0',
    tax_deduction: '0',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (structure) {
      setFormData({
        base_salary: parseFloat(structure.base_salary).toString(),
        hra: parseFloat(structure.hra).toString(),
        da: parseFloat(structure.da).toString(),
        special_allowances: parseFloat(structure.special_allowances).toString(),
        pf_deduction: parseFloat(structure.pf_deduction).toString(),
        tax_deduction: parseFloat(structure.tax_deduction).toString(),
      });
    }
  }, [structure]);

  if (!isOpen || !structure) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Only allow numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await payrollService.updateSalaryStructure(structure.id, {
        base_salary: formData.base_salary || '0',
        hra: formData.hra || '0',
        da: formData.da || '0',
        special_allowances: formData.special_allowances || '0',
        pf_deduction: formData.pf_deduction || '0',
        tax_deduction: formData.tax_deduction || '0',
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to update salary structure:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-card w-full max-w-lg rounded-2xl shadow-premium border border-border/50 overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Configure Salary</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {structure.employee_details.first_name} {structure.employee_details.last_name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Earnings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Basic Pay</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      name="base_salary"
                      value={formData.base_salary}
                      onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2 bg-secondary/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">HRA</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      name="hra"
                      value={formData.hra}
                      onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2 bg-secondary/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">DA</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      name="da"
                      value={formData.da}
                      onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2 bg-secondary/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Special Allowances</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      name="special_allowances"
                      value={formData.special_allowances}
                      onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2 bg-secondary/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-border/50"></div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-destructive">Deductions</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">PF Deduction</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      name="pf_deduction"
                      value={formData.pf_deduction}
                      onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-destructive/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tax Deduction</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      name="tax_deduction"
                      value={formData.tax_deduction}
                      onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-destructive/50"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Structure'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
