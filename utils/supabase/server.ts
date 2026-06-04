import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";

import { getSupabaseEnv } from "./env";

type PagesRequest = NextApiRequest | GetServerSidePropsContext["req"];
type PagesResponse = NextApiResponse | GetServerSidePropsContext["res"];

type PagesServerClientOptions = {
  req: PagesRequest;
  res: PagesResponse;
};

function getRequestCookies(req: PagesRequest) {
  return Object.entries(req.cookies ?? {}).flatMap(([name, value]) => {
    if (Array.isArray(value)) {
      return value.map((cookieValue) => ({ name, value: cookieValue }));
    }

    if (typeof value === "string") {
      return [{ name, value }];
    }

    return [];
  });
}

function getExistingSetCookieHeaders(res: PagesResponse) {
  const existingHeader = res.getHeader("Set-Cookie");

  if (!existingHeader) {
    return [];
  }

  if (Array.isArray(existingHeader)) {
    return existingHeader.map(String);
  }

  return [String(existingHeader)];
}

function serializeCookie(name: string, value: string, options: CookieOptions) {
  const cookieParts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];

  if (options.maxAge !== undefined) {
    cookieParts.push(`Max-Age=${Math.floor(options.maxAge)}`);
  }

  if (options.domain) {
    cookieParts.push(`Domain=${options.domain}`);
  }

  if (options.path) {
    cookieParts.push(`Path=${options.path}`);
  }

  if (options.expires) {
    cookieParts.push(`Expires=${options.expires.toUTCString()}`);
  }

  if (options.httpOnly) {
    cookieParts.push("HttpOnly");
  }

  if (options.secure) {
    cookieParts.push("Secure");
  }

  if (options.sameSite) {
    const sameSite =
      options.sameSite === true ? "Strict" : String(options.sameSite);

    cookieParts.push(`SameSite=${sameSite}`);
  }

  return cookieParts.join("; ");
}

export function createPagesServerClient({ req, res }: PagesServerClientOptions) {
  const { supabaseUrl, supabasePublishableKey } = getSupabaseEnv();

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return getRequestCookies(req);
      },
      setAll(cookiesToSet, headers) {
        Object.entries(headers).forEach(([key, value]) => {
          res.setHeader(key, value);
        });

        const serializedCookies = cookiesToSet.map(({ name, value, options }) =>
          serializeCookie(name, value, options),
        );

        res.setHeader("Set-Cookie", [
          ...getExistingSetCookieHeaders(res),
          ...serializedCookies,
        ]);
      },
    },
  });
}
