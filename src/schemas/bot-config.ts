import { z } from 'zod';

/**
 * SECURITY NOTICE: This schema defines ONLY public-facing bot configuration fields.
 * 
 * The Gatekeeper Pattern:
 * - Sensitive fields (API keys, tokens, private configs) are NEVER included here
 * - Only fields safe for public display on botarena.sh are allowed
 * - Schema acts as a whitelist - anything not explicitly defined is rejected
 * 
 * Why this matters:
 * - Prevents accidental exposure of secrets in public profiles
 * - Ensures bot owners control what information is shared
 * - Creates a clear boundary between internal and public configuration
 */

/**
 * Public-facing bot configuration schema
 * Validates data that is safe to display publicly on botarena.sh
 */
export const PublicBotConfig = z.object({
  // Core identity
  owner: z
    .string()
    .min(1, 'Owner must be at least 1 character')
    .max(100, 'Owner must be 100 characters or less')
    .nullable()
    .optional(),
  name: z.string()
    .min(1, 'Bot name is required')
    .max(100, 'Bot name must be 100 characters or less'),
  
  // "Yearbook quote" - one sentence personality showcase
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description must be 500 characters or less'),
  
  // LLM configuration (public info only - no API keys)
  modelPrimary: z
    .string()
    .min(1, 'Primary LLM is required')
    .regex(
      /^[a-z0-9][a-z0-9._-]*\/[a-z0-9][a-z0-9._-]*$/i,
      'Model must match provider/model'
    ),
  modelFallbacks: z
    .array(
      z
        .string()
        .min(1)
        .regex(
          /^[a-z0-9][a-z0-9._-]*\/[a-z0-9][a-z0-9._-]*$/i,
          'Model must match provider/model'
        )
    )
    .default([]),
  
  // Skills/tools the bot has access to (names only, no config)
  skills: z.array(z.string())
    .min(0)
    .default([]),
  
  // MCPs (Model Context Protocols) the bot uses
  mcps: z.array(z.string())
    .min(0)
    .default([]),
  
  // CLI tools the bot has access to
  clis: z.array(z.string())
    .min(0)
    .default([]),
  
  // Bot harness/framework
  harness: z.string()
    .min(1, 'Harness/framework is required'),
  
  // Bot version
  version: z.string()
    .min(1, 'Version is required')
    .default('1.0.0'),
  
  // Optional avatar URL (must be valid URL if provided)
  avatar: z.string()
    .url('Avatar must be a valid URL')
    .optional(),
});

/**
 * Type inference for PublicBotConfig
 */
export type PublicBotConfigType = z.infer<typeof PublicBotConfig>;

/**
 * Schema for file discovery results
 * Tracks how bot information was detected
 */
export const DiscoveredBotInfo = z.object({
  runtime: z.string(),
  detectedFrom: z.string(),
  name: z.string().optional(),
  avatar: z.string().optional(),
});

/**
 * Type inference for DiscoveredBotInfo
 */
export type DiscoveredBotInfoType = z.infer<typeof DiscoveredBotInfo>;

/**
 * Validates a raw configuration object against the PublicBotConfig schema
 * 
 * @param config - Unknown configuration object to validate
 * @returns Validated PublicBotConfig object
 * @throws z.ZodError if validation fails
 */
export function validatePublicConfig(config: unknown): PublicBotConfigType {
  return PublicBotConfig.parse(config);
}

/**
 * Safely validates a configuration object, returning null on failure
 * 
 * @param config - Unknown configuration object to validate
 * @returns Validated PublicBotConfig object or null if invalid
 */
export function safeValidatePublicConfig(config: unknown): PublicBotConfigType | null {
  const result = PublicBotConfig.safeParse(config);
  return result.success ? result.data : null;
}

/**
 * Sanitizes a raw configuration by extracting only public-safe fields
 * 
 * @param rawConfig - Raw configuration object that may contain sensitive data
 * @returns Sanitized PublicBotConfig with only safe fields
 * @throws z.ZodError if required public fields are missing
 */
export function sanitizeConfig(rawConfig: unknown): PublicBotConfigType {
  // First, extract only known public fields if rawConfig is an object
  if (typeof rawConfig !== 'object' || rawConfig === null) {
    throw new Error('Configuration must be an object');
  }

  const raw = rawConfig as Record<string, unknown>;
  
  // Extract only public-safe fields (whitelist approach)
  const sanitized = {
    owner: raw.owner,
    name: raw.name,
    description: raw.description,
    modelPrimary: raw.modelPrimary,
    modelFallbacks: raw.modelFallbacks,
    skills: raw.skills,
    mcps: raw.mcps,
    clis: raw.clis,
    harness: raw.harness,
    version: raw.version,
    avatar: raw.avatar,
  };

  return validatePublicConfig(sanitized);
}

/**
 * Checks if a configuration is safe for public display
 * 
 * @param config - Configuration object to check
 * @returns true if configuration is valid and safe for public display
 */
export function isSafeForPublicDisplay(config: unknown): boolean {
  return PublicBotConfig.safeParse(config).success;
}

/**
 * List of sensitive field names that should NEVER be included in public configs
 * Used for validation warnings and security auditing
 */
export const SENSITIVE_FIELD_NAMES = [
  'apiKey',
  'api_key',
  'apikey',
  'token',
  'secret',
  'password',
  'privateKey',
  'private_key',
  'auth',
  'credential',
  'credentials',
  'accessToken',
  'access_token',
  'refreshToken',
  'refresh_token',
];

/**
 * Checks if a configuration object contains any suspicious sensitive fields
 * 
 * @param config - Configuration object to scan
 * @returns Array of sensitive field names found (empty if clean)
 */
export function detectSensitiveFields(config: unknown): string[] {
  if (typeof config !== 'object' || config === null) {
    return [];
  }

  const found: string[] = [];
  const keys = Object.keys(config as Record<string, unknown>);
  
  for (const key of keys) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_FIELD_NAMES.some(sensitive => lowerKey.includes(sensitive))) {
      found.push(key);
    }
  }

  return found;
}
