import React from 'react';
import { cn } from '../../lib/utils.ts';

export type StatusType =
  | 'confirmed'
  | 'waitlisted'
  | 'pending_verification'
  | 'cancelled'
  | 'expired'
  | 'published'
  | 'draft'
  | 'archived'
  | 'present'
  | 'absent'
  | 'unmarked';

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const configs: Record<string, { label: string; dotClass: string; textClass: string }> = {
    confirmed: {
      label: 'Confirmed',
      dotClass: 'bg-emerald-500',
      textClass: 'text-emerald-700 dark:text-emerald-400 font-medium',
    },
    waitlisted: {
      label: 'Waitlisted',
      dotClass: 'bg-amber-500',
      textClass: 'text-amber-700 dark:text-amber-400 font-medium',
    },
    pending_verification: {
      label: 'Pending Verification',
      dotClass: 'bg-sky-500',
      textClass: 'text-sky-700 dark:text-sky-400 font-medium',
    },
    cancelled: {
      label: 'Cancelled',
      dotClass: 'bg-slate-400',
      textClass: 'text-slate-500 dark:text-slate-400 line-through',
    },
    expired: {
      label: 'Expired',
      dotClass: 'bg-red-400',
      textClass: 'text-red-600 dark:text-red-400',
    },
    published: {
      label: 'Published',
      dotClass: 'bg-emerald-500',
      textClass: 'text-emerald-700 dark:text-emerald-400 font-medium',
    },
    draft: {
      label: 'Draft',
      dotClass: 'bg-slate-400',
      textClass: 'text-slate-600 dark:text-slate-400',
    },
    archived: {
      label: 'Archived',
      dotClass: 'bg-slate-300',
      textClass: 'text-slate-400',
    },
    present: {
      label: 'Present',
      dotClass: 'bg-emerald-500',
      textClass: 'text-emerald-700 dark:text-emerald-400 font-semibold',
    },
    absent: {
      label: 'Absent',
      dotClass: 'bg-rose-500',
      textClass: 'text-rose-700 dark:text-rose-400',
    },
    unmarked: {
      label: 'Unmarked',
      dotClass: 'bg-slate-400',
      textClass: 'text-slate-500 dark:text-slate-400',
    },
  };

  const config = configs[status] || {
    label: status.replace(/_/g, ' '),
    dotClass: 'bg-slate-400',
    textClass: 'text-slate-600 dark:text-slate-400',
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs tracking-tight', config.textClass, className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dotClass)} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
}
