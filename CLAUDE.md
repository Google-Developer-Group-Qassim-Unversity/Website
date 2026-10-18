# Website

The public site for GDG Qassim (`gdg-q.com`). It is one of three repos
(`Backend`, `Admin`, `Website`); `Backend/CLAUDE.md` describes how they fit
together.

## Linear: use `linear-gdg`, never `linear`

This project's tickets live in the GDG Linear workspace, reached through an MCP
server named `linear-gdg` (`https://mcp.linear.app/mcp`). It is declared in this
repo for every agent we use:

| Agent | File | Sign in once with |
|-------|------|-------------------|
| Claude Code | `.mcp.json` | `/mcp` |
| Codex | `.codex/config.toml` (project must be trusted) | `codex mcp login linear-gdg` |
| opencode | `opencode.json` | `opencode mcp auth linear-gdg` |
| Cursor | `.cursor/mcp.json` | Settings → MCP |
| VS Code (Copilot) | `.vscode/mcp.json` | the server's "Start" prompt |
| Gemini CLI | `.gemini/settings.json` | `/mcp auth linear-gdg` |

Sign in with the Linear account that is a member of the GDG workspace. No token
is committed. A `linear` server, if one is loaded, is some other workspace
configured outside this repo: never read or write GDG tickets through it.
