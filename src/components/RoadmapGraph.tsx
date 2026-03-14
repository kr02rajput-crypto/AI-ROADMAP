"use client";

import { useCallback, useMemo } from "react";
import ReactFlow, {
  type Node,
  type Edge,
  Background,
  Controls,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  type NodeTypes,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import NodeCard from "./NodeCard";

interface Resource {
  id: string;
  title: string;
  url: string;
  type: string;
}

interface RoadmapNodeData {
  id: string;
  nodeId: string;
  title: string;
  description: string;
  difficulty: string;
  parentId: string | null;
  positionX: number;
  positionY: number;
  resources: Resource[];
}

interface RoadmapGraphProps {
  nodesData: RoadmapNodeData[];
  roadmapData: string | null;
  progressMap: Record<string, boolean>;
  onToggleComplete: (nodeId: string) => void;
  onNodeClick: (nodeId: string) => void;
}

export default function RoadmapGraph({
  nodesData,
  roadmapData,
  progressMap,
  onToggleComplete,
  onNodeClick,
}: RoadmapGraphProps) {
  const nodeTypes: NodeTypes = useMemo(
    () => ({
      custom: NodeCard,
    }),
    []
  );

  // Parse the AI-generated data for child relationships
  const parsedData = useMemo(() => {
    if (!roadmapData) return null;
    try {
      return JSON.parse(roadmapData);
    } catch {
      return null;
    }
  }, [roadmapData]);

  const initialNodes: Node[] = useMemo(() => {
    return nodesData.map((node) => ({
      id: node.nodeId,
      type: "custom",
      position: { x: node.positionX, y: node.positionY },
      data: {
        label: node.title,
        difficulty: node.difficulty,
        completed: progressMap[node.id] || false,
        onToggleComplete,
        onNodeClick,
        dbNodeId: node.id,
      },
    }));
  }, [nodesData, progressMap, onToggleComplete, onNodeClick]);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];

    if (parsedData?.nodes) {
      for (const aiNode of parsedData.nodes) {
        if (aiNode.children) {
          for (const childId of aiNode.children) {
            edges.push({
              id: `${aiNode.id}-${childId}`,
              source: aiNode.id,
              target: childId,
              type: "smoothstep",
              animated: true,
              style: { stroke: "#6d28d9", strokeWidth: 2 },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "#6d28d9",
                width: 20,
                height: 20,
              },
            });
          }
        }
      }
    } else {
      // Fallback: use parentId-based edges
      for (const node of nodesData) {
        if (node.parentId) {
          edges.push({
            id: `${node.parentId}-${node.nodeId}`,
            source: node.parentId,
            target: node.nodeId,
            type: "smoothstep",
            animated: true,
            style: { stroke: "#6d28d9", strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#6d28d9",
              width: 20,
              height: 20,
            },
          });
        }
      }
    }

    return edges;
  }, [nodesData, parsedData]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.2}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1e293b" gap={20} size={1} />
        <Controls
          className="!bg-slate-800 !border-slate-700 !rounded-xl !shadow-xl"
          showInteractive={false}
        />
      </ReactFlow>
    </div>
  );
}
