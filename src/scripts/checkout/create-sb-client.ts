import { createClient } from "@supabase/supabase-js";
import { env } from "../env.ts";

export const createSbClient = createClient(
  env.SUPABASE_API_URL,
  env.SUPABASE_API_KEY,
);
