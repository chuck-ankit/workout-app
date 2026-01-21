import { memo, useMemo } from 'react';
import { Armchair, Sparkles, Flame, Activity } from 'lucide-react';
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
      <div className="bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl animate-fadeIn overflow-hidden relative optimize-render">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
        <div className="relative z-10">
          <div className="animate-float mb-6">
            <Armchair className="w-16 md:w-20 h-16 md:h-20 mx-auto" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Complete Rest Day</h2>
          <p className="text-base md:text-lg text-white/90 max-w-md mx-auto leading-relaxed mb-6">
            Your muscles grow while you rest, not while you train. Recovery is just as important as the workout itself.
          </p>
          <div className="inline-block bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4">
            <div className="flex items-center justify-center gap-2 text-white">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Focus on sleep, hydration, and nutrition</span>
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel bg-white/90 rounded-3xl shadow-2xl overflow-hidden animate-fadeIn border border-white/70 optimize-render">
      <div className="bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-600 px-6 md:px-8 py-6 md:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="pill bg-white/20 text-white border border-white/30 mb-2">Daily session</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">{workout.day}</h2>
            <p className="text-white/80 text-sm md:text-base">{workout.focus}</p>
          </div>
          <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/20">
            <Flame className="w-5 h-5 text-white" fill="currentColor" />
            <div>
              <p className="text-xs text-white/80">Completion</p>
              <span className="text-white font-bold text-lg">{completionPercent}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-3 md:space-y-4" style={{ contain: 'layout style' }}>
        {workout.warmup && workout.warmup.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-teal-600" />
              <h3 className="text-lg font-semibold text-gray-800">Warmup</h3>
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
              index={index}
            />
          );
        })}
      </div>

      <div className="px-6 md:px-8 py-5 md:py-6 bg-gradient-to-r from-gray-50 to-teal-50 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-gray-700 font-semibold text-sm">Daily Progress</p>
            <p className="text-gray-500 text-xs mt-1">
              {completedCount} of {workout.exercises.length} completed
            </p>
          </div>
          <div className="w-full sm:w-48 bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                completionPercent === 100
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                  : 'bg-gradient-to-r from-teal-400 to-cyan-500'
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
