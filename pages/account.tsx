import type { GetServerSideProps } from "next";

import { hasSupabaseEnv } from "../utils/supabase/env";
import { createPagesServerClient } from "../utils/supabase/server";

type AccountPageProps = {
  configurationError?: string;
  email?: string;
  displayName?: string | null;
};

export const getServerSideProps: GetServerSideProps<
  AccountPageProps
> = async (context) => {
  if (!hasSupabaseEnv()) {
    return {
      props: {
        configurationError:
          "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to use Supabase Auth.",
      },
    };
  }

  const supabase = createPagesServerClient(context);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();

  return {
    props: {
      displayName: profile?.display_name ?? null,
      email: user.email ?? "",
    },
  };
};

export default function AccountPage({
  configurationError,
  displayName,
  email,
}: AccountPageProps) {
  if (configurationError) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6">
        <h1 className="text-3xl font-semibold text-zinc-950">
          Supabase is not configured
        </h1>
        <p className="mt-3 text-zinc-600">{configurationError}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6">
      <h1 className="text-3xl font-semibold text-zinc-950">Account</h1>
      <dl className="mt-8 space-y-4 text-zinc-700">
        <div>
          <dt className="text-sm font-medium text-zinc-500">Email</dt>
          <dd>{email}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-zinc-500">Display name</dt>
          <dd>{displayName || "No display name set yet."}</dd>
        </div>
      </dl>

      <form action="/api/auth/signout" className="mt-8" method="post">
        <button
          className="rounded-md bg-zinc-950 px-4 py-2 font-medium text-white"
          type="submit"
        >
          Sign out
        </button>
      </form>
    </main>
  );
}
