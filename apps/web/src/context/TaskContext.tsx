'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task, Dependency, Epic } from '@/types/kanban';
import { initialTasks, initialDependencies, initialEpics } from '@/data/mock';

const STORAGE_KEY = 'constellation_graph_data';

interface TaskContextType {
  tasks: Task[];
  dependencies: Dependency[];
  epics: Epic[];
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTasks: (taskIds: string[]) => void;
  addDependency: (dependency: Dependency) => void;
  removeDependencies: (dependencyIds: string[]) => void;
  addEpic: (epic: Epic) => void;
  updateEpic: (epic: Epic) => void;
  deleteEpic: (epicId: string) => void;
  resetData: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [dependencies, setDependencies] = useState<Dependency[]>(initialDependencies);
  const [epics, setEpics] = useState<Epic[]>(initialEpics);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed.tasks)) {
             setTasks(parsed.tasks);
        }
        if (Array.isArray(parsed.dependencies)) {
            setDependencies(parsed.dependencies);
        }
        if (Array.isArray(parsed.epics)) {
            setEpics(parsed.epics);
        }
      } catch (e) {
        console.error('Failed to load graph data', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    
    const data = {
      tasks,
      dependencies,
      epics,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [tasks, dependencies, epics, isInitialized]);

  const addTask = useCallback((task: Task) => {
    setTasks(prev => [...prev, task]);
  }, []);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  }, []);

  const deleteTasks = useCallback((taskIds: string[]) => {
    setTasks(prev => prev.filter(t => !taskIds.includes(t.id)));
    // Cascade delete dependencies
    setDependencies(prev => prev.filter(d => !taskIds.includes(d.source) && !taskIds.includes(d.target)));
  }, []);

  const addDependency = useCallback((dep: Dependency) => {
    setDependencies(prev => {
      const exists = prev.some(d => d.source === dep.source && d.target === dep.target);
      if (exists) return prev;
      return [...prev, dep];
    });
  }, []);

  const removeDependencies = useCallback((ids: string[]) => {
    setDependencies(prev => prev.filter(d => !ids.includes(d.id)));
  }, []);

  const addEpic = useCallback((epic: Epic) => {
    setEpics(prev => [...prev, epic]);
  }, []);

  const updateEpic = useCallback((updatedEpic: Epic) => {
    setEpics(prev => prev.map(e => e.id === updatedEpic.id ? updatedEpic : e));
  }, []);

  const deleteEpic = useCallback((epicId: string) => {
    setEpics(prev => prev.filter(e => e.id !== epicId));
    // Optional: Delete tasks associated with this epic? Or move them to backlog?
    // For now, let's keep tasks but they will be orphaned from an epic perspective
  }, []);

  const resetData = useCallback(() => {
    setTasks(initialTasks);
    setDependencies(initialDependencies);
    setEpics(initialEpics);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <TaskContext.Provider value={{ 
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
      deleteEpic,
      resetData
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
