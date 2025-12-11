import { WorkoutDay } from '../types/workout';

export const workoutData: WorkoutDay[] = [
  {
    day: "Monday",
    focus: "Upper Strength",
    exercises: [
      { name: "Machine Chest Press", sets: "3 × 12", muscleGroup: "Chest" },
      { name: "Lat Pulldown (Wide Grip)", sets: "4 × 10–12", muscleGroup: "Back" },
      { name: "Seated Dumbbell Shoulder Press", sets: "3 × 10", muscleGroup: "Shoulders" },
      { name: "Seated Cable Row / Neutral Grip", sets: "3 × 12", muscleGroup: "Back" },
      { name: "Face Pulls", sets: "3 × 15", muscleGroup: "Shoulders" },
      { name: "Dumbbell Bicep Curls", sets: "3 × 12–15", muscleGroup: "Biceps" },
      { name: "Cable Tricep Pushdown", sets: "3 × 12–15", muscleGroup: "Triceps" }
    ]
  },
  {
    day: "Tuesday",
    focus: "Lower Body Strength",
    exercises: [
      { name: "Leg Press", sets: "4 × 10–12", muscleGroup: "Legs" },
      { name: "Goblet Squats to Bench", sets: "3 × 10", muscleGroup: "Legs" },
      { name: "DB Romanian Deadlift", sets: "4 × 10–12", muscleGroup: "Hamstrings" },
      { name: "Leg Extensions", sets: "3 × 12–15", muscleGroup: "Quads" },
      { name: "Hip Adductor Machine", sets: "3 × 12–15", muscleGroup: "Inner Thigh" },
      { name: "Standing Calf Raises", sets: "4 × 12–15", muscleGroup: "Calves" },
      { name: "Plank (Knees Down)", sets: "3 × 30s", muscleGroup: "Core" }
    ]
  },
  {
    day: "Wednesday",
    focus: "Active Cardio + Core",
    exercises: [
      { name: "Incline Walk", sets: "30 min", note: "Incline 8–10 • Speed 3–4 km/h", muscleGroup: "Cardio" },
      { name: "Mountain Climbers (Hands on Bench)", sets: "3 × 20", muscleGroup: "Core" },
      { name: "Cable Woodchoppers", sets: "2 × 15 each side", muscleGroup: "Obliques" }
    ]
  },
  {
    day: "Thursday",
    focus: "Upper Hypertrophy",
    exercises: [
      { name: "Incline Dumbbell Press", sets: "4 × 10–12", muscleGroup: "Chest" },
      { name: "Neutral Grip Lat Pulldown", sets: "4 × 10–12", muscleGroup: "Back" },
      { name: "Lateral Raises", sets: "4 × 15–20", muscleGroup: "Shoulders" },
      { name: "Pec Deck / Reverse Pec Deck", sets: "3 × 12–15", muscleGroup: "Chest" },
      { name: "Cable Hammer Curls", sets: "3 × 10–12", muscleGroup: "Biceps" },
      { name: "Tricep Rope Pushdown", sets: "3 × 12", muscleGroup: "Triceps" },
      { name: "Face Pulls", sets: "3 × 15", muscleGroup: "Shoulders" }
    ]
  },
  {
    day: "Friday",
    focus: "Lower Body + Full Body Burn",
    exercises: [
      { name: "Bulgarian Split Squats (Hold Wall)", sets: "3 × 8 each leg", muscleGroup: "Legs" },
      { name: "Seated Leg Press Calf Raises", sets: "4 × 15", muscleGroup: "Calves" },
      { name: "Single Leg Romanian Deadlift", sets: "3 × 10 each leg", muscleGroup: "Hamstrings" },
      { name: "Walking Lunges (Bodyweight)", sets: "2 × 20 steps", muscleGroup: "Legs" },
      { name: "Battle Ropes", sets: "5 × 20s on / 40s off", muscleGroup: "Full Body" }
    ]
  },
  {
    day: "Saturday",
    focus: "Conditioning + Weak Areas",
    exercises: [
      { name: "Rowing / Cycling / Swimming", sets: "20–25 min", muscleGroup: "Cardio" },
      { name: "Incline Pushups", sets: "3 × 8", muscleGroup: "Chest" },
      { name: "Assisted Pull-Ups", sets: "3 × 5", muscleGroup: "Back" },
      { name: "Core (Plank or Cable Crunch)", sets: "2–3 sets", muscleGroup: "Core" }
    ]
  },
  {
    day: "Sunday",
    focus: "Full Rest",
    isRest: true,
    exercises: []
  }
];
