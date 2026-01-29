1. ✅ SWITCHED TO FILE DISCOVERY - Why simple file reading over MCP:
   - Simplicity: No protocol setup, no config changes, no bot restart
   - User control: Interactive prompts let bot owners craft their description
   - Immediate: Works right away without installing anything in bot config
   - Safe: Only reads allowlisted files (SOUL.md, skills/), never secrets

2. ✅ SWITCHED TO CONVEX - Why Convex over Supabase:
   - Reactive by default: Queries auto-update when data changes (perfect for live bot showcase)
   - TypeScript-native: No SQL/ORM context switching, queries are just TypeScript functions
   - Zero boilerplate: No connection management, migrations, or RLS policies to configure
   - Automatic transactions: Every mutation is ACID-compliant without begin/commit statements
   - AI-friendly: LLMs generate correct Convex code more reliably (no SQL context switching)

3. Use latest nextjs and react versions, check if unsure

4. ✅ FIXED - Removed microservices mentions. Using simple modular backend with Convex functions:
   - No microservices overhead for a simple showcase platform
   - Convex provides query/mutation/action functions in one codebase
   - Logical separation via function organization, not service boundaries
   - Single deployment, automatic scaling by Convex
