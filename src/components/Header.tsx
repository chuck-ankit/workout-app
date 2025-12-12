import { memo } from 'react';
import { Dumbbell, Zap } from 'lucide-react';

interface HeaderProps {
  progress: number;
  isLoading?: boolean;
}

function Header({ progress, isLoading }: HeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-3xl glass-panel px-5 md:px-8 py-8 animate-fadeInUp optimize-render" style={{ transform: 'translateZ(0)' }}>
      <div className="absolute inset-0 bg-gradient-to-r from-teal-50 via-white to-cyan-50 opacity-70" />
      <div className="relative z-10 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg">
              <Dumbbell className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <div>
              <p className="pill bg-teal-100 text-teal-800 border border-teal-200">12-Week Program</p>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mt-2">
                Next Level Fitness
              </h1>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 bg-white/80 border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
            <Zap className="w-5 h-5 text-teal-600" fill="currentColor" />
            <div className="text-left">
              <p className="text-xs uppercase font-semibold tracking-wide text-gray-500">Weekly Momentum</p>
              <p className="text-lg font-bold text-gray-800">{progress}% complete</p>
            </div>
          </div>
        </div>
        <p className="text-base md:text-lg text-gray-600 mb-6 max-w-3xl">
          Designed for sustainable strength. Track your days, nail your form, and let recovery carry you to the next milestone.
        </p>
      </div>
      <div className="relative z-10 inline-block bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm px-6 md:px-8 py-5 rounded-2xl border border-gray-200 shadow-lg max-w-md mx-auto md:mx-0 w-full" style={{ transform: 'translateZ(0)' }}>
        <div className="flex justify-between items-center text-sm mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-teal-600" fill="currentColor" />
            <span className="font-semibold text-gray-700">Weekly Progress</span>
          </div>
          <span
            className={`font-bold text-lg transition-all ${
              progress === 100 ? 'text-emerald-600' : 'text-teal-600'
            }`}
          >
            {progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-sm">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              progress === 100
                ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                : 'bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500'
            } ${isLoading ? 'animate-pulse' : ''}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && (
          <p className="text-xs text-emerald-600 font-semibold mt-2 animate-pulse">
            All exercises completed this week!
          </p>
        )}
      </div>
    </header>
  );
}

export default memo(Header);
