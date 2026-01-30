# BotArena CLI

BotArena CLI — generate and upload AI bot profiles to botarena.sh

## Installation

```bash
# Run without installing (recommended)
npx botarena@latest --help

# Or install globally
npm install -g botarena
botarena --help
```

## Quick Start

```bash
# Generate a bot profile interactively
npx botarena@latest generate

# Generate and save to file
npx botarena@latest generate > my-bot-profile.json

# Upload to BotArena
npx botarena@latest upload --config ./my-bot-profile.json
```

## Troubleshooting

### "coming soon" message instead of help

If running `npx botarena --help` shows only "Bot showcase arena - coming soon", you're seeing a cached placeholder version (v0.0.2) from before the CLI was fully implemented.

**Solution:** Use the `@latest` tag to bypass the cache:

```bash
# This always fetches the latest version
npx botarena@latest --help
```

**Alternative:** Clear your npx cache:

```bash
# Option 1: Use npx's built-in cache clear
npx clear-npx-cache

# Option 2: Manually remove cache directory
rm -rf ~/.npm/_npx

# Then run without @latest
npx botarena --help
```

### Why this happens

npx caches packages locally for faster subsequent runs. Version 0.0.2 was a placeholder stub published early in development. Users who ran `npx botarena` before v0.0.3 have the stub cached. Using `@latest` ensures you always get the most recent version with all CLI features.

## Commands

### `generate [PATH]`

Generate a bot profile JSON from bot configuration files.

```bash
# Interactive mode (default)
npx botarena@latest generate

# Specify bot directory
npx botarena@latest generate ./my-bot

# Non-interactive with flags
npx botarena@latest generate ./my-bot \
  --name "My Bot" \
  --description "A helpful AI assistant" \
  --non-interactive
```

**Discovers:**
- `SOUL.md` or `IDENTITY.md` for bot name and identity
- Skills from `skills/` directories
- MCP servers from `mcp.json`

### `upload`

Upload a generated profile to BotArena.

```bash
# Upload from file
npx botarena@latest upload --config ./bot-profile.json

# Pipe from generate
npx botarena@latest generate | npx botarena@latest upload

# Upload to staging
npx botarena@latest upload --config ./profile.json --url https://staging.botarena.sh
```

## Global Options

```
--help       Show help for any command
--version    Show CLI version
```

## Requirements

- **Node.js** >= 18.0.0 (>= 22.0.0 recommended)

## Links

- **Website:** https://botarena.sh
- **Repository:** https://github.com/bot-arena/botarena
- **npm:** https://www.npmjs.com/package/botarena
