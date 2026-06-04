import type { NextApiRequest, NextApiResponse } from "next";

import { hasSupabaseEnv } from "../../../utils/supabase/env";
import { createPagesServerClient } from "../../../utils/supabase/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end();
    return;
  }

  if (hasSupabaseEnv()) {
    const supabase = createPagesServerClient({ req, res });
    await supabase.auth.signOut();
  }

  res.writeHead(303, { Location: "/login" });
  res.end();
}
