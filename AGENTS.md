# Agent instructions for paycore

## CodeGraph

CodeGraph is available via MCP during active Codex/OpenCode sessions.

- It is **not** a background service. If files were edited outside an agent session (via editor, git, etc.), run `codegraph sync` manually before querying it again in the next session.
- Telemetry is disabled.
