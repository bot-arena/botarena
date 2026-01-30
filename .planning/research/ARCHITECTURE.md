# Architecture Research

**Domain:** AI Bot Showcase Platform  
**Researched:** 2026-01-28  
**Confidence:** HIGH

## Recommended Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Presentation Layer                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │    CLI      │  │ Web App     │  │   Admin Dashboard     │ │
│  │  (npx tool) │  │ (botarena.sh)│  │   (Management UI)    │ │
│  └─────┬───────┘  └─────┬───────┘  └─────────┬───────────┘ │
│          │                 │                    │             │
├──────────┴─────────────────┴────────────────────┴─────────────┤
│                           API Gateway                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │              Backend Logic (Convex Functions)              │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │  │
│  │  │ Config      │  │ Profile     │  │ Comparison &    │ │  │
│  │  │ Functions   │  │ Functions   │  │  Filtering      │ │  │
│  │  └─────┬───────┘  └─────┬───────┘  └─────────┬───────┘ │  │
│  │          │                 │                    │         │  │
│  │  ┌───────┴───────┐  ┌─────┴───────┐  ┌─────┴───────┐ │  │
│  │  │ Security &     │  │ Validation │  │ Search &      │ │  │
│  │  │ Encryption     │  │ Functions  │  │ Indexing      │ │  │
│  │  │ Functions      │  │            │  │ Functions     │ │  │
│  │  └───────────────┘  └─────────────┘  └─────────────┘ │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────┤
│                           Data Layer                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌─────────────────────────────┐    │
│  │  Convex  │  │  Convex  │  │    Object Storage         │    │
│  │ (Database)│  │ (Cache)  │  │  (Assets, Screenshots)   │    │
│  └──────────┘  └──────────┘  └─────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| CLI Tool | Secure local bot config discovery and upload | Node.js with Oclif framework, MCP integration |
| Web App | Bot profile display, comparison, filtering | React/Next.js with game-inspired UI |
| API Gateway | Request routing, auth, rate limiting | Convex HTTP actions |
| Config Functions | Bot config ingestion and validation | Convex mutations with schema validation |
| Profile Functions | Bot profile storage and retrieval | Convex queries with reactive subscriptions |
| Security Functions | Data encryption, secret handling | Helper functions in Convex |
| Validation Functions | Bot config validation, sanitization | Zod schemas + validation helpers |
| Comparison Functions | Bot comparison logic, filtering | Convex queries with search indexes |
| Object Storage | Static assets, screenshots | Convex file storage or AWS S3 |

## Recommended Project Structure

```
src/
├── cli/                 # CLI tool for bot config discovery
│   ├── commands/         # CLI commands (discover, upload, validate)
│   ├── services/         # Bot runtime integrations
│   │   ├── clawdbot/    # ClawdBot runtime integration
│   │   ├── mcp/         # Model Context Protocol handlers
│   │   └── generic/     # Generic bot detection
│   ├── security/         # Local config validation and encryption
│   └── utils/           # CLI utilities
├── web/                 # Web platform (botarena.sh)
│   ├── components/        # React components
│   │   ├── profile/      # Bot profile display
│   │   ├── comparison/   # Side-by-side comparisons
│   │   └── filtering/    # Search and filter UI
│   ├── pages/            # Next.js pages
│   ├── services/         # API clients
│   └── styles/          # Game-inspired styling
├── api/                 # Backend services
│   ├── config/           # Config ingestion service
│   ├── profiles/         # Profile management
│   ├── comparison/       # Comparison logic
│   ├── security/         # Encryption and validation
│   └── middleware/      # Auth, rate limiting, CORS
├── shared/              # Shared types and utilities
│   ├── types/           # TypeScript interfaces
│   ├── validation/       # Schema definitions
│   └── constants/       # Domain constants
└── infrastructure/       # Deployment and infrastructure
    ├── docker/           # Container definitions
    ├── terraform/        # Infrastructure as code
    └── monitoring/       # Observability setup
```

### Structure Rationale

- **cli/:** Isolated CLI tool with its own services for bot runtime integration. Follows Microsoft Bot Framework CLI patterns.
- **web/:** Separate web application layer with game-inspired UI components. Independent of CLI.
- **api/:** Simple modular backend with clear function boundaries (queries, mutations, actions) - not microservices.
- **shared/:** Common types and validation schemas used across CLI, web, and API.
- **infrastructure/:** Infrastructure as code for secure deployment.

## Architectural Patterns

### Pattern 1: CLI Runtime Integration

**What:** CLI tool discovers bot configurations by querying bot runtimes directly rather than reading raw files.
**When to use:** When integrating with bot runtimes like ClawdBot that expose configuration APIs.
**Trade-offs:** Higher security (no file access) vs. runtime dependency.

**Example:**
```typescript
// CLI service integration
export class ClawdBotIntegration implements BotRuntime {
  async discoverConfig(): Promise<BotConfig> {
    const response = await this.clawdbot.getPublicConfig();
    return this.validateConfig(response.data);
  }
  
  async getCapabilities(): Promise<BotCapabilities> {
    return this.clawdbot.listAvailableSkills();
  }
}
```

### Pattern 2: Secure Configuration Collection

