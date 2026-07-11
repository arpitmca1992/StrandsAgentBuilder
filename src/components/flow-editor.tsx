import React, { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  Panel,
  type Node,
  type Edge,
  type Connection,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type ReactFlowInstance,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import {
  Network, Search, Bot, Wrench, Server, ArrowRight,
  ArrowLeft, Code, Crown, Users, Globe, GitBranch,
  Keyboard, ZoomIn, ZoomOut, Maximize2, Trash2, X
} from 'lucide-react';

import {
  AgentNode,
  OrchestratorAgentNode,
  SwarmNode,
  ToolNode,
  InputNode,
  OutputNode,
  CustomToolNode,
  A2AAgentNode,
  WorkflowNode,
} from './nodes';
import { MCPToolNode } from './nodes/mcp-tool-node';
import { isValidConnection } from '../lib/connection-validator';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const nodeTypes = {
  agent: AgentNode,
  'orchestrator-agent': OrchestratorAgentNode,
  swarm: SwarmNode,
  tool: ToolNode,
  'mcp-tool': MCPToolNode,
  input: InputNode,
  output: OutputNode,
  'custom-tool': CustomToolNode,
  'a2a-agent': A2AAgentNode,
  workflow: WorkflowNode,
};

/** MiniMap node color by type */
function getMiniMapNodeColor(node: Node): string {
  switch (node.type) {
    case 'agent': return '#3b82f6';
    case 'orchestrator-agent': return '#8b5cf6';
    case 'swarm': return '#10b981';
    case 'a2a-agent': return '#0ea5e9';
    case 'workflow': return '#f59e0b';
    case 'tool': return '#6b7280';
    case 'mcp-tool': return '#6366f1';
    case 'input': return '#22c55e';
    case 'output': return '#ef4444';
    case 'custom-tool': return '#ec4899';
    case 'graph-builder': return '#7c3aed';
    default: return '#9ca3af';
  }
}

/** Quick-add node items for the floating toolbar */
const quickAddItems = [
  { type: 'agent', icon: Bot, label: 'Agent', color: 'text-blue-600' },
  { type: 'input', icon: ArrowRight, label: 'Input', color: 'text-green-600' },
  { type: 'output', icon: ArrowLeft, label: 'Output', color: 'text-red-600' },
  { type: 'tool', icon: Wrench, label: 'Tool', color: 'text-gray-600' },
  { type: 'mcp-tool', icon: Server, label: 'MCP', color: 'text-indigo-600' },
  { type: 'custom-tool', icon: Code, label: 'Custom', color: 'text-pink-600' },
];

interface FlowEditorProps {
  className?: string;
  onNodeSelect?: (node: Node | null) => void;
  nodes?: Node[];
  onNodesChange?: (nodes: Node[]) => void;
  edges?: Edge[];
  onEdgesChange?: (edges: Edge[]) => void;
  graphMode?: boolean;
  onGraphModeChange?: (enabled: boolean) => void;
}

export function FlowEditor({
  className = '',
  onNodeSelect,
  nodes: externalNodes,
  onNodesChange: externalOnNodesChange,
  edges: externalEdges,
  onEdgesChange: externalOnEdgesChange,
  graphMode = false,
  onGraphModeChange
}: FlowEditorProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [internalNodes, setInternalNodes, onInternalNodesChange]: [Node[], (nodes: Node[]) => void, OnNodesChange] = useNodesState(initialNodes);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Use external nodes if provided, otherwise use internal state
  const nodes = externalNodes || internalNodes;
  const setNodes = externalOnNodesChange || setInternalNodes;
  const onNodesChange = externalOnNodesChange ? 
    (changes: any) => {
      const removedNodeIds = changes
        .filter((change: any) => change.type === 'remove')
        .map((change: any) => change.id);
      
      const updatedNodes = nodes.map((node) => {
        const change = changes.find((c: any) => c.id === node.id);
        if (!change) return node;
        switch (change.type) {
          case 'position':
            return { ...node, position: change.position };
          case 'select':
            return { ...node, selected: change.selected };
          case 'remove':
            return null;
          default:
            return node;
        }
      }).filter(Boolean);
      
      externalOnNodesChange(updatedNodes as Node[]);
      
      if (removedNodeIds.length > 0 && externalOnEdgesChange) {
        const updatedEdges = edges.filter(edge => 
          !removedNodeIds.includes(edge.source) && !removedNodeIds.includes(edge.target)
        );
        externalOnEdgesChange(updatedEdges);
      }
    } : 
    onInternalNodesChange;
  
  const [internalEdges, setInternalEdges, onInternalEdgesChange]: [Edge[], (edges: Edge[]) => void, OnEdgesChange] = useEdgesState(initialEdges);
  
  const edges = externalEdges || internalEdges;
  const setEdges = externalOnEdgesChange || setInternalEdges;
  const onEdgesChange = externalOnEdgesChange ? 
    (changes: any) => {
      const updatedEdges = edges.map((edge) => {
        const change = changes.find((c: any) => c.id === edge.id);
        if (!change) return edge;
        switch (change.type) {
          case 'remove':
            return null;
          case 'select':
            return { ...edge, selected: change.selected };
          default:
            return edge;
        }
      }).filter(Boolean);
      externalOnEdgesChange(updatedEdges as Edge[]);
    } : 
    onInternalEdgesChange;

  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      const validation = isValidConnection(params, nodes, edges, graphMode);
      if (validation.valid) {
        setEdges(addEdge({
          ...params,
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 },
        }, edges));
        setConnectionError(null);
      } else {
        // Show toast-style error instead of alert()
        setConnectionError(validation.message || 'Invalid connection');
        setTimeout(() => setConnectionError(null), 3000);
      }
    },
    [setEdges, nodes, edges, graphMode]
  );

  const isValidConnectionCallback = useCallback(
    (connection: Connection) => {
      const validation = isValidConnection(connection, nodes, edges, graphMode);
      return validation.valid;
    },
    [nodes, edges, graphMode]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      onNodeSelect?.(node);
    },
    [onNodeSelect]
  );

  const onPaneClick = useCallback(() => {
    onNodeSelect?.(null);
  }, [onNodeSelect]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  /** Create default data for a node type */
  const getDefaultNodeData = (type: string) => {
    const defaults: Record<string, any> = {
      agent: {
        label: 'Agent',
        modelProvider: 'AWS Bedrock',
        modelId: 'us.anthropic.claude-3-7-sonnet-20250219-v1:0',
        modelName: 'Claude 3.7 Sonnet',
        systemPrompt: 'You are a helpful AI assistant.',
        temperature: 0.7,
        maxTokens: 4000,
      },
      'orchestrator-agent': {
        label: 'Orchestrator',
        modelProvider: 'AWS Bedrock',
        modelId: 'us.anthropic.claude-3-7-sonnet-20250219-v1:0',
        modelName: 'Claude 3.7 Sonnet',
        systemPrompt: 'You orchestrate multiple agents to solve complex tasks.',
        temperature: 0.7,
        maxTokens: 4000,
      },
      swarm: { label: 'Swarm', maxHandoffs: 20, maxIterations: 20, executionTimeout: 900, nodeTimeout: 300 },
      'a2a-agent': { label: 'A2A Agent', endpoint: '', timeout: 300 },
      workflow: { label: 'Workflow', workflowId: 'my_workflow', tasks: [] },
      tool: { label: 'Tool', toolType: 'built-in', toolName: 'calculator' },
      'mcp-tool': { label: 'MCP Server', serverName: 'mcp_server', transportType: 'stdio', command: 'uvx', args: ['server-name@latest'], argsText: 'server-name@latest', url: 'http://localhost:8000/mcp', timeout: 30, description: 'MCP server for external tools', env: {}, envText: '' },
      input: { label: 'User Input' },
      output: { label: 'Output' },
      'custom-tool': { label: 'Custom Tool', pythonCode: '@tool\ndef my_tool(param: str) -> dict:\n    """Tool description."""\n    return {"status": "success"}' },
    };
    return defaults[type] || { label: `${type} node` };
  };

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: `${type}_${Date.now()}`,
        type,
        position,
        data: getDefaultNodeData(type),
      };

      setNodes([...nodes, newNode]);
    },
    [reactFlowInstance, setNodes, nodes]
  );

  /** Quick-add a node at the center of the current viewport */
  const handleQuickAdd = useCallback((type: string) => {
    if (!reactFlowInstance) return;

    const { x, y, zoom } = reactFlowInstance.getViewport();
    const centerX = (-x + (reactFlowWrapper.current?.clientWidth || 800) / 2) / zoom;
    const centerY = (-y + (reactFlowWrapper.current?.clientHeight || 600) / 2) / zoom;

    // Offset slightly to avoid stacking
    const offset = nodes.length * 20;

    const newNode: Node = {
      id: `${type}_${Date.now()}`,
      type,
      position: { x: centerX + offset, y: centerY + offset },
      data: getDefaultNodeData(type),
    };

    setNodes([...nodes, newNode]);
  }, [reactFlowInstance, setNodes, nodes]);

  /** Delete all selected nodes */
  const handleDeleteSelected = useCallback(() => {
    const selectedIds = nodes.filter(n => n.selected).map(n => n.id);
    if (selectedIds.length === 0) return;
    setNodes(nodes.filter(n => !n.selected));
    if (externalOnEdgesChange) {
      externalOnEdgesChange(edges.filter(e => !selectedIds.includes(e.source) && !selectedIds.includes(e.target)));
    }
  }, [nodes, edges, setNodes, externalOnEdgesChange]);

  return (
    <div className={`h-full w-full ${className} relative`} ref={reactFlowWrapper}>
      {/* Connection Error Toast */}
      {connectionError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
            <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-900" onClick={() => setConnectionError(null)} />
            {connectionError}
          </div>
        </div>
      )}

      {/* Graph Mode Toggle */}
      <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg px-4 py-2 flex items-center space-x-3 border border-gray-200">
        <Network className={`w-4 h-4 ${graphMode ? 'text-purple-600' : 'text-gray-400'}`} />
        <span className="text-sm font-medium text-gray-700">Graph Mode</span>
        <button
          onClick={() => onGraphModeChange?.(!graphMode)}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            ${graphMode ? 'bg-purple-600' : 'bg-gray-300'}
          `}
          title="Toggle Graph Mode: Enable DAG-based multi-agent orchestration"
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow
              ${graphMode ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={(edge) => isValidConnectionCallback(edge as Connection)}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        deleteKeyCode={["Delete", "Backspace"]}
        multiSelectionKeyCode={["Meta", "Ctrl"]}
        fitView
        attributionPosition="bottom-left"
        connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2 }}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 },
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Controls
          showInteractive={false}
          className="!bg-white !border !border-gray-200 !rounded-lg !shadow-md"
        />
        <MiniMap
          nodeColor={getMiniMapNodeColor}
          maskColor="rgba(0,0,0,0.08)"
          className="!bg-white !border !border-gray-200 !rounded-lg !shadow-md"
          pannable
          zoomable
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#e2e8f0"
        />

        {/* Bottom-left: Quick Add Toolbar */}
        <Panel position="bottom-center">
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2 flex items-center gap-1">
            {quickAddItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.type}
                  onClick={() => handleQuickAdd(item.type)}
                  className="flex flex-col items-center px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors group"
                  title={`Add ${item.label} node`}
                >
                  <Icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
                  <span className="text-[9px] text-gray-500 mt-0.5">{item.label}</span>
                </button>
              );
            })}
            <div className="w-px h-8 bg-gray-200 mx-1" />
            <button
              onClick={handleDeleteSelected}
              className="flex flex-col items-center px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors group"
              title="Delete selected nodes (Del)"
            >
              <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
              <span className="text-[9px] text-gray-500 mt-0.5">Delete</span>
            </button>
            <button
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="flex flex-col items-center px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors group"
              title="Keyboard shortcuts"
            >
              <Keyboard className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              <span className="text-[9px] text-gray-500 mt-0.5">Keys</span>
            </button>
          </div>
        </Panel>

        {/* Node count badge */}
        <Panel position="top-left">
          <div className="bg-white/90 border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm text-xs text-gray-600 flex items-center gap-3">
            <span><strong>{nodes.length}</strong> nodes</span>
            <span><strong>{edges.length}</strong> connections</span>
          </div>
        </Panel>
      </ReactFlow>

      {/* Keyboard Shortcuts Panel */}
      {showShortcuts && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-72">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-800">Keyboard Shortcuts</h4>
            <button onClick={() => setShowShortcuts(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-gray-600">Delete node</span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono">Del / ⌫</kbd></div>
            <div className="flex justify-between"><span className="text-gray-600">Multi-select</span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono">Ctrl/⌘ + Click</kbd></div>
            <div className="flex justify-between"><span className="text-gray-600">Pan canvas</span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono">Drag background</kbd></div>
            <div className="flex justify-between"><span className="text-gray-600">Zoom in/out</span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono">Scroll / Pinch</kbd></div>
            <div className="flex justify-between"><span className="text-gray-600">Fit view</span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono">Controls button</kbd></div>
            <div className="flex justify-between"><span className="text-gray-600">Connect nodes</span><kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono">Drag handle → handle</kbd></div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Bot className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-500 mb-1">Start building your agent</h3>
            <p className="text-sm text-gray-400 max-w-xs">
              Drag nodes from the palette on the left, or use the quick-add bar below
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
