import { useState, memo, useMemo } from 'react';
import { Check, ChevronDown, Dumbbell, Activity } from 'lucide-react';
import { Exercise } from '../types/workout';

interface ExerciseItemProps {
  exercise: Exercise;
  isCompleted: boolean;
  onToggle: () => void;
  index: number;
}

function ExerciseItem({ exercise, isCompleted, onToggle, index }: ExerciseItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const muscleGroupColors: Record<string, string> = useMemo(() => ({
    Chest: 'bg-orange-100 text-orange-800 border border-orange-200',
    Back: 'bg-blue-100 text-blue-800 border border-blue-200',
    Shoulders: 'bg-amber-100 text-amber-800 border border-amber-200',
    Biceps: 'bg-cyan-100 text-cyan-800 border border-cyan-200',
    Triceps: 'bg-teal-100 text-teal-800 border border-teal-200',
    Legs: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    Quads: 'bg-green-100 text-green-800 border border-green-200',
    Hamstrings: 'bg-lime-100 text-lime-800 border border-lime-200',
    Calves: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    Core: 'bg-rose-100 text-rose-800 border border-rose-200',
    Cardio: 'bg-red-100 text-red-800 border border-red-200',
    'Full Body': 'bg-indigo-100 text-indigo-800 border border-indigo-200',
    'Inner Thigh': 'bg-pink-100 text-pink-800 border border-pink-200',
    Obliques: 'bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-200',
  }), []);

  return (
    <div
      className="group animate-slideIn optimize-render"
      style={{ 
        animationDelay: `${Math.min(index * 30, 300)}ms`,
        transform: 'translateZ(0)'
      }}
    >
      <div
        className={`
          flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 md:p-5
          transition-optimized duration-300 rounded-2xl
          ${isCompleted ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200' : 'bg-white border border-gray-200 hover:border-teal-300 hover:shadow-md'}
          ${isExpanded ? 'rounded-b-none' : ''}
        `}
        style={{ transform: 'translateZ(0)' }}
      >
        <button
          onClick={onToggle}
          className={`
            flex-shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-lg border-2
            transition-optimized duration-300 flex items-center justify-center
            ${
              isCompleted
                ? 'bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-500 scale-110'
                : 'border-gray-300 hover:border-teal-500 bg-white'
            }
          `}
        >
          {isCompleted && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-sm md:text-base ${
            isCompleted ? 'line-through text-gray-500' : 'text-gray-800'
          }`}>
            {exercise.name}
          </h4>
          {exercise.note && (
            <p className="text-xs md:text-sm text-gray-500 mt-1">{exercise.note}</p>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 ml-10 sm:ml-0">
          <span className="px-3 py-1.5 bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 border border-teal-200 rounded-lg font-bold text-xs md:text-sm whitespace-nowrap">
            {exercise.sets}
          </span>

          {exercise.muscleGroup && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-center p-1.5 text-gray-400 hover:text-teal-600 transition-colors"
            >
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {isExpanded && exercise.muscleGroup && (
        <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-4 md:p-5 rounded-b-2xl animate-expandDown border-t border-teal-200 shadow-md optimize-render" style={{ transform: 'translateZ(0)' }}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white rounded-lg border border-teal-200">
                <Activity className="w-5 h-5 text-teal-600" strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Target Muscle</p>
                <span className={`inline-block px-3 py-1.5 rounded-full text-xs md:text-sm font-semibold mt-1 ${
                  muscleGroupColors[exercise.muscleGroup] || 'bg-gray-100 text-gray-700'
                }`}>
                  {exercise.muscleGroup}
                </span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-teal-100">
              <div className="flex gap-3">
                <Dumbbell className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                <p className="text-sm text-gray-700 leading-relaxed">
                  Focus on controlled movements. Maintain proper form throughout each rep. Rest 60-90 seconds between sets for optimal recovery.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(ExerciseItem);
