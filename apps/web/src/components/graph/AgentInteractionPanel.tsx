'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Epic, Task } from '@/types/kanban';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChevronLeft, ChevronRight, MessageSquare, Pin, Trash2, Send } from 'lucide-react';

// UI-only scaffold for the Graph page right sidebar.
// It keeps messages in local component state and can be wired to real sessions later.
type ChatRole = 'user' | 'assistant' | 'system';

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  ts: number;
};

function formatTime(ts: number) {
  try {
    return new Date(ts).toLocaleTimeString();
  } catch {
    return '';
  }
}

function buildTaskReference(task: Task) {
  return `#${task.id} ${task.title}`;
}

interface AgentInteractionPanelProps {
  epic: Epic | null;
  selectedTask: Task | null;
}

export function AgentInteractionPanel({ epic, selectedTask }: AgentInteractionPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [pinnedEpic, setPinnedEpic] = useState<Epic | null>(null);
  const [pinnedTask, setPinnedTask] = useState<Task | null>(null);
  const [draft, setDraft] = useState('');
  const [messagesByKey, setMessagesByKey] = useState<Record<string, ChatMessage[]>>({});

  const composerRef = useRef<HTMLTextAreaElement | null>(null);

  const activeEpic = isPinned ? pinnedEpic : epic;
  const activeTask = isPinned ? pinnedTask : selectedTask;
  const conversationKey = activeEpic?.id ?? 'global';

  const messages = messagesByKey[conversationKey] ?? [];

  const headerSubtitle = useMemo(() => {
    if (!activeEpic) return 'No epic selected';
    if (!activeTask) return activeEpic.title;
    return `${activeEpic.title} · ${buildTaskReference(activeTask)}`;
  }, [activeEpic, activeTask]);

  const ensureSystemMessage = useMemo(() => {
    if (messages.length > 0) return null;
    if (!activeEpic) return '请选择一个 Epic 开始对话。';
    if (!activeTask) return '在中间依赖图中选择一个任务，开始讨论依赖与计划。';
    return '你可以让 Agent 总结阻塞原因、建议拆分任务或生成后续任务清单。';
  }, [activeEpic, activeTask, messages.length]);

  const appendMessage = useCallback((next: ChatMessage) => {
    setMessagesByKey((prev) => {
      const current = prev[conversationKey] ?? [];
      return { ...prev, [conversationKey]: [...current, next] };
    });
  }, [conversationKey]);

  const handleTogglePin = useCallback(() => {
    setIsPinned((prev) => {
      if (!prev) {
        setPinnedEpic(epic);
        setPinnedTask(selectedTask);
      } else {
        setPinnedEpic(null);
        setPinnedTask(null);
      }
      return !prev;
    });
  }, [epic, selectedTask]);

  const handleClear = useCallback(() => {
    setMessagesByKey((prev) => ({ ...prev, [conversationKey]: [] }));
  }, [conversationKey]);

  const handleSend = useCallback(() => {
    const content = draft.trim();
    if (!content) return;

    const now = Date.now();
    appendMessage({
      id: `u-${now}`,
      role: 'user',
      content,
      ts: now,
    });

    const contextLine = activeTask ? `当前上下文：${buildTaskReference(activeTask)}。` : '当前未选择任务上下文。';
    appendMessage({
      id: `a-${now}`,
      role: 'assistant',
      content: `${contextLine}\n\n我已收到你的信息：\n${content}`,
      ts: now + 1,
    });

    setDraft('');
    requestAnimationFrame(() => composerRef.current?.focus());
  }, [activeTask, appendMessage, draft]);

  const handleInsertReference = useCallback(() => {
    if (!activeTask) return;
    const refText = buildTaskReference(activeTask);
    setDraft((prev) => {
      const next = prev.trim().length === 0 ? refText : `${prev}\n${refText}`;
      return next;
    });
    requestAnimationFrame(() => composerRef.current?.focus());
  }, [activeTask]);

  const handleComposerKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Ctrl/⌘ + Enter, keep plain Enter for new lines via Shift+Enter.
    if (e.key !== 'Enter') return;
    if (e.shiftKey) return;
    if (!(e.ctrlKey || e.metaKey)) return;

    e.preventDefault();
    handleSend();
  }, [handleSend]);

  if (isCollapsed) {
    return (
      <aside className="h-full w-12 flex-shrink-0 border-l border-ink-light/10 bg-concrete-pure shadow-inner flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-ink-light/10">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Expand"
            onClick={() => setIsCollapsed(false)}
          >
            <ChevronLeft size={18} />
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center text-ink-light">
          <MessageSquare size={18} />
        </div>
      </aside>
    );
  }

  return (
    <aside className="h-full w-[420px] flex-shrink-0 border-l border-ink-light/10 bg-concrete-pure shadow-inner flex flex-col overflow-hidden">
      <div className="h-16 border-b border-ink-light/10 bg-concrete-light/30 backdrop-blur-sm px-4 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-ink-medium tracking-wider">AGENT</span>
            {isPinned && <Badge variant="agent" className="h-5 px-2 text-[10px]">PINNED</Badge>}
          </div>
          <div className="text-xs text-ink-dark truncate" title={headerSubtitle}>
            {headerSubtitle}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant={isPinned ? 'primary' : 'ghost'}
            size="sm"
            className="h-8 w-8 p-0"
            title={isPinned ? 'Unpin' : 'Pin'}
            onClick={handleTogglePin}
          >
            <Pin size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Clear"
            onClick={handleClear}
          >
            <Trash2 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Collapse"
            onClick={() => setIsCollapsed(true)}
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>

      {activeTask && (
        <div className="px-4 py-3 border-b border-ink-light/10 bg-white">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-mono text-ink-medium">{buildTaskReference(activeTask)}</div>
              <div className="text-sm font-semibold text-ink-black truncate">{activeTask.title}</div>
              <div className="mt-1 flex items-center gap-2">
                <Badge
                  variant={
                    activeTask.status === 'done'
                      ? 'success'
                      : activeTask.status === 'blocked'
                        ? 'destructive'
                        : activeTask.status === 'inprogress'
                          ? 'inprogress'
                          : 'secondary'
                  }
                  className="h-5 px-2 text-[10px]"
                >
                  {activeTask.status}
                </Badge>
                <span className="text-[10px] uppercase font-bold tracking-wider text-ink-medium">{activeTask.priority}</span>
                {activeTask.assignee?.name && (
                  <span className="text-[10px] text-ink-medium truncate">{activeTask.assignee.name}</span>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-8 px-2 text-[10px]" onClick={handleInsertReference}>
              引用
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-concrete-light/20">
        {ensureSystemMessage && (
          <div className="text-xs text-ink-medium bg-white/70 border border-ink-light/10 rounded-[2px] p-3 whitespace-pre-wrap">
            {ensureSystemMessage}
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              'flex',
              m.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[90%] rounded-[2px] border px-3 py-2 text-sm whitespace-pre-wrap',
                m.role === 'user'
                  ? 'bg-ink-black text-concrete-pure border-ink-black'
                  : m.role === 'assistant'
                    ? 'bg-white text-ink-black border-ink-light/10'
                    : 'bg-concrete-rough text-ink-dark border-ink-light/10'
              )}
            >
              <div className="text-[10px] opacity-70 mb-1 flex items-center justify-between gap-2">
                <span className="uppercase tracking-wider">{m.role}</span>
                <span className="font-mono">{formatTime(m.ts)}</span>
              </div>
              <div>{m.content}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-ink-light/10 bg-white p-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={composerRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleComposerKeyDown}
            placeholder="输入消息…（Ctrl/⌘ + Enter 发送，Shift + Enter 换行）"
            className="flex-1 min-h-[44px] max-h-[140px] resize-none rounded-[2px] border border-ink-light/20 bg-concrete-pure px-3 py-2 text-sm text-ink-black outline-none focus-visible:ring-1 focus-visible:ring-ink-black"
          />
          <Button
            variant="primary"
            size="sm"
            className="h-[44px] w-[44px] p-0"
            onClick={handleSend}
            title="Send"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </aside>
  );
}
