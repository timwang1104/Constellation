import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'agent' | 'inprogress';
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-ink-black text-concrete-pure hover:bg-ink-dark",
    secondary: "border-transparent bg-concrete-rough text-ink-black hover:bg-concrete-light",
    outline: "text-ink-black border-ink-light",
    destructive: "border-transparent bg-status-blocked text-white hover:bg-red-800", // Blocked
    success: "border-transparent bg-status-done text-white hover:bg-green-700", // Done
    agent: "border-transparent bg-status-agent text-white hover:bg-purple-800", // Agent
    inprogress: "border-transparent bg-status-inprogress text-white hover:bg-blue-800", // In Progress
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-[2px] border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
