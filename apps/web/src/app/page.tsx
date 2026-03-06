import { Navbar } from "@/components/layout/Navbar";
import { KanbanColumn } from "@/components/kanban/KanbanColumn";
import { Task } from "@/components/kanban/TaskCard";

// Sample Data
const initialTasks: Task[] = [
  { id: '101', title: 'Setup Project Repository', status: 'done', priority: 'high', tags: ['infra'], assignee: { type: 'human', name: 'Alice' } },
  { id: '102', title: 'Configure CI/CD Pipeline', status: 'done', priority: 'high', tags: ['devops'], assignee: { type: 'agent', name: 'DevBot' } },
  { id: '103', title: 'Implement Auth Service', status: 'inprogress', priority: 'high', tags: ['backend'], assignee: { type: 'human', name: 'Bob' } },
  { id: '104', title: 'Design Frontend Architecture', status: 'inprogress', priority: 'medium', tags: ['frontend'], assignee: { type: 'agent', name: 'DesignBot' } },
  { id: '105', title: 'Integrate Payment Gateway', status: 'blocked', priority: 'high', tags: ['payment'], assignee: { type: 'human', name: 'Charlie' } }, // Blocked by Auth
  { id: '106', title: 'Create User Dashboard', status: 'todo', priority: 'medium', tags: ['frontend'] },
  { id: '107', title: 'Write API Documentation', status: 'todo', priority: 'low', tags: ['docs'] },
];

export default function Home() {
  const todoTasks = initialTasks.filter(t => t.status === 'todo');
  const doingTasks = initialTasks.filter(t => t.status === 'inprogress');
  const blockedTasks = initialTasks.filter(t => t.status === 'blocked');
  const doneTasks = initialTasks.filter(t => t.status === 'done');

  return (
    <main className="flex flex-col min-h-screen bg-concrete-light font-sans text-ink-black selection:bg-status-agent selection:text-white">
      <Navbar />
      
      <div className="flex-1 p-6 overflow-x-auto">
        <div className="flex gap-6 h-full min-w-max">
          <KanbanColumn title="To Do" tasks={todoTasks} status="todo" />
          <KanbanColumn title="In Progress" tasks={doingTasks} status="inprogress" />
          <KanbanColumn title="Blocked" tasks={blockedTasks} status="blocked" />
          <KanbanColumn title="Done" tasks={doneTasks} status="done" />
        </div>
      </div>
    </main>
  );
}
