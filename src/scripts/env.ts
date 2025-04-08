export function getEnvVar(key: string): string {
  // Try process.env first (for deployment/server-side)
  const processEnv = process.env[key];
  if (processEnv) return processEnv;

  // Try import.meta.env (for local development)
  const importMetaEnv = import.meta.env[key];
  if (importMetaEnv) return importMetaEnv;

  // Throw error if variable is not found
  throw new Error(`Environment variable ${key} is not defined`);
}

// Define and export environment variables with getters
export const env = {
  get EB_BEARER() {
    return getEnvVar("EB_BEARER");
  },
  get STRIPE_SECRET_KEY() {
    return getEnvVar("STRIPE_SECRET_KEY");
  },
  get KIT_API_KEY() {
    return getEnvVar("KIT_API_KEY");
  },
  get SUPABASE_API_URL() {
    return getEnvVar("SUPABASE_API_URL");
  },
  get SUPABASE_API_KEY() {
    return getEnvVar("SUPABASE_API_KEY");
  },
  get STRIPE_WEBHOOK_SECRET() {
    return getEnvVar("STRIPE_WEBHOOK_SECRET");
  },
  get POSTMARK_SERVER_TOKEN() {
    return getEnvVar("POSTMARK_SERVER_TOKEN");
  },
} as const;
