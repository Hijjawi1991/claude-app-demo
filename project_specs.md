# project_specs.md — HireBee: Async Video Interview SaaS


## 0) Product Summary


HireBee is a SaaS platform for async video interviews. Employers post jobs, invite candidates via unique links, and review recorded video answers in a Kanban pipeline. Candidates record directly in the browser — no account required.


**Tech stack:**
- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Supabase (Auth, Postgres, Storage, RLS)
- shadcn/ui component library
- @dnd-kit for drag-and-drop Kanban
- Stripe for subscription payments
- Deployed on Vercel


---


## 1) Roles & Permissions


### Admin (Employer)
- Email/password auth via Supabase
- Creates jobs, writes 5 questions, sets recording settings
- Invites candidates (generates unique tokenized links)
- Reviews video submissions in a Kanban pipeline
- Updates candidate status (Pending → Shortlisted → Approved → Rejected)
- Manages billing (upgrade to Pro, cancel via Stripe billing portal)


### Candidate (Interviewee)
- Accesses interview via unique token link — no account required
- Records up to 5 × 60s video answers in the browser (MediaRecorder API)
- Videos upload directly to Supabase Storage


---


## 2) Subscription Plans


| Feature | Free | Pro ($49/mo) |
|---|---|---|
| Active jobs | 1 | Unlimited |
| Candidates/month | 10 | Unlimited |
| Video storage | 7 days | 1 year |
| Kanban pipeline | ✓ | ✓ |
| Priority support | — | ✓ |


Plan limits enforced server-side in `POST /api/admin/jobs`. Stripe webhook upgrades/downgrades `profiles.subscription_status` automatically.


---


## 3) Data Model (Supabase Postgres)


### `profiles`
- `id` uuid PK (matches auth.users.id)
- `email` text
- `subscription_status` text default 'free' ('free' | 'pro')
- `stripe_customer_id` text null
- `created_at` timestamptz


### `jobs`
- `id` uuid PK
- `owner_id` uuid FK → profiles.id
- `title` text not null
- `description` text null
- `prep_time_seconds` int default 30
- `max_do_overs` int default 1
- `max_answer_seconds` int default 60
- `is_active` boolean default true
- `created_at`, `updated_at` timestamptz


### `job_questions`
- `id` uuid PK
- `job_id` uuid FK → jobs.id
- `order_index` int (1–5), unique per job
- `prompt_text` text


### `candidates`
- `id` uuid PK
- `job_id` uuid FK → jobs.id
- `full_name` text null
- `email` text null
- `invite_token` text unique
- `status` text ('Pending' | 'Shortlisted' | 'Approved' | 'Rejected')
- `notes` text null
- `completed_at` timestamptz null
- `created_at` timestamptz


### `candidate_answers`
- `id` uuid PK
- `candidate_id` uuid FK → candidates.id
- `job_question_id` uuid FK → job_questions.id
- `video_path` text (Storage path)
- `video_url` text
- `duration_seconds` int
- `do_overs_used` int default 0
- `submitted_at` timestamptz


---


## 4) Route Structure


### Marketing (public)
- `/` — Home page (hero, features, testimonials, CTA)
- `/about` — Company story + values
- `/contact` — Contact form
- `/pricing` — 3-tier pricing with Stripe checkout for Pro


### Admin (authenticated, `app/(admin)/` route group)
- `/dashboard` — Job list, plan badge, upgrade banner for free users
- `/jobs/[jobId]` — Job detail with tabs: Overview | Pipeline | Questions | Settings
- `/jobs/[jobId]/pipeline` — Kanban board (drag-and-drop)
- `/candidates/[candidateId]` — Video review, status, notes
- `/settings` — Account plan + billing management


### API Routes
**Admin (authenticated):**
- `GET/POST /api/admin/jobs` — list/create jobs (enforces free plan limit)
- `PATCH /api/admin/jobs/[jobId]` — update settings
- `PUT /api/admin/jobs/[jobId]/questions` — replace all 5 questions
- `GET/POST /api/admin/jobs/[jobId]/candidates` — list/create candidates
- `GET/PATCH /api/admin/candidates/[candidateId]` — review with signed URLs / update status


**Candidate (public, token-based):**
- `GET /api/interview/[token]` — verify token, return job + questions
- `POST /api/interview/[token]/upload-intent` — return signed Storage upload URL
- `POST /api/interview/[token]/submit` — save answer metadata
- `POST /api/interview/[token]/complete` — mark interview complete


**Payments:**
- `POST /api/checkout` — create Stripe Checkout session for Pro plan
- `POST /api/billing-portal` — create Stripe Customer Portal session
- `POST /api/webhooks/stripe` — handle checkout.session.completed + subscription.deleted


---


## 5) Key Technical Decisions


- **Storage:** Private `interviews` bucket. All video access via signed URLs (1hr expiry). Never public.
- **Candidate auth:** Token-based only. Candidate operations go through API routes — no direct Supabase client access from the browser for candidate data.
- **Tenant isolation:** All jobs scoped to `owner_id = auth.uid()` via RLS. Admins only see their own data.
- **Plan limits:** Checked server-side in `POST /api/admin/jobs` before insert.
- **Stripe webhook:** Excluded from middleware auth check. Signature verified via `STRIPE_WEBHOOK_SECRET`.
- **Optimistic Kanban UI:** State updates immediately on drag; PATCH fires in background; reverts on failure.


---


## 6) Environment Variables


```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
```


---


## 7) Out of Scope
- Live video calls
- Multi-admin teams / organizations
- More than 5 questions per job
- Video transcoding
- Safari support (Chrome/Edge only for recording)
- Email delivery for candidate invites (links are copy-pasted manually)



