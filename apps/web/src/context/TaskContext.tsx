'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Task, Dependency, Epic, Project } from '@/types/kanban';

const STORAGE_KEY = 'constellation_graph_data';
const MAX_HISTORY_SIZE = 50;

interface Snapshot {
  tasks: Task[];
  dependencies: Dependency[];
  epics: Epic[];
  projects: Project[];
}

interface TaskContextType {
  tasks: Task[];
  dependencies: Dependency[];
  epics: Epic[];
  projects: Project[];
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTasks: (taskIds: string[]) => void;
  addDependency: (dependency: Dependency) => void;
  removeDependencies: (dependencyIds: string[]) => void;
  addEpic: (epic: Epic) => void;
  updateEpic: (epic: Epic) => void;
  deleteEpic: (epicId: string) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  resetData: () => void;
  undo: () => void;
  canUndo: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Use ref for history to avoid stale closures; track length for canUndo reactivity
  const historyRef = useRef<Snapshot[]>([]);
  const [historyLength, setHistoryLength] = useState(0);

  // Refs to avoid stale closures in saveHistory
  const stateRef = useRef({ tasks, dependencies, epics, projects });
  stateRef.current = { tasks, dependencies, epics, projects };

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
        if (Array.isArray(parsed.projects)) {
            setProjects(parsed.projects);
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
      projects,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [tasks, dependencies, epics, projects, isInitialized]);

  const saveHistory = useCallback(() => {
    const { tasks, dependencies, epics, projects } = stateRef.current;
    historyRef.current.push({ tasks, dependencies, epics, projects });
    if (historyRef.current.length > MAX_HISTORY_SIZE) {
      historyRef.current = historyRef.current.slice(-MAX_HISTORY_SIZE);
    }
    setHistoryLength(historyRef.current.length);
  }, []);

  const undo = useCallback(() => {
    const snapshot = historyRef.current.pop();
    if (!snapshot) return;

    setHistoryLength(historyRef.current.length);
    setTasks(snapshot.tasks);
    setDependencies(snapshot.dependencies);
    setEpics(snapshot.epics);
    setProjects(snapshot.projects);
  }, []);

  const addTask = useCallback((task: Task) => {
    saveHistory();
    setTasks(prev => [...prev, task]);
  }, [saveHistory]);

  const updateTask = useCallback((updatedTask: Task) => {
    saveHistory();
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  }, [saveHistory]);

  const deleteTasks = useCallback((taskIds: string[]) => {
    saveHistory();
    setTasks(prev => prev.filter(t => !taskIds.includes(t.id)));
    // Cascade delete dependencies
    setDependencies(prev => prev.filter(d => !taskIds.includes(d.source) && !taskIds.includes(d.target)));
  }, [saveHistory]);

  const addDependency = useCallback((dep: Dependency) => {
    saveHistory();
    setDependencies(prev => {
      const exists = prev.some(d => d.source === dep.source && d.target === dep.target);
      if (exists) return prev;
      return [...prev, dep];
    });
  }, [saveHistory]);

  const removeDependencies = useCallback((ids: string[]) => {
    saveHistory();
    setDependencies(prev => prev.filter(d => !ids.includes(d.id)));
  }, [saveHistory]);

  const addEpic = useCallback((epic: Epic) => {
    saveHistory();
    setEpics(prev => [...prev, epic]);
  }, [saveHistory]);

  const updateEpic = useCallback((updatedEpic: Epic) => {
    saveHistory();
    setEpics(prev => prev.map(e => e.id === updatedEpic.id ? updatedEpic : e));
  }, [saveHistory]);

  const deleteEpic = useCallback((epicId: string) => {
    saveHistory();
    setEpics(prev => prev.filter(e => e.id !== epicId));
    // Optional: Delete tasks associated with this epic? Or move them to backlog?
    // For now, let's keep tasks but they will be orphaned from an epic perspective
  }, [saveHistory]);

  const addProject = useCallback((project: Project) => {
    saveHistory();
    setProjects(prev => [...prev, project]);
  }, [saveHistory]);

  const updateProject = useCallback((updatedProject: Project) => {
    saveHistory();
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  }, [saveHistory]);

  const deleteProject = useCallback((projectId: string) => {
    saveHistory();
    setProjects(prev => prev.filter(p => p.id !== projectId));
    // When deleting a project, we should probably delete or unassign its epics
    // For now, let's keep them (they will become unassigned)
  }, [saveHistory]);

  const resetData = useCallback(() => {
    saveHistory();
    setTasks([]);
    setDependencies([]);
    setEpics([]);
    setProjects([]);
    localStorage.removeItem(STORAGE_KEY);
  }, [saveHistory]);

  return (
    <TaskContext.Provider value={{
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
      deleteProject,
      resetData,
      undo,
      canUndo: historyLength > 0
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
