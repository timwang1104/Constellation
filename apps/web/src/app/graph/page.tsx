'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { DependencyGraph } from '@/components/graph/DependencyGraph';
import { initialTasks, initialDependencies } from '@/data/mock';

export default function GraphPage() {
  return (
    <main className="flex flex-col h-screen bg-concrete-light font-sans text-ink-black selection:bg-status-agent selection:text-white">
      <Navbar />
      
      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-ink-black flex items-center gap-2">
            <span className="text-status-agent">⚡</span> Project Talent Tree
          </h1>
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-[2px] border border-concrete-rough shadow-sm">
            <span className="text-xs text-ink-medium flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-status-blocked"></span> Blocked
            </span>
            <span className="text-xs text-ink-medium flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-status-inprogress"></span> In Progress
            </span>
            <span className="text-xs text-ink-medium flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-status-done"></span> Learned (Done)
            </span>
             <span className="text-xs text-ink-medium flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-concrete-rough border border-ink-light"></span> Available
            </span>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-[2px] shadow-sm border border-concrete-rough relative overflow-hidden">
          <div className="absolute inset-0 z-0">
             <DependencyGraph tasks={initialTasks} dependencies={initialDependencies} />
          </div>
        </div>
      </div>
    </main>
  );
}
