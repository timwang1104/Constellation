'use client';

import { Navbar } from "@/components/layout/Navbar";
import { KanbanColumn } from "@/components/kanban/KanbanColumn";
import { useTaskContext } from "@/context/TaskContext";

export default function Home() {
  const { tasks } = useTaskContext();

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const doingTasks = tasks.filter(t => t.status === 'inprogress');
  const blockedTasks = tasks.filter(t => t.status === 'blocked');
  const doneTasks = tasks.filter(t => t.status === 'done');

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
