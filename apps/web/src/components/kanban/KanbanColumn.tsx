import { TaskCard, Task } from "./TaskCard";

export function KanbanColumn({ title, tasks, status }: { title: string; tasks: Task[]; status: Task['status'] }) {
  const count = tasks.length;
  
  return (
    <div className="flex flex-col h-full min-w-[280px] bg-concrete-rough/30 rounded-[2px] p-2">
      <div className="flex items-center justify-between px-2 py-3 mb-2 border-b border-concrete-rough">
        <h3 className="font-sans font-bold text-sm text-ink-dark uppercase tracking-wider">{title}</h3>
        <span className="text-xs font-mono text-ink-medium bg-concrete-rough px-2 py-0.5 rounded-[2px]">{count}</span>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 px-1">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
