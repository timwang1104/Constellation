import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Bot, User, AlertCircle, GitPullRequest } from "lucide-react";

export type Task = {
  id: string;
  title: string;
  status: 'todo' | 'inprogress' | 'blocked' | 'done';
  assignee?: {
    type: 'human' | 'agent';
    name: string;
  };
  priority: 'high' | 'medium' | 'low';
  tags: string[];
};

export function TaskCard({ task }: { task: Task }) {
  const isBlocked = task.status === 'blocked';
  const isAgent = task.assignee?.type === 'agent';

  return (
    <Card className={`group relative mb-3 cursor-pointer hover:border-ink-medium transition-all ${isBlocked ? 'border-l-4 border-l-status-blocked' : ''}`}>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start gap-2">
          <span className="font-mono text-xs text-ink-medium">#{task.id}</span>
          {isBlocked && <AlertCircle size={16} className="text-status-blocked" />}
        </div>
        <CardTitle className="text-sm font-medium leading-snug text-ink-black">
          {task.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <div className="flex flex-wrap gap-1 mt-2">
          {task.tags.map(tag => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-concrete-rough text-ink-dark rounded-[1px] uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {task.assignee ? (
            <div className={`h-6 w-6 rounded-full flex items-center justify-center border ${isAgent ? 'bg-status-agent text-white border-transparent' : 'bg-concrete-rough text-ink-dark border-concrete-light'}`}>
              {isAgent ? <Bot size={14} /> : <User size={14} />}
            </div>
          ) : (
            <div className="h-6 w-6 rounded-full border border-dashed border-ink-light flex items-center justify-center text-ink-light">
              <span className="text-[10px]">?</span>
            </div>
          )}
        </div>
        
        {/* Priority Indicator */}
        <div className={`h-1.5 w-6 rounded-full ${
          task.priority === 'high' ? 'bg-red-500' : 
          task.priority === 'medium' ? 'bg-orange-400' : 'bg-blue-300'
        }`} />
      </CardFooter>
    </Card>
  );
}
