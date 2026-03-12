import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Epic, Project } from '@/types/kanban';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Plus, Settings, ChevronDown, ChevronRight, Folder, Trash2 } from 'lucide-react';

interface EpicSelectorProps {
  projects: Project[];
  epics: Epic[];
  selectedEpicId: string;
  onSelect: (id: string) => void;
  onAddProject: () => void;
  onAddEpic: (projectId?: string) => void;
  onEditEpic: (epic: Epic) => void;
  onDeleteEpic: (epicId: string) => void;
  onDeleteProject: (projectId: string) => void;
}

export function EpicSelector({ projects, epics, selectedEpicId, onSelect, onAddProject, onAddEpic, onEditEpic, onDeleteEpic, onDeleteProject }: EpicSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Initialize expanded projects once
  useEffect(() => {
    if (projects.length > 0 && expandedProjects.size === 0) {
      setExpandedProjects(new Set(projects.map(p => p.id)));
    }
  }, [projects]);

  useEffect(() => {
    if (selectedProjectId && !projects.some(p => p.id === selectedProjectId)) {
      setSelectedProjectId(null);
    }
  }, [projects, selectedProjectId]);

  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      return next;
    });
  };

  // Group epics by project
  const epicsByProject = useMemo(() => {
    const grouped: Record<string, Epic[]> = {};
    epics.forEach(epic => {
      const pid = epic.projectId || 'unassigned';
      if (!grouped[pid]) grouped[pid] = [];
      grouped[pid].push(epic);
    });
    return grouped;
  }, [epics]);

  const handleSelectEpic = (id: string) => {
    onSelect(id);
    setSelectedProjectId(null); // Deselect project when epic is selected
  };

  const handleSelectProject = (projectId: string) => {
      setSelectedProjectId(projectId);
      toggleProject(projectId);
  };

  const isEditableTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false;
    const tagName = target.tagName.toLowerCase();
    if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') return true;
    if (target.isContentEditable) return true;
    return false;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isEditableTarget(e.target)) return;
    if (e.key !== 'Delete' && e.key !== 'Backspace') return;

    e.preventDefault();
    e.stopPropagation();

    if (selectedProjectId) {
      onDeleteProject(selectedProjectId);
      return;
    }
    onDeleteEpic(selectedEpicId);
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      const selectedElement = scrollContainerRef.current.querySelector(`[data-epic-id="${selectedEpicId}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedEpicId]);

  const renderEpicCard = (epic: Epic) => {
    const isSelected = epic.id === selectedEpicId && !selectedProjectId;
    
    return (
      <div
        key={epic.id}
        data-epic-id={epic.id}
        onClick={(e) => {
            e.stopPropagation();
            handleSelectEpic(epic.id);
        }}
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
          </div>
        </div>

        <h3 className={cn(
          "font-bold text-sm mb-1 line-clamp-2",
          isSelected ? "text-ink-black" : "text-ink-medium"
        )}>
          {epic.title}
        </h3>
        
        {epic.description && isSelected && (
          <p className="text-xs text-ink-medium mb-4 line-clamp-3 leading-relaxed">
            {epic.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-ink-light/5">
          <div className="flex items-center gap-2">
            <span className={cn(
              "w-2 h-2 rounded-full",
              epic.status === 'done' ? "bg-green-500" :
              epic.status === 'inprogress' ? "bg-blue-500" :
              epic.status === 'blocked' ? "bg-red-500" :
              "bg-gray-400"
            )} />
            <span className="text-[10px] uppercase font-bold tracking-wider text-ink-light">
              {epic.status}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <div className="w-16 h-1 bg-ink-light/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-status-agent transition-all duration-500"
                style={{ width: `${epic.progress}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-ink-light">{epic.progress}%</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseDownCapture={() => containerRef.current?.focus()}
      className="w-80 h-full bg-concrete-rough border-r border-ink-light/10 flex flex-col shadow-inner relative z-10 focus:outline-none"
    >
      <div className="p-6 border-b border-ink-light/5 bg-concrete-light/50 backdrop-blur-sm flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-ink-black tracking-tight">PROJECTS</h2>
          <p className="text-xs text-ink-medium mt-1">Select an epic</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onAddProject} title="Create New Project">
          <Plus size={18} />
        </Button>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto py-6 space-y-4 scrollbar-hide px-4"
        style={{ perspective: '1000px' }}
      >
        {projects.map((project) => {
            const projectEpics = epicsByProject[project.id] || [];
            const isExpanded = expandedProjects.has(project.id);
            const isProjectSelected = selectedProjectId === project.id;

            return (
                <div key={project.id} className="mb-2">
                    <div 
                        className={cn(
                            "flex items-center px-2 py-2 cursor-pointer text-ink-black font-semibold text-sm select-none rounded-md transition-colors group",
                            isProjectSelected ? "bg-black/10" : "hover:bg-black/5"
                        )}
                        onClick={() => handleSelectProject(project.id)}
                    >
                        {isExpanded ? <ChevronDown size={16} className="text-ink-medium mr-2" /> : <ChevronRight size={16} className="text-ink-medium mr-2" />}
                        <Folder size={16} className="text-ink-medium mr-2" />
                        <span className="flex-1">{project.name}</span>
                        <span className="text-xs text-ink-light bg-black/5 px-2 py-0.5 rounded-full mr-2">{projectEpics.length}</span>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteProject(project.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/10 rounded transition-all text-ink-medium hover:text-red-600"
                          title="Delete Project"
                        >
                          <Trash2 size={14} />
                        </button>
                    </div>

                    {isExpanded && (
                        <div className="mt-2 space-y-4 pl-4 border-l border-ink-light/10 ml-3">
                            {projectEpics.length === 0 && (
                                <div className="text-xs text-ink-light italic py-2 px-2">No epics in this project</div>
                            )}
                            {projectEpics.map(renderEpicCard)}
                            <div className="pt-2">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="w-full justify-start text-xs text-ink-medium hover:text-ink-black"
                                    onClick={() => onAddEpic(project.id)}
                                >
                                    <Plus size={14} className="mr-2" />
                                    New Epic
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            );
        })}

        {/* Unassigned Epics */}
        {epicsByProject['unassigned'] && epicsByProject['unassigned'].length > 0 && (
            <div className="mb-2">
                <div className="px-2 py-2 text-ink-medium font-semibold text-sm select-none flex items-center">
                    <span className="ml-8">Unassigned</span>
                    <span className="ml-auto text-xs text-ink-light bg-black/5 px-2 py-0.5 rounded-full">{epicsByProject['unassigned'].length}</span>
                </div>
                 <div className="mt-2 space-y-4 pl-4 border-l border-ink-light/10 ml-3">
                     {epicsByProject['unassigned'].map(renderEpicCard)}
                 </div>
            </div>
        )}
      </div>
    </div>
  );
}
