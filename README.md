# Go for German — Teacher Marketplace

A Next.js marketplace where curated, verified German-as-a-foreign-language
teachers register and offer one-on-one lessons, small groups, exam
preparation, and specialized subject-specific courses (e.g. Medical German,
Nursing German). Built alongside Go for German's existing course offering.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind CSS v4)
- **Supabase** (Postgres, Row Level Security, Storage) for the database
- **Vercel** for hosting

## Features

- **Landing page** introducing the marketplace
- **Find a Teacher** — filterable directory (teaching format, specialization,
  price tier) of approved teacher profiles
- **Teacher profile pages** with bio, teaching philosophy, specializations,
  qualifications, pricing plans, and a booking inquiry widget
- **Become a Teacher** — a 4-step registration wizard (Basic Info,
  Qualifications, Formats & Pricing, Review) that uploads a headshot/CV to
  Supabase Storage and submits the application through a `SECURITY DEFINER`
  RPC (`submit_teacher_application`), so every new profile lands with
  `status = 'pending'` until the Go for German team approves it — client
  code can never self-approve

## Data model

| Table | Purpose |
| --- | --- |
| `teachers` | Core profile + moderation `status` (`pending`/`approved`/`rejected`) + `available_for_own_courses` flag for GfG's internal course pool |
| `price_tier_definitions` | The 4 fixed price tiers (Standard Tutor → Specialist Expert) |
| `specializations` | Predefined specialization list (teachers can also add free-text ones) |
| `teacher_teaching_formats` | One-on-one / small group / exam prep / subject-specific |
| `teacher_specializations` | Per-teacher specializations (predefined or custom) |
| `teacher_qualifications` | CV/certificate line items shown on the profile |
| `pricing_plans` | Per-teacher, per-course-type pricing at a given tier |
| `teacher_availability` | Weekly recurring availability windows |
| `bookings` | Lesson inquiries submitted through a teacher's profile |

Row Level Security is enabled everywhere: the public can only read
`approved` teachers and their related rows; booking inserts are open but
never readable by anonymous clients; teacher self-registration only ever
happens through the `submit_teacher_application` RPC.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project URL + anon key
npm run dev
```

## Environment variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/publishable key |

## Deployment

Deployed on Vercel, connected to this repository. Set the two environment
variables above in the Vercel project settings.
