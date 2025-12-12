# Workout App

A workout tracking application with Supabase integration for progress syncing.

## Setup

### Database Setup

The app requires a `workout_progress` table in your Supabase database. To create it:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the following SQL migration:

```sql
CREATE TABLE IF NOT EXISTS workout_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
  exercise_id text NOT NULL,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  week_start_date date NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create unique constraint with explicit name for upsert operations
CREATE UNIQUE INDEX IF NOT EXISTS workout_progress_user_exercise_week_unique 
ON workout_progress(user_id, exercise_id, week_start_date);

-- Disable RLS for single user app
ALTER TABLE workout_progress DISABLE ROW LEVEL SECURITY;

CREATE INDEX idx_workout_progress_user_week ON workout_progress(user_id, week_start_date);
CREATE INDEX idx_workout_progress_user_exercise ON workout_progress(user_id, exercise_id);
```

Alternatively, you can find the migration file at `supabase/migrations/20251211110604_create_workout_progress_table.sql` and copy its contents.

### Environment Variables

Create a `.env` file in the root directory with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

If these are not set, the app will run in local-only mode using localStorage.

## Development

```bash
npm install
npm run dev
```

## Features

- Weekly workout tracking
- Progress persistence (localStorage + Supabase)
- Automatic week reset
- Exercise completion tracking
