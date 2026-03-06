'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { 
  Bot, User, AlertCircle, CheckCircle2, Lock, 
  Layout, Database, Server, FileText, CreditCard, Code, Cloud, Settings, Zap
} from 'lucide-react';
import { Task } from '@/types/kanban';
import { cn } from '@/lib/utils';

const getIconForTask = (tags: string[]) => {
  if (tags.includes('frontend')) return <Layout size={24} />;
  if (tags.includes('backend')) return <Database size={24} />;
  if (tags.includes('infra')) return <Cloud size={24} />;
  if (tags.includes('devops')) return <Settings size={24} />;
  if (tags.includes('docs')) return <FileText size={24} />;
  if (tags.includes('payment')) return <CreditCard size={24} />;
  return <Code size={24} />;
};

export function TaskNode({ data }: NodeProps<Task>) {
  const task = data;
  const isBlocked = task.status === 'blocked';
  const isDone = task.status === 'done';
  const isInProgress = task.status === 'inprogress';
  const isAgent = task.assignee?.type === 'agent';

  // Talent Tree Styles
  // Done: Gold border, full color
  // In Progress: Blue/Magic border, full color
  // Blocked: Red/Gray border, desaturated, Lock icon
  // Todo: Silver/Gray border, slightly desaturated

  const containerStyle = cn(
    "relative w-16 h-16 rounded-lg border-[3px] shadow-lg flex items-center justify-center transition-all duration-300 group cursor-pointer bg-white",
    isDone ? "border-status-done shadow-green-500/20" :
    isInProgress ? "border-status-inprogress shadow-blue-500/20 animate-pulse-slow" :
    isBlocked ? "border-status-blocked/50 opacity-80 grayscale-[0.5]" :
    "border-concrete-rough hover:border-ink-medium"
  );

  const iconColor = cn(
    "transition-colors duration-300",
    isDone ? "text-status-done" :
    isInProgress ? "text-status-inprogress" :
    isBlocked ? "text-status-blocked" :
    "text-ink-light group-hover:text-ink-medium"
  );

  return (
    <div className="relative group">
      {/* Tooltip */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 bg-white text-ink-black p-3 rounded-md shadow-ando border border-concrete-rough opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
        <div className="flex justify-between items-start mb-1">
          <span className="font-bold text-sm text-ink-black">{task.title}</span>
          <span className="text-xs font-mono text-ink-medium">#{task.id}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <span className={cn(
            "text-[10px] px-1.5 py-0.5 rounded-[2px] uppercase font-bold tracking-wider",
            isDone ? "bg-green-50 text-status-done" :
            isInProgress ? "bg-blue-50 text-status-inprogress" :
            isBlocked ? "bg-red-50 text-status-blocked" :
            "bg-concrete-rough text-ink-medium"
          )}>
            {task.status}
          </span>
          <span className={cn(
            "text-[10px] px-1.5 py-0.5 rounded-[2px] uppercase font-bold tracking-wider",
            task.priority === 'high' ? "text-red-600" :
            task.priority === 'medium' ? "text-orange-500" : "text-blue-500"
          )}>
            {task.priority} Priority
          </span>
        </div>

        {task.assignee && (
          <div className="flex items-center gap-2 text-xs text-ink-medium border-t border-concrete-rough pt-2 mt-2">
            <span className="flex items-center gap-1">
              {isAgent ? <Bot size={12} className="text-status-agent" /> : <User size={12} className="text-status-inprogress" />}
              <span className="text-ink-dark">{task.assignee.name}</span>
            </span>
          </div>
        )}
      </div>

      {/* Main Node */}
      <div className={containerStyle}>
        <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 w-full h-full absolute top-0 left-0 z-10" isConnectable={false} />
        
        <div className={iconColor}>
          {getIconForTask(task.tags)}
        </div>

        {/* Status Badges */}
        {isBlocked && (
          <div className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 border border-status-blocked shadow-sm">
            <Lock size={12} className="text-status-blocked" />
          </div>
        )}
        
        {isDone && (
          <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-0.5 border border-status-done shadow-sm">
            <CheckCircle2 size={12} className="text-status-done" />
          </div>
        )}

        {/* Rank/Points (Optional WoW flavor) */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white text-[10px] font-mono text-ink-medium px-1.5 rounded border border-concrete-rough shadow-sm">
          {isDone ? '1/1' : '0/1'}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-ink-light !w-2 !h-2 !border-0 !bottom-0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
