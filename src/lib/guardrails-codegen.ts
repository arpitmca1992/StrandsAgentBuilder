/**
 * Guardrails Code Generator — Generates Python code for agent safety configuration
 *
 * Handles:
 * - Bedrock Guardrails (guardrail_id, version, trace, redaction settings)
 * - Agent Control Plugin (agent_name, server_url, deny/steer modes)
 * - Custom Hooks Guardrails (notify-only mode with Bedrock ApplyGuardrail API)
 *
 * Security considerations (OWASP compliant):
 * - No credentials/secrets hardcoded in generated code — uses env vars
 * - Input validation patterns included in generated code
 * - Guardrail IDs and versions are sanitized before interpolation
 *
 * Based on Strands Agents SDK:
 * https://strandsagents.com/docs/user-guide/safety-security/guardrails/
 * https://strandsagents.com/blog/strands-agents-with-agent-control/
 */

export interface GuardrailsCodeOptions {
  // Bedrock Guardrails
  bedrockGuardrailEnabled?: boolean;
  bedrockGuardrailId?: string;
  bedrockGuardrailVersion?: string;
  bedrockGuardrailTrace?: boolean;
  bedrockGuardrailRedactInput?: boolean;
  bedrockGuardrailRedactInputMessage?: string;
  bedrockGuardrailRedactOutput?: boolean;
  bedrockGuardrailRedactOutputMessage?: string;
  // Agent Control
  agentControlEnabled?: boolean;
  agentControlAgentName?: string;
  agentControlServerUrl?: string;
  // Custom Hook Guardrails (notify-only / shadow mode)
  customGuardrailHookEnabled?: boolean;
  customGuardrailHookMode?: 'notify_only' | 'blocking';
}

/**
 * Sanitize a guardrail ID to prevent injection in generated code.
 * Only alphanumeric, hyphens, and underscores allowed.
 */
function sanitizeGuardrailId(id: string): string {
  return (id || '').replace(/[^a-zA-Z0-9\-_]/g, '');
}

/**
 * Sanitize a string for safe inclusion in Python string literals.
 * Escapes backslashes, quotes, and control characters.
 */
