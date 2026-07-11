import { type Node, type Edge } from '@xyflow/react';
import { Settings, X } from 'lucide-react';
import { ModelProviderConfig } from './model-provider-config';
import { AgentAdvancedConfig } from './agent-advanced-config';
import { GuardrailsConfig } from './guardrails-config';
import { ObservabilityConfig } from './observability-config';
import { AdvancedFeaturesConfig } from './advanced-features-config';
import { AgentPluginsConfig } from './agent-plugins-config';

interface PropertyPanelProps {
  selectedNode: Node | null;
  onClose: () => void;
  onUpdateNode: (nodeId: string, data: any) => void;
  edges?: Edge[];
  nodes?: Node[];
  className?: string;
}

export function PropertyPanel({
  selectedNode,
  onClose,
  onUpdateNode,
  edges = [],
  nodes = [],
  className = ''
}: PropertyPanelProps) {
  if (!selectedNode) {
    return null;
  }

  // Check if the selected node has an output node connected
  const hasConnectedOutputNode = () => {
    if (!selectedNode || (selectedNode.type !== 'agent' && selectedNode.type !== 'orchestrator-agent')) {
      return true; // For non-agent nodes, always allow streaming
    }

    // Find all edges where this node is the source from its output handle
    const outgoingEdges = edges.filter(edge =>
      edge.source === selectedNode.id && edge.sourceHandle === 'output'
    );

    // For each outgoing edge, check if the target node is an output node
    return outgoingEdges.some(edge => {
      const targetNode = nodes.find(node => node.id === edge.target);
      return targetNode && targetNode.type === 'output';
    });
  };

  const handleInputChange = (field: string, value: any) => {
    try {
      onUpdateNode(selectedNode.id, {
        ...selectedNode.data,
        [field]: value,
      });
    } catch (error) {
      console.error('Failed to update node property:', error);
      // In a production app, you might want to show a toast notification here
    }
  };

  const renderAgentProperties = (data: any) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Agent Name
        </label>
        <input
          type="text"
          value={data.label || ''}
          onChange={(e) => handleInputChange('label', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Agent Name"
        />
      </div>

      <ModelProviderConfig
        data={data}
        onUpdate={(updates) => {
          onUpdateNode(selectedNode.id, {
            ...selectedNode.data,
            ...updates,
          });
        }}
        showStreaming={true}
        streamingAvailable={hasConnectedOutputNode()}
      />

      <AgentAdvancedConfig
        data={data}
        onUpdate={(updates) => {
          onUpdateNode(selectedNode.id, {
            ...selectedNode.data,
            ...updates,
          });
        }}
      />

      <GuardrailsConfig
        data={data}
        onUpdate={(updates) => {
          onUpdateNode(selectedNode.id, {
            ...selectedNode.data,
            ...updates,
          });
        }}
      />

      <ObservabilityConfig
        data={data}
        onUpdate={(updates) => {
          onUpdateNode(selectedNode.id, {
            ...selectedNode.data,
            ...updates,
          });
        }}
      />

      <AdvancedFeaturesConfig
        data={data}
        onUpdate={(updates) => {
          onUpdateNode(selectedNode.id, {
            ...selectedNode.data,
            ...updates,
          });
        }}
      />

      <AgentPluginsConfig
        data={data}
        onUpdate={(updates) => {
          onUpdateNode(selectedNode.id, {
            ...selectedNode.data,
            ...updates,
          });
        }}
      />
    </div>
  );

  const renderToolProperties = (data: any) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tool Name
        </label>
        <input
          type="text"
          value={data.label || ''}
          onChange={(e) => handleInputChange('label', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Tool Name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tool Type
        </label>
        <select
          value={data.toolType || 'built-in'}
          onChange={(e) => handleInputChange('toolType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="built-in">Built-in</option>
          {/* <option value="custom">Custom</option> */}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tool Name/Function
        </label>
        {data.toolType === 'built-in' || !data.toolType ? (
          <select
            value={data.toolName || 'calculator'}
            onChange={(e) => handleInputChange('toolName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="calculator">Calculator</option>
            <option value="file_read">File Reader</option>
            <option value="file_write">File Write</option>
            <option value="shell">Shell Command</option>
            <option value="current_time">Current Time</option>
            <option value="http_request">Http Request</option>
            <option value="editor">Editor</option>
            <option value="retrieve">Retrieve (KB)</option>
            <option value="mem0_memory">mem0_memory</option>
          </select>
        ) : (
          <input
            type="text"
            value={data.toolName || ''}
            onChange={(e) => handleInputChange('toolName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="custom_function_name"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={data.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Tool description..."
          rows={3}
        />
      </div>
    </div>
  );

  const renderInputProperties = () => (
    <div className="space-y-4">
      <div className="text-center py-8">
        <div className="text-gray-500">
          Input node - connects user input to agents
        </div>
        <div className="text-sm text-gray-400 mt-2">
          No configuration required
        </div>
      </div>
    </div>
  );

  const renderMCPToolProperties = (data: any) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Server Name
        </label>
        <input
          type="text"
          value={data.serverName || ''}
          onChange={(e) => handleInputChange('serverName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="MCP Server Name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transport Type
        </label>
        <select
          value={data.transportType || 'stdio'}
          onChange={(e) => handleInputChange('transportType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="stdio">Standard I/O (stdio)</option>
          <option value="streamable_http">Streamable HTTP</option>
          <option value="sse">Server-Sent Events (SSE)</option>
        </select>
      </div>

      {data.transportType === 'stdio' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Command
            </label>
            <input
              type="text"
              value={data.command || ''}
              onChange={(e) => handleInputChange('command', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="uvx"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arguments (one per line)
            </label>
            <textarea
              value={data.argsText !== undefined ? data.argsText : (data.args ? data.args.join('\n') : '')}
              onChange={(e) => {
                const argsText = e.target.value;
                const args = argsText.split('\n').filter(arg => arg.trim());
                onUpdateNode(selectedNode.id, {
                  ...selectedNode.data,
                  argsText: argsText,
                  args: args
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y"
              placeholder="server-name@latest"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter each argument on a separate line
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Environment Variables (JSON format)
            </label>
            <textarea
              value={data.envText || (data.env && Object.keys(data.env).length > 0 ? JSON.stringify(data.env, null, 2) : '')}
              onChange={(e) => {
                const envText = e.target.value.trim();
                try {
                  const env = envText ? JSON.parse(envText) : {};
                  handleInputChange('envText', envText);
                  handleInputChange('env', env);
                } catch {
                  // Keep the text even if JSON is invalid for user to continue editing
                  handleInputChange('envText', envText);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 resize-y font-mono text-sm"
              placeholder='{\n  "PATH": "/usr/local/bin",\n  "API_KEY": "your-key"\n}'
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional environment variables for the MCP server process (valid JSON required)
            </p>
          </div>
        </>
      )}

      {(data.transportType === 'streamable_http' || data.transportType === 'sse') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Server URL
          </label>
          <input
            type="url"
            value={data.url || ''}
            onChange={(e) => handleInputChange('url', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="http://localhost:8000/mcp"
          />
        </div>
      )}

      {(data.transportType === 'streamable_http' || data.transportType === 'sse') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Headers (JSON format)
          </label>
          <textarea
            value={data.headersText || ''}
            onChange={(e) => {
              const headersText = e.target.value;
              try {
                const headers = headersText ? JSON.parse(headersText) : {};
                handleInputChange('headersText', headersText);
                handleInputChange('headers', headers);
              } catch {
                handleInputChange('headersText', headersText);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder='{"Authorization": "Bearer token"}'
            rows={3}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timeout (seconds)
        </label>
        <input
          type="number"
          value={data.timeout || 30}
          onChange={(e) => handleInputChange('timeout', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          min="1"
          max="300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={data.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Description of the MCP server..."
          rows={3}
        />
      </div>
    </div>
  );

  const renderCustomToolProperties = (data: any) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tool Name
        </label>
        <input
          type="text"
          value={data.label || ''}
          onChange={(e) => handleInputChange('label', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="My Custom Tool"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Python Function
        </label>
        <textarea
          value={data.pythonCode || ''}
          onChange={(e) => handleInputChange('pythonCode', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
          placeholder="def word_counter(text: str) -> str:&#10;    &quot;&quot;&quot;Count words in the provided text&quot;&quot;&quot;&#10;    word_count = len(text.split())&#10;    return f&quot;Word count: {word_count}&quot;"
          rows={12}
        />
        <p className="text-xs text-gray-500 mt-1">
          Complete Python function with type hints and docstring. The function will be automatically decorated with @tool.
        </p>
      </div>
    </div>
  );

  const renderOrchestratorAgentProperties = (data: any) => (
    <div className="space-y-4">
      {/* Basic Agent Properties */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Orchestrator Name
        </label>
        <input
          type="text"
          value={data.label || ''}
          onChange={(e) => handleInputChange('label', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          placeholder="Orchestrator Agent"
        />
      </div>

      <ModelProviderConfig
        data={data}
        onUpdate={(updates) => {
          onUpdateNode(selectedNode.id, {
            ...selectedNode.data,
            ...updates,
          });
        }}
        showStreaming={true}
        streamingAvailable={hasConnectedOutputNode()}
      />

      <AgentAdvancedConfig
        data={data}
        onUpdate={(updates) => {
          onUpdateNode(selectedNode.id, {
            ...selectedNode.data,
            ...updates,
          });
        }}
      />

      <GuardrailsConfig
        data={data}
        onUpdate={(updates) => {
          onUpdateNode(selectedNode.id, {
            ...selectedNode.data,
            ...updates,
          });
        }}
      />

      <ObservabilityConfig
        data={data}
        onUpdate={(updates) => {
          onUpdateNode(selectedNode.id, {
            ...selectedNode.data,
            ...updates,
          });
        }}
      />

      <AdvancedFeaturesConfig
        data={data}
        onUpdate={(updates) => {
          onUpdateNode(selectedNode.id, {
            ...selectedNode.data,
            ...updates,
          });
        }}
      />

      <AgentPluginsConfig
        data={data}
        onUpdate={(updates) => {
          onUpdateNode(selectedNode.id, {
            ...selectedNode.data,
            ...updates,
          });
        }}
      />

      {/* Orchestrator-Specific Properties */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold text-purple-800 mb-3">Orchestration Settings</h4>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Coordination Prompt
          </label>
          <textarea
            value={data.coordinationPrompt || ''}
            onChange={(e) => handleInputChange('coordinationPrompt', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            placeholder="Instructions for how to coordinate and aggregate results from sub-agents..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  const renderGraphBuilderProperties = (data: any) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Graph Name
        </label>
        <input
          type="text"
          value={data.label || ''}
          onChange={(e) => handleInputChange('label', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          placeholder="Graph"
        />
        <p className="text-xs text-gray-500 mt-1">
          Name for this graph workflow
        </p>
      </div>

      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold text-purple-800 mb-2">Entry Points</h4>
        <p className="text-sm text-gray-600 mb-2">
          Connect the purple handle (right side) to agent nodes to define entry points.
          Entry point agents receive the original user input.
        </p>
      </div>

      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold text-purple-800 mb-2">Agent Dependencies</h4>
        <p className="text-sm text-gray-600 mb-2">
          Connect agent output (bottom) to another agent's input (top) to define execution dependencies.
          Example: Agent A → Agent B means B depends on A's output.
        </p>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={data.enableDebugLogs || false}
            onChange={(e) => handleInputChange('enableDebugLogs', e.target.checked)}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <span className="text-sm font-medium text-gray-700">Enable Debug Logs</span>
        </label>
        <p className="text-xs text-gray-500 mt-1">
          Enable debug logging for graph execution
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Execution Timeout (seconds)
        </label>
        <input
          type="number"
          value={data.executionTimeout || ''}
          onChange={(e) => handleInputChange('executionTimeout', e.target.value ? parseInt(e.target.value) : undefined)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          placeholder="Optional"
          min="1"
        />
        <p className="text-xs text-gray-500 mt-1">
          Leave empty for no timeout
        </p>
      </div>
    </div>
  );

  const renderA2AAgentProperties = (data: any) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Node Label
        </label>
        <input
          type="text"
          value={data.label || ''}
          onChange={(e) => handleInputChange('label', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
          placeholder="A2A Agent"
        />
      </div>

      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold text-sky-800 mb-3">A2A Connection</h4>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Endpoint URL <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.endpoint || ''}
            onChange={(e) => handleInputChange('endpoint', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
            placeholder="http://localhost:9000"
          />
          <p className="text-xs text-gray-500 mt-1">
            Base URL of the remote A2A agent server
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agent Name
          </label>
          <input
            type="text"
            value={data.agentName || ''}
            onChange={(e) => handleInputChange('agentName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
            placeholder="(auto-detected from agent card)"
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional — auto-populated from agent card if not provided
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={data.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
            placeholder="Optional description of what this agent does"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timeout (seconds)
          </label>
          <input
            type="number"
            value={data.timeout || 300}
            onChange={(e) => handleInputChange('timeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
            min="10"
            max="3600"
          />
          <p className="text-xs text-gray-500 mt-1">
            Timeout for HTTP operations (default: 300s)
          </p>
        </div>

        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Streaming
          </label>
          <input
            type="checkbox"
            checked={data.streaming || false}
            onChange={(e) => handleInputChange('streaming', e.target.checked)}
            className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Use streaming responses (uses stream_async)
        </p>
      </div>
    </div>
  );

  const renderWorkflowProperties = (data: any) => {
    const tasks = data.tasks || [];

    const addTask = () => {
      const newTasks = [...tasks, {
        taskId: `task_${tasks.length + 1}`,
        description: '',
        systemPrompt: '',
        dependencies: [],
        priority: 3,
      }];
      handleInputChange('tasks', newTasks);
    };

    const removeTask = (index: number) => {
      const newTasks = tasks.filter((_: any, i: number) => i !== index);
      handleInputChange('tasks', newTasks);
    };

    const updateTask = (index: number, field: string, value: any) => {
      const newTasks = [...tasks];
      newTasks[index] = { ...newTasks[index], [field]: value };
      handleInputChange('tasks', newTasks);
    };

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Workflow Label
          </label>
          <input
            type="text"
            value={data.label || ''}
            onChange={(e) => handleInputChange('label', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
            placeholder="Workflow"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Workflow ID
          </label>
          <input
            type="text"
            value={data.workflowId || ''}
            onChange={(e) => handleInputChange('workflowId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 font-mono text-sm"
            placeholder="my_workflow"
          />
          <p className="text-xs text-gray-500 mt-1">
            Unique identifier for this workflow (used in code generation)
          </p>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-amber-800">Tasks</h4>
            <button
              onClick={addTask}
              className="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition-colors"
            >
              + Add Task
            </button>
          </div>

          {tasks.length === 0 && (
            <p className="text-xs text-gray-400 italic text-center py-4">
              No tasks defined. Click "+ Add Task" to create one.
            </p>
          )}

          <div className="space-y-4">
            {tasks.map((task: any, index: number) => (
              <div key={index} className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-700">Task #{index + 1}</span>
                  <button
                    onClick={() => removeTask(index)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Task ID
                    </label>
                    <input
                      type="text"
                      value={task.taskId || ''}
                      onChange={(e) => updateTask(index, 'taskId', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-amber-500 focus:border-amber-500 font-mono"
                      placeholder="task_id"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Description
                    </label>
                    <textarea
                      value={task.description || ''}
                      onChange={(e) => updateTask(index, 'description', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-amber-500 focus:border-amber-500"
                      placeholder="What this task does..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      System Prompt
                    </label>
                    <textarea
                      value={task.systemPrompt || ''}
                      onChange={(e) => updateTask(index, 'systemPrompt', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Agent persona for this task..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Dependencies (comma-separated task IDs)
                    </label>
                    <input
                      type="text"
                      value={(task.dependencies || []).join(', ')}
                      onChange={(e) => updateTask(index, 'dependencies', e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-amber-500 focus:border-amber-500 font-mono"
                      placeholder="task_1, task_2"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Priority (1=highest, 5=lowest)
                    </label>
                    <input
                      type="number"
                      value={task.priority || 3}
                      onChange={(e) => updateTask(index, 'priority', parseInt(e.target.value))}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-amber-500 focus:border-amber-500"
                      min="1"
                      max="5"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSwarmProperties = (data: any) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Swarm Name
        </label>
        <input
          type="text"
          value={data.label || ''}
          onChange={(e) => handleInputChange('label', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          placeholder="Swarm Name"
        />
      </div>

      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold text-emerald-800 mb-3">Execution Settings</h4>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Handoffs
          </label>
          <input
            type="number"
            value={data.maxHandoffs || 20}
            onChange={(e) => handleInputChange('maxHandoffs', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            min="1"
            max="100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum number of agent handoffs allowed during execution
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Iterations
          </label>
          <input
            type="number"
            value={data.maxIterations || 20}
            onChange={(e) => handleInputChange('maxIterations', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            min="1"
            max="100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum total iterations across all agents
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Execution Timeout (seconds)
          </label>
          <input
            type="number"
            value={data.executionTimeout || 900}
            onChange={(e) => handleInputChange('executionTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            min="10"
            max="3600"
          />
          <p className="text-xs text-gray-500 mt-1">
            Total execution timeout in seconds (default: 900 = 15 minutes)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Node Timeout (seconds)
          </label>
          <input
            type="number"
            value={data.nodeTimeout || 300}
            onChange={(e) => handleInputChange('nodeTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            min="5"
            max="1800"
          />
          <p className="text-xs text-gray-500 mt-1">
            Individual agent timeout in seconds (default: 300 = 5 minutes)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Repetitive Handoff Detection Window
          </label>
          <input
            type="number"
            value={data.repetitiveHandoffDetectionWindow || 0}
            onChange={(e) => handleInputChange('repetitiveHandoffDetectionWindow', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            min="0"
            max="20"
          />
          <p className="text-xs text-gray-500 mt-1">
            Number of recent nodes to check for ping-pong behavior (0 = disabled)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Unique Agents for Detection
          </label>
          <input
            type="number"
            value={data.repetitiveHandoffMinUniqueAgents || 0}
            onChange={(e) => handleInputChange('repetitiveHandoffMinUniqueAgents', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            min="0"
            max="10"
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum unique nodes required in recent sequence (0 = disabled)
          </p>
        </div>
      </div>

    </div>
  );

  const renderProperties = () => {
    switch (selectedNode.type) {
      case 'agent':
        return renderAgentProperties(selectedNode.data);
      case 'orchestrator-agent':
        return renderOrchestratorAgentProperties(selectedNode.data);
      case 'swarm':
        return renderSwarmProperties(selectedNode.data);
      case 'a2a-agent':
        return renderA2AAgentProperties(selectedNode.data);
      case 'workflow':
        return renderWorkflowProperties(selectedNode.data);
      case 'graph-builder':
        return renderGraphBuilderProperties(selectedNode.data);
      case 'tool':
        return renderToolProperties(selectedNode.data);
      case 'mcp-tool':
        return renderMCPToolProperties(selectedNode.data);
      case 'input':
        return renderInputProperties();
      case 'custom-tool':
        return renderCustomToolProperties(selectedNode.data);
      default:
        return (
          <div className="text-gray-500 text-center py-8">
            No properties available for this node type.
          </div>
        );
    }
  };

  return (
    <div className={`bg-white border-l border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Settings className="w-4 h-4 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Properties</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto">
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">Node Type</div>
          <div className="font-medium text-gray-900 capitalize">{selectedNode.type}</div>
        </div>

        {renderProperties()}
      </div>
    </div>
  );
}