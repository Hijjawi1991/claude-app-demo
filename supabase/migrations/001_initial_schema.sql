-- profiles: extends auth.users
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  subscription_status text default 'free' check (subscription_status in ('free', 'pro')),
  stripe_customer_id text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- jobs
create table jobs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  prep_time_seconds int default 30,
  max_do_overs int default 1,
  max_answer_seconds int default 60,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table jobs enable row level security;

create policy "Owners can manage own jobs"
  on jobs for all
  using (auth.uid() = owner_id);

-- job_questions
create table job_questions (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  order_index int not null,
  prompt_text text not null,
  unique (job_id, order_index)
);

alter table job_questions enable row level security;

create policy "Owners can manage questions via jobs"
  on job_questions for all
  using (
    exists (
      select 1 from jobs where jobs.id = job_questions.job_id and jobs.owner_id = auth.uid()
    )
  );

-- candidates
create table candidates (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  full_name text,
  email text,
  invite_token text unique not null,
  status text default 'Pending' check (status in ('Pending', 'Shortlisted', 'Approved', 'Rejected')),
  notes text,
  completed_at timestamptz,
  created_at timestamptz default now()
);

alter table candidates enable row level security;

create policy "Owners can manage candidates via jobs"
  on candidates for all
  using (
    exists (
      select 1 from jobs where jobs.id = candidates.job_id and jobs.owner_id = auth.uid()
    )
  );

-- candidate_answers
create table candidate_answers (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references candidates(id) on delete cascade,
  job_question_id uuid not null references job_questions(id) on delete cascade,
  video_path text not null,
  video_url text not null,
  duration_seconds int not null,
  do_overs_used int default 0,
  submitted_at timestamptz default now(),
  unique (candidate_id, job_question_id)
);

alter table candidate_answers enable row level security;

create policy "Owners can view answers via candidates"
  on candidate_answers for select
  using (
    exists (
      select 1 from candidates
      join jobs on jobs.id = candidates.job_id
      where candidates.id = candidate_answers.candidate_id
      and jobs.owner_id = auth.uid()
    )
  );

-- contact_messages (admin-only via service role)
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

alter table contact_messages enable row level security;
-- No public policies — only accessible via service_role key
