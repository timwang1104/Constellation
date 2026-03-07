import { useState, useCallback } from 'react';
import { Task, Epic, Project } from '@/types/kanban';

export function useGraphModals() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEpicModalOpen, setIsEpicModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingEpic, setEditingEpic] = useState<Epic | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const [preSelectedProjectId, setPreSelectedProjectId] = useState<string>('');

  const openAddTaskModal = useCallback(() => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  }, []);

  const openEditTaskModal = useCallback((task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  }, []);

  const closeTaskModal = useCallback(() => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  }, []);

  const openAddEpicModal = useCallback((projectId?: string) => {
    setEditingEpic(null);
    setPreSelectedProjectId(projectId || '');
    setIsEpicModalOpen(true);
  }, []);

  const openEditEpicModal = useCallback((epic: Epic) => {
    setEditingEpic(epic);
    setIsEpicModalOpen(true);
  }, []);

  const closeEpicModal = useCallback(() => {
    setIsEpicModalOpen(false);
    setEditingEpic(null);
  }, []);

  const openAddProjectModal = useCallback(() => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  }, []);

  const openEditProjectModal = useCallback((project: Project) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  }, []);

  const closeProjectModal = useCallback(() => {
    setIsProjectModalOpen(false);
    setEditingProject(null);
  }, []);

  return {
    isTaskModalOpen,
    isEpicModalOpen,
    isProjectModalOpen,
    editingTask,
    editingEpic,
    editingProject,
    preSelectedProjectId,
    openAddTaskModal,
    openEditTaskModal,
    closeTaskModal,
    openAddEpicModal,
    openEditEpicModal,
    closeEpicModal,
    openAddProjectModal,
    openEditProjectModal,
    closeProjectModal,
  };
}
