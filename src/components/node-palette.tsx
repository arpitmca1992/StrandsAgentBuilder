import React, { useState } from 'react';
import { Bot, Wrench, ArrowRight, ArrowLeft, Code, Server, Crown, Users, Globe, GitBranch, Search, X } from 'lucide-react';

interface NodeTypeItem {
  type: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  category: string;
  color: string;
}

const nodeTypes: NodeTypeItem[] = [
  {
    type: 'agent',
    label: 'Agent',
    icon: Bot,
    description: 'Strands Agent with configurable model and settings',
    category: 'Core',
    color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
  },
  {
    type: 'orchestrator-agent',
    label: 'Orchestrator',
    icon: Crown,
    description: 'Orchestrates multiple agents as tools',
    category: 'Multi-Agent',
    color: 'bg-purple-50 border-purple-200 hover:border-purple-400',
  },
  {
    type: 'swarm',
    label: 'Swarm',
    icon: Users,
    description: 'Multi-agent swarm with handoff coordination',
    category: 'Multi-Agent',
    color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400',
  },
  {
    type: 'a2a-agent',
    label: 'A2A Agent',
    icon: Globe,
    description: 'Connect to remote A2A protocol endpoints',
    category: 'Multi-Agent',
    color: 'bg-sky-50 border-sky-200 hover:border-sky-400',
  },
  {
    type: 'workflow',
    label: 'Workflow',
    icon: GitBranch,
    description: 'DAG-based task pipeline with dependencies',
    category: 'Multi-Agent',
    color: 'bg-amber-50 border-amber-200 hover:border-amber-400',
  },
  {
    type: 'tool',
    label: 'Built-in Tool',
    icon: Wrench,
    description: 'Pre-built tools (calculator, HTTP, file)',
    category: 'Tools',
    color: 'bg-gray-50 border-gray-200 hover:border-gray-400',
  },
  {
    type: 'mcp-tool',
    label: 'MCP Server',
    icon: Server,
    description: 'Model Context Protocol server integration',
    category: 'Tools',
    color: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400',
  },
  {
    type: 'custom-tool',
    label: 'Custom Tool',
    icon: Code,
    description: 'Define custom @tool with Python code',
    category: 'Tools',
    color: 'bg-pink-50 border-pink-200 hover:border-pink-400',
  },
  {
    type: 'input',
    label: 'Input',
    icon: ArrowRight,
    description: 'User input prompt or data source',
    category: 'IO',
    color: 'bg-green-50 border-green-200 hover:border-green-400',
  },
  {
    type: 'output',
    label: 'Output',
    icon: ArrowLeft,
    description: 'Agent response or result destination',
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

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
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
      {/* Logo & Branding */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

                  return (
                    <div
                      key={nodeType.type}
                      className={`flex items-center p-2.5 rounded-lg cursor-grab active:cursor-grabbing transition-all border ${nodeType.color} hover:shadow-sm active:shadow-md active:scale-[0.98]`}
                      draggable
                      onDragStart={(event) => onDragStart(event, nodeType.type)}
                      title={`Drag to canvas: ${nodeType.description}`}
                    >
                      <div className="w-8 h-8 rounded-md bg-white/80 border border-white shadow-sm flex items-center justify-center mr-2.5 flex-shrink-0">
                        <IconComponent className="w-4 h-4 text-gray-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-800">{nodeType.label}</div>
                        <div className="text-[10px] text-gray-500 truncate">{nodeType.description}</div>
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
    </div>
  );
}
