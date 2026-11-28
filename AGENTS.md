# Website

GDG Qassim's public site (`gdg-q.com`): the leaderboard, events, member profiles and wallet passes.
Next.js 15 App Router, Clerk, react-query. All data comes from the `Backend` API. The repos sit side by
side, and `Backend/AGENTS.md` covers the API, its environments and its migrations.

## Branches, deploys, environments

- Branch from `dev`, open PRs into `dev`. Never push to `main` or open a PR into it unless asked; a
  release is one `dev` -> `main` PR (`Backend/.claude/skills/releasing-to-production`).
- A merge to `dev` deploys staging (`dev.gdg-q.com`, which calls `api-dev.gdg-q.com` and Clerk's
  development instance); `main` deploys production. Both run in Docker on the VPS
  (`gdg-score-web-staging` on port 3014, `gdg-score-web` on 3010).
- A change that needs new API ships as same-named branches in Backend and here. Backend merges and
  deploys first. This repo's PR checks never run against Backend, so check the new API on staging
  yourself.

## Commands

Secrets come from Infisical (`--path=/main-frontend`); `pnpm run dev` wraps `infisical run`.

```bash
pnpm install              # a fresh worktree has no node_modules
pnpm run dev              # port 3000; Admin uses it too, Next moves to the next free port
pnpm run typecheck        # the real type check: `next build` ignores type errors here
pnpm test                 # node:test, tests/*.test.mjs and tests/*.test.ts
```

There is no lint. The repo has no ESLint config, and `pnpm run lint` (`next lint`) only offers to
create one. CI runs typecheck, the tests and `next build`.

## Caching: public data is up to 90 s stale by design

Two layers. On the server, `lib/api/shared.ts` caches unauthenticated GETs in Next's data cache for
30 s and never caches a request that carries a token. In the browser, react-query treats data as fresh
for 60 s (`DEFAULT_STALE_TIME` in `lib/query-client.ts`). A "stale for a minute" report is usually the
second layer. Keep it that way: an authenticated response cached under a shared key
leaks one member's data to another.

When Backend changes data, it calls `POST /api/revalidate` here (`app/api/revalidate/route.ts`, bearer
`REVALIDATE_SECRET`). A full reset expires every page. Attendance changes send `?tag=points`, which
expires only the `members` and `departments` tags. So a new cached fetch of points data needs one of
those tags, as in `lib/api/api.ts`, or it stays stale after attendance changes.

## Code layout

- Server code calls `lib/api/server.ts`: `serverApi` adds the signed-in member's Clerk token, and
  `publicServerApi` sends none (so its responses can be cached). Client components use
  `hooks/use-api.ts`. Never import `server.ts` into a client component.
- Strings live in `lib/translations.ts` (`en` and `ar`). Read them through `lib/i18n.ts` anywhere, or
  `lib/server-i18n.ts` on the server only, since it imports `next/headers`.

## Linear

GDG tickets (`GDG-54`) live in the GDG Linear workspace: the `linear-gdg` MCP server from `.mcp.json`, or
`linear-gdgq` in Albrrak773's own setup. Never read or write them through another Linear server.
