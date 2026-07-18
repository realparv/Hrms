"use client";

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Calendar, Briefcase, UserCircle, MapPin, Building2, CalendarDays, Users, Award, ShieldCheck } from 'lucide-react';
import { Employee } from '../types';

interface EmployeeDetailsPaneProps {
  employee: Employee | null;
  onClose: () => void;
}

export function EmployeeDetailsPane({ employee, onClose }: EmployeeDetailsPaneProps) {
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
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center font-bold text-4xl text-primary border-2 border-primary/20 shadow-xl group-hover:scale-105 transition-transform">
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
                  <div className="bg-gradient-to-br from-secondary/40 to-secondary/10 p-5 rounded-2xl border border-border/50 hover:shadow-md transition-all">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Department</p>
                    <p className="text-lg font-bold tracking-tight">{employee.department_id || 'HQ'}</p>
                  </div>
                  <div className="bg-gradient-to-br from-secondary/40 to-secondary/10 p-5 rounded-2xl border border-border/50 hover:shadow-md transition-all">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Joining Date</p>
                    <p className="text-lg font-bold tracking-tight">{new Date(employee.joining_date).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-secondary/40 to-secondary/10 p-5 rounded-2xl border border-border/50 hover:shadow-md transition-all">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Manager</p>
                    <p className="text-lg font-bold tracking-tight">{employee.manager_id || 'Unassigned'}</p>
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
              <button className="w-full py-3.5 bg-gradient-to-r from-primary to-blue-500 text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all text-sm tracking-wide">
                View Full Employee Profile
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
