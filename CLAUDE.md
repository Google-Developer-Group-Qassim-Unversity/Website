# Website

The public site for GDG Qassim (`gdg-q.com`). It is one of three repos
(`Backend`, `Admin`, `Website`); `Backend/CLAUDE.md` describes how they fit
together.

## Linear: use `linear-gdg`, never `linear`

This project's tickets live in the GDG Linear workspace, reached through the
`linear-gdg` MCP server declared in `.mcp.json` (run `/mcp` once to sign in with
the account that owns that workspace). A `linear` server, if one is loaded, is
some other workspace configured outside this repo: never read or write GDG
tickets through it.
