import { WorkoutDay } from '../types/workout';

export const workoutData: WorkoutDay[] = [
  {
    day: "Monday",
    focus: "Upper Strength (Chest Priority + Shoulders & Back)",
    warmup: [
      "Arm circles (small → large, forward & backward) – 1 min",
      "Band pull-aparts – 2 sets of 15–20 reps",
      "Shoulder CARs (controlled rotations) – 5 reps each arm",
      "Thoracic spine rotations (Open Books) – 8–10 reps each side",
      "Light cardio (rower or treadmill walk) – 3 min"
    ],
    exercises: [
      { name: "Barbell Bench Press", sets: "4 × 6–8", muscleGroup: "Chest" },
      { name: "Machine Chest Press", sets: "3 × 10–12", muscleGroup: "Chest" },

      { name: "Barbell Military Press", sets: "4 × 6–8", muscleGroup: "Shoulders" },
      { name: "Face Pulls", sets: "3 × 15", muscleGroup: "Shoulders" },

      { name: "Lat Pulldown (Wide Grip)", sets: "4 × 10–12", muscleGroup: "Back" },
      { name: "Barbell Bent-Over Row", sets: "4 × 6–8", muscleGroup: "Back" },
      { name: "Seated Cable Row", sets: "3 × 12", muscleGroup: "Back" },

      { name: "Cable Tricep Pushdown", sets: "3 × 12–15", muscleGroup: "Triceps" }
    ]
  },

  {
    day: "Tuesday",
    focus: "Lower Body Strength (Barbell Squat Focus)",
    warmup: [
      "Hip circles (large controlled circles) – 1 min",
      "Leg swings (front-back & side) – 15 reps per leg",
      "Glute bridges (pause at top) – 2 × 15 reps",
      "Bodyweight squats (slow & deep) – 2 sets of 10",
      "Light cardio (cycle or treadmill) – 3 min"
    ],
    exercises: [
      { name: "Barbell Back Squat", sets: "4 × 5–6", muscleGroup: "Legs" },
      { name: "Leg Press", sets: "3 × 10–12", muscleGroup: "Legs" },
      { name: "Goblet Squats to Bench", sets: "3 × 10", muscleGroup: "Legs" },

      { name: "DB Romanian Deadlift", sets: "4 × 10–12", muscleGroup: "Hamstrings" },
      { name: "Leg Extensions", sets: "3 × 12–15", muscleGroup: "Quads" },
      { name: "Standing Calf Raises", sets: "4 × 12–15", muscleGroup: "Calves" },

      { name: "Russian Twists (Weighted)", sets: "3 × 20", muscleGroup: "Core" },
      { name: "Plank", sets: "3 × 40s", muscleGroup: "Core" }
    ]
  },

  {
    day: "Wednesday",
    focus: "Active Cardio + Upper Burn + Core",
    warmup: [
      "Easy incline walk or cycling – 3 min",
      "Cat–Cow spinal mobility – 8–10 reps",
      "Shoulder rolls (forward & backward) – 1 min",
      "Dead bug activation (slow breathing) – 2 × 8 reps each side"
    ],
    exercises: [
      { name: "Incline Walk / Elliptical", sets: "25–30 min", muscleGroup: "Cardio" },

      { name: "Incline Barbell Bench Press", sets: "3 × 8–10", muscleGroup: "Chest" },

      { name: "Assisted Lat Pulldown", sets: "3 × 12–15", muscleGroup: "Back" },
      { name: "Chest-Supported Dumbbell Row", sets: "3 × 12", muscleGroup: "Back" },

      { name: "Cable Crunch", sets: "3 × 15", muscleGroup: "Core" },
      { name: "Dead Bug", sets: "3 × 8 each side", muscleGroup: "Core" },
      { name: "Russian Twists", sets: "3 × 16", muscleGroup: "Core" }
    ]
  },

  {
    day: "Thursday",
    focus: "Upper Hypertrophy (Chest Angles + Delts + Arms)",
    warmup: [
      "Band pull-aparts – 2 × 20 reps",
      "Band external rotations – 2 × 12 reps",
      "Scapular push-ups – 2 × 10 reps",
      "Light dumbbell lateral raises – 2 × 15 reps"
    ],
    exercises: [
      { name: "Incline Dumbbell Press", sets: "3 × 10–12", muscleGroup: "Chest" },
      { name: "Decline Barbell Bench Press", sets: "3 × 8–10", muscleGroup: "Chest" },
      { name: "Pec Deck / Reverse Pec Deck", sets: "3 × 12–15", muscleGroup: "Chest" },

      { name: "Neutral Grip Lat Pulldown", sets: "4 × 10–12", muscleGroup: "Back" },
      { name: "Barbell Pendlay Row", sets: "4 × 6–8", muscleGroup: "Back" },

      { name: "Arnold Press", sets: "3 × 10", muscleGroup: "Shoulders" },
      { name: "Lateral Raises", sets: "4 × 15–20", muscleGroup: "Shoulders" },
      { name: "Rear Delt Fly", sets: "3 × 15", muscleGroup: "Shoulders" },

      { name: "EZ-Bar Curls", sets: "3 × 8–10", muscleGroup: "Biceps" },
      { name: "Cable Hammer Curls", sets: "3 × 10–12", muscleGroup: "Biceps" },
      { name: "Tricep Rope Pushdown", sets: "3 × 12", muscleGroup: "Triceps" }
    ]
  },

  {
    day: "Friday",
    focus: "Lower Body + Posterior Chain (Deadlift Day)",
    warmup: [
      "Hip hinge drill (hands on hips) – 2 min",
      "Hamstring walkouts – 6–8 slow reps",
      "Glute bridges (pause) – 2 × 15 reps",
      "Bodyweight lunges – 10 reps each leg",
      "Light cardio – 2 min"
    ],
    exercises: [
      { name: "Barbell Deadlift", sets: "4 × 4–6", muscleGroup: "Back" },
      { name: "Squat Machine / Assisted Squats", sets: "3 × 10–12", muscleGroup: "Legs" },
      { name: "Leg Press (High Rep)", sets: "3 × 15", muscleGroup: "Legs" },

      { name: "Machine Romanian Deadlift", sets: "3 × 12", muscleGroup: "Hamstrings" },
      { name: "Walking Lunges", sets: "2 × 20 steps", muscleGroup: "Legs" },

      { name: "Treadmill Fast Walk Intervals", sets: "12 min", muscleGroup: "Cardio" }
    ]
  },

  {
    day: "Saturday",
    focus: "Conditioning + Weak Areas",
    warmup: [
      "Easy rowing or cycling – 3 min",
      "Shoulder mobility flow (arm swings & cross-body) – 3 min",
      "Hip openers & side lunges – 2 min",
      "Plank hold – 2 × 30s"
    ],
    exercises: [
      { name: "Cycling / Rowing / Elliptical", sets: "25–30 min", muscleGroup: "Cardio" },

      { name: "Barbell Bench Press (Technique Focus)", sets: "3 × 10", muscleGroup: "Chest" },
      { name: "Incline Pushups", sets: "3 × 12", muscleGroup: "Chest" },

      { name: "Assisted Pull-Ups", sets: "4 × 6–8", muscleGroup: "Back" },
      { name: "Single-Arm Dumbbell Row", sets: "3 × 12", muscleGroup: "Back" },

      { name: "Upright Barbell Row (Light)", sets: "3 × 12", muscleGroup: "Shoulders" },

      { name: "Cable Crunch", sets: "3 × 15", muscleGroup: "Core" },
      { name: "Side Plank", sets: "3 × 30s each side", muscleGroup: "Core" }
    ]
  },

  {
    day: "Sunday",
    focus: "Full Rest",
    isRest: true,
    exercises: []
  }
];
