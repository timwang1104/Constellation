import { Task, Dependency, Epic } from "@/types/kanban";

export const initialEpics: Epic[] = [
  {
    id: 'epic-1',
    title: 'E1: MVP Infrastructure',
    status: 'done',
    progress: 100
  },
  {
    id: 'epic-2',
    title: 'E2: User Management',
    status: 'inprogress',
    progress: 60
  },
  {
    id: 'epic-3',
    title: 'E3: Payment Integration',
    status: 'blocked',
    progress: 0
  }
];

export const initialTasks: Task[] = [
  { 
    id: '101', 
    title: 'Setup Project Repository', 
    status: 'done', 
    priority: 'high', 
    tags: ['infra'], 
    assignee: { type: 'human', name: 'Alice' },
    epicId: 'epic-1'
  },
  { 
    id: '102', 
    title: 'Configure CI/CD Pipeline', 
    status: 'done', 
    priority: 'high', 
    tags: ['devops'], 
    assignee: { type: 'agent', name: 'DevBot' },
    epicId: 'epic-1'
  },
  { 
    id: '103', 
    title: 'Implement Auth Service', 
    status: 'inprogress', 
    priority: 'high', 
    tags: ['backend'], 
    assignee: { type: 'human', name: 'Bob' },
    epicId: 'epic-2'
  },
  { 
    id: '104', 
    title: 'Design Frontend Architecture', 
    status: 'inprogress', 
    priority: 'medium', 
    tags: ['frontend'], 
    assignee: { type: 'agent', name: 'DesignBot' },
    epicId: 'epic-1'
  },
  { 
    id: '105', 
    title: 'Integrate Payment Gateway', 
    status: 'blocked', 
    priority: 'high', 
    tags: ['payment'], 
    assignee: { type: 'human', name: 'Charlie' },
    epicId: 'epic-3'
  }, // Blocked by Auth
  { 
    id: '106', 
    title: 'Create User Dashboard', 
    status: 'todo', 
    priority: 'medium', 
    tags: ['frontend'],
    epicId: 'epic-2'
  },
  { 
    id: '107', 
    title: 'Write API Documentation', 
    status: 'todo', 
    priority: 'low', 
    tags: ['docs'],
    epicId: 'epic-1'
  },
];

export const initialDependencies: Dependency[] = [
  { id: 'd1', source: '101', target: '102', type: 'finish_to_start' },
  { id: 'd2', source: '103', target: '105', type: 'finish_to_start' }, // Auth -> Payment
  { id: 'd3', source: '104', target: '106', type: 'finish_to_start' }, // Design -> Dashboard
];
