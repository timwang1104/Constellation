import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";

// Since I don't have CVA installed, I'll implement a simpler version or just install it.
// Actually, CVA is great for this. Let me install `class-variance-authority` quickly.
// Or I can just write standard React components with props. Let's stick to simple props first to avoid too many dependencies, 
// but wait, CVA is standard in Shadcn/UI which I recommended.
// I'll install `class-variance-authority` and `@radix-ui/react-slot` to be proper.

// Wait, I can't install too many things without user approval/time.
// I'll stick to `clsx` and `tailwind-merge` which I already installed.
// I will implement Button without CVA for now to be fast.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center rounded-[2px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink-black disabled:pointer-events-none disabled:opacity-50 shadow-sm";
    
    const variants = {
      primary: "bg-ink-black text-concrete-pure hover:bg-ink-dark shadow-sm", // Ink Black as primary for Ando style
      secondary: "bg-concrete-rough text-ink-black hover:bg-concrete-light",
      ghost: "hover:bg-concrete-rough text-ink-dark hover:text-ink-black shadow-none",
      destructive: "bg-status-blocked text-concrete-pure hover:bg-red-900",
      outline: "border border-ink-light bg-transparent hover:bg-concrete-rough text-ink-black shadow-none"
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-12 px-8 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
