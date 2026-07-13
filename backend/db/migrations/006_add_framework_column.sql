-- Migration 006: Add framework column to templates and projects
-- Supports multi-framework builder (Strands + Google ADK)

-- Add framework column to templates table
ALTER TABLE templates ADD COLUMN framework VARCHAR(20) NOT NULL DEFAULT 'strands' AFTER description;
ALTER TABLE templates ADD INDEX idx_templates_framework (framework);

-- Add framework column to projects table (if exists)
ALTER TABLE projects ADD COLUMN framework VARCHAR(20) NOT NULL DEFAULT 'strands' AFTER description;
ALTER TABLE projects ADD INDEX idx_projects_framework (framework);

-- Update existing templates to be explicitly 'strands'
UPDATE templates SET framework = 'strands' WHERE framework = '' OR framework IS NULL;

-- Seed initial Google ADK templates
INSERT INTO templates (name, description, framework, pattern, flow_data, tags, is_official) VALUES
(
  'ADK Research Pipeline',
  'Sequential agent pipeline: researcher gathers info, writer produces content. Uses SequentialAgent for deterministic ordering.',
  'google-adk',
  'Sequential',
  JSON_OBJECT(
    'nodes', JSON_ARRAY(
      JSON_OBJECT('id', 'input_1', 'type', 'adk-input', 'position', JSON_OBJECT('x', 50, 'y', 200), 'data', JSON_OBJECT('label', 'Input')),
      JSON_OBJECT('id', 'researcher', 'type', 'adk-llm-agent', 'position', JSON_OBJECT('x', 250, 'y', 100), 'data', JSON_OBJECT('label', 'Researcher', 'name', 'researcher', 'model', 'gemini-2.0-flash', 'instruction', 'You are a research assistant. Search for information and provide comprehensive summaries.')),
      JSON_OBJECT('id', 'writer', 'type', 'adk-llm-agent', 'position', JSON_OBJECT('x', 250, 'y', 300), 'data', JSON_OBJECT('label', 'Writer', 'name', 'writer', 'model', 'gemini-2.0-flash', 'instruction', 'You are a content writer. Take research notes and produce well-structured articles.')),
      JSON_OBJECT('id', 'pipeline', 'type', 'adk-sequential', 'position', JSON_OBJECT('x', 500, 'y', 200), 'data', JSON_OBJECT('label', 'Pipeline', 'name', 'research_pipeline', 'description', 'Research then write')),
      JSON_OBJECT('id', 'output_1', 'type', 'adk-output', 'position', JSON_OBJECT('x', 750, 'y', 200), 'data', JSON_OBJECT('label', 'Output'))
    ),
    'edges', JSON_ARRAY(
      JSON_OBJECT('id', 'e1', 'source', 'input_1', 'target', 'pipeline', 'animated', true),
      JSON_OBJECT('id', 'e2', 'source', 'researcher', 'target', 'pipeline', 'targetHandle', 'sub-agents', 'animated', true),
      JSON_OBJECT('id', 'e3', 'source', 'writer', 'target', 'pipeline', 'targetHandle', 'sub-agents', 'animated', true),
      JSON_OBJECT('id', 'e4', 'source', 'pipeline', 'target', 'output_1', 'animated', true)
    )
  ),
  'sequential,research,pipeline,adk',
  1
),
(
  'ADK Parallel Data Gatherer',
  'Parallel agent that fetches data from multiple sources simultaneously. Uses ParallelAgent for concurrent execution.',
  'google-adk',
  'Parallel',
  JSON_OBJECT(
    'nodes', JSON_ARRAY(
      JSON_OBJECT('id', 'input_1', 'type', 'adk-input', 'position', JSON_OBJECT('x', 50, 'y', 200), 'data', JSON_OBJECT('label', 'Input')),
      JSON_OBJECT('id', 'news_agent', 'type', 'adk-llm-agent', 'position', JSON_OBJECT('x', 250, 'y', 50), 'data', JSON_OBJECT('label', 'News Agent', 'name', 'news_agent', 'model', 'gemini-2.0-flash', 'instruction', 'Search for latest news on the topic.', 'outputKey', 'news_results')),
      JSON_OBJECT('id', 'academic_agent', 'type', 'adk-llm-agent', 'position', JSON_OBJECT('x', 250, 'y', 200), 'data', JSON_OBJECT('label', 'Academic Agent', 'name', 'academic_agent', 'model', 'gemini-2.0-flash', 'instruction', 'Search for academic papers and research.', 'outputKey', 'academic_results')),
      JSON_OBJECT('id', 'social_agent', 'type', 'adk-llm-agent', 'position', JSON_OBJECT('x', 250, 'y', 350), 'data', JSON_OBJECT('label', 'Social Agent', 'name', 'social_agent', 'model', 'gemini-2.0-flash', 'instruction', 'Search for social media discussions.', 'outputKey', 'social_results')),
      JSON_OBJECT('id', 'gatherer', 'type', 'adk-parallel', 'position', JSON_OBJECT('x', 520, 'y', 200), 'data', JSON_OBJECT('label', 'Data Gatherer', 'name', 'data_gatherer', 'description', 'Fetch from all sources at once')),
      JSON_OBJECT('id', 'output_1', 'type', 'adk-output', 'position', JSON_OBJECT('x', 750, 'y', 200), 'data', JSON_OBJECT('label', 'Output'))
    ),
    'edges', JSON_ARRAY(
      JSON_OBJECT('id', 'e1', 'source', 'input_1', 'target', 'gatherer', 'animated', true),
      JSON_OBJECT('id', 'e2', 'source', 'news_agent', 'target', 'gatherer', 'targetHandle', 'sub-agents', 'animated', true),
      JSON_OBJECT('id', 'e3', 'source', 'academic_agent', 'target', 'gatherer', 'targetHandle', 'sub-agents', 'animated', true),
      JSON_OBJECT('id', 'e4', 'source', 'social_agent', 'target', 'gatherer', 'targetHandle', 'sub-agents', 'animated', true),
      JSON_OBJECT('id', 'e5', 'source', 'gatherer', 'target', 'output_1', 'animated', true)
    )
  ),
  'parallel,data,multi-source,adk',
  1
),
(
  'ADK Writer-Reviewer Loop',
  'Loop agent pattern: writer drafts content, reviewer provides feedback, loop continues until quality meets threshold.',
  'google-adk',
  'Loop',
  JSON_OBJECT(
    'nodes', JSON_ARRAY(
      JSON_OBJECT('id', 'input_1', 'type', 'adk-input', 'position', JSON_OBJECT('x', 50, 'y', 200), 'data', JSON_OBJECT('label', 'Input')),
      JSON_OBJECT('id', 'writer', 'type', 'adk-llm-agent', 'position', JSON_OBJECT('x', 250, 'y', 100), 'data', JSON_OBJECT('label', 'Writer', 'name', 'writer', 'model', 'gemini-2.0-flash', 'instruction', 'Write or revise content based on feedback. When the reviewer approves, escalate to end the loop.', 'outputKey', 'draft')),
      JSON_OBJECT('id', 'reviewer', 'type', 'adk-llm-agent', 'position', JSON_OBJECT('x', 250, 'y', 300), 'data', JSON_OBJECT('label', 'Reviewer', 'name', 'reviewer', 'model', 'gemini-2.0-flash', 'instruction', 'Review the draft. If quality is good, approve and escalate. Otherwise provide specific feedback for improvement.', 'outputKey', 'feedback')),
      JSON_OBJECT('id', 'loop', 'type', 'adk-loop', 'position', JSON_OBJECT('x', 500, 'y', 200), 'data', JSON_OBJECT('label', 'Refinement Loop', 'name', 'refinement_loop', 'maxIterations', 5)),
      JSON_OBJECT('id', 'output_1', 'type', 'adk-output', 'position', JSON_OBJECT('x', 750, 'y', 200), 'data', JSON_OBJECT('label', 'Output'))
    ),
    'edges', JSON_ARRAY(
      JSON_OBJECT('id', 'e1', 'source', 'input_1', 'target', 'loop', 'animated', true),
      JSON_OBJECT('id', 'e2', 'source', 'writer', 'target', 'loop', 'targetHandle', 'sub-agents', 'animated', true),
      JSON_OBJECT('id', 'e3', 'source', 'reviewer', 'target', 'loop', 'targetHandle', 'sub-agents', 'animated', true),
      JSON_OBJECT('id', 'e4', 'source', 'loop', 'target', 'output_1', 'animated', true)
    )
  ),
  'loop,writer,reviewer,feedback,adk',
  1
),
(
  'ADK MCP Research Agent',
  'Single LLM agent connected to MCP servers for web search and file access. Demonstrates MCPToolset integration.',
  'google-adk',
  'Single + MCP',
  JSON_OBJECT(
    'nodes', JSON_ARRAY(
      JSON_OBJECT('id', 'input_1', 'type', 'adk-input', 'position', JSON_OBJECT('x', 50, 'y', 200), 'data', JSON_OBJECT('label', 'Input')),
      JSON_OBJECT('id', 'search_tool', 'type', 'adk-builtin-tool', 'position', JSON_OBJECT('x', 200, 'y', 80), 'data', JSON_OBJECT('label', 'Google Search', 'toolType', 'google_search')),
      JSON_OBJECT('id', 'mcp_filesystem', 'type', 'adk-mcp-tool', 'position', JSON_OBJECT('x', 200, 'y', 320), 'data', JSON_OBJECT('label', 'Filesystem MCP', 'serverName', 'filesystem', 'transport', 'stdio', 'command', 'npx -y @modelcontextprotocol/server-filesystem .')),
      JSON_OBJECT('id', 'agent', 'type', 'adk-llm-agent', 'position', JSON_OBJECT('x', 450, 'y', 200), 'data', JSON_OBJECT('label', 'Research Agent', 'name', 'research_agent', 'model', 'gemini-2.0-flash', 'instruction', 'You are a research assistant with web search and file system access. Search the web for information and save findings to files.')),
      JSON_OBJECT('id', 'output_1', 'type', 'adk-output', 'position', JSON_OBJECT('x', 700, 'y', 200), 'data', JSON_OBJECT('label', 'Output'))
    ),
    'edges', JSON_ARRAY(
      JSON_OBJECT('id', 'e1', 'source', 'input_1', 'target', 'agent', 'targetHandle', 'input', 'animated', true),
      JSON_OBJECT('id', 'e2', 'source', 'search_tool', 'target', 'agent', 'targetHandle', 'tools', 'animated', true),
      JSON_OBJECT('id', 'e3', 'source', 'mcp_filesystem', 'target', 'agent', 'targetHandle', 'tools', 'animated', true),
      JSON_OBJECT('id', 'e4', 'source', 'agent', 'sourceHandle', 'output', 'target', 'output_1', 'animated', true)
    )
  ),
  'mcp,research,search,filesystem,adk',
  1
);
