# Agent Builder Studio

**Visual AI Agent Builder** | Multi-Framework | No-Code Agent Workflows | Drag-and-Drop | Python Code Generation | Multi-Agent Orchestration

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Strands SDK](https://img.shields.io/badge/Strands_SDK-v1.47.0-blue.svg)](https://strandsagents.com/)
[![Google ADK](https://img.shields.io/badge/Google_ADK-v1.36.x-emerald.svg)](https://google.github.io/adk-docs/)

> Build AI agent teams visually — drag, connect, configure, deploy. Supports **Strands Agents SDK** and **Google ADK**. No coding required to get started. Full Python code generated automatically.

A visual drag-and-drop interface for creating, configuring, and executing AI agent workflows. Build complex agent interactions through an intuitive node-based editor that generates Python code using the [Strands Agents SDK](https://strandsagents.com/) or [Google Agent Development Kit (ADK)](https://google.github.io/adk-docs/).

### 🔍 Keywords

`ai-agents` `agent-builder` `visual-programming` `no-code` `low-code` `strands-agents` `google-adk` `multi-agent` `agent-orchestration` `llm` `bedrock` `openai` `anthropic` `gemini` `drag-and-drop` `flow-editor` `react-flow` `xyflow` `python-code-generation` `aws-bedrock` `vertex-ai` `agent-workflow` `ai-workflow-builder` `mcp-server` `model-context-protocol` `swarm-agents` `graph-agents` `a2a-protocol` `agent-to-agent` `guardrails` `opentelemetry` `agent-deployment` `lambda-deployment` `ecs-fargate` `agentcore` `structured-output` `conversation-management` `session-management` `agent-sops` `human-in-the-loop`

---

## ⭐ Highlights — Ready-to-Use Templates

Start building immediately with **8 pre-built templates** from real-world patterns:

| Template | Pattern | Source | Features Used |
|----------|---------|--------|---------------|
| 🎮 **Pokemon Battle Orchestrator** | Agents-as-Tools | [Itsuki's Article](https://levelup.gitconnected.com/strands-agents-interesting-multi-agent-pattern-0c7f97088b6d) | Routing prompt, multi-specialist delegation |
| 🐝 **Pokemon Swarm Team** | Swarm (Autonomous) | [Itsuki's Article](https://levelup.gitconnected.com/strands-agents-interesting-multi-agent-pattern-0c7f97088b6d) | 4 agents, handoff detection, shared context |
| 📊 **Pokemon Research Graph** | Graph (Parallel) | [Itsuki's Article](https://levelup.gitconnected.com/strands-agents-interesting-multi-agent-pattern-0c7f97088b6d) | Fan-out to specialists → aggregation |
| 🏭 **Production-Ready Agent** | Single Agent (Full) | [Strands SDK](https://strandsagents.com/) | Guardrails, OTEL, Memory, SOPs, Retry, Session, HITL |
| 🔄 **Writer-Reviewer Loop** | Graph (Cyclic) | [Strands Graph Docs](https://strandsagents.com/docs/user-guide/concepts/multi-agent/graph/) | Feedback loop, conditional routing |
| 🌐 **Distributed ML Pipeline** | A2A + Graph | [Strands A2A Docs](https://strandsagents.com/docs/user-guide/concepts/multi-agent/agent-to-agent/) | Remote agents, parallel processing |
| 🔍 **MCP Research Agent** | Single + MCP | [Strands MCP Docs](https://strandsagents.com/docs/user-guide/concepts/tools/mcp-tools/) | Multiple MCP servers, streaming |
| 📋 **Data Analysis Workflow** | Workflow DAG | [Strands Workflow Docs](https://strandsagents.com/docs/user-guide/concepts/multi-agent/workflow/) | Task dependencies, parallel execution |

Templates load from MySQL database via API. Click **Open → Templates** to use them.

---

## Features

### Visual Flow Editor
- Drag-and-drop canvas with snap-to-grid
- 13 node types covering the full Strands SDK
- Auto-layout (5 arrangements: Horizontal, Vertical, Radial, Grid, Shuffle)
- Connection-aware layouts using topological sorting
- Semantic edge labels (tool, depends, ✓ true, ✗ false)
- Colored MiniMap with node-type identification
- Quick-add toolbar for one-click node creation
- Keyboard shortcuts (Ctrl+S save, Ctrl+Z undo, Delete, shortcuts panel)

### Multi-Agent Patterns (All 5 Strands Patterns)
- **Agent** — Single LLM agent with tools
- **Orchestrator** — Agents-as-Tools hierarchical delegation
- **Swarm** — Autonomous handoff with shared context
- **Graph** — Deterministic DAG with conditional edges, cycles, parallel execution
- **Workflow** — Task DAG with dependencies and parallel execution
- **A2A Agent** — Remote Agent-to-Agent protocol
- **Function Node** — Deterministic Python (no LLM) for graph pipelines
- **Condition Node** — If/else branching in graphs

### 15+ Model Providers
AWS Bedrock, OpenAI, Anthropic, Google Gemini, Ollama, LiteLLM, MistralAI, SageMaker, LlamaAPI, llama.cpp, Writer, Vercel, Amazon Nova, Custom Provider

### Agent Configuration (Full SDK Coverage)
- Retry Strategy (max attempts, exponential backoff)
- Conversation Manager (Sliding Window, Summarizing, Null)
- Session Manager (File, S3)
- Invocation Limits (max turns, token budget)
- Structured Output (Pydantic schema)
- Goal Loop Plugin (autonomous iteration)
- Human-in-the-Loop (approval gates)
- Community Tools Catalog (19+ tools)
- MCP Instrumentation (OTEL for tool calls)

### Safety & Security
- **Bedrock Guardrails** — Content filtering, PII redaction, topic blocking
- **Agent Control** — Runtime guardrails plugin (Galileo)
- **Custom Hook Guardrails** — Notify-only or blocking mode
- Input sanitization (OWASP compliant codegen)
- No hardcoded secrets (all via environment variables)

### Observability
- **OpenTelemetry** — Distributed tracing (OTLP/gRPC, OTLP/HTTP, Console)
- Service name, sampling rate, auth headers configuration
- **Agent SOPs** — Markdown-based workflow definitions
- Execution trace waterfall view

### Memory & Context
- **Bedrock Knowledge Base** (RAG)
- **Mem0** (Conversational memory)
- Custom memory stores

### Code Generation
- Full Python code from visual flows
- Bidirectional code editing (generate ↔ edit)
- Syntax validation for custom tools
- Flow validation with navigate-to-node
- Copy to clipboard, download as .py

### Interactive Execution
- Single-turn execution with streaming
- Multi-turn chat with conversation history
- Live WebSocket updates
- Execution history with artifacts

### One-Click Deployment
- **AWS Bedrock AgentCore** — Managed agent runtime
- **AWS Lambda** — Serverless functions
- **ECS Fargate** — Container-based
- Auth configuration (IAM/Cognito/API Key)
- Deploy progress stepper

### UX & Accessibility
- Welcome onboarding overlay
- Toast notification system (no native alerts)
- Themed confirmation modals
- Validation indicators on nodes (red/amber badges with hover tooltips)
- Property panel with contextual help tooltips
- Node palette with documentation links to Strands docs
- Undo/Redo (Ctrl+Z / Ctrl+Shift+Z)
- Responsive layout with fixed header/sidebar

---

## Quick Start

### Environment Setup

1. Install [Node.js 22](https://nodejs.org/en/download)
2. Install [uv](https://docs.astral.sh/uv/getting-started/installation/)
3. Install frontend dependencies:
```bash
npm install
```
4. Install backend dependencies:
```bash
cd backend
uv sync
```

### Development
```bash
# Start frontend
npm run dev

# Start backend (new terminal)
cd backend
uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Access at http://localhost:5173
```

### Database Setup (MySQL — for templates)
```sql
CREATE DATABASE strands_builder CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Then run migrations in order:
```bash
mysql -u root strands_builder < backend/db/migrations/001_create_templates_table.sql
mysql -u root strands_builder < backend/db/migrations/002_seed_official_templates.sql
mysql -u root strands_builder < backend/db/migrations/005_seed_rich_templates.sql
```

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, XYFlow (React Flow)
- **Backend**: FastAPI, Python, Uvicorn
- **Database**: MySQL 8 (templates, projects, evaluations)
- **AI Framework**: Strands Agents SDK (Python)
- **Deployment**: AWS (AgentCore, Lambda, ECS Fargate)

### SDK Compatibility

This builder is updated to support features up to **Strands Agents SDK v1.47.0** (Python). Code generation covers the full SDK surface including multi-agent patterns (Graph, Swarm, A2A), memory management, interventions, and observability features introduced through v1.47.0.

Google ADK support targets **v1.36.x** (latest maintained 1.x branch). Code generation produces valid Python with correct imports for LlmAgent, workflow agents, FunctionTool, MCPToolset, callbacks, and session management.

---

## Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌──────────────┐
│  React Frontend │  API    │  FastAPI Backend │  SQL    │   MySQL DB   │
│  (Visual Editor)│ ──────→ │  (Code Exec +   │ ──────→ │  (Templates, │
│  Port 5173      │         │   Deploy + Chat) │         │   Projects)  │
│                 │ ←────── │  Port 8000       │ ←────── │              │
└─────────────────┘         └─────────────────┘         └──────────────┘
```

---

---

## ⚠️ Legal Disclaimers & Compliance

### Not an Official Product

**This project is NOT an official Amazon Web Services (AWS) product.** It is an independent, community-driven open-source project. It is not endorsed, sponsored, affiliated with, or supported by Amazon Web Services, Inc. or any of its affiliates.

### Trademarks

- "Amazon Web Services", "AWS", "Amazon Bedrock", "AWS Lambda", "Amazon ECS", "AWS Fargate", "Amazon SageMaker", and all related logos are trademarks or registered trademarks of Amazon.com, Inc. or its affiliates.
- "OpenAI" is a trademark of OpenAI, Inc.
- "Anthropic" and "Claude" are trademarks of Anthropic, PBC.
- "Google" and "Gemini" are trademarks of Google LLC.
- All other trademarks are the property of their respective owners.

Use of these names in this project is for identification purposes only and does not imply endorsement.

### No Warranty

THIS SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY.

### Data & Security Notice

- This tool generates Python code that may interact with cloud services (AWS, OpenAI, etc.). Users are responsible for:
  - Securing their own API keys and credentials
  - Reviewing generated code before deployment to production
  - Complying with their organization's security policies
  - Ensuring proper IAM permissions and access controls
  - Protecting any PII or sensitive data processed by agents
- Generated agent code runs with the permissions of the executing user's AWS credentials
- No telemetry, analytics, or usage data is collected by this project

### AI-Generated Code Warning

Code generated by this tool is produced algorithmically based on visual flow configurations. **Users MUST review all generated code before production deployment.** The authors accept no liability for:
- Errors in generated code
- Unintended behaviors of deployed agents
- Costs incurred from agent execution on cloud services
- Data loss or security breaches resulting from deployed agents

### License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

### Attribution & Sources

This project builds upon:
- [Strands Agents SDK](https://strandsagents.com/) — The open-source AI agent framework (Apache 2.0 License)
- [React Flow / XYFlow](https://reactflow.dev/) — Node-based UI library (MIT License)
- [FastAPI](https://fastapi.tiangolo.com/) — Python web framework (MIT License)
- Community patterns from [Strands Agents: Interesting Multi-Agent Pattern](https://levelup.gitconnected.com/strands-agents-interesting-multi-agent-pattern-0c7f97088b6d) by Itsuki

### Contributing

By contributing to this project, you agree that your contributions will be licensed under the MIT License. Contributors retain copyright to their individual contributions.

### Responsible AI

Users of this tool are responsible for ensuring their AI agents comply with:
- Their organization's Responsible AI policies
- Applicable laws and regulations (GDPR, CCPA, etc.)
- AWS Acceptable Use Policy (if deploying to AWS)
- Model provider terms of service (OpenAI, Anthropic, Google, etc.)
