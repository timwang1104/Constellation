'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { DependencyGraph } from '@/components/graph/DependencyGraph';
import { EpicSelector } from '@/components/graph/EpicSelector';
import { EpicForm } from '@/components/graph/EpicForm';
import { Task, Dependency, Epic } from '@/types/kanban';
import { Connection } from 'reactflow';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { TaskForm } from '@/components/graph/TaskForm';
import { Plus, Save } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { initialEpics } from '@/data/mock';

export default function GraphPage() {
  const { 
    tasks, 
    dependencies, 
    epics,
    addTask, 
    updateTask, 
    deleteTasks, 
    addDependency, 
    removeDependencies,
    addEpic,
    updateEpic,
    deleteEpic
  } = useTaskContext();

  // State
  const [selectedEpicId, setSelectedEpicId] = useState<string>(initialEpics[0].id);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEpicModalOpen, setIsEpicModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingEpic, setEditingEpic] = useState<Epic | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save feedback
  React.useEffect(() => {
    setLastSaved(new Date());
  }, [tasks, dependencies, epics]);

  // Filter Tasks and Dependencies
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => task.epicId === selectedEpicId);
  }, [tasks, selectedEpicId]);

  const filteredDependencies = useMemo(() => {
    const taskIds = new Set(filteredTasks.map(t => t.id));
    return dependencies.filter(dep => taskIds.has(dep.source) && taskIds.has(dep.target));
  }, [dependencies, filteredTasks]);

  // Handlers
  const handleAddTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9), // Simple ID generation
      tags: taskData.tags || [],
      epicId: selectedEpicId, // Auto-assign to current epic
    };
    addTask(newTask);
    setIsTaskModalOpen(false);
  };

  const handleEditTask = (taskData: Omit<Task, 'id'>) => {
    if (!editingTask) return;
    updateTask({ ...editingTask, ...taskData });
    setEditingTask(null);
    setIsTaskModalOpen(false);
  };

  const handleDeleteNodes = useCallback((taskIds: string[]) => {
    deleteTasks(taskIds);
  }, [deleteTasks]);

  const handleDeleteEdges = useCallback((dependencyIds: string[]) => {
    removeDependencies(dependencyIds);
  }, [removeDependencies]);

  const handleConnect = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target) return;
    
    const newDependency: Dependency = {
      id: `d-${Date.now()}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      type: 'finish_to_start',
    };
    addDependency(newDependency);
  }, [addDependency]);

  const handleDeleteSingleTask = () => {
    if (!editingTask) return;
    deleteTasks([editingTask.id]);
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

  const handleAddEpic = (epicData: Omit<Epic, 'id'>) => {
    const newEpic: Epic = {
      ...epicData,
      id: `epic-${Date.now()}`,
    };
    addEpic(newEpic);
    setIsEpicModalOpen(false);
    setSelectedEpicId(newEpic.id); // Switch to new epic
  };

  const handleEditEpic = (epicData: Omit<Epic, 'id'>) => {
    if (!editingEpic) return;
    updateEpic({ ...editingEpic, ...epicData });
    setEditingEpic(null);
    setIsEpicModalOpen(false);
  };

  const handleDeleteEpic = () => {
    if (!editingEpic) return;
    
    // Switch to another epic if we're deleting the current one
    if (selectedEpicId === editingEpic.id) {
      const otherEpic = epics.find(e => e.id !== editingEpic.id);
      if (otherEpic) {
        setSelectedEpicId(otherEpic.id);
      }
    }
    
    deleteEpic(editingEpic.id);
    setEditingEpic(null);
    setIsEpicModalOpen(false);
  };

  const openAddEpicModal = () => {
    setEditingEpic(null);
    setIsEpicModalOpen(true);
  };

  const openEditEpicModal = (epic: Epic) => {
    setEditingEpic(epic);
    setIsEpicModalOpen(true);
  };

  const handleConfirmDeleteEpic = (epicId: string) => {
    const epicToDelete = epics.find(e => e.id === epicId);
    if (epicToDelete) {
      // Use window.confirm for quick shortcut action
      if (window.confirm(`Are you sure you want to delete epic "${epicToDelete.title}"?`)) {
        if (selectedEpicId === epicId) {
            const otherEpic = epics.find(e => e.id !== epicId);
            if (otherEpic) {
              setSelectedEpicId(otherEpic.id);
            }
        }
        deleteEpic(epicId);
        setIsEpicModalOpen(false); // Close if open
        setEditingEpic(null);
      }
    }
  };

  return (
    <main className="flex flex-col h-screen bg-concrete-light font-sans text-ink-black selection:bg-status-agent selection:text-white overflow-hidden">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Epic Selector */}
        <EpicSelector 
          epics={epics} 
          selectedEpicId={selectedEpicId} 
          onSelect={setSelectedEpicId}
          onAddEpic={openAddEpicModal}
          onEditEpic={openEditEpicModal}
          onDeleteEpic={handleConfirmDeleteEpic}
        />

        {/* Right Column: Dependency Graph */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-concrete-light relative">
          <div className="absolute top-4 right-4 z-10 flex gap-2 items-center">
            {lastSaved && (
              <span className="text-xs text-ink-medium mr-2 flex items-center gap-1 bg-white/80 px-2 py-1 rounded backdrop-blur-sm border border-concrete-rough shadow-sm">
                <Save size={12} />
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
             <Button 
                variant="primary" 
                size="sm" 
                onClick={openAddModal}
                className="gap-2 shadow-lg"
              >
                <Plus size={16} />
                Add Task
              </Button>
          </div>

          <div className="flex-1 w-full h-full">
            <DependencyGraph 
              tasks={filteredTasks} 
              dependencies={filteredDependencies}
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
        title={editingTask ? "Edit Task" : "New Task"}
      >
        <TaskForm
          initialData={editingTask || undefined}
          onSubmit={editingTask ? handleEditTask : handleAddTask}
          onDelete={editingTask ? handleDeleteSingleTask : undefined}
          onCancel={() => setIsTaskModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEpicModalOpen}
        onClose={() => setIsEpicModalOpen(false)}
        title={editingEpic ? "Edit Epic" : "New Epic"}
      >
        <EpicForm
          initialData={editingEpic || undefined}
          onSubmit={editingEpic ? (data) => handleEditEpic(data) : (data) => handleAddEpic(data)}
          onDelete={editingEpic ? handleDeleteEpic : undefined}
          onCancel={() => setIsEpicModalOpen(false)}
        />
      </Modal>
    </main>
  );
}
