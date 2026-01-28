# Technology Stack

**Project:** BotArena
**Researched:** January 28, 2026
**Overall confidence:** HIGH

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js | 16.1.6 | Web platform framework | Industry standard for React apps with hybrid rendering, excellent for showcase sites with static generation + dynamic features |
| Node.js | 22 LTS | CLI tool runtime | LTS version ensures stability, widely supported, required for oclif CLI framework |
| TypeScript | 5.0+ | Type safety across platform | Prevents configuration errors, essential for handling sensitive bot data safely |

### CLI Development

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| oclif | 4.0+ | CLI framework for `npx botarena` | Industry standard for Node.js CLIs, extensible, TypeScript-first, minimal runtime dependencies |
| Commander.js | 12.0+ | Alternative CLI option | Simple, battle-tested, good for smaller CLIs if oclif feels heavyweight |
| Inquirer.js | 9.0+ | Interactive prompts | Best-in-class for collecting bot configuration from users securely |

### Database & Storage

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Supabase | 2.0+ | Bot profile storage & API | PostgreSQL with JSONB support for flexible bot configs, built-in auth, real-time features, excellent Node.js SDK |
| PostgreSQL | 15+ | Primary database | JSONB support perfect for variable bot schemas, ACID compliance, mature ecosystem |
| Drizzle ORM | 0.29+ | Database client | Type-safe database access, excellent TypeScript support, lightweight compared to Prisma |

### Frontend & Visual Design

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Motion (Framer Motion) | 12.29.0 | Animation library | Industry standard for React animations, perfect for game-inspired UI, hardware-accelerated performance |
| Tailwind CSS | 3.4+ | Styling framework | Utility-first approach excellent for rapid UI development, works seamlessly with Next.js |
| Radix UI | 1.0+ | Component primitives | Accessible, unstyled components perfect for custom game-inspired design system |
| Lucide React | 0.344+ | Icon library | Modern, clean icons that work well with gaming aesthetic |

### Security & Integration

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| MCP SDK | Latest | Model Context Protocol integration | Standard for AI agent integration, works with ClawdBot runtime and other AI agents |
| @supabase/auth-helpers | Latest | Authentication | Secure auth integration, supports multiple providers, essential for bot owner verification |
| Zod | 3.22+ | Schema validation | Runtime type checking for bot configurations, prevents malformed data submission |
| Node-forge | 1.3+ | Cryptographic operations | Secure handling of API keys and sensitive bot configuration data |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Vitest | 0.34+ | Testing framework - faster than Jest, excellent Vite integration |
| Playwright | 1.40+ | E2E testing - reliable for CLI and web testing |
| ESLint + TypeScript ESLint | Latest | Code quality - essential for security-focused codebase |
| Prettier | 3.0+ | Code formatting - consistency across team |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| **Web Framework** | Next.js | Remix | Next.js has better static generation support for showcase content, larger ecosystem |
| **Database** | Supabase | MongoDB Atlas | Supabase provides SQL with JSON flexibility, better security posture, 50% cost reduction reported by users |
| **CLI Framework** | oclif | Commander.js alone | oclif provides plugin system for future extensions, better TypeScript integration |
| **Animation** | Motion | GSAP | Motion has React-first API, smaller bundle size, better integration with modern React patterns |

## Installation

```bash
# Core web platform
npm install next@16.1.6 react@18 react-dom@18
npm install @supabase/supabase-js@2
npm install drizzle-orm@0.29.0
npm install motion@12.29.0 tailwindcss@3.4.0
npm install @radix-ui/react-*
npm install lucide-react@0.344.0
npm install zod@3.22.0

# CLI tool
npm install @oclif/core@4.0.0 inquirer@9.0.0
npm install @modelcontextprotocol/sdk
npm install node-forge@1.3.0

# Development dependencies
npm install -D vitest@0.34.0 playwright@1.40.0
npm install -D typescript@5.0+ @types/node
npm install -D eslint prettier
```

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| MongoDB | Document stores lack relational constraints, higher cost, vendor lock-in with SSPL licensing | PostgreSQL with JSONB columns via Supabase |
| Create React App | No built-in routing, poor static generation, deprecated | Next.js with App Router |
| Styled Components | Runtime CSS generation, larger bundles, harder to maintain for gaming UI | Tailwind CSS with CSS-in-JS only where needed |
| jQuery | Legacy, no React integration, poor performance | Motion for animations, React patterns for interactions |
| Hardcoded API keys | Security risk, impossible to rotate, ends up in git | Environment variables + Supabase Vault + runtime encryption |
| Custom auth system | Security pitfalls, maintenance burden, GDPR compliance issues | Supabase Auth with established providers |

## Stack Patterns by Variant

**If you need maximum performance:**
- Use Next.js with `output: 'export'` for fully static generation
- Implement Motion's `LayoutGroup` for batched animations
- Leverage Supabase edge functions for dynamic content

**If you need rapid development:**
- Use Next.js with hybrid rendering (static pages + dynamic API routes)
- Start with Tailwind presets, customize progressively
- Use Supabase auth helpers for immediate user management

**If you're targeting enterprise deployments:**
- Add PostgreSQL connection pooling via PgBouncer
- Implement row-level security in Supabase for multi-tenant data isolation
- Use MCP's enterprise security features for agent integration

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Next.js 16.1.6 | React 18 | Required for App Router features |
| Motion 12.29.0 | React 18 | Uses React 18 concurrent features |
| Supabase JS 2.0+ | Node 18+ | ESM modules, requires modern Node |
| oclif 4.0+ | Node 18 LTS | TypeScript-native, drops older Node support |

## Security Considerations

- **Never store API keys in code** - Use Supabase Vault or environment variables
- **Validate all bot configs** - Zod schemas prevent injection attacks
- **Use HTTPS everywhere** - Supabase provides automatic SSL
- **Implement rate limiting** - Supabase Edge Functions + PostgreSQL triggers
- **Encrypt sensitive data** - Use node-forge for any local temporary storage

## Sources

- Next.js official documentation - App Router and static generation features (HIGH confidence)
- oclif documentation - v4.0 release notes and CLI patterns (HIGH confidence)
- Supabase documentation - JSONB support and auth integration (HIGH confidence)
- Motion documentation - React animation API and performance (HIGH confidence)
- Anthropic MCP documentation - Model Context Protocol standards (HIGH confidence)
- WebSearch 2025-2026 results - Current ecosystem adoption patterns (MEDIUM confidence)

---
*Stack research for: AI bot showcase platform*
*Researched: January 28, 2026*