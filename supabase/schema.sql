create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  role text not null default 'siswa' check (role in ('siswa', 'guru')),
  created_at timestamptz not null default now()
);

create unique index if not exists profiles_username_ci_unique
  on public.profiles (lower(username));

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  requested_username text;
begin
  requested_username := lower(
    regexp_replace(
      coalesce(nullif(trim(new.raw_user_meta_data ->> 'username'), ''), split_part(coalesce(new.email, ''), '@', 1)),
      '[^a-zA-Z0-9_-]+',
      '_',
      'g'
    )
  );

  if length(requested_username) < 3 then
    requested_username := 'siswa_' || left(new.id::text, 8);
  end if;

  begin
    insert into public.profiles (id, username, role)
    values (new.id, requested_username, 'siswa')
    on conflict (id) do nothing;
  exception when unique_violation then
    insert into public.profiles (id, username, role)
    values (new.id, requested_username || '_' || left(new.id::text, 8), 'siswa')
    on conflict (id) do nothing;
  end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute procedure public.handle_new_auth_user();

do $$
declare
  auth_user record;
  requested_username text;
begin
  for auth_user in
    select id, email, raw_user_meta_data
    from auth.users
    where not exists (
      select 1 from public.profiles where profiles.id = auth.users.id
    )
  loop
    requested_username := lower(
      regexp_replace(
        coalesce(nullif(trim(auth_user.raw_user_meta_data ->> 'username'), ''), split_part(coalesce(auth_user.email, ''), '@', 1)),
        '[^a-zA-Z0-9_-]+',
        '_',
        'g'
      )
    );
    if length(requested_username) < 3 then
      requested_username := 'siswa_' || left(auth_user.id::text, 8);
    end if;

    if exists (select 1 from public.profiles where lower(username) = requested_username) then
      requested_username := requested_username || '_' || left(auth_user.id::text, 8);
    end if;

    insert into public.profiles (id, username, role)
    values (auth_user.id, requested_username, 'siswa')
    on conflict (id) do nothing;
  end loop;
end;
$$;

create or replace function public.current_app_role()
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select role from public.profiles where id = auth.uid()
$$;

revoke all on function public.current_app_role() from public, anon;
grant execute on function public.current_app_role() to authenticated;

alter table public.profiles enable row level security;
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
  loop
    execute format('drop policy %I on public.profiles', existing_policy.policyname);
  end loop;
end;
$$;
create policy profiles_read_own_or_teacher
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.current_app_role() = 'guru');

create table if not exists public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  student_id text not null,
  mood_score integer not null,
  energy_level integer not null,
  focus_level integer not null,
  workload_level integer not null,
  factors text[] not null default '{}',
  desired_support text not null,
  reflection_text text,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_analyses (
  id uuid primary key default gen_random_uuid(),
  checkin_id uuid not null references public.daily_checkins(id) on delete cascade,
  need_category text not null,
  priority text not null,
  recommended_action text not null,
  human_support_needed boolean not null default false,
  safety_flag boolean not null default false,
  ai_summary text not null,
  created_at timestamptz not null default now()
);

alter table public.daily_checkins enable row level security;
alter table public.ai_analyses enable row level security;
revoke all on public.daily_checkins, public.ai_analyses from anon, authenticated;
grant select, insert on public.daily_checkins to authenticated;
grant select on public.ai_analyses to authenticated;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select tablename, policyname from pg_policies
    where schemaname = 'public' and tablename in ('daily_checkins', 'ai_analyses')
  loop
    execute format('drop policy %I on public.%I', existing_policy.policyname, existing_policy.tablename);
  end loop;
end;
$$;
create policy daily_checkins_insert_own
  on public.daily_checkins for insert to authenticated
  with check (student_id = auth.uid()::text and public.current_app_role() = 'siswa');
drop policy if exists daily_checkins_read_own_or_teacher on public.daily_checkins;
create policy daily_checkins_read_own_or_teacher
  on public.daily_checkins for select to authenticated
  using (
    (student_id = auth.uid()::text and public.current_app_role() = 'siswa')
    or public.current_app_role() = 'guru'
  );
drop policy if exists ai_analyses_insert_own on public.ai_analyses;
drop policy if exists ai_analyses_read_own_or_teacher on public.ai_analyses;
create policy ai_analyses_read_own_or_teacher
  on public.ai_analyses for select to authenticated
  using (
    public.current_app_role() = 'guru'
    or exists (
      select 1 from public.daily_checkins
      where daily_checkins.id = ai_analyses.checkin_id
        and daily_checkins.student_id = auth.uid()::text
    )
  );

