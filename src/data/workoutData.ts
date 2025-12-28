import { WorkoutDay } from '../types/workout';

export const workoutData: WorkoutDay[] = [
  {
    day: "Monday",
    focus: "Upper Strength (Chest Priority)",
    exercises: [
      {
        name: "Barbell Bench Press",
        sets: "4 × 6–8",
        note: "Start light • focus on form • full rest",
        muscleGroup: "Chest"
      },
      {
        name: "Machine Chest Press",
        sets: "3 × 10–12",
        note: "Controlled tempo",
        muscleGroup: "Chest"
      },
      {
        name: "Lat Pulldown (Wide Grip)",
        sets: "4 × 10–12",
        muscleGroup: "Back"
      },
      {
        name: "Seated Cable Row / Neutral Grip",
        sets: "3 × 12",
        muscleGroup: "Back"
      },
      {
        name: "Face Pulls",
        sets: "3 × 15",
        muscleGroup: "Shoulders"
      },
      {
        name: "Cable Tricep Pushdown",
        sets: "3 × 12–15",
        muscleGroup: "Triceps"
      }
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
      { name: "Plank (Knees Down)", sets: "3 × 30–40s", muscleGroup: "Core" }
    ]
  },
  {
    day: "Wednesday",
    focus: "Active Cardio + Core + Upper Burn",
    exercises: [
      {
        name: "Incline Walk / Elliptical",
        sets: "25–30 min",
        note: "Steady pace • fat burn zone",
        muscleGroup: "Cardio"
      },
      {
        name: "Incline Barbell Bench Press",
        sets: "3 × 8–10",
        note: "Moderate weight • chest & shoulders",
        muscleGroup: "Chest"
      },
      {
        name: "Assisted Lat Pulldown",
        sets: "3 × 12–15",
        muscleGroup: "Back"
      },
      {
        name: "Standing Cable Crunch",
        sets: "3 × 12–15",
        muscleGroup: "Core"
      },
      {
        name: "Dead Bug",
        sets: "3 × 8–10 each side",
        muscleGroup: "Core"
      },
      {
        name: "Farmer’s Carry (Light Dumbbells)",
        sets: "3 × 30–45s",
        muscleGroup: "Core"
      }
    ]
  },
  {
    day: "Thursday",
    focus: "Upper Hypertrophy (Chest Angles)",
    exercises: [
      {
        name: "Incline Dumbbell Press",
        sets: "3 × 10–12",
        muscleGroup: "Chest"
      },
      {
        name: "Decline Barbell Bench Press",
        sets: "3 × 8–10",
        note: "Lower chest focus • controlled",
        muscleGroup: "Chest"
      },
      {
        name: "Neutral Grip Lat Pulldown",
        sets: "4 × 10–12",
        muscleGroup: "Back"
      },
      {
        name: "Lateral Raises",
        sets: "4 × 15–20",
        muscleGroup: "Shoulders"
      },
      {
        name: "Pec Deck / Reverse Pec Deck",
        sets: "3 × 12–15",
        muscleGroup: "Chest"
      },
      {
        name: "Cable Hammer Curls",
        sets: "3 × 10–12",
        muscleGroup: "Biceps"
      },
      {
        name: "Tricep Rope Pushdown",
        sets: "3 × 12",
        muscleGroup: "Triceps"
      }
    ]
  },
  {
    day: "Friday",
    focus: "Lower Body + Full Body Burn",
    exercises: [
      {
        name: "Squat Machine / Assisted Squats",
        sets: "4 × 10–12",
        muscleGroup: "Legs"
      },
      {
        name: "Leg Press (High Rep)",
        sets: "3 × 15",
        note: "Short rest • calorie burn",
        muscleGroup: "Legs"
      },
      {
        name: "Machine Romanian Deadlift / Cable Pull-Through",
        sets: "3 × 12",
        muscleGroup: "Hamstrings"
      },
      {
        name: "Walking Lunges (Short Steps)",
        sets: "2 × 16–20 steps",
        muscleGroup: "Legs"
      },
      {
        name: "Treadmill Fast Walk Intervals",
        sets: "10–12 min",
        note: "1 min fast / 1 min slow",
        muscleGroup: "Cardio"
      }
    ]
  },
  {
    day: "Saturday",
    focus: "Conditioning + Weak Areas",
    exercises: [
      {
        name: "Cycling / Rowing / Elliptical",
        sets: "25–30 min",
        note: "Steady or intervals",
        muscleGroup: "Cardio"
      },
      {
        name: "Barbell Bench Press (Technique Focus)",
        sets: "3 × 10",
        note: "Light weight • improve push strength",
        muscleGroup: "Chest"
      },
      {
        name: "Incline Pushups (Bench or Wall)",
        sets: "3 × 8–12",
        muscleGroup: "Chest"
      },
      {
        name: "Assisted Pull-Ups / Lat Pulldown Hold",
        sets: "3 × 6–8",
        muscleGroup: "Back"
      },
      {
        name: "Cable Pallof Press",
        sets: "3 × 12 each side",
        muscleGroup: "Core"
      },
      {
        name: "Plank (Knees or Elevated)",
        sets: "3 × 30–45s",
        muscleGroup: "Core"
      }
    ]
  },
  {
    day: "Sunday",
    focus: "Full Rest",
    isRest: true,
    exercises: []
  }
];
