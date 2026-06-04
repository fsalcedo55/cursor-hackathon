import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/router";

import { createClient } from "../utils/supabase/client";

type AuthMode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const supabase = createClient();
      const authResponse =
        authMode === "signin"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (authResponse.error) {
        setMessage(authResponse.error.message);
        return;
      }

      if (authMode === "signup" && !authResponse.data.session) {
        setMessage("Check your email to confirm your account before signing in.");
        return;
      }

      await router.push("/account");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="text-3xl font-semibold text-zinc-950">
        {authMode === "signin" ? "Sign in" : "Create an account"}
      </h1>
      <p className="mt-3 text-zinc-600">
        Use your email and password to access your Supabase-backed account.
      </p>

      <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-sm font-medium text-zinc-800">
          Email
          <input
            className="rounded-md border border-zinc-300 px-3 py-2"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-zinc-800">
          Password
          <input
            className="rounded-md border border-zinc-300 px-3 py-2"
            minLength={6}
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </label>

        <button
          className="rounded-md bg-zinc-950 px-4 py-2 font-medium text-white disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting
            ? "Working..."
            : authMode === "signin"
              ? "Sign in"
              : "Sign up"}
        </button>
      </form>

      <button
        className="mt-4 text-left text-sm font-medium text-zinc-700"
        onClick={() => {
          setAuthMode(authMode === "signin" ? "signup" : "signin");
          setMessage("");
        }}
        type="button"
      >
        {authMode === "signin"
          ? "Need an account? Sign up."
          : "Already have an account? Sign in."}
      </button>

      {message ? <p className="mt-4 text-sm text-zinc-700">{message}</p> : null}
    </main>
  );
}
