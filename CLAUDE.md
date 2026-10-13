# Website

GDG Qassim's public site (`gdg-q.com`): the leaderboard, events, member
profiles and wallet passes. Next.js with Clerk auth; every piece of data comes
from the `Backend` API.

## Three repositories

| Repo | What | Deployed at |
|------|------|-------------|
| [`Backend`](https://github.com/Google-Developer-Group-Qassim-Unversity/Backend) | FastAPI + MySQL; the one API every frontend calls | `refactor.albrrak773.com`, staging `api-dev.gdg-q.com` |
| [`Admin`](https://github.com/Google-Developer-Group-Qassim-Unversity/Admin) | Next.js admin panel | `admin.gdg-q.com`, staging `admin-dev.gdg-q.com` |
| `Website` | This repo | `gdg-q.com`, staging `dev.gdg-q.com` |

They are meant to be cloned side by side; `Backend/...` means that file in the
sibling repo. A change that spans repos uses the same branch name in each, and
the backend merges first.

## Branches: everything goes through `dev`

**Never push to `main`, and never open a PR into `main`.** Branch from `dev`,
open the PR into `dev`. A merge to `dev` deploys staging (`dev.gdg-q.com`,
against the staging backend and Clerk's development instance); `main` only
ever receives `dev`: once in a while, one large `dev` -> `main` PR, merged with
a merge commit, which deploys prod. Don't open that PR unless asked. PR checks
(typecheck, tests, a production build) run on PRs into `dev` only.

Secrets come from Infisical at `/main-frontend`: `dev` for local, `staging`
and `prod` for the two deployments. See `docs/ENVIRONMENT_VARIABLES.md`.

## Commands

```bash
pnpm run dev          # runs via infisical, port 3000
pnpm run typecheck
pnpm test             # Node 24: the .mjs tests import .ts files natively
```

`next.config.mjs` ignores type and lint errors during the build, so run
`pnpm run typecheck` yourself; CI does.
