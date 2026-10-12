import React from 'react';
import clsx from 'clsx';
export function Card({ children, className, glow }: { children: React.ReactNode, className?: string, glow?: boolean }) {
  return (
    <div className={clsx("bg-background-surface border rounded-xl p-6 relative overflow-hidden", glow ? "border-accent/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]" : "border-border", className)}>
      {children}
    </div>
  );
}
