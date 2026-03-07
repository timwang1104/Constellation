'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { DependencyGraph } from '@/components/graph/DependencyGraph';
import { EpicSelector } from '@/components/graph/EpicSelector';
import { GraphModals } from '@/components/graph/GraphModals';
import { Task, Dependency, Epic, Project } from '@/types/kanban';
import { Connection } from 'reactflow';
import { Button } from '@/components/ui/Button';
import { Plus, Save } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { initialEpics } from '@/data/mock';
import { useGraphModals } from '@/hooks/useGraphModals';
import { generateId } from '@/lib/id-generator';

export default function GraphPage() {
  const { 
    tasks, 
    dependencies, 
    epics,
    projects,
    addTask, 
    updateTask, 
    deleteTasks, 
    addDependency, 
    removeDependencies,
    addEpic,
    updateEpic,
    deleteEpic,
    addProject,
    updateProject,
    deleteProject
  } = useTaskContext();

  const modals = useGraphModals();
  const {
    openAddTaskModal,
    openEditTaskModal,
    closeTaskModal,
    closeEpicModal,
    closeProjectModal,
    editingTask,
    editingEpic,
    editingProject
  } = modals;

  // State
  const [selectedEpicId, setSelectedEpicId] = useState<string>(initialEpics[0].id);
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
      id: generateId('task-'),
      tags: taskData.tags || [],
      epicId: selectedEpicId, // Auto-assign to current epic
    };
    addTask(newTask);
    closeTaskModal();
  };

  const handleEditTask = (taskData: Omit<Task, 'id'>) => {
    if (!editingTask) return;
    updateTask({ ...editingTask, ...taskData });
    closeTaskModal();
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
      id: generateId('dep-'),
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
    closeTaskModal();
  };

  const handleAddEpic = (epicData: Omit<Epic, 'id'>) => {
    const newEpic: Epic = {
      ...epicData,
      id: generateId('epic-'),
    };
    addEpic(newEpic);
    closeEpicModal();
    setSelectedEpicId(newEpic.id); // Switch to new epic
  };

  const handleEditEpic = (epicData: Omit<Epic, 'id'>) => {
    if (!editingEpic) return;
    updateEpic({ ...editingEpic, ...epicData });
    closeEpicModal();
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
    closeEpicModal();
  };

  const handleConfirmDeleteEpic = (epicId: string) => {
    const epicToDelete = epics.find(e => e.id === epicId);
    if (epicToDelete) {
      if (window.confirm(`Are you sure you want to delete epic "${epicToDelete.title}"?`)) {
        if (selectedEpicId === epicId) {
            const otherEpic = epics.find(e => e.id !== epicId);
            if (otherEpic) {
              setSelectedEpicId(otherEpic.id);
            }
        }
        deleteEpic(epicId);
        closeEpicModal();
      }
    }
  };
  
  const handleConfirmDeleteProject = (projectId: string) => {
      const projectToDelete = projects.find(p => p.id === projectId);
      if (projectToDelete) {
          if (window.confirm(`Are you sure you want to delete project "${projectToDelete.name}"?`)) {
              deleteProject(projectId);
              closeProjectModal();
          }
      }
  };

  // Project Handlers
  const handleAddProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: generateId('proj-'),
    };
    addProject(newProject);
    closeProjectModal();
  };

  const handleEditProject = (projectData: Omit<Project, 'id'>) => {
    if (!editingProject) return;
    updateProject({ ...editingProject, ...projectData });
    closeProjectModal();
  };

  const handleDeleteProject = () => {
    if (!editingProject) return;
    if (window.confirm('Are you sure you want to delete this project?')) {
       deleteProject(editingProject.id);
       closeProjectModal();
    }
  };

  return (
    <main className="flex flex-col h-screen bg-concrete-light font-sans text-ink-black selection:bg-status-agent selection:text-white overflow-hidden">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Epic Selector */}
        <EpicSelector 
          projects={projects}
          epics={epics} 
          selectedEpicId={selectedEpicId} 
          onSelect={setSelectedEpicId}
          onAddProject={modals.openAddProjectModal}
          onAddEpic={modals.openAddEpicModal}
          onEditEpic={modals.openEditEpicModal}
          onDeleteEpic={handleConfirmDeleteEpic}
          onDeleteProject={handleConfirmDeleteProject}
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
                onClick={openAddTaskModal}
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
              onNodeDoubleClick={openEditTaskModal}
              onDeleteNodes={handleDeleteNodes}
              onDeleteEdges={handleDeleteEdges}
            />
          </div>
        </div>
      </div>

      <GraphModals 
        modals={modals}
        projects={projects}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteSingleTask}
        onAddEpic={handleAddEpic}
        onEditEpic={handleEditEpic}
        onDeleteEpic={handleDeleteEpic}
        onAddProject={handleAddProject}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
      />
    </main>
  );
}
