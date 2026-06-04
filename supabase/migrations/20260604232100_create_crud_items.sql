create table public.crud_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  notes text,
  is_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index crud_items_user_id_idx on public.crud_items (user_id);

alter table public.crud_items enable row level security;

create policy "Users can read their own crud items"
on public.crud_items
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own crud items"
on public.crud_items
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own crud items"
on public.crud_items
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own crud items"
on public.crud_items
for delete
to authenticated
using ((select auth.uid()) = user_id);
