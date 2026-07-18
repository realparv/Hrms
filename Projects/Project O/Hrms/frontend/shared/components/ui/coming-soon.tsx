"use client";

import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';

interface ComingSoonProps {
  title: string;
  icon: LucideIcon;
  description?: string;
}

export function ComingSoon({ title, icon: Icon, description }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
      <Card className="w-full max-w-md bg-card/60 glass-panel border-0 shadow-premium">
        <CardContent className="flex flex-col items-center text-center p-10">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary animate-pulse">
            <Icon className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">{title}</h2>
          <p className="text-muted-foreground mb-6">
            {description || 'This module is currently under development. Stay tuned for updates!'}
          </p>
          <div className="inline-flex items-center justify-center px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
            Coming Soon
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
