import React, { useState } from 'react';
import { Bot, Wrench, ArrowRight, ArrowLeft, Code, Server, Crown, Users, Globe, GitBranch, Search, X, Cpu } from 'lucide-react';

interface NodeTypeItem {
  type: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  tooltip: string;
  docUrl: string;
  category: string;
  color: string;
}

const nodeTypes: NodeTypeItem[] = [
  {
    type: 'agent',
    label: 'Agent',
    icon: Bot,
    description: 'Strands Agent with configurable model and settings',
    tooltip: 'A single AI agent powered by an LLM. The agent loop handles tool selection, reasoning, and response generation. Connect tools for capabilities and configure model, system prompt, and guardrails.',
    docUrl: 'https://strandsagents.com/docs/user-guide/concepts/agents/agent-loop/',
    category: 'Core',
    color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
  },
  {
    type: 'orchestrator-agent',
    label: 'Orchestrator',
    icon: Crown,
    description: 'Coordinates multiple agents as callable tools',
    tooltip: 'An orchestrator agent that wraps other agents as tools. It decides which sub-agent to invoke based on the task. Use for complex workflows where different agents specialize in different tasks (e.g., research agent + writing agent).',
    docUrl: 'https://strandsagents.com/docs/user-guide/concepts/multi-agent/agents-as-tools/',
    category: 'Multi-Agent',
    color: 'bg-purple-50 border-purple-200 hover:border-purple-400',
  },
  {
    type: 'swarm',
    label: 'Swarm',
    icon: Users,
    description: 'Autonomous agent team with handoff coordination',
    tooltip: 'A dynamic team of agents that autonomously hand off tasks to each other. Agents decide the execution path themselves. Best for collaborative tasks where agents need to coordinate without predefined sequence (e.g., customer support with specialist routing).',
    docUrl: 'https://strandsagents.com/docs/user-guide/concepts/multi-agent/swarm/',
    category: 'Multi-Agent',
    color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400',
  },
  {
    type: 'a2a-agent',
    label: 'A2A Agent',
    icon: Globe,
    description: 'Connect to remote Agent-to-Agent endpoints',
    tooltip: 'Connects to a remote A2A (Agent-to-Agent) protocol server. Enables cross-platform agent communication — invoke agents running on different servers, frameworks, or organizations as if they were local. Uses the open A2A standard.',
    docUrl: 'https://strandsagents.com/docs/user-guide/concepts/multi-agent/agent-to-agent/',
    category: 'Multi-Agent',
    color: 'bg-sky-50 border-sky-200 hover:border-sky-400',
  },
  {
    type: 'workflow',
    label: 'Workflow',
    icon: GitBranch,
    description: 'DAG-based task pipeline with parallel execution',
    tooltip: 'A deterministic task graph (DAG) where you define tasks with explicit dependencies. Independent tasks run in parallel, dependent tasks run sequentially. Each task gets its own system prompt and context from upstream results. Best for repeatable, multi-step processes.',
    docUrl: 'https://strandsagents.com/docs/user-guide/concepts/multi-agent/workflow/',
    category: 'Multi-Agent',
    color: 'bg-amber-50 border-amber-200 hover:border-amber-400',
  },
  {
    type: 'function-node',
    label: 'Function Node',
    icon: Cpu,
    description: 'Deterministic Python function (no LLM)',
    tooltip: 'A custom node that runs pure Python code without calling an LLM. Use for data transformation, validation, API calls, or any deterministic logic in Graph mode. Faster and cheaper than agent nodes for non-AI operations.',
    docUrl: 'https://strandsagents.com/docs/user-guide/concepts/multi-agent/graph/#custom-node-types',
    category: 'Multi-Agent',
    color: 'bg-teal-50 border-teal-200 hover:border-teal-400',
  },
  {
    type: 'tool',
    label: 'Built-in Tool',
    icon: Wrench,
    description: 'Pre-built tools (calculator, HTTP, file)',
    tooltip: 'Pre-built tool functions from the strands-tools package. Includes calculator, file_read, file_write, shell, http_request, current_time, editor, and more. Connect to an Agent\'s "Tools" handle to give it capabilities.',
    docUrl: 'https://strandsagents.com/docs/user-guide/concepts/tools/community-tools-package/',
    category: 'Tools',
    color: 'bg-gray-50 border-gray-200 hover:border-gray-400',
  },
  {
    type: 'mcp-tool',
    label: 'MCP Server',
    icon: Server,
    description: 'Model Context Protocol server integration',
    tooltip: 'Connect to an MCP (Model Context Protocol) server to give your agent access to external tools, data sources, and APIs. Supports stdio, SSE, and streamable HTTP transports. Each MCP server can connect to one agent.',
    docUrl: 'https://strandsagents.com/docs/user-guide/concepts/tools/mcp-tools/',
    category: 'Tools',
    color: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400',
  },
  {
    type: 'custom-tool',
    label: 'Custom Tool',
    icon: Code,
    description: 'Define custom @tool with Python code',
    tooltip: 'Write your own tool function using the @tool decorator. Define parameters, return types, and docstrings that the LLM reads to decide when and how to call your tool. Full Python — use any library.',
    docUrl: 'https://strandsagents.com/docs/user-guide/concepts/tools/custom-tools/',
    category: 'Tools',
    color: 'bg-pink-50 border-pink-200 hover:border-pink-400',
  },
  {
    type: 'input',
    label: 'Input',
    icon: ArrowRight,
    description: 'User input prompt or data source',
    tooltip: 'The entry point for your flow. Represents user input that gets passed to the connected agent. Every flow needs at least one Input node connected to an agent.',
    docUrl: 'https://strandsagents.com/docs/user-guide/quickstart/python/',
    category: 'IO',
    color: 'bg-green-50 border-green-200 hover:border-green-400',
  },
  {
    type: 'output',
    label: 'Output',
    icon: ArrowLeft,
    description: 'Agent response or result destination',
    tooltip: 'Captures the final agent response. Connect from an agent\'s "Output" handle. Required for code generation — without it, the generated code won\'t return results.',
    docUrl: 'https://strandsagents.com/docs/user-guide/concepts/streaming/',
    category: 'IO',
    color: 'bg-red-50 border-red-200 hover:border-red-400',
  },
];

