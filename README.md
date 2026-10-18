# Website

GDG Qassim's public site, at [gdg-q.com](https://gdg-q.com): the leaderboard,
events, member profiles and wallet passes. Next.js with Clerk auth.

It is one of three repos, meant to be cloned side by side:

| Repo | What |
|------|------|
| [Backend](https://github.com/Google-Developer-Group-Qassim-Unversity/Backend) | The one API every frontend calls (FastAPI, MySQL) |
| [Admin](https://github.com/Google-Developer-Group-Qassim-Unversity/Admin) | The admin panel, `admin.gdg-q.com` |
| Website | This repo, `gdg-q.com` (staging `dev.gdg-q.com`) |

This repo was `score-leaderboard-app`. Branch from `dev` and open PRs into
`dev`: a merge there deploys staging, and `main` only receives `dev`, which
deploys production. See [CLAUDE.md](CLAUDE.md). Secrets come from Infisical at
`/main-frontend` (see `docs/ENVIRONMENT_VARIABLES.md`).

```bash
pnpm install
pnpm run dev
```

## Pull request notifications

New pull requests targeting `dev` are announced in Discord when the
`DISCORD_WEBHOOK_URL` Actions secret is configured. Each message includes the
author, PR title and number, repository, and a direct link for review.
