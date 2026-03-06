"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Network, Layers, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="h-16 border-b border-ink-light bg-concrete-pure px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-ink-black flex items-center justify-center rounded-[2px]">
            <span className="text-white font-mono font-bold">C</span>
          </div>
          <span className="font-sans font-bold text-lg tracking-tight text-ink-black">Constellation</span>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-concrete-rough p-1 rounded-[2px] gap-1">
          <NavLink href="/" icon={<LayoutGrid size={16} />} label="Board" isActive={pathname === '/'} />
          <NavLink href="/graph" icon={<Network size={16} />} label="Graph" isActive={pathname === '/graph'} />
          <NavLink href="/arch" icon={<Layers size={16} />} label="Arch" isActive={pathname === '/arch'} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Agent Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-concrete-light rounded-[2px] border border-concrete-rough">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-agent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-status-agent"></span>
          </span>
          <span className="text-xs font-mono text-ink-dark">2 Agents Active</span>
        </div>

        {/* Actions */}
        <button className="p-2 text-ink-medium hover:text-ink-black transition-colors">
          <Bell size={20} />
        </button>
        <button className="h-8 w-8 bg-concrete-rough rounded-full flex items-center justify-center text-ink-dark hover:bg-concrete-light transition-colors">
          <User size={16} />
        </button>
      </div>
    </nav>
  );
}

function NavLink({ href, icon, label, isActive }: { href: string; icon: React.ReactNode; label: string; isActive?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-[2px] text-sm font-medium transition-all",
        isActive
          ? "bg-white text-ink-black shadow-sm"
          : "text-ink-medium hover:text-ink-black hover:bg-white/50"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
