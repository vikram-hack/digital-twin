import React from 'react';
import clsx from 'clsx';
export function Badge({ children, variant = 'normal' }: { children: React.ReactNode, variant?: 'normal'|'compromised'|'at-risk'|'critical'|'protected'|'blocked'|'low'|'medium'|'high' }) {
  const variants = {
    normal: 'bg-accent/10 text-accent border border-accent/20',
    compromised: 'bg-danger/10 text-danger border border-danger/20',
    'at-risk': 'bg-warning/10 text-warning border border-warning/20',
    critical: 'bg-critical/10 text-critical border border-critical/20',
    protected: 'bg-success/10 text-success border border-success/20',
    blocked: 'bg-gray-800 text-gray-400 border border-gray-700',
    low: 'bg-green-500/10 text-green-500 border border-green-500/20',
    medium: 'bg-warning/10 text-warning border border-warning/20',
    high: 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
  };
  return <span className={clsx("px-2 py-1 text-xs rounded-md font-medium inline-block", variants[variant] || variants.normal)}>{children}</span>;
}
