interface DayTabsProps {
  days: string[];
  activeDay: number;
  onDayChange: (index: number) => void;
  completedDays?: number[];
}

export default function DayTabs({ days, activeDay, onDayChange, completedDays = [] }: DayTabsProps) {
  return (
    <div className="flex gap-2 md:gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide animate-fadeInUp -mx-4 px-4 md:mx-0 md:px-0">
      {days.map((day, index) => {
        const isActive = activeDay === index;
        const isCompleted = completedDays.includes(index);
        const isRest = index === 6;

        return (
          <button
            key={day}
            onClick={() => onDayChange(index)}
            className={`
              relative px-4 md:px-6 py-3 rounded-2xl font-semibold whitespace-nowrap
              transition-all duration-300 transform flex-shrink-0
              ${
                isActive
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-xl shadow-teal-500/30 scale-110'
                  : isCompleted && !isRest
                  ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300 hover:scale-105'
                  : isRest
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 hover:scale-105'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-teal-300 hover:bg-teal-50 hover:scale-105'
              }
            `}
          >
            {day.substring(0, 3)}
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
