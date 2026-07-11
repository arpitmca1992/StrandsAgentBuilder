import { Handle, Position, type NodeProps, useReactFlow } from '@xyflow/react';
import { Bot, Settings, X, Shield, Zap, Brain, Activity } from 'lucide-react';

interface AgentNodeData {
  label?: string;
  modelProvider?: string;
  modelId?: string;
  modelName?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  streaming?: boolean;
  apiKey?: string;
  baseUrl?: string;
  thinkingEnabled?: boolean;
  thinkingBudgetTokens?: number;
  reasoningEffort?: 'low' | 'medium' | 'high';
  // Feature badges
  bedrockGuardrailEnabled?: boolean;
  agentControlEnabled?: boolean;
  otelEnabled?: boolean;
  memoryEnabled?: boolean;
  goalLoopEnabled?: boolean;
  humanInLoopEnabled?: boolean;
}

export function AgentNode({ data, selected, id }: NodeProps) {
  const { deleteElements } = useReactFlow();
  const nodeData = data as AgentNodeData || {};
  const {
    label = 'Agent',
    modelProvider = 'AWS Bedrock',
    modelName = 'Claude 3.7 Sonnet',
    temperature = 0.7,
    streaming = false,
    systemPrompt = '',
    bedrockGuardrailEnabled = false,
    agentControlEnabled = false,
    otelEnabled = false,
    memoryEnabled = false,
    thinkingEnabled = false,
  } = nodeData;

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };

  // Truncate system prompt for preview
  const promptPreview = systemPrompt
    ? systemPrompt.slice(0, 60) + (systemPrompt.length > 60 ? '...' : '')
    : 'No system prompt';

  const hasGuardrails = bedrockGuardrailEnabled || agentControlEnabled;

  return (
    <div className={`
      bg-white rounded-xl border-2 shadow-sm min-w-[220px] max-w-[260px] transition-all duration-150
      ${selected ? 'border-blue-500 shadow-xl ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300 hover:shadow-md'}
    `}>
      {/* Node Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 border-b border-blue-100 rounded-t-[10px] flex items-center">
        <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center mr-2">
          <Bot className="w-3.5 h-3.5 text-blue-600" />
        </div>
        <span className="text-sm font-semibold text-gray-800 truncate flex-1">{label}</span>
        <div className="ml-auto flex items-center space-x-1">
          {selected && (
            <button
              onClick={handleDelete}
              className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
              title="Delete node"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Node Content */}
      <div className="px-3 py-2.5">
        {/* Model info */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-medium truncate">
            {modelProvider === 'AWS Bedrock' ? '☁️ Bedrock' : modelProvider}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium truncate">
            {modelName}
          </span>
        </div>

        {/* System prompt preview */}
        <p className="text-[10px] text-gray-400 italic line-clamp-2 mb-2 leading-relaxed">
          &ldquo;{promptPreview}&rdquo;
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap gap-1">
          {streaming && (
            <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
              <Zap className="w-2.5 h-2.5" /> Stream
            </span>
          )}
          {hasGuardrails && (
            <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
              <Shield className="w-2.5 h-2.5" /> Safe
            </span>
          )}
          {otelEnabled && (
            <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              <Activity className="w-2.5 h-2.5" /> Trace
            </span>
          )}
          {memoryEnabled && (
            <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
              <Brain className="w-2.5 h-2.5" /> Memory
            </span>
          )}
          {thinkingEnabled && (
            <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              💭 Think
            </span>
          )}
        </div>

        {/* Temperature indicator */}
        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-[9px] text-gray-400">Temp</span>
          <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-orange-400 rounded-full transition-all"
              style={{ width: `${(temperature as number) * 100}%` }}
            />
          </div>
          <span className="text-[9px] text-gray-500 font-mono">{temperature}</span>
        </div>
      </div>

      {/* Input Handle */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center">
        <span className="text-[9px] font-medium text-green-600 bg-green-50 px-1.5 rounded-full border border-green-200 mb-0.5">Input</span>
        <Handle
          type="target"
          position={Position.Top}
          id="user-input"
          className="!bg-green-500 !w-3 !h-3 !border-2 !border-white !relative !transform-none"
          style={{ position: 'relative', top: 0, left: 0 }}
        />
      </div>

      {/* Tool Handle (left) */}
      <div className="absolute left-0 top-[40%] -translate-x-full -translate-y-1/2 flex items-center">
        <span className="text-[9px] font-medium text-orange-600 bg-orange-50 px-1.5 rounded-full border border-orange-200 mr-0.5">Tools</span>
        <Handle
          type="target"
          position={Position.Left}
          id="tools"
          className="!bg-orange-500 !w-3 !h-3 !border-2 !border-white !relative !transform-none"
          style={{ position: 'relative', left: 0, top: 0 }}
        />
      </div>
      <Handle
        type="target"
        position={Position.Left}
        id="orchestrator-input"
        className="!bg-purple-400 !w-3 !h-3 !border-2 !border-white !absolute"
        style={{ left: -6, top: '70%' }}
      />

      {/* Output Handle */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full flex flex-col items-center">
        <Handle
          type="source"
          position={Position.Bottom}
          id="output"
          className="!bg-indigo-500 !w-3 !h-3 !border-2 !border-white !relative !transform-none"
          style={{ position: 'relative', bottom: 0, left: 0 }}
        />
        <span className="text-[9px] font-medium text-indigo-600 bg-indigo-50 px-1.5 rounded-full border border-indigo-200 mt-0.5">Output</span>
      </div>
    </div>
  );
}
