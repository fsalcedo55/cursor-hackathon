import type { FormEvent } from "react";
import { useState } from "react";
import type { GetServerSideProps } from "next";

import { hasSupabaseEnv } from "../utils/supabase/env";
import { createClient } from "../utils/supabase/client";
import { createPagesServerClient } from "../utils/supabase/server";

type CrudItem = {
  id: string;
  user_id: string;
  title: string;
  notes: string | null;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
};

type CrudTestPageProps = {
  configurationError?: string;
  initialError?: string;
  initialItems: CrudItem[];
  userEmail?: string;
  userId?: string;
};

export const getServerSideProps: GetServerSideProps<
  CrudTestPageProps
> = async (context) => {
  if (!hasSupabaseEnv()) {
    return {
      props: {
        configurationError:
          "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to use Supabase CRUD.",
        initialItems: [],
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

  const { data, error } = await supabase
    .from("crud_items")
    .select("id,user_id,title,notes,is_complete,created_at,updated_at")
    .order("created_at", { ascending: false });

  return {
    props: {
      initialError: error?.message,
      initialItems: data ?? [],
      userEmail: user.email ?? "",
      userId: user.id,
    },
  };
};

export default function CrudTestPage({
  configurationError,
  initialError,
  initialItems,
  userEmail,
  userId,
}: CrudTestPageProps) {
  const [items, setItems] = useState(initialItems);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingNotes, setEditingNotes] = useState("");
  const [message, setMessage] = useState(initialError ?? "");
  const [isLoading, setIsLoading] = useState(false);

  if (configurationError) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6">
        <h1 className="text-3xl font-semibold text-zinc-950">
          Supabase is not configured
        </h1>
        <p className="mt-3 text-zinc-600">{configurationError}</p>
      </main>
    );
  }

  async function loadItems() {
    setIsLoading(true);
    setMessage("");

    const supabase = createClient();
    const { data, error } = await supabase
      .from("crud_items")
      .select("id,user_id,title,notes,is_complete,created_at,updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
    } else {
      setItems(data ?? []);
    }

    setIsLoading(false);
  }

  async function createItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!userId) {
      setMessage("You must be signed in to create an item.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    const supabase = createClient();
    const { data, error } = await supabase
      .from("crud_items")
      .insert({
        notes: notes || null,
        title,
        user_id: userId,
      })
      .select("id,user_id,title,notes,is_complete,created_at,updated_at")
      .single();

    if (error) {
      setMessage(error.message);
    } else if (data) {
      setItems((currentItems) => [data, ...currentItems]);
      setTitle("");
      setNotes("");
      setMessage("Created item.");
    }

    setIsLoading(false);
  }

  async function updateItem(itemId: string) {
    setIsLoading(true);
    setMessage("");

    const supabase = createClient();
    const { data, error } = await supabase
      .from("crud_items")
      .update({
        notes: editingNotes || null,
        title: editingTitle,
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId)
      .select("id,user_id,title,notes,is_complete,created_at,updated_at")
      .single();

    if (error) {
      setMessage(error.message);
    } else if (data) {
      setItems((currentItems) =>
        currentItems.map((item) => (item.id === itemId ? data : item)),
      );
      setEditingId(null);
      setMessage("Updated item.");
    }

    setIsLoading(false);
  }

  async function toggleItem(item: CrudItem) {
    setIsLoading(true);
    setMessage("");

    const supabase = createClient();
    const { data, error } = await supabase
      .from("crud_items")
      .update({
        is_complete: !item.is_complete,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id)
      .select("id,user_id,title,notes,is_complete,created_at,updated_at")
      .single();

    if (error) {
      setMessage(error.message);
    } else if (data) {
      setItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.id === item.id ? data : currentItem,
        ),
      );
      setMessage(data.is_complete ? "Marked complete." : "Marked incomplete.");
    }

    setIsLoading(false);
  }

  async function deleteItem(itemId: string) {
    setIsLoading(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase
      .from("crud_items")
      .delete()
      .eq("id", itemId);

    if (error) {
      setMessage(error.message);
    } else {
      setItems((currentItems) =>
        currentItems.filter((item) => item.id !== itemId),
      );
      setMessage("Deleted item.");
    }

    setIsLoading(false);
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-950">
            Supabase CRUD Test
          </h1>
          <p className="mt-2 text-zinc-600">
            Signed in as {userEmail}. These rows are protected by Supabase RLS.
          </p>
        </div>
        <form action="/api/auth/signout" method="post">
          <button
            className="rounded-md border border-zinc-300 px-4 py-2 font-medium text-zinc-800"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </div>

      <form
        className="mt-8 rounded-lg border border-zinc-200 p-4"
        onSubmit={createItem}
      >
        <h2 className="text-lg font-semibold text-zinc-950">Create item</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-800">
            Title
            <input
              className="rounded-md border border-zinc-300 px-3 py-2"
              onChange={(event) => setTitle(event.target.value)}
              required
              value={title}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-800">
            Notes
            <input
              className="rounded-md border border-zinc-300 px-3 py-2"
              onChange={(event) => setNotes(event.target.value)}
              value={notes}
            />
          </label>
        </div>
        <button
          className="mt-4 rounded-md bg-zinc-950 px-4 py-2 font-medium text-white disabled:opacity-60"
          disabled={isLoading}
          type="submit"
        >
          Create
        </button>
      </form>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-950">Read items</h2>
        <button
          className="rounded-md border border-zinc-300 px-4 py-2 font-medium text-zinc-800 disabled:opacity-60"
          disabled={isLoading}
          onClick={loadItems}
          type="button"
        >
          Refresh
        </button>
      </div>

      {message ? <p className="mt-4 text-sm text-zinc-700">{message}</p> : null}

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li className="rounded-lg border border-zinc-200 p-4" key={item.id}>
            {editingId === item.id ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  className="rounded-md border border-zinc-300 px-3 py-2"
                  onChange={(event) => setEditingTitle(event.target.value)}
                  value={editingTitle}
                />
                <input
                  className="rounded-md border border-zinc-300 px-3 py-2"
                  onChange={(event) => setEditingNotes(event.target.value)}
                  value={editingNotes}
                />
                <div className="flex gap-2 sm:col-span-2">
                  <button
                    className="rounded-md bg-zinc-950 px-4 py-2 font-medium text-white disabled:opacity-60"
                    disabled={isLoading || !editingTitle}
                    onClick={() => updateItem(item.id)}
                    type="button"
                  >
                    Save update
                  </button>
                  <button
                    className="rounded-md border border-zinc-300 px-4 py-2 font-medium text-zinc-800"
                    onClick={() => setEditingId(null)}
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-zinc-950">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600">
                      {item.notes || "No notes"}
                    </p>
                    <p className="mt-2 text-xs text-zinc-500">
                      Status: {item.is_complete ? "complete" : "incomplete"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800 disabled:opacity-60"
                      disabled={isLoading}
                      onClick={() => toggleItem(item)}
                      type="button"
                    >
                      Toggle
                    </button>
                    <button
                      className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800"
                      onClick={() => {
                        setEditingId(item.id);
                        setEditingTitle(item.title);
                        setEditingNotes(item.notes ?? "");
                      }}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-700 disabled:opacity-60"
                      disabled={isLoading}
                      onClick={() => deleteItem(item.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {items.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-zinc-300 p-4 text-zinc-600">
          No CRUD items yet. Create one above.
        </p>
      ) : null}
    </main>
  );
}
