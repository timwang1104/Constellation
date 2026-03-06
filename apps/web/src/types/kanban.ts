export type TaskStatus = 'todo' | 'inprogress' | 'blocked' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';
export type AssigneeType = 'human' | 'agent';

export interface Assignee {
  type: AssigneeType;
  name: string;
  avatarUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[];
  assignee?: Assignee;
  description?: string;
}

export interface Dependency {
  id: string;
  source: string; // source task id (predecessor)
  target: string; // target task id (successor)
  type: 'finish_to_start'; // default
}