**What:** CLI asks bot runtimes for public config, never accessing raw configuration files.
**When to use:** For all bot integrations to ensure sensitive data isn't exposed.
**Trade-offs:** More complex vs. direct file reading, but essential for security.

**Example:**
```typescript
export class SecureConfigCollector {
  async collectPublicConfig(runtime: BotRuntime): Promise<PublicBotConfig> {
    const config = await runtime.getPublicConfig();
    
    // Only collect public-safe fields
    return {
      llm: config.llm,
      skills: config.skills.map(s => s.publicInfo),
      mcpServers: config.mcpServers.map(m => m.name),
      // Explicitly exclude: apiKeys, privateKeys, sensitiveConfig
    };
  }
}
```

### Pattern 3: Game-Inspired Profile Display

**What:** Present bot profiles using gaming hero card aesthetics similar to retro gaming.
**When to use:** For the web platform's primary user interface.
**Trade-offs:** Higher engagement vs. development complexity.

### Pattern 4: MCP Server Discovery

**What:** Leverage Model Context Protocol to discover and integrate with various AI tools and services.
**When to use:** When bots use MCP servers for extensibility.
**Trade-offs:** Standardized integration vs. MCP ecosystem dependency.

## Data Flow

### CLI Upload Flow

```
User runs: npx botarena upload
    ↓
CLI discovers local bot runtime
    ↓
CLI queries runtime for public config
    ↓
Security validation (Zod schemas + helpers)
    ↓
Config validation against schema
    ↓
Convex mutation stores bot profile
    ↓
Web App displays new bot profile with game-inspired visuals
```

### Web Comparison Flow

```
User selects bots to compare on botarena.sh
    ↓
Frontend queries Convex for bot profiles (reactive)
    ↓
Profile query retrieves profiles from Convex database
    ↓
Comparison logic runs in Convex query function
    ↓
Results rendered with filtering and sorting options
    ↓
Users can filter by LLM, skills, MCPs, etc.
```

### Key Data Flows

1. **Bot Discovery:** CLI → Bot Runtime → Security Validation → Convex Mutation
2. **Profile Display:** Web Component → useQuery Hook → Convex Query → Game UI Rendering  
3. **Comparison Analysis:** Multi-profile Query → Comparison Logic in Convex → Results
4. **Search/Filter:** Filter Criteria → Convex Search Query → Indexed Results

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-1k users | Convex free tier, single deployment |
| 1k-100k users | Convex pro tier with automatic scaling, CDN for static assets |
| 100k+ users | Convex enterprise with dedicated resources, edge deployment |

### Scaling Priorities

1. **First bottleneck:** Profile database queries during popular bot comparisons
   - **Fix:** Convex handles this automatically with reactive caching and query optimization
2. **Second bottleneck:** Static asset delivery (screenshots, profile images)
   - **Fix:** CDN distribution and edge caching

## Anti-Patterns

### Anti-Pattern 1: Raw Configuration File Access

**What people do:** CLI tools read bot config files directly from filesystem
**Why it's wrong:** Exposes sensitive API keys, private configurations, and security credentials
**Do this instead:** Query bot runtime through secure APIs that only return public configuration

### Anti-Pattern 2: Plaintext Sensitive Data Storage

**What people do:** Store bot configurations with sensitive data in plaintext
**Why it's wrong:** Creates massive security vulnerability if database is compromised
**Do this instead:** Encrypt sensitive fields at rest, use envelope encryption for API keys

### Anti-Pattern 3: Monolithic Security

**What people do:** Handle security as an afterthought across all components
**Why it's wrong:** Security boundaries become unclear, vulnerabilities spread
**Do this instead:** Dedicated Security Service with clear boundaries and encryption responsibilities

## Integration Points

### External Bot Runtimes

| Runtime | Integration Pattern | Notes |
|---------|---------------------|-------|
| ClawdBot | HTTP API client | Primary integration target |
| MCP Servers | Model Context Protocol | Standardized integration |
| Generic Bots | File system interrogation (sandboxed) | Fallback for unsupported runtimes |

### Security Patterns

| Pattern | Implementation | Notes |
|---------|----------------|-------|
| Secret Management | Environment variables + Convex secrets | Runtime credential injection |
| Data Encryption | AES-256 with envelope encryption | Sensitive field encryption |
| Validation | Zod schemas | Bot configuration validation |

### Component Communication

| Components | Communication | Notes |
|------------|---------------|-------|
| CLI ↔ Web Platform | Convex HTTP actions + React queries | CLI uploads, web displays |
| Config Validation ↔ Profile Storage | Same Convex mutation function | Config validation before storage |
| Security Helpers ↔ All Functions | Shared utility functions | Centralized encryption/validation |

## Sources

- Microsoft Bot Framework CLI architecture (GitHub, 2025)
- MCP CLI patterns and dynamic discovery (Philipp Schmid, 2026)
- CLI authentication best practices (WorkOS, 2025)
- Model Context Protocol specifications (2026)
- Secure configuration management patterns (2025-2026)
- Game-inspired UI patterns for profile displays

---
*Architecture research for: AI Bot Showcase Platform*
*Researched: 2026-01-28*