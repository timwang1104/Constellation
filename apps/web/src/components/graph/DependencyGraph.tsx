'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
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
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Task, Dependency } from '@/types/kanban';
import { TaskNode } from './TaskNode';
import { getLayoutedElements } from '@/lib/graph-layout';

interface DependencyGraphProps {
  tasks: Task[];
  dependencies: Dependency[];
}

export function DependencyGraph({ tasks, dependencies }: DependencyGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="h-full w-full bg-concrete-light border border-concrete-rough rounded-[2px] overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
      >
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