const categories = ['IO', 'Core', 'Tools', 'Multi-Agent'];

interface NodePaletteProps {
  className?: string;
}

export function NodePalette({ className = '' }: NodePaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [draggingType, setDraggingType] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<NodeTypeItem | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
    setDraggingType(nodeType);

    // Create a custom drag image (small, clean)
    const ghost = document.createElement('div');
    ghost.className = 'fixed -top-[200px] left-0 px-3 py-2 bg-white border border-indigo-300 rounded-lg shadow-xl text-xs font-medium text-indigo-700 flex items-center gap-2 z-[9999]';
    ghost.innerHTML = `<span>⬡</span><span>${label}</span>`;
    document.body.appendChild(ghost);
    event.dataTransfer.setDragImage(ghost, 40, 20);

    // Cleanup ghost element after drag starts
    requestAnimationFrame(() => {
      setTimeout(() => document.body.removeChild(ghost), 0);
    });
  };

  const onDragEnd = () => {
    setDraggingType(null);
  };

  // Filter nodes by search — derived state, no useEffect
  const filteredNodeTypes = searchQuery
    ? nodeTypes.filter(
        (node) =>
          node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : nodeTypes;

  const filteredCategories = searchQuery
    ? categories.filter((cat) => filteredNodeTypes.some((n) => n.category === cat))
    : categories;

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col ${className}`}>
      {/* Logo & Branding — matches header height (h-12 = 48px) */}
      <div className="h-12 px-4 flex items-center border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="leading-tight">
            <h1 className="text-sm font-bold text-gray-900 tracking-tight">Strands Builder</h1>
            <p className="text-[10px] text-indigo-600 font-medium">Visual Agent Studio</p>
          </div>
        </div>
      </div>

      {/* Components Header + Search */}
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Components</h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
            placeholder="Search nodes..."
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Node List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {filteredCategories.map((category) => {
          const categoryNodes = filteredNodeTypes.filter((node) => node.category === category);
          if (categoryNodes.length === 0) return null;

          return (
            <div key={category}>
              <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
                {category}
              </h3>
              <div className="space-y-1.5">
                {categoryNodes.map((nodeType) => {
                  const IconComponent = nodeType.icon;
                  const isDragging = draggingType === nodeType.type;

                  return (
                    <div
                      key={nodeType.type}
                      className={`rounded-lg cursor-grab active:cursor-grabbing transition-all border ${nodeType.color} hover:shadow-sm active:shadow-md active:scale-[0.98] ${
                        isDragging ? 'opacity-40 scale-95 ring-2 ring-indigo-300' : ''
                      }`}
                      draggable
                      onDragStart={(event) => onDragStart(event, nodeType.type, nodeType.label)}
                      onDragEnd={onDragEnd}
                      role="button"
                      tabIndex={0}
                      aria-label={`Add ${nodeType.label} node. ${nodeType.description}`}
                    >
                      {/* Main row */}
                      <div className="flex items-center p-2.5 group">
                        <div className="w-8 h-8 rounded-md bg-white/80 border border-white shadow-sm flex items-center justify-center mr-2.5 flex-shrink-0">
                          <IconComponent className="w-4 h-4 text-gray-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-gray-800">{nodeType.label}</div>
                          <div className="text-[10px] text-gray-500 truncate">{nodeType.description}</div>
                        </div>
                        {/* Info icon — hover to show tooltip */}
                        <div className="relative flex-shrink-0 ml-1">
                          <div
                            className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-100 hover:text-blue-600 transition-colors cursor-help"
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setTooltipPos({ top: rect.top - 8, left: rect.right + 8 });
                              setHoveredNode(nodeType);
                            }}
                            onMouseLeave={() => setHoveredNode(null)}
                          >
                            <span className="text-[9px] font-bold">?</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredNodeTypes.length === 0 && (
          <div className="text-center py-8">
            <Search className="w-6 h-6 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-400">No nodes match &ldquo;{searchQuery}&rdquo;</p>
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="p-3 border-t border-gray-100 bg-gray-50">
        <p className="text-[10px] text-gray-400 text-center">
          Drag nodes to canvas or use quick-add bar
        </p>
      </div>

      {/* Tooltip — rendered fixed, outside scroll container */}
      {hoveredNode && (
        <div
          className="fixed w-60 bg-gray-900 text-white text-[10px] rounded-lg shadow-2xl p-3 z-[9999] pointer-events-none"
          style={{ top: tooltipPos.top, left: tooltipPos.left }}
        >
          <p className="font-semibold text-[11px] text-gray-100 mb-1.5">{hoveredNode.label}</p>
          <p className="leading-relaxed text-gray-300 mb-2">{hoveredNode.tooltip}</p>
          <span className="inline-flex items-center gap-1 text-blue-300 text-[10px]">
            📖 Strands Docs →
          </span>
          <div className="absolute top-3 -left-1.5 w-2.5 h-2.5 bg-gray-900 rotate-45" />
        </div>
      )}
    </div>
  );
}