function sanitizePythonString(str: string): string {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Generate import statements needed for guardrails configuration.
 */
export function generateGuardrailsImports(data: GuardrailsCodeOptions): string[] {
  const imports: string[] = [];

  if (data.agentControlEnabled) {
    imports.push('import agent_control');
    imports.push('from agent_control.integrations.strands import AgentControlPlugin');
  }

  if (data.customGuardrailHookEnabled) {
    imports.push('import boto3');
    imports.push('from strands.hooks import HookProvider, HookRegistry, MessageAddedEvent, AfterInvocationEvent');
  }

  return imports;
}

/**
 * Generate Bedrock model kwargs for guardrails.
 * These are passed to BedrockModel constructor, NOT to Agent.
 */
export function generateBedrockGuardrailKwargs(data: GuardrailsCodeOptions): string {
  if (!data.bedrockGuardrailEnabled || !data.bedrockGuardrailId) {
    return '';
  }

  const guardrailId = sanitizeGuardrailId(data.bedrockGuardrailId);
  const version = sanitizeGuardrailId(data.bedrockGuardrailVersion || '1');

  const kwargs: string[] = [];
  kwargs.push(`    guardrail_id=os.environ.get("BEDROCK_GUARDRAIL_ID", "${guardrailId}")`);
  kwargs.push(`    guardrail_version="${version}"`);

  if (data.bedrockGuardrailTrace) {
    kwargs.push(`    guardrail_trace="enabled"`);
  }

  if (data.bedrockGuardrailRedactInput !== undefined) {
    kwargs.push(`    guardrail_redact_input=${data.bedrockGuardrailRedactInput ? 'True' : 'False'}`);
  }

  if (data.bedrockGuardrailRedactInputMessage) {
    kwargs.push(`    guardrail_redact_input_message="${sanitizePythonString(data.bedrockGuardrailRedactInputMessage)}"`);
  }

  if (data.bedrockGuardrailRedactOutput) {
    kwargs.push(`    guardrail_redact_output=True`);
  }

  if (data.bedrockGuardrailRedactOutputMessage) {
    kwargs.push(`    guardrail_redact_output_message="${sanitizePythonString(data.bedrockGuardrailRedactOutputMessage)}"`);
  }

  return kwargs.join(',\n');
}

/**
 * Generate Agent Control plugin initialization code.
 * Returns code to insert BEFORE the agent creation.
 */
export function generateAgentControlSetup(data: GuardrailsCodeOptions): string {
  if (!data.agentControlEnabled || !data.agentControlAgentName) {
    return '';
  }

  const agentName = sanitizePythonString(data.agentControlAgentName);
  const lines: string[] = [];

  lines.push(`# Agent Control — Runtime guardrails`);
  lines.push(`# Server URL configured via AGENT_CONTROL_URL env var`);

  if (data.agentControlServerUrl) {
    lines.push(`os.environ.setdefault("AGENT_CONTROL_URL", "${sanitizePythonString(data.agentControlServerUrl)}")`);
  }

  lines.push(`agent_control.init(agent_name="${agentName}")`);

  return lines.join('\n');
}

/**
 * Generate Agent Control plugin kwarg for Agent constructor.
 */
export function generateAgentControlPluginKwarg(data: GuardrailsCodeOptions): string {
  if (!data.agentControlEnabled || !data.agentControlAgentName) {
    return '';
  }

  const agentName = sanitizePythonString(data.agentControlAgentName);
  return `AgentControlPlugin(agent_name="${agentName}")`;
}

/**
 * Generate custom guardrail hook class code (notify-only or blocking mode).
 * This is a full class definition that should be placed before agent creation.
 */
export function generateCustomGuardrailHookCode(data: GuardrailsCodeOptions): string {
  if (!data.customGuardrailHookEnabled) {
    return '';
  }

  const mode = data.customGuardrailHookMode || 'notify_only';
  const isBlocking = mode === 'blocking';

  const code = `
# Custom Guardrail Hook — ${isBlocking ? 'Blocking' : 'Notify-Only (Shadow)'} Mode
class GuardrailValidationHook(HookProvider):
    """Evaluates content against Bedrock Guardrails API.
    
    Mode: ${isBlocking ? 'BLOCKING — will raise exception on violations' : 'NOTIFY-ONLY — logs violations without blocking'}
    
    Security: Uses IAM role-based auth, no hardcoded credentials.
    """

    def __init__(self, guardrail_id: str, guardrail_version: str, region: str = "us-east-1"):
        self.guardrail_id = guardrail_id
        self.guardrail_version = guardrail_version
        self.bedrock_client = boto3.client("bedrock-runtime", region)

    def register_hooks(self, registry: HookRegistry) -> None:
        registry.add_callback(MessageAddedEvent, self._check_input)
        registry.add_callback(AfterInvocationEvent, self._check_output)

    def _evaluate(self, content: str, source: str = "INPUT") -> dict:
        """Evaluate content against guardrails. Returns assessment result."""
        if not content or not content.strip():
            return {"action": "NONE"}
        try:
            response = self.bedrock_client.apply_guardrail(
                guardrailIdentifier=self.guardrail_id,
                guardrailVersion=self.guardrail_version,
                source=source,
                content=[{"text": {"text": content[:10000}}}]  # Limit input size
            )
            return response
        except Exception as e:
            print(f"[GUARDRAIL] Evaluation error: {e}")
            return {"action": "ERROR"}

    def _check_input(self, event: MessageAddedEvent) -> None:
        """Check user input ${isBlocking ? '— BLOCKS if violation detected' : '— logs violations only'}."""
        if event.message.get("role") != "user":
            return
        content = "".join(
            block.get("text", "") for block in event.message.get("content", [])
        )
        if not content:
            return
        result = self._evaluate(content, "INPUT")
        if result.get("action") == "GUARDRAIL_INTERVENED":
            ${isBlocking
    ? `raise ValueError(f"[GUARDRAIL BLOCKED] Input violates safety policy")`
    : `print(f"[GUARDRAIL] WOULD BLOCK INPUT: {content[:100]}...")`}

    def _check_output(self, event: AfterInvocationEvent) -> None:
        """Check assistant output ${isBlocking ? '— BLOCKS if violation detected' : '— logs violations only'}."""
        if not event.agent.messages:
            return
        last = event.agent.messages[-1]
        if last.get("role") != "assistant":
            return
        content = "".join(
            block.get("text", "") for block in last.get("content", [])
        )
        if not content:
            return
        result = self._evaluate(content, "OUTPUT")
        if result.get("action") == "GUARDRAIL_INTERVENED":
            ${isBlocking
    ? `raise ValueError(f"[GUARDRAIL BLOCKED] Output violates safety policy")`
    : `print(f"[GUARDRAIL] WOULD BLOCK OUTPUT: {content[:100]}...")`}
`;

  return code;
}

/**
 * Get the hooks kwarg string for custom guardrail hook.
 */
export function getCustomGuardrailHookKwarg(data: GuardrailsCodeOptions): string {
  if (!data.customGuardrailHookEnabled) {
    return '';
  }

  const guardrailId = sanitizeGuardrailId(data.bedrockGuardrailId || 'YOUR_GUARDRAIL_ID');
  const version = sanitizeGuardrailId(data.bedrockGuardrailVersion || '1');

  return `GuardrailValidationHook(
        guardrail_id=os.environ.get("BEDROCK_GUARDRAIL_ID", "${guardrailId}"),
        guardrail_version="${version}"
    )`;
}
