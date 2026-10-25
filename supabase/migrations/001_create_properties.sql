-- =========================================================
-- 物件テーブルの作成
-- Supabase ダッシュボードの SQL Editor に貼り付けて実行する
-- =========================================================

create table if not exists public.properties (
  -- 物件ID（自動採番）
  id uuid primary key default gen_random_uuid(),
  -- 登録したユーザー（未指定ならログイン中のユーザーIDが入る）
  -- ユーザーが削除されたら、その物件も削除する
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- 物件名
  name text not null check (char_length(name) between 1 and 100),
  -- 家賃（円）
  rent integer not null check (rent >= 0),
  -- エリア名
  area text not null check (char_length(area) between 1 and 100),
  -- 間取り（例：1LDK）
  layout text not null check (char_length(layout) between 1 and 20),
  -- 作成日時・更新日時
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ユーザーごとの一覧取得を速くするためのインデックス
create index if not exists properties_user_id_idx on public.properties (user_id);

-- ---------------------------------------------------------
-- 更新時に updated_at を自動で現在時刻にするトリガー
-- ---------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------
-- 行レベルセキュリティ（RLS）
-- 自分が登録した物件のみ表示・登録・編集・削除できる
-- ---------------------------------------------------------
alter table public.properties enable row level security;

-- ログインユーザーにだけ操作権限を与える（未ログインの anon には与えない）
revoke all on public.properties from anon;
grant select, insert, update, delete on public.properties to authenticated;

-- 表示：自分の物件のみ
drop policy if exists "自分の物件のみ表示できる" on public.properties;
create policy "自分の物件のみ表示できる"
  on public.properties for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- 登録：自分のユーザーIDでのみ登録できる
drop policy if exists "自分の物件のみ登録できる" on public.properties;
create policy "自分の物件のみ登録できる"
  on public.properties for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- 編集：自分の物件のみ。編集後も自分の物件であること（他人に付け替え不可）
drop policy if exists "自分の物件のみ編集できる" on public.properties;
create policy "自分の物件のみ編集できる"
  on public.properties for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 削除：自分の物件のみ
drop policy if exists "自分の物件のみ削除できる" on public.properties;
create policy "自分の物件のみ削除できる"
  on public.properties for delete
  to authenticated
  using ((select auth.uid()) = user_id);
