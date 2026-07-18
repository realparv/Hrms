"use client";

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Calendar, Briefcase, UserCircle, MapPin, Building2, CalendarDays, Users, Award, ShieldCheck } from 'lucide-react';
import { Employee } from '../types';
import { employeeService } from '../services/employeeService';
import { useState } from 'react';

interface EmployeeDetailsPaneProps {
  employee: Employee | null;
  onClose: () => void;
  onUpdate?: (updatedEmployee: Employee) => void;
}

export function EmployeeDetailsPane({ employee, onClose, onUpdate }: EmployeeDetailsPaneProps) {
  // Prevent scrolling when pane is open
  useEffect(() => {
    if (employee) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [employee]);

  const [isEditingDept, setIsEditingDept] = useState(false);
  const [deptInput, setDeptInput] = useState('');
  const [isEditingManager, setIsEditingManager] = useState(false);
  const [managerInput, setManagerInput] = useState('');

  // Reset inputs when employee changes
  useEffect(() => {
    if (employee) {
      setDeptInput(employee.department_id || '');
      setManagerInput(employee.manager || '');
      setIsEditingDept(false);
      setIsEditingManager(false);
    }
  }, [employee]);

  const handleUpdate = async (field: 'department_id' | 'manager', value: string) => {
    if (!employee) return;
    try {
      const updated = await employeeService.updateEmployee(employee.id, { [field]: value });
      if (onUpdate) onUpdate(updated);
      if (field === 'department_id') setIsEditingDept(false);
      if (field === 'manager') setIsEditingManager(false);
    } catch (err) {
      console.error(`Failed to update ${field}:`, err);
    }
  };

  return (
    <AnimatePresence>
      {employee && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 transition-all"
          />
          
          {/* Slide-over panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-lg bg-card/95 backdrop-blur-xl border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50 bg-background/50">
              <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Employee Dossier</h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-all hover:rotate-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Profile Header */}
              <div className="flex items-center gap-6">
                <div className="relative group cursor-pointer">
                  <div className="absolute -inset-1 bg-black/20 dark:bg-white/20 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                  <div className="relative w-24 h-24 glass-effect-glow flex items-center justify-center font-bold text-4xl text-foreground group-hover:scale-105">
                    {employee.first_name[0]}{employee.last_name[0]}
                  </div>
                  {employee.is_active && (
                    <div className="absolute bottom-0 right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-card shadow-sm"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-3xl font-bold tracking-tight">{employee.first_name} {employee.last_name}</h3>
                  <p className="text-lg text-primary font-medium mt-1">{employee.designation_id || 'Staff Member'}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-secondary/80 text-secondary-foreground border border-border">
                      <Briefcase className="w-3 h-3" />
                      {employee.employment_type.replace('_', ' ')}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      employee.is_active 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                        : 'bg-destructive/10 text-destructive border-destructive/20'
                    }`}>
                      <ShieldCheck className="w-3 h-3" />
                      {employee.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" /> Contact Details
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-0.5">Corporate Email</p>
                      <p className="font-semibold">{employee.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-0.5">Phone Number</p>
                      <p className="font-semibold">{employee.phone || 'Unlisted'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employment Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" /> Organization
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-secondary/40 to-secondary/10 p-5 rounded-2xl border border-border/50 hover:shadow-md transition-all">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Employee ID</p>
                    <p className="text-lg font-bold font-mono tracking-tight">{employee.employee_id}</p>
                  </div>
                  <div className="bg-gradient-to-br from-secondary/40 to-secondary/10 p-5 rounded-2xl border border-border/50 hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-muted-foreground font-medium">Department</p>
                      {!isEditingDept && (
                        <button onClick={() => setIsEditingDept(true)} className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">Edit</button>
                      )}
                    </div>
                    {isEditingDept ? (
                      <input 
                        autoFocus
                        value={deptInput}
                        onChange={e => setDeptInput(e.target.value)}
                        onBlur={() => handleUpdate('department_id', deptInput)}
                        onKeyDown={e => e.key === 'Enter' && handleUpdate('department_id', deptInput)}
                        className="w-full bg-background border border-border rounded px-2 py-1 text-sm font-bold tracking-tight focus:outline-none focus:ring-1 focus:ring-primary" 
                      />
                    ) : (
                      <p className="text-lg font-bold tracking-tight">{employee.department_id || 'HQ'}</p>
                    )}
                  </div>
                  <div className="bg-gradient-to-br from-secondary/40 to-secondary/10 p-5 rounded-2xl border border-border/50 hover:shadow-md transition-all">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Joining Date</p>
                    <p className="text-lg font-bold tracking-tight">{new Date(employee.joining_date).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-secondary/40 to-secondary/10 p-5 rounded-2xl border border-border/50 hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-muted-foreground font-medium">Manager</p>
                      {!isEditingManager && (
                        <button onClick={() => setIsEditingManager(true)} className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">Edit</button>
                      )}
                    </div>
                    {isEditingManager ? (
                      <input 
                        autoFocus
                        value={managerInput}
                        onChange={e => setManagerInput(e.target.value)}
                        onBlur={() => handleUpdate('manager', managerInput)}
                        onKeyDown={e => e.key === 'Enter' && handleUpdate('manager', managerInput)}
                        className="w-full bg-background border border-border rounded px-2 py-1 text-sm font-bold tracking-tight focus:outline-none focus:ring-1 focus:ring-primary" 
                      />
                    ) : (
                      <p className="text-lg font-bold tracking-tight">{employee.manager || 'Unassigned'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <UserCircle className="w-4 h-4 text-primary" /> Demographics
                </h4>
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <span className="text-muted-foreground flex items-center gap-3 text-sm font-medium">
                      <UserCircle className="w-4 h-4" /> Gender
                    </span>
                    <span className="font-semibold">{employee.gender || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <span className="text-muted-foreground flex items-center gap-3 text-sm font-medium">
                      <CalendarDays className="w-4 h-4" /> Date of Birth
                    </span>
                    <span className="font-semibold">
                      {employee.date_of_birth ? new Date(employee.date_of_birth).toLocaleDateString() : 'Not provided'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
                    <span className="text-muted-foreground flex items-center gap-3 text-sm font-medium">
                      <Users className="w-4 h-4" /> Marital Status
                    </span>
                    <span className="font-semibold">{employee.marital_status || 'Not provided'}</span>
                  </div>
                </div>
              </div>
              
              <div className="pb-8"></div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-border/50 bg-background/50 backdrop-blur-md">
              <button className="w-full py-3.5 glass-effect-glow text-foreground font-bold text-sm tracking-wide">
                View Full Employee Profile
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
