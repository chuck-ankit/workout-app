import { memo, useMemo } from 'react';
import { Armchair, Sparkles, Flame, Activity, CheckCircle2 } from 'lucide-react';
import { WorkoutDay } from '../types/workout';
import ExerciseItem from './ExerciseItem';

interface WorkoutCardProps {
  workout: WorkoutDay;
  completedExercises: Set<string>;
  onToggleExercise: (exerciseId: string) => void;
  dayIndex: number;
}

function WorkoutCard({
  workout,
  completedExercises,
  onToggleExercise,
  dayIndex,
}: WorkoutCardProps) {
  const completedCount = useMemo(() => {
    return workout.exercises.filter((_, index) =>
      completedExercises.has(`d${dayIndex}-e${index}`)
    ).length;
  }, [workout.exercises, completedExercises, dayIndex]);

  const completionPercent = useMemo(() => {
    return workout.exercises.length > 0
      ? Math.round((completedCount / workout.exercises.length) * 100)
      : 0;
  }, [completedCount, workout.exercises.length]);

  if (workout.isRest) {
    return (
      <div className="bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400 rounded-2xl md:rounded-3xl p-8 md:p-12 text-center text-white shadow-xl animate-fadeIn overflow-hidden relative">
        <div className="absolute inset-0 bg-white/10" />
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="relative z-10">
          <Armchair className="w-16 md:w-20 h-16 md:h-20 mx-auto mb-5" strokeWidth={1.5} />
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Rest Day</h2>
          <p className="text-base md:text-lg text-white/90 max-w-md mx-auto mb-6">
            Your muscles grow while you rest. Focus on sleep, hydration, and nutrition.
          </p>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-xl px-5 py-3">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">Recovery Time</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel bg-white/90 rounded-2xl md:rounded-3xl shadow-xl overflow-hidden animate-fadeIn border border-white/60">
      <div className="bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-600 px-5 md:px-8 py-5 md:py-7 relative">
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/70 font-medium">Day {dayIndex + 1}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">{workout.day}</h2>
            <p className="text-white/80 text-sm md:text-base">{workout.focus}</p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-3 rounded-xl">
            <Flame className="w-5 h-5 text-white" fill="currentColor" />
            <span className="text-white font-bold text-lg">{completionPercent}%</span>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-3">
        {workout.warmup && workout.warmup.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-teal-600" />
              <h3 className="text-base font-semibold text-gray-800">Warmup</h3>
            </div>
            <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
              <ul className="space-y-2">
                {workout.warmup.map((warmupItem, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-teal-500 mt-0.5">•</span>
                    <span>{warmupItem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {workout.exercises.map((exercise, index) => {
          const exerciseId = `d${dayIndex}-e${index}`;
          return (
            <ExerciseItem
              key={exerciseId}
              exercise={exercise}
              isCompleted={completedExercises.has(exerciseId)}
              onToggle={() => onToggleExercise(exerciseId)}
            />
          );
        })}
      </div>

      <div className="px-5 md:px-8 py-4 bg-gradient-to-r from-gray-50 to-teal-50 border-t border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {completionPercent === 100 ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            ) : (
              <Flame className="w-5 h-5 text-teal-500" fill="currentColor" />
            )}
            <span className="text-base font-medium text-gray-700">
              {completedCount}/{workout.exercises.length} completed
            </span>
          </div>
          <div className="flex-1 max-w-[140px] md:max-w-[200px] bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                completionPercent === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-teal-400 to-cyan-500'
              }`}
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(WorkoutCard);
