'use client';

import React, { useEffect, useCallback, useMemo, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Task, Dependency } from '@/types/kanban';
import { TaskNode, TaskNodeData, QuickExtendDirection } from './TaskNode';
import { getLayoutedElements } from '@/lib/graph-layout';
import { MousePointer2, Hand } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DependencyGraphProps {
  tasks: Task[];
  dependencies: Dependency[];
  onConnect: (connection: Connection) => void;
  onQuickExtend: (fromTask: Task, direction: QuickExtendDirection) => string;
  onNodeDoubleClick: (task: Task) => void;
  onDeleteNodes: (taskIds: string[]) => void;
  onDeleteEdges: (dependencyIds: string[]) => void;
  onSelectionChange?: (selectedTasks: Task[]) => void;
}

export function DependencyGraph({ 
  tasks, 
  dependencies,
  onConnect: onConnectProp,
  onQuickExtend: onQuickExtendProp,
  onNodeDoubleClick,
  onDeleteNodes,
  onDeleteEdges,
  onSelectionChange
}: DependencyGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const nodeTypes = useMemo(() => ({ task: TaskNode }), []);

  const hasAppliedInitialLayoutRef = useRef(false);
  const nodesRef = useRef<Node<TaskNodeData>[]>([]);
  const pendingNewNodePositionsRef = useRef<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    nodesRef.current = nodes as Node<TaskNodeData>[];
  }, [nodes]);

  const handleQuickExtend = useCallback(
    (fromTask: Task, direction: QuickExtendDirection, suggestedPosition: { x: number; y: number }) => {
      const newTaskId = onQuickExtendProp(fromTask, direction);
      pendingNewNodePositionsRef.current[newTaskId] = suggestedPosition;
    },
    [onQuickExtendProp]
  );

  useEffect(() => {
    const existingNodeById = new Map(nodesRef.current.map((n) => [n.id, n]));

    const initialNodes: Node<TaskNodeData>[] = tasks.map((task) => {
      const existing = existingNodeById.get(task.id);
      const pendingPosition = pendingNewNodePositionsRef.current[task.id];
      if (pendingPosition) {
        delete pendingNewNodePositionsRef.current[task.id];
      }

      return {
        id: task.id,
        type: 'task',
        data: {
          task,
          onQuickExtend: handleQuickExtend,
        },
        position: pendingPosition ?? existing?.position ?? { x: 0, y: 0 },
      };
    });

    // Transform dependencies to edges
    const initialEdges: Edge[] = dependencies.map((dep) => ({
      id: dep.id,
      source: dep.source,
      target: dep.target,
      sourceHandle: dep.sourceHandle,
      targetHandle: dep.targetHandle,
      animated: true,
      style: { stroke: '#94a3b8', strokeWidth: 2 },
      type: 'default', // Bezier curve for smooth connection
      selectable: true, // Explicitly allow selection
      interactionWidth: 20, // Easier to click
      className: 'cursor-pointer', 
    }));

    if (!hasAppliedInitialLayoutRef.current) {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        initialNodes,
        initialEdges,
        'LR'
      );

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      hasAppliedInitialLayoutRef.current = true;
      return;
    }

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [tasks, dependencies, handleQuickExtend, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      onConnectProp(params);
    },
    [onConnectProp]
  );

  return (
    <div className="h-full w-full bg-concrete-light border border-concrete-rough rounded-[2px] overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={({ nodes }) => {
          if (onSelectionChange) {
            onSelectionChange(nodes.map(n => (n.data as TaskNodeData).task));
          }
        }}
        onNodeDoubleClick={(_, node) => onNodeDoubleClick((node.data as TaskNodeData).task)}
        onNodesDelete={(nodes) => onDeleteNodes(nodes.map(n => n.id))}
        onEdgesDelete={(edges) => onDeleteEdges(edges.map(e => e.id))}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        deleteKeyCode={['Backspace', 'Delete']}
        multiSelectionKeyCode={['Meta', 'Control']}
        selectionOnDrag={isSelectionMode}
        panOnDrag={!isSelectionMode}
        zoomOnScroll={true}
        panOnScroll={true}
      >
        <Panel position="top-left" className="bg-white p-1 rounded-md shadow-md border border-concrete-rough flex gap-1">
          <Button
            variant={!isSelectionMode ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setIsSelectionMode(false)}
            title="Pan Mode (Hand)"
            className="w-8 h-8 p-0"
          >
            <Hand size={18} />
          </Button>
          <Button
            variant={isSelectionMode ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setIsSelectionMode(true)}
            title="Selection Mode (Box Select)"
            className="w-8 h-8 p-0"
          >
            <MousePointer2 size={18} />
          </Button>
        </Panel>
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#cbd5e1" />
        <Controls showInteractive={false} className="bg-white border-concrete-rough text-ink-dark shadow-sm" />
        <MiniMap 
          nodeColor={(node) => {
            const status = (node.data as TaskNodeData).task.status;
            switch (status) {
              case 'blocked': return '#ef4444';
              case 'done': return '#22c55e';
              case 'inprogress': return '#3b82f6';
              default: return '#e2e8f0';
            }
          }}
          maskColor="#f8fafc" 
          className="bg-white border border-concrete-rough rounded-[2px]"
        />
      </ReactFlow>
    </div>
  );
}
