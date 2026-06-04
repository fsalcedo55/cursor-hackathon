import type { CreateNextContextOptions } from "@trpc/server/adapters/next";

import { hasSupabaseEnv } from "../utils/supabase/env";
import { createPagesServerClient } from "../utils/supabase/server";

export async function createContext({ req, res }: CreateNextContextOptions) {
  if (!hasSupabaseEnv()) {
    return {
      supabase: null,
      user: null,
    };
  }

  const supabase = createPagesServerClient({ req, res });
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return {
    supabase,
    user: error ? null : user,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
