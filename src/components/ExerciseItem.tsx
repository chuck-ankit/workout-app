import { useState, memo, useMemo, useCallback } from 'react';
import { Check, ChevronDown, Activity } from 'lucide-react';
import { Exercise } from '../types/workout';

interface ExerciseItemProps {
  exercise: Exercise;
  isCompleted: boolean;
  onToggle: () => void;
}

function ExerciseItem({ exercise, isCompleted, onToggle }: ExerciseItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    onToggle();
  }, [onToggle]);

  const handleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const muscleGroupColors = useMemo(() => ({
    Chest: 'bg-orange-100 text-orange-800',
    Back: 'bg-blue-100 text-blue-800',
    Shoulders: 'bg-amber-100 text-amber-800',
    Biceps: 'bg-cyan-100 text-cyan-800',
    Triceps: 'bg-teal-100 text-teal-800',
    Legs: 'bg-emerald-100 text-emerald-800',
    Quads: 'bg-green-100 text-green-800',
    Hamstrings: 'bg-lime-100 text-lime-800',
    Calves: 'bg-yellow-100 text-yellow-800',
    Core: 'bg-rose-100 text-rose-800',
    Cardio: 'bg-red-100 text-red-800',
    'Full Body': 'bg-indigo-100 text-indigo-800',
    'Inner Thigh': 'bg-pink-100 text-pink-800',
    Obliques: 'bg-fuchsia-100 text-fuchsia-800',
  } as Record<string, string>), []);

  return (
    <div className="group exercise-item animate-fadeInUp" style={{ animationDuration: '0.3s' }}>
      <div
        className={`
          flex items-center gap-2 p-2.5 md:p-4 rounded-xl
          transition-all duration-200 hover:shadow-md
          ${isCompleted ? 'bg-emerald-50 border border-emerald-200' : 'bg-white border border-gray-200 hover:border-teal-300'}
        `}
      >
        <button
          onClick={handleToggle}
          className={`
            flex-shrink-0 w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl border-2 active:scale-90
            transition-all duration-150 flex items-center justify-center touch-manipulation
            ${isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 hover:border-teal-500 bg-white'}
          `}
        >
          {isCompleted && <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          <h4 className={`font-medium text-xs sm:text-sm ${
            isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'
          }`}>
            {exercise.name}
          </h4>
          {exercise.note && (
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 hidden sm:block">{exercise.note}</p>
          )}
        </div>

        <span className="px-2 py-1 md:px-3 md:py-1.5 bg-teal-50 text-teal-700 rounded-md font-semibold text-[10px] sm:text-xs whitespace-nowrap">
          {exercise.sets}
        </span>

        {exercise.muscleGroup && (
          <button
            onClick={handleExpand}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-teal-600 transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {isExpanded && exercise.muscleGroup && (
        <div className="bg-teal-50 p-3 md:p-4 rounded-b-xl border-t border-teal-200 mt-[-2px] animate-fadeIn">
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <Activity className="w-3.5 h-3.5 md:w-4 md:h-4 text-teal-600" />
            <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-medium ${muscleGroupColors[exercise.muscleGroup] || 'bg-gray-100 text-gray-700'}`}>
              {exercise.muscleGroup}
            </span>
          </div>
          <p className="text-xs text-gray-600">
            Focus on controlled movements. Maintain proper form throughout each rep.
          </p>
        </div>
      )}
    </div>
  );
}

export default memo(ExerciseItem);
