import { memo, useRef, useCallback } from 'react';

interface DayTabsProps {
  days: string[];
  activeDay: number;
  onDayChange: (index: number) => void;
  completedDays?: number[];
}

function DayTabs({ days, activeDay, onDayChange, completedDays = [] }: DayTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToActive = useCallback(() => {
    if (scrollRef.current) {
      const activeButton = scrollRef.current.querySelector('[data-active="true"]');
      if (activeButton) {
        activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, []);

  return (
    <div className="relative -mx-4 px-4 md:mx-0 md:px-0">
      <div 
        ref={scrollRef}
        className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide py-1 touch-pan-x"
        style={{ scrollBehavior: 'smooth' }}
      >
        {days.map((day, index) => {
          const isActive = activeDay === index;
          const isCompleted = completedDays.includes(index);
          const isRest = index === 6;

          return (
            <button
              key={day}
              data-active={isActive}
              onClick={() => {
                onDayChange(index);
                setTimeout(scrollToActive, 50);
              }}
              className={`
                relative flex-shrink-0 px-4 py-2.5 md:px-5 md:py-3 font-semibold whitespace-nowrap
                transition-all duration-200 text-sm md:text-base rounded-xl
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-400
                active:scale-95 touch-manipulation select-none
                ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/30 border-transparent'
                    : isCompleted && !isRest
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : isRest
                    ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-teal-300 hover:bg-teal-50'
                }
              `}
              style={{ borderWidth: isActive ? 0 : 1 }}
            >
              <span className="text-[10px] md:text-xs block text-gray-400 mb-0.5">{index + 1}</span>
              <span>{day.substring(0, 3)}</span>
              {isCompleted && !isActive && !isRest && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default memo(DayTabs);
