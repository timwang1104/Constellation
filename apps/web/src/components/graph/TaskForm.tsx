import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority } from '@/types/kanban';
import { Button } from '@/components/ui/Button';

interface TaskFormProps {
  initialData?: Partial<Task>;
  onSubmit: (data: Omit<Task, 'id'>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function TaskForm({ initialData, onSubmit, onCancel, onDelete }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [status, setStatus] = useState<TaskStatus>(initialData?.status || 'todo');
  const [priority, setPriority] = useState<TaskPriority>(initialData?.priority || 'medium');
  const [description, setDescription] = useState(initialData?.description || '');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      status,
      priority,
      description,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      assignee: initialData?.assignee // Preserve assignee for now as we don't have a user selector yet
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="frontend, bug, urgent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div className="flex justify-between items-center pt-2">
        {onDelete && (
          <Button variant="destructive" onClick={onDelete} type="button">
            Delete
          </Button>
        )}
        <div className="flex gap-2 ml-auto">
          <Button variant="ghost" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}
