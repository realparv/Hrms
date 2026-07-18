"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Attendance } from '../types';

interface AttendanceCalendarProps {
  attendances: Attendance[];
}

export function AttendanceCalendar({ attendances }: AttendanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const resetToToday = () => {
    setCurrentDate(new Date());
  };

  // Build the calendar grid (always 42 cells to maintain consistent 6-row height)
  const calendarDays = [];
  
  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      dateStr: `${month === 0 ? year - 1 : year}-${String(month === 0 ? 12 : month).padStart(2, '0')}-${String(daysInPrevMonth - i).padStart(2, '0')}`
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
      dateStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    });
  }
  
  // Next month days to fill up to 42 (6 rows)
  const remainingDays = 42 - calendarDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      dateStr: `${month === 11 ? year + 1 : year}-${String(month === 11 ? 1 : month + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    });
  }

  const getAttendanceForDay = (dateStr: string) => {
    return attendances.find(a => a.date === dateStr);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400';
      case 'ABSENT':
        return 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400';
      case 'HALF_DAY':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400';
      case 'LATE':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400';
      default:
        return 'border-transparent text-foreground';
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-border/50 gap-4 bg-secondary/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              {monthNames[month]} {year}
            </h3>
            <p className="text-xs text-muted-foreground font-medium">Monthly Attendance View</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={resetToToday} 
            className="px-3 py-1.5 text-xs font-semibold bg-secondary hover:bg-secondary/80 rounded-md transition-colors mr-2"
          >
            Today
          </button>
          <div className="flex bg-secondary rounded-lg p-0.5 border border-border/50">
            <button onClick={prevMonth} className="p-1.5 hover:bg-background rounded-md transition-all text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="w-px bg-border/50 mx-0.5" />
            <button onClick={nextMonth} className="p-1.5 hover:bg-background rounded-md transition-all text-muted-foreground hover:text-foreground">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 p-4 md:p-6 bg-card/40">
        <div className="grid grid-cols-7 gap-px bg-border/50 rounded-xl overflow-hidden shadow-[0_0_0_1px_var(--border)]">
          {/* Day Headers */}
          {dayNames.map(day => (
            <div key={day} className="bg-secondary/40 text-center py-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              {day}
            </div>
          ))}
          
          {/* Calendar Cells */}
          {calendarDays.map((cell, index) => {
            const attendance = getAttendanceForDay(cell.dateStr);
            const isToday = cell.isCurrentMonth && 
                            cell.day === new Date().getDate() && 
                            month === new Date().getMonth() && 
                            year === new Date().getFullYear();

            return (
              <div 
                key={index} 
                className={`
                  bg-card min-h-[80px] p-2 flex flex-col transition-all relative group cursor-default
                  ${!cell.isCurrentMonth ? 'opacity-40 bg-secondary/10' : 'hover:bg-secondary/10'}
                `}
              >
                {/* Date Number */}
                <div className="flex justify-between items-start w-full">
                  <span className={`
                    w-7 h-7 flex items-center justify-center text-sm rounded-full font-medium z-10
                    ${isToday 
                      ? 'bg-primary text-primary-foreground font-bold shadow-md shadow-primary/30' 
                      : 'text-foreground/80'}
                  `}>
                    {cell.day}
                  </span>
                </div>

                {/* Status Indicator */}
                {attendance && (
                  <div className="mt-auto pt-1 w-full flex flex-col gap-1 z-10 relative">
                    <div className={`text-[10px] font-semibold px-2 py-1 rounded-md border ${getStatusStyles(attendance.status)} truncate w-full text-center transition-all group-hover:scale-[1.02]`}>
                      {attendance.status.replace('_', ' ')}
                    </div>
                  </div>
                )}
                
                {/* Subtle Hover Background Effect for interactive feel */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 md:gap-8 pt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-md bg-emerald-500/20 border border-emerald-500/50" /> Present
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-md bg-amber-500/20 border border-amber-500/50" /> Half Day
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-md bg-blue-500/20 border border-blue-500/50" /> Late
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-md bg-rose-500/20 border border-rose-500/50" /> Absent
          </div>
        </div>
      </div>
    </div>
  );
}
