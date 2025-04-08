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

// Define and export environment variables
export const env = {
  EB_BEARER: getEnvVar("EB_BEARER"),
  STRIPE_SECRET_KEY: getEnvVar("STRIPE_SECRET_KEY"),
  KIT_API_KEY: getEnvVar("KIT_API_KEY"),
  SUPABASE_API_URL: getEnvVar("SUPABASE_API_URL"),
  SUPABASE_API_KEY: getEnvVar("SUPABASE_API_KEY"),
  STRIPE_WEBHOOK_SECRET: getEnvVar("STRIPE_WEBHOOK_SECRET"),
  POSTMARK_SERVER_TOKEN: getEnvVar("POSTMARK_SERVER_TOKEN"),
} as const;
