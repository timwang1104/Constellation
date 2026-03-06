'use client';

import React, { useState, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { DependencyGraph } from '@/components/graph/DependencyGraph';
import { initialTasks, initialDependencies } from '@/data/mock';
import { Task, Dependency } from '@/types/kanban';
import { Connection } from 'reactflow';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { TaskForm } from '@/components/graph/TaskForm';
import { Plus } from 'lucide-react';

export default function GraphPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [dependencies, setDependencies] = useState<Dependency[]>(initialDependencies);
  
  // Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Handlers
  const handleAddTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9), // Simple ID generation
    };
    setTasks((prev) => [...prev, newTask]);
    setIsTaskModalOpen(false);
  };

  const handleEditTask = (taskData: Omit<Task, 'id'>) => {
    if (!editingTask) return;
    setTasks((prev) => 
      prev.map((t) => (t.id === editingTask.id ? { ...t, ...taskData } : t))
    );
    setEditingTask(null);
    setIsTaskModalOpen(false);
  };

  const handleDeleteNodes = useCallback((taskIds: string[]) => {
    setTasks((prev) => prev.filter((t) => !taskIds.includes(t.id)));
    setDependencies((prev) => 
      prev.filter((d) => !taskIds.includes(d.source) && !taskIds.includes(d.target))
    );
  }, []);

  const handleDeleteEdges = useCallback((dependencyIds: string[]) => {
    setDependencies((prev) => prev.filter((d) => !dependencyIds.includes(d.id)));
  }, []);

  const handleConnect = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target) return;
    
    // Check if dependency already exists
    const exists = dependencies.some(
      (d) => d.source === connection.source && d.target === connection.target
    );
    if (exists) return;

    const newDependency: Dependency = {
      id: `d-${Date.now()}`,
      source: connection.source,
      target: connection.target,
      type: 'finish_to_start',
    };
    setDependencies((prev) => [...prev, newDependency]);
  }, [dependencies]);

  const handleDeleteSingleTask = () => {
    if (!editingTask) return;
    setTasks((prev) => prev.filter((t) => t.id !== editingTask.id));
    setDependencies((prev) => 
      prev.filter((d) => d.source !== editingTask.id && d.target !== editingTask.id)
    );
    setEditingTask(null);
    setIsTaskModalOpen(false);
  };

  const openAddModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  return (
    <main className="flex flex-col h-screen bg-concrete-light font-sans text-ink-black selection:bg-status-agent selection:text-white">
      <Navbar />
      
      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-ink-black flex items-center gap-2">
              <span className="text-status-agent">⚡</span> Project Talent Tree
            </h1>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={openAddModal}
              className="gap-2"
            >
              <Plus size={16} />
              Add Task
            </Button>
          </div>

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
             <DependencyGraph 
               tasks={tasks} 
               dependencies={dependencies} 
               onConnect={handleConnect}
               onNodeDoubleClick={openEditModal}
               onDeleteNodes={handleDeleteNodes}
               onDeleteEdges={handleDeleteEdges}
             />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
      >
        <TaskForm
          initialData={editingTask || {}}
          onSubmit={editingTask ? handleEditTask : handleAddTask}
          onCancel={() => setIsTaskModalOpen(false)}
          onDelete={editingTask ? handleDeleteSingleTask : undefined}
        />
      </Modal>
    </main>
  );
}
