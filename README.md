# INN STYLE standalone website

This folder is a self-contained Vite/React frontend. It has no dependency on the
Replit monorepo, API server, database, or Replit environment variables.

## Local setup

```sh
pnpm install
pnpm run build
```

The production site is generated in `dist/`. For local preview:

```sh
pnpm run dev
```

## Cloudflare Workers Builds

Copy the source and configuration files from this folder into the root of a
new repository, including hidden files such as `.npmrc` and `.gitignore`.
Exclude generated `node_modules/`, `dist/`, and `*.tsbuildinfo`; installation
and build recreate them. The build and deploy commands are:

- Build command: `pnpm run build`
- Deploy command: `npx wrangler deploy`
- Output directory: `dist`
- Build variables: none

`wrangler.jsonc` deploys the generated static files only; there is no Worker
application code or backend.