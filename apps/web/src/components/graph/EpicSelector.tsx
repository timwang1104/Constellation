import React, { useRef, useEffect } from 'react';
import { Epic } from '@/types/kanban';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Plus, Settings } from 'lucide-react';

interface EpicSelectorProps {
  epics: Epic[];
  selectedEpicId: string;
  onSelect: (id: string) => void;
  onAddEpic: () => void;
  onEditEpic: (epic: Epic) => void;
  onDeleteEpic: (epicId: string) => void;
}

export function EpicSelector({ epics, selectedEpicId, onSelect, onAddEpic, onEditEpic, onDeleteEpic }: EpicSelectorProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Keyboard support for deleting
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if we have a selection and no modal is open (simple check)
      // In a real app we might check if an input is focused
      if (
        (e.key === 'Delete' || e.key === 'Backspace') && 
        selectedEpicId && 
        !(document.activeElement instanceof HTMLInputElement) &&
        !(document.activeElement instanceof HTMLTextAreaElement)
      ) {
        // Confirm before delete? For now, let's just trigger the callback
        // The parent can decide whether to show a confirmation
        onDeleteEpic(selectedEpicId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEpicId, onDeleteEpic]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const selectedElement = scrollContainerRef.current.querySelector(`[data-epic-id="${selectedEpicId}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedEpicId]);

  return (
    <div className="w-80 h-full bg-concrete-rough border-r border-ink-light/10 flex flex-col shadow-inner relative z-10">
      <div className="p-6 border-b border-ink-light/5 bg-concrete-light/50 backdrop-blur-sm flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-ink-black tracking-tight">EPICS</h2>
          <p className="text-xs text-ink-medium mt-1">Select an epic</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onAddEpic} title="Create New Epic">
          <Plus size={18} />
        </Button>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto py-10 space-y-6 scrollbar-hide px-4"
        style={{ perspective: '1000px' }}
      >
        {epics.map((epic) => {
          const isSelected = epic.id === selectedEpicId;
          
          return (
            <div
              key={epic.id}
              data-epic-id={epic.id}
              onClick={() => onSelect(epic.id)}
              className={cn(
                "cursor-pointer p-5 rounded-lg transition-all duration-500 transform-gpu relative group",
                isSelected 
                  ? "bg-white shadow-xl scale-100 opacity-100 z-10 border-l-4 border-status-agent translate-x-2" 
                  : "bg-concrete-light/40 hover:bg-white/60 scale-90 opacity-60 hover:opacity-90 hover:scale-95 border border-transparent hover:border-ink-light/5"
              )}
              style={{
                transformStyle: 'preserve-3d',
                transform: isSelected 
                  ? 'translateZ(20px) rotateX(0deg)' 
                  : 'translateZ(-10px) rotateX(0deg)'
              }}
            >
              <div className="flex justify-end items-start mb-2 min-h-[26px]">
                <div className="flex items-center gap-2">
                  {isSelected && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditEpic(epic);
                      }}
                      className="text-ink-medium hover:text-ink-black transition-colors"
                      title="Edit Epic"
                    >
                      <Settings size={14} />
                    </button>
                  )}
                  {isSelected && <div className="h-2 w-2 rounded-full bg-status-agent animate-pulse" />}
                </div>
              </div>
              
              <h3 className={cn(
                "font-bold text-lg mb-1 transition-colors",
                isSelected ? "text-ink-black" : "text-ink-dark"
              )}>
                {epic.title}
              </h3>
              
              {isSelected && epic.description && (
                <p className="text-xs text-ink-medium mb-3 line-clamp-3">
                  {epic.description}
                </p>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-ink-medium uppercase tracking-wider font-semibold">
                  <span>Progress</span>
                  <span>{epic.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-ink-light/10 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      epic.status === 'done' ? "bg-status-done" :
                      epic.status === 'inprogress' ? "bg-status-inprogress" :
                      epic.status === 'blocked' ? "bg-status-blocked" :
                      "bg-ink-medium"
                    )}
                    style={{ width: `${epic.progress}%` }}
                  />
                </div>
              </div>

              {isSelected && (
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-status-agent rounded-l-full" />
              )}
            </div>
          );
        })}
        {/* Spacer to allow scrolling to center */}
        <div className="h-32" />
      </div>
      
      {/* Gradient overlays for roller effect */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-concrete-rough to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-concrete-rough to-transparent pointer-events-none z-20" />
    </div>
  );
}
