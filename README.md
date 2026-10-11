# Website

GDG Qassim's public site, at [gdg-q.com](https://gdg-q.com): the leaderboard,
events, member profiles and wallet passes. Next.js with Clerk auth.

It is one of three repos, meant to be cloned side by side:

| Repo | What |
|------|------|
| [Backend](https://github.com/Google-Developer-Group-Qassim-Unversity/Backend) | The one API every frontend calls (FastAPI, MySQL) |
| [Admin](https://github.com/Google-Developer-Group-Qassim-Unversity/Admin) | The admin panel, `admin.gdg-q.com` |
| Website | This repo, `gdg-q.com` |

This repo was `score-leaderboard-app`. A push to `main` deploys production
(`.github/workflows/deploy.yml`); secrets come from Infisical at `/main-frontend`
(see `docs/ENVIRONMENT_VARIABLES.md`).

```bash
pnpm install
pnpm run dev
```
