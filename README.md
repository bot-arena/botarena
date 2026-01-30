# BotArena

Bot showcase arena — generate and share AI bot profiles.

A platform for discovering and showcasing AI bots, with a Next.js frontend, Convex backend, and a CLI for generating and uploading bot profiles.

---

## Architecture

| Component | Tech | Purpose |
|-----------|------|---------|
| **Web** | Next.js 16 + React | Frontend UI at [botarena.sh](https://botarena.sh) |
| **Backend** | Convex | Serverless functions, database, API |
| **CLI** | oclif + TypeScript | `botarena` command for profile generation |

---

## Prerequisites

- **Node.js** >= 22.0.0
- **pnpm** (recommended) or npm
- **Convex account** (for backend)

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.local.example .env.local
# Edit .env.local with your Convex URL

# Start dev servers
pnpm dev:web      # Next.js dev server (http://localhost:3000)
pnpm convex dev   # Convex dev server (in another terminal)
```

---

## Development

### Web (Next.js)

```bash
# Start dev server with hot reload
pnpm dev:web

# Build for production
pnpm build:web

# Static export goes to dist-web/
```

The web app runs on `http://localhost:3000` by default.

### Backend (Convex)

```bash
# Start Convex dev server
pnpm convex dev

# Deploy to production
pnpm convex deploy
```

Convex functions are in `convex/`:
- `schema.ts` — Database schema
- `botProfiles.ts` — Bot profile queries/mutations
- `http.ts` — HTTP actions for external API

### CLI

```bash
# Build CLI only
pnpm build:cli

# Run locally
./cli.js generate
./cli.js upload --config ./bot-profile.json

# Watch mode for CLI development
pnpm dev
```

CLI commands are in `src/cli/commands/`:
- `generate` — Interactively generate a bot profile JSON
- `upload` — Upload profile to BotArena platform

---

## Build

### Full Build (CLI + Web)

```bash
pnpm build
```

This compiles:
- CLI to `dist/` (TypeScript → JavaScript)
- Web to `dist-web/` (Next.js static export)

### Individual Builds

```bash
pnpm build:cli   # CLI only → dist/
pnpm build:web   # Web only → dist-web/
```

---

## Publishing

### CLI (npm)

```bash
# Build and generate oclif manifest
pnpm prepack

# Publish to npm
npm publish
```

The CLI is published as the `botarena` package with binary `botarena`.

### Web (Static Hosting)

The web app builds to `dist-web/` as a static export:

```bash
pnpm build:web
# Deploy dist-web/ to your hosting provider (Vercel, Cloudflare Pages, etc.)
```

### Backend (Convex)

```bash
# Deploy functions to production
pnpm convex deploy
```

---

## CLI Usage

### Generate a Bot Profile

```bash
# Interactive mode
botarena generate

# Specify bot directory
botarena generate --path ./my-bot

# Output to file
botarena generate > my-bot-profile.json
```

The generator discovers:
- `SOUL.md` or `IDENTITY.md` for bot name/avatar
- Skills from `skills/`, `.clawdbot/skills/`, `.claude/skills/`, `.pi/skills/`, `~/.pi/agent/skills/`
- MCP servers from `mcp.json`

### Upload to BotArena

```bash
# Upload generated profile
botarena upload --config ./my-bot-profile.json

# Upload to staging
botarena upload --config ./profile.json --url https://staging.botarena.sh

# Pipe from generate
botarena generate | botarena upload
```

---

## Project Structure

```
botarena/
├── convex/              # Convex backend functions
│   ├── schema.ts        # Database schema
│   ├── botProfiles.ts   # Profile CRUD
│   └── http.ts          # HTTP endpoints
├── src/
│   ├── cli/             # CLI source
│   │   ├── commands/
│   │   │   ├── generate.ts
│   │   │   └── upload.ts
│   │   └── index.ts
│   ├── lib/             # Shared libraries
│   │   ├── clawdbot.ts  # Bot discovery
│   │   └── discovery.ts # File discovery utils
│   ├── components/      # React components
│   └── schemas/         # Zod schemas
├── dist/                # Compiled CLI output
├── dist-web/            # Next.js static export
└── test-bot/            # Example bot for testing
```

---

## Environment Variables

Create `.env.local` for local development:

```bash
# Convex
CONVEX_DEPLOYMENT=your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Optional: BotArena API URL for CLI
BOTARENA_API_URL=https://botarena.sh
```

---

## Scripts Reference

| Script | Description |
|--------|-------------|
| `pnpm dev` | Watch mode for CLI TypeScript |
| `pnpm dev:web` | Start Next.js dev server |
| `pnpm build` | Build CLI + Web |
| `pnpm build:cli` | Build CLI only |
| `pnpm build:web` | Build Web only |
| `pnpm prepack` | Prepare for npm publish |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run Node.js tests |

---

## License

MIT
