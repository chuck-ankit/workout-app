export interface Exercise {
  name: string;
  sets: string;
  note?: string;
  muscleGroup?: string;
  difficulty?: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  warmup?: string[];
  exercises: Exercise[];
  isRest?: boolean;
}

export interface WorkoutProgress {
  exerciseId: string;
  completed: boolean;
  date: string;
}
