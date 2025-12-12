/*
  # Create Workout Progress Tracking Table (Single User App)

  1. New Tables
    - `workout_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - single default user for the app
      - `exercise_id` (text) - format: "d{dayIndex}-e{exerciseIndex}"
      - `day_of_week` (integer) - 0-6 (Sunday-Saturday)
      - `week_start_date` (date) - Monday of the week
      - `completed` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - RLS disabled for single user app
    - All operations allowed via service role key

  3. Indexes
    - Create index on (user_id, week_start_date) for efficient weekly queries
    - Create index on (user_id, exercise_id) for checking completion status
*/

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
