import { memo } from 'react';
import { Zap, TrendingUp } from 'lucide-react';

interface HeaderProps {
  progress: number;
  isLoading?: boolean;
}

function Header({ progress, isLoading }: HeaderProps) {
  const motivationalMessage = () => {
    if (progress === 0) return "Let's start crushing it!";
    if (progress < 25) return "Great start! Keep pushing!";
    if (progress < 50) return "You're on fire!";
    if (progress < 75) return "More than halfway there!";
    if (progress < 100) return "Almost at 100%!";
    return "Week Complete! You're a beast!";
  };

  return (
    <header className="relative overflow-hidden rounded-2xl md:rounded-3xl glass-panel px-5 md:px-8 py-6 md:py-8 animate-fadeInUp">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-50 via-white to-cyan-50 opacity-70" />
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-teal-200/30 rounded-full blur-2xl animate-pulse" />
      <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-cyan-200/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden shadow-lg shadow-teal-500/25 bg-white">
              <img src="/logo.svg" alt="Next Level Fitness" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Next Level Fitness
              </h1>
              <p className="text-sm text-teal-700 font-medium">12-Week Program</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/80 border border-gray-200/60 rounded-xl px-4 py-2.5">
            <Zap className="w-5 h-5 text-amber-500" fill="currentColor" />
            <span className="text-lg font-bold text-gray-800">{progress}%</span>
          </div>
        </div>
        
        <p className="text-base md:text-lg text-gray-600 mb-5">{motivationalMessage()}</p>
        
        <div className="relative z-10 bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm px-5 py-4 rounded-xl border border-gray-200/60 shadow-sm">
          <div className="flex justify-between items-center text-sm mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <span className="font-semibold text-gray-700">Weekly Progress</span>
            </div>
            <span className={`font-bold text-lg ${progress === 100 ? 'text-emerald-600' : 'text-teal-600'}`}>{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                progress === 100 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500'
              } ${isLoading ? 'animate-pulse' : ''}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);
