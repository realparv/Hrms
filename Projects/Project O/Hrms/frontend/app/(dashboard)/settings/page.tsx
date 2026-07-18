"use client";

import { Settings as SettingsIcon } from 'lucide-react';
import { ComingSoon } from '@/shared/components/ui/coming-soon';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-1">
          Configure your organization, module preferences, and integrations.
        </p>
      </div>

      <ComingSoon 
        title="Settings & Configuration" 
        icon={SettingsIcon} 
        description="The settings module is being built right now. Soon you'll be able to customize your workspace, manage roles, and integrate with external tools."
      />
    </div>
  );
}