create table if not exists public.practice_questions (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete restrict,
  title text not null,
  prompt text not null,
  options jsonb not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint practice_questions_options_array check (jsonb_typeof(options) = 'array')
);

create table if not exists public.practice_answer_keys (
  question_id uuid primary key references public.practice_questions(id) on delete cascade,
  correct_option integer not null check (correct_option >= 0)
);

create table if not exists public.practice_attempts (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.practice_questions(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  selected_option integer not null check (selected_option >= 0),
  is_correct boolean not null,
  score integer not null check (score in (0, 100)),
  submitted_at timestamptz not null default now()
);

alter table public.practice_questions enable row level security;
alter table public.practice_answer_keys enable row level security;
alter table public.practice_attempts enable row level security;
revoke all on public.practice_questions, public.practice_answer_keys, public.practice_attempts from anon, authenticated;
grant select on public.practice_questions to authenticated;
grant select on public.practice_attempts to authenticated;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select tablename, policyname from pg_policies
    where schemaname = 'public'
      and tablename in ('practice_questions', 'practice_answer_keys', 'practice_attempts')
  loop
    execute format('drop policy %I on public.%I', existing_policy.policyname, existing_policy.tablename);
  end loop;
end;
$$;
create policy practice_questions_read_active_or_teacher
  on public.practice_questions for select to authenticated
  using (
    (is_active and public.current_app_role() = 'siswa')
    or public.current_app_role() = 'guru'
  );
create policy practice_answer_keys_read_teacher
  on public.practice_answer_keys for select to authenticated
  using (public.current_app_role() = 'guru');
create policy practice_attempts_read_own_or_teacher
  on public.practice_attempts for select to authenticated
  using (student_id = auth.uid() or public.current_app_role() = 'guru');

create or replace function public.create_teacher_practice_question(
  p_title text,
  p_prompt text,
  p_options jsonb,
  p_correct_option integer
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  new_question_id uuid;
begin
  if auth.uid() is null or public.current_app_role() <> 'guru' then
    raise exception 'Akses hanya untuk guru.' using errcode = '42501';
  end if;
  if length(trim(p_title)) = 0 or length(trim(p_prompt)) = 0
    or jsonb_typeof(p_options) <> 'array'
    or jsonb_array_length(p_options) < 2
    or p_correct_option < 0
    or p_correct_option >= jsonb_array_length(p_options) then
    raise exception 'Data soal tidak valid.' using errcode = '22023';
  end if;

  insert into public.practice_questions (teacher_id, title, prompt, options)
  values (auth.uid(), trim(p_title), trim(p_prompt), p_options)
  returning id into new_question_id;

  insert into public.practice_answer_keys (question_id, correct_option)
  values (new_question_id, p_correct_option);

  return new_question_id;
end;
$$;

create or replace function public.submit_practice_attempt(
  p_question_id uuid,
  p_selected_option integer
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_user_id uuid := auth.uid();
  option_count integer;
  correct_option_index integer;
  answer_is_correct boolean;
  new_attempt_id uuid;
begin
  if current_user_id is null or public.current_app_role() <> 'siswa' then
    raise exception 'Akses hanya untuk siswa.' using errcode = '42501';
  end if;

  select jsonb_array_length(options)
  into option_count
  from public.practice_questions
  where id = p_question_id and is_active;
  if not found then
    raise exception 'Soal tidak ditemukan.' using errcode = 'P0002';
  end if;
  if p_selected_option < 0 or p_selected_option >= option_count then
    raise exception 'Pilihan jawaban tidak valid.' using errcode = '22023';
  end if;

  select correct_option into correct_option_index
  from public.practice_answer_keys
  where question_id = p_question_id;
  if not found then
    raise exception 'Kunci jawaban tidak tersedia.' using errcode = 'P0002';
  end if;

  answer_is_correct := p_selected_option = correct_option_index;
  insert into public.practice_attempts (
    question_id, student_id, selected_option, is_correct, score
  ) values (
    p_question_id, current_user_id, p_selected_option, answer_is_correct,
    case when answer_is_correct then 100 else 0 end
  ) returning id into new_attempt_id;

  return jsonb_build_object(
    'attempt_id', new_attempt_id,
    'is_correct', answer_is_correct,
    'score', case when answer_is_correct then 100 else 0 end
  );
end;
$$;

revoke all on function public.create_teacher_practice_question(text, text, jsonb, integer) from public, anon;
revoke all on function public.submit_practice_attempt(uuid, integer) from public, anon;
grant execute on function public.create_teacher_practice_question(text, text, jsonb, integer) to authenticated;
grant execute on function public.submit_practice_attempt(uuid, integer) to authenticated;