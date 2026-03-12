export type TaskStatus = "todo" | "inprogress" | "blocked" | "done" | "canceled";

export type TaskPriority = "high" | "medium" | "low";

export type AssigneeType = "human" | "agent" | "none";

export interface Assignee {
  type: AssigneeType;
  name: string;
  avatarUrl?: string;
  id?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status?: "active" | "archived";
}

export interface Epic {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  progress: number;
}

export interface Task {
  id: string;
  epicId?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[];
  assignee?: Assignee;
  dueDate?: string;
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
  version?: number;
}

export interface Dependency {
  id: string;
  source: string; // source task id (predecessor)
  target: string; // target task id (successor)
  sourceHandle?: string | null;
  targetHandle?: string | null;
  type?: "finish_to_start";
  createdAt?: string;
}

// Event Sourcing types (kept for future use)
export interface ClaimRecord {
  taskId: string;
  assigneeType: AssigneeType;
  assigneeId: string;
  time: string;
  reason?: string;
}

export type EventType =
  | "task_created"
  | "task_updated"
  | "task_claimed"
  | "task_released"
  | "task_transitioned"
  | "dependency_added"
  | "dependency_removed"
  | "agent_progress"
  | "agent_message"
  | "task_archived";

export interface TaskEvent {
  id: string;
  taskId: string;
  type: EventType;
  actorType: AssigneeType | "system";
  actorId?: string;
  payloadJson?: unknown;
  ts: string;
}

export type AgentSessionStatus =
  | "created"
  | "running"
  | "completed"
  | "failed"
  | "archived"
  | "destroyed";

export interface AgentSession {
  id: string;
  taskId: string;
  agentId: string;
  status: AgentSessionStatus;
  startedAt: string;
  endedAt?: string;
  lastHeartbeatAt?: string;
  progressJson?: unknown;
}

export interface AgentMessage {
  id: string;
  sessionId: string;
  ts: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  toolCallJson?: unknown;
  tokenUsageJson?: unknown;
  redacted?: boolean;
}

export interface ArchiveRecord {
  id: string;
  taskId: string;
  sessionId?: string;
  artifactUri: string;
  hash?: string;
  sizeBytes?: number;
  createdAt: string;
  retentionUntil?: string;
}
