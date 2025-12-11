/*
  # Create Workout Progress Tracking Table

  1. New Tables
    - `workout_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `exercise_id` (text) - format: "d{dayIndex}-e{exerciseIndex}"
      - `day_of_week` (integer) - 0-6 (Sunday-Saturday)
      - `week_start_date` (date) - Monday of the week
      - `completed` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `workout_progress` table
    - Add policy for authenticated users to manage their own workout data

  3. Indexes
    - Create index on (user_id, week_start_date) for efficient weekly queries
    - Create index on (user_id, exercise_id) for checking completion status
*/

CREATE TABLE IF NOT EXISTS workout_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id text NOT NULL,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  week_start_date date NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE workout_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workout progress"
  ON workout_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout progress"
  ON workout_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workout progress"
  ON workout_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout progress"
  ON workout_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_workout_progress_user_week ON workout_progress(user_id, week_start_date);
CREATE INDEX idx_workout_progress_user_exercise ON workout_progress(user_id, exercise_id);
