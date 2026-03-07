import React from 'react';
import { Task, Epic, Project } from '@/types/kanban';
import { Modal } from '@/components/ui/Modal';
import { TaskForm } from '@/components/graph/TaskForm';
import { EpicForm } from '@/components/graph/EpicForm';
import { ProjectForm } from '@/components/graph/ProjectForm';

interface GraphModalsProps {
  modals: {
    isTaskModalOpen: boolean;
    isEpicModalOpen: boolean;
    isProjectModalOpen: boolean;
    editingTask: Task | null;
    editingEpic: Epic | null;
    editingProject: Project | null;
    preSelectedProjectId: string;
    closeTaskModal: () => void;
    closeEpicModal: () => void;
    closeProjectModal: () => void;
  };
  projects: Project[];
  onAddTask: (data: Omit<Task, 'id'>) => void;
  onEditTask: (data: Omit<Task, 'id'>) => void;
  onDeleteTask: () => void;
  onAddEpic: (data: Omit<Epic, 'id'>) => void;
  onEditEpic: (data: Omit<Epic, 'id'>) => void;
  onDeleteEpic: () => void;
  onAddProject: (data: Omit<Project, 'id'>) => void;
  onEditProject: (data: Omit<Project, 'id'>) => void;
  onDeleteProject: () => void;
}

export function GraphModals({
  modals,
  projects,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onAddEpic,
  onEditEpic,
  onDeleteEpic,
  onAddProject,
  onEditProject,
  onDeleteProject,
}: GraphModalsProps) {
  const {
    isTaskModalOpen,
    isEpicModalOpen,
    isProjectModalOpen,
    editingTask,
    editingEpic,
    editingProject,
    preSelectedProjectId,
    closeTaskModal,
    closeEpicModal,
    closeProjectModal,
  } = modals;

  return (
    <>
      <Modal
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
        title={editingTask ? "Edit Task" : "New Task"}
      >
        <TaskForm
          initialData={editingTask || undefined}
          onSubmit={editingTask ? onEditTask : onAddTask}
          onDelete={editingTask ? onDeleteTask : undefined}
          onCancel={closeTaskModal}
        />
      </Modal>

      <Modal
        isOpen={isEpicModalOpen}
        onClose={closeEpicModal}
        title={editingEpic ? "Edit Epic" : "New Epic"}
      >
        <EpicForm
          initialData={editingEpic || (preSelectedProjectId ? { projectId: preSelectedProjectId } : undefined)}
          projects={projects}
          onSubmit={editingEpic ? onEditEpic : onAddEpic}
          onDelete={editingEpic ? onDeleteEpic : undefined}
          onCancel={closeEpicModal}
        />
      </Modal>

      <Modal
        isOpen={isProjectModalOpen}
        onClose={closeProjectModal}
        title={editingProject ? "Edit Project" : "New Project"}
      >
        <ProjectForm
          initialData={editingProject || undefined}
          onSubmit={editingProject ? onEditProject : onAddProject}
          onDelete={editingProject ? onDeleteProject : undefined}
          onCancel={closeProjectModal}
        />
      </Modal>
    </>
  );
}
