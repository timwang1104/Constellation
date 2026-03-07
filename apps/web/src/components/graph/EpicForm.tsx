import React, { useState } from 'react';
import { Epic, TaskStatus } from '@/types/kanban';
import { Button } from '@/components/ui/Button';

interface EpicFormProps {
  initialData?: Partial<Epic>;
  onSubmit: (data: Omit<Epic, 'id'>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function EpicForm({ initialData, onSubmit, onCancel, onDelete }: EpicFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [status, setStatus] = useState<TaskStatus>(initialData?.status || 'todo');
  const [progress, setProgress] = useState(initialData?.progress || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      status,
      progress,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="blocked">Blocked</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t mt-4">
        {onDelete && (
          <Button variant="destructive" onClick={onDelete} type="button">
            Delete Epic
          </Button>
        )}
        <div className="flex gap-2 ml-auto">
          <Button variant="ghost" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {initialData ? 'Update Epic' : 'Create Epic'}
          </Button>
        </div>
      </div>
    </form>
  );
}
