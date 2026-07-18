"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function LiveClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // Avoid hydration mismatch by setting time after mount
    setTime(new Date());
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (!time) return <div className="h-24 w-full bg-secondary/50 animate-pulse rounded-xl" />;

  const formatNumber = (num: number) => num.toString().padStart(2, '0');
  
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  const displayHours = hours % 12 || 12;

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
        Current Time
      </div>
      
      <div className="flex items-end gap-2 text-foreground font-mono font-bold tracking-tight">
        <motion.div 
          key={displayHours}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-7xl tabular-nums bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent"
        >
          {formatNumber(displayHours)}
        </motion.div>
        
        <div className="text-5xl md:text-6xl pb-1.5 animate-pulse text-primary/70">:</div>
        
        <motion.div 
          key={minutes}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-7xl tabular-nums bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent"
        >
          {formatNumber(minutes)}
        </motion.div>
        
        <div className="flex flex-col items-start ml-2 pb-2">
          <motion.div 
            key={seconds}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-2xl text-primary font-bold tabular-nums"
          >
            {formatNumber(seconds)}
          </motion.div>
          <div className="text-lg font-bold text-muted-foreground">
            {ampm}
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm font-medium text-muted-foreground">
        {time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
}
