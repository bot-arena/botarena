---
status: resolved
trigger: "Investigate why bot discovery isn't finding skills, model, MCPs, or CLIs"
created: 2026-01-30T16:20:00Z
updated: 2026-01-30T16:25:00Z
---

## Current Focus

hypothesis: COMPLETE - Root cause identified and documented
test: Code analysis of discovery flow
expecting: N/A - Investigation complete
next_action: Report findings to user

## Symptoms

expected: 
  - Running `npx botarena generate <bot-path>` should discover bot name, runtime, skills count
  - Should query bot for description, model, MCPs, CLIs
  - Skills count should reflect actual skills in skills/ directory
  - Should discover MCPs from mcp.json
  - Should discover CLIs from somewhere

actual:
  - Name discovered correctly
  - Skills shows 0 (even if skills exist)
  - No query for description, model, MCPs, CLIs
  - LLM shows "Not specified"
  - MCPs array is empty
  - CLIs array is empty

errors: None - silent failures in discovery logic

reproduction: Run `npx botarena generate <path-to-bot-with-skills>`

started: Reported in UAT Test 3

## Eliminated

- hypothesis: Skills directory not being scanned
  evidence: Code DOES scan skills directories (lines 136-168 in clawdbot.ts)
  timestamp: 2026-01-30T16:22:00Z

- hypothesis: MCPs not being read from mcp.json
  evidence: Code DOES read mcp.json (lines 174-194 in clawdbot.ts)
  timestamp: 2026-01-30T16:22:00Z

## Evidence

- timestamp: 2026-01-30T16:21:00Z
  checked: src/cli/commands/generate.ts
  found: Line 81 logs skills count as `discovered.skills?.length || 0` - skills come from discovery.discover()
  implication: If skills is empty/undefined, it shows 0

- timestamp: 2026-01-30T16:22:00Z
  checked: src/lib/clawdbot.ts discoverSkills() method
  found: Only scans SKILL_DIRECTORIES which are hardcoded paths like 'skills', '.clawdbot/skills', '.claude/skills', '.pi/skills', '~/.pi/agent/skills'
  implication: If bot has skills in a different location (e.g., 'src/skills/', 'lib/skills/'), they won't be found

- timestamp: 2026-01-30T16:23:00Z
  checked: src/lib/clawdbot.ts extractPublicConfig() method
  found: Lines 117-123 - LLM is hardcoded to 'Not specified', clis is hardcoded to empty array []
  implication: No logic exists to discover LLM model or CLI tools

- timestamp: 2026-01-30T16:23:00Z
  checked: src/cli/commands/generate.ts
  found: Lines 84-94 - Description is collected via interactive inquirer prompt, NOT discovered from files
  implication: The "ask the bot" pattern is implemented as user input, not file discovery

- timestamp: 2026-01-30T16:24:00Z
  checked: src/lib/clawdbot.ts discoverMCPs() method
  found: Only reads from 'mcp.json' in basePath, expects specific format (mcpServers or servers)
  implication: If mcp.json uses different structure or is named differently, MCPs won't be found

## Resolution

root_cause: |
  THREE SEPARATE ISSUES:
  
  1. SKILLS=0: The SKILL_DIRECTORIES array only checks hardcoded paths ('skills', '.clawdbot/skills', etc.).
     If a bot stores skills in a non-standard location (e.g., 'src/skills/'), discovery returns empty.
     Also, skills are only discovered as directory names - no validation that they are actual skills.
  
  2. MISSING LLM/CLIs: The extractPublicConfig() method hardcodes:
     - llm.primary = 'Not specified' (line 118)
     - clis = [] (line 123)
     There is NO logic to discover these from any files.
  
  3. NO "ASK THE BOT" PATTERN: The description is collected via interactive user prompt (inquirer),
     not by querying/reading from bot files. The user expected the CLI to "ask the bot" by reading
     from SOUL.md or other files, but instead it asks the human user interactively.

fix: |
  To fix these issues:
  
  1. SKILLS: Add more flexible skill discovery - search recursively or allow custom skills path
  2. LLM: Add logic to read model from config files (e.g., mcp.json, claude.config.json, or SOUL.md)
  3. CLIs: Add logic to discover CLI tools from package.json bin entries or a clis.json file
  4. "ASK THE BOT": Either:
     a) Extract description from SOUL.md automatically (extractDescriptionFromSoul exists but isn't used)
     b) Or clarify that "ask the bot" means interactive user input

verification: N/A - This is a diagnosis-only task

files_changed: []
