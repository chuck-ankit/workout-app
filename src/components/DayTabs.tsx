import { memo } from 'react';

interface DayTabsProps {
  days: string[];
  activeDay: number;
  onDayChange: (index: number) => void;
  completedDays?: number[];
}

function DayTabs({ days, activeDay, onDayChange, completedDays = [] }: DayTabsProps) {
  return (
    <div className="flex gap-2 md:gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-4 scrollbar-hide animate-fadeInUp -mx-4 px-4 md:mx-0 md:px-0 optimize-render" style={{ transform: 'translateZ(0)', scrollBehavior: 'smooth' }}>
      {days.map((day, index) => {
        const isActive = activeDay === index;
        const isCompleted = completedDays.includes(index);
        const isRest = index === 6;

        return (
          <button
            key={day}
            onClick={() => onDayChange(index)}
            className={`
              relative w-24 md:w-28 h-16 md:h-20 rounded-2xl font-semibold whitespace-nowrap backdrop-blur
              transition-all duration-300 transform flex-none flex flex-col items-center justify-center gap-1 text-sm md:text-base tracking-wide border
              focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-400 focus-visible:ring-offset-slate-50
              ${
                isActive
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-xl shadow-teal-500/30 scale-105 border-transparent'
                  : isCompleted && !isRest
                  ? 'bg-emerald-50/80 text-emerald-800 border-emerald-200 hover:-translate-y-1'
                  : isRest
                  ? 'bg-blue-50/80 text-blue-800 border-blue-200 hover:-translate-y-1'
                  : 'bg-white/80 text-gray-700 border-gray-200 hover:border-teal-200 hover:bg-teal-50/70 hover:-translate-y-1'
              }
            `}
          >
            <span className="text-xs uppercase text-gray-500">Day {index + 1}</span>
            <span className="text-base md:text-lg">{day.substring(0, 3)}</span>
            {isCompleted && !isActive && !isRest && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default memo(DayTabs);
