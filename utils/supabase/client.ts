import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnv } from "./env";

type BrowserClient = ReturnType<typeof createBrowserClient>;

let browserClient: BrowserClient | undefined;

export function createClient() {
  if (browserClient) {
    return browserClient;
  }

  const { supabaseUrl, supabasePublishableKey } = getSupabaseEnv();

  browserClient = createBrowserClient(supabaseUrl, supabasePublishableKey);

  return browserClient;
}
