'use client';

import React, { useEffect, useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Task, Dependency } from '@/types/kanban';
import { TaskNode } from './TaskNode';
import { getLayoutedElements } from '@/lib/graph-layout';
import { MousePointer2, Hand, MousePointerClick } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DependencyGraphProps {
  tasks: Task[];
  dependencies: Dependency[];
  onConnect: (connection: Connection) => void;
  onNodeDoubleClick: (task: Task) => void;
  onDeleteNodes: (taskIds: string[]) => void;
  onDeleteEdges: (dependencyIds: string[]) => void;
}

export function DependencyGraph({ 
  tasks, 
  dependencies,
  onConnect: onConnectProp,
  onNodeDoubleClick,
  onDeleteNodes,
  onDeleteEdges
}: DependencyGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const nodeTypes = useMemo(() => ({ task: TaskNode }), []);

  useEffect(() => {
    // Transform tasks to nodes
    const initialNodes: Node[] = tasks.map((task) => ({
      id: task.id,
      type: 'task',
      data: task,
      position: { x: 0, y: 0 },
    }));

    // Transform dependencies to edges
    const initialEdges: Edge[] = dependencies.map((dep) => ({
      id: dep.id,
      source: dep.source,
      target: dep.target,
      animated: true,
      style: { stroke: '#94a3b8', strokeWidth: 2 },
      type: 'smoothstep',
    }));

    // Apply layout
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges,
      'TB'
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [tasks, dependencies, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      // Optimistically add edge locally (optional, but good for feedback)
      setEdges((eds) => addEdge(params, eds)); 
      onConnectProp(params);
    },
    [setEdges, onConnectProp]
  );

  return (
    <div className="h-full w-full bg-concrete-light border border-concrete-rough rounded-[2px] overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={(_, node) => onNodeDoubleClick(node.data)}
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
            const status = node.data.status;
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
