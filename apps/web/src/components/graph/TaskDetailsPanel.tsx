import React from 'react';
import { Task } from '@/types/kanban';
import { cn } from '@/lib/utils';
import { X, Calendar, User, Hash, Tag, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TaskDetailsPanelProps {
  task: Task | null;
  onClose: () => void;
  onEdit: (task: Task) => void;
}

export function TaskDetailsPanel({ task, onClose, onEdit }: TaskDetailsPanelProps) {
  if (!task) return null;

  const isDone = task.status === 'done';
  const isInProgress = task.status === 'inprogress';
  const isBlocked = task.status === 'blocked';

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[500px] bg-white rounded-lg shadow-xl border border-concrete-rough z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start justify-between p-4 border-b border-concrete-rough bg-concrete-light/30">
        <div className="flex-1 pr-4">
          <h3 className="text-lg font-bold text-ink-black leading-tight">{task.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn(
              "text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded",
              isDone ? "bg-green-100 text-green-700" :
              isInProgress ? "bg-blue-100 text-blue-700" :
              isBlocked ? "bg-red-100 text-red-700" :
              "bg-gray-100 text-gray-700"
            )}>
              {task.status}
            </span>
            <span className={cn(
              "text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded",
              task.priority === 'high' ? "bg-red-50 text-red-600" :
              task.priority === 'medium' ? "bg-orange-50 text-orange-600" :
              "bg-blue-50 text-blue-600"
            )}>
              {task.priority} Priority
            </span>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 text-ink-medium hover:text-ink-black">
          <X size={18} />
        </Button>
      </div>

      <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
        {task.description && (
          <div className="text-sm text-ink-dark leading-relaxed whitespace-pre-wrap">
            {task.description}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-2">
          {task.assignee && (
            <div className="flex items-center gap-2 text-sm text-ink-dark">
              <User size={14} className="text-ink-medium" />
              <span>{task.assignee.name}</span>
            </div>
          )}
          
          {task.dueDate && (
            <div className="flex items-center gap-2 text-sm text-ink-dark">
              <Calendar size={14} className="text-ink-medium" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {task.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 text-xs bg-concrete-rough px-2 py-1 rounded text-ink-dark">
                <Tag size={10} className="text-ink-medium" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-concrete-rough bg-concrete-light/30 flex justify-end gap-2">
        <Button variant="secondary" size="sm" onClick={() => onEdit(task)}>
          Edit Task
        </Button>
      </div>
    </div>
  );
}
