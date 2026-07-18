"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User as UserIcon, Mail, Phone, Building, Shield } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { authService } from '@/features/auth/services/authService';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone_number: user?.phone_number || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !user) return null;

  const getInitials = () => {
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updatedUser = await authService.updateProfile(formData);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
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
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="bg-card text-card-foreground w-full max-w-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-border/40 overflow-hidden relative"
        >
          {/* Elegant Themed Header */}
          <div className="h-32 w-full relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border/40">
            {/* Subtle background pattern/glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-background/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all backdrop-blur-sm border border-border/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Avatar */}
          <div className="px-8 pb-8 relative -mt-16">
            <div className="w-28 h-28 rounded-full bg-card flex items-center justify-center text-3xl font-bold text-primary border-4 border-card shadow-lg relative mb-6">
              <div className="absolute inset-0 rounded-full bg-primary/10"></div>
              <span className="relative z-10">{getInitials()}</span>
            </div>

            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1">
                  {user.first_name} {user.last_name}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-primary/10 text-primary uppercase tracking-wide">
                  <Shield className="w-3 h-3" />
                  {user.role}
                </span>
              </div>
              <button
                onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                className="px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors border border-border/50 shadow-sm"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone Number</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3.5 rounded-xl bg-secondary/40 border border-border/40 transition-colors hover:bg-secondary/60">
                  <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-muted-foreground shadow-sm border border-border/50">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Email Address</p>
                    <p className="font-medium text-sm text-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3.5 rounded-xl bg-secondary/40 border border-border/40 transition-colors hover:bg-secondary/60">
                  <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-muted-foreground shadow-sm border border-border/50">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Phone Number</p>
                    <p className="font-medium text-sm text-foreground">{user.phone_number || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3.5 rounded-xl bg-secondary/40 border border-border/40 transition-colors hover:bg-secondary/60">
                  <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center text-muted-foreground shadow-sm border border-border/50">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">Organization ID</p>
                    <p className="font-medium text-sm text-foreground">{user.organization || 'Platform Level'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
