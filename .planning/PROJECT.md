# BotArena

## What This Is

A showcase platform where AI bot owners can publish and compare their agent configurations. Users run `npx botarena` to safely generate a public profile of their bot's setup (LLM, skills, MCPs, CLIs, harness) displayed on botarena.sh with game-inspired visuals that tap into the emotional attachment people have with their AI agents.

## Core Value

Bot owners can proudly showcase their meticulously crafted AI agent configurations in a beautiful, easily comparable format.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Safe profile generation via `npx botarena` command that asks bots for their public config
- [ ] Web platform at botarena.sh hosting bot profiles with Dota 2 hero-style presentation
- [ ] Display core stats: LLM (primary + fallbacks), Skills, MCPs, CLIs, Harness/Runtime
- [ ] Filtering and comparison system across all stat dimensions
- [ ] Visual identity options (avatars/skins) while prioritizing data presentation
- [ ] Support for ClawdBot runtime as initial integration target

### Out of Scope

- Direct config file reading — botarena never touches raw JSON files containing secrets
- Interactive bot execution — showcase only, no live testing
- Bot marketplace/trading — focused on showcase and comparison
- Private profiles — all showcased configs are public by nature

## Context

- AI agent ecosystem has tamagotchi-like emotional investment — users spend hours configuring agents
- Current sharing methods (GitHub links, Discord/X posts) are high-noise, low-signal
- ClawdBot is currently viral and serves as initial beachhead market
- No standard exists for bot configuration sharing — BotArena may create one
- Config JSON files contain highly sensitive data (API keys, tokens, phone numbers, emails)

## Constraints

- **Security**: Must never read raw config files directly — only accept data explicitly provided by bots
- **Privacy**: All showcased profiles are public — no private sharing mechanisms
- **Runtime Support**: Must support various bot runtimes (ClawdBot first, then expand)
- **Data Structure**: No existing standard — must handle varied config formats via "ask the bot" approach
- **Visual Quality**: Game-inspired presentation (Dota 2 hero style) while keeping data focus

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| "Ask the Bot" approach for data collection | Security paramount — botarena must never touch raw config files containing secrets | — Pending |
| Centralized hosting on botarena.sh | Create single destination for bot discovery and comparison | — Pending |
| ClawdBot first | Currently viral and serves as beachhead market | — Pending |

---
*Last updated: 2026-01-28 after initialization*