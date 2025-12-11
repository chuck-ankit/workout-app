import { Dumbbell, Zap } from 'lucide-react';

interface HeaderProps {
  progress: number;
  isLoading?: boolean;
}

export default function Header({ progress, isLoading }: HeaderProps) {
  return (
    <header className="text-center mb-8 animate-fadeInUp">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg">
          <Dumbbell className="w-8 h-8 text-white" strokeWidth={2} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
          Next Level Fitness
        </h1>
      </div>
      <p className="text-base md:text-lg text-gray-600 mb-6">12-Week Transformation Program</p>

      <div className="inline-block bg-gradient-to-br from-white to-gray-50 backdrop-blur-md px-6 md:px-8 py-5 rounded-2xl border border-gray-200 shadow-lg max-w-md mx-auto w-full">
        <div className="flex justify-between items-center text-sm mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-teal-600" fill="currentColor" />
            <span className="font-semibold text-gray-700">Weekly Progress</span>
          </div>
          <span className={`font-bold text-lg transition-all ${
            progress === 100 ? 'text-emerald-600' : 'text-teal-600'
          }`}>
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
