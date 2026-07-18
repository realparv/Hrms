"use client";

import { useEffect, useState } from 'react';
import { Search, Plus, Download, MoreHorizontal, LayoutGrid, List as ListIcon, Building2, Briefcase, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Employee } from '../types';
import { employeeService } from '../services/employeeService';
import { EmployeeDetailsPane } from './EmployeeDetailsPane';

export function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const data = await employeeService.getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((emp) =>
    `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employee_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-96 group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            className="w-full pl-11 pr-4 py-2.5 border border-border/50 rounded-xl bg-card/30 backdrop-blur-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
            placeholder="Search employees by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center p-1 bg-secondary/50 rounded-lg border border-border/50">
            <button 
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'table' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-medium hover:bg-secondary/80 transition-all border border-border/50 hover:shadow-md">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-blue-500 text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5">
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="glass-panel p-12 flex flex-col items-center justify-center min-h-[400px] border-0">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-muted-foreground font-medium animate-pulse">Loading directory...</p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="glass-panel p-12 flex flex-col items-center justify-center min-h-[400px] border-0 text-center">
          <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No employees found</h3>
          <p className="text-muted-foreground mt-1 max-w-sm">
            We couldn't find any employees matching "{searchQuery}". Try adjusting your search.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="glass-panel border-0 shadow-premium overflow-hidden bg-card/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-secondary/30 text-muted-foreground border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium tracking-wide">Employee</th>
                  <th className="px-6 py-4 font-medium tracking-wide">Employee ID</th>
                  <th className="px-6 py-4 font-medium tracking-wide">Role</th>
                  <th className="px-6 py-4 font-medium tracking-wide">Status</th>
                  <th className="px-6 py-4 font-medium tracking-wide text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <AnimatePresence>
                  {filteredEmployees.map((employee, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={employee.id}
                      className="group hover:bg-secondary/20 transition-colors cursor-pointer"
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center font-bold text-sm text-primary shadow-inner border border-primary/10">
                              {employee.first_name[0]}{employee.last_name[0]}
                            </div>
                            {employee.is_active && (
                              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-card"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {employee.first_name} {employee.last_name}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" /> {employee.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs px-2 py-1 bg-secondary/50 rounded-md border border-border/50">
                          {employee.employee_id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{employee.designation_id || 'Staff'}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Briefcase className="w-3 h-3" /> {employee.employment_type.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          employee.is_active 
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                            : 'bg-destructive/10 text-destructive border-destructive/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${employee.is_active ? 'bg-emerald-500' : 'bg-destructive'}`}></span>
                          {employee.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredEmployees.map((employee, idx) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                key={employee.id}
                onClick={() => setSelectedEmployee(employee)}
                className="glass-panel border-0 shadow-premium bg-card/60 p-6 rounded-2xl cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:bg-card/80 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center font-bold text-xl text-primary shadow-inner border border-primary/10 group-hover:scale-105 transition-transform">
                      {employee.first_name[0]}{employee.last_name[0]}
                    </div>
                    {employee.is_active && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-card"></div>
                    )}
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    employee.is_active 
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                      : 'bg-destructive/10 text-destructive border-destructive/20'
                  }`}>
                    {employee.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                    {employee.first_name} {employee.last_name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium mb-3">{employee.designation_id || 'Staff'}</p>
                  
                  <div className="space-y-2 mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="truncate">{employee.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>{employee.employment_type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{employee.department_id || 'HQ'}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <EmployeeDetailsPane 
        employee={selectedEmployee} 
        onClose={() => setSelectedEmployee(null)} 
      />
    </div>
  );
}
