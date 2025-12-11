import { Flame, Apple, Moon } from 'lucide-react';

export default function InfoBoxes() {
  const infoData = [
    {
      icon: Flame,
      title: 'Daily Warm-up',
      description: '5 min brisk walk + Arm circles + Torso twists. Do not skip this!',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
      borderColor: 'border-orange-200',
    },
    {
      icon: Apple,
      title: 'Nutrition & Hydration',
      description: 'Goal: 160-180g Protein daily. Drink 3-4 Liters of water.',
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50',
      borderColor: 'border-emerald-200',
    },
    {
      icon: Moon,
      title: 'Recovery & Sleep',
      description: 'Sleep 7-8 hours every night. Your body repairs and grows during sleep.',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-12 animate-fadeInUp" style={{ animationDelay: '300ms' }}>
      {infoData.map((info, index) => {
        const Icon = info.icon;
        return (
          <div
            key={info.title}
            className={`${info.bgColor} ${info.borderColor} border-2 rounded-2xl p-5 md:p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:border-opacity-100 animate-slideIn`}
            style={{ animationDelay: `${400 + index * 100}ms` }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${info.color} flex-shrink-0`}>
                <Icon className="w-5 md:w-6 h-5 md:h-6 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="font-bold text-gray-800 text-sm md:text-base">{info.title}</h3>
            </div>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">{info.description}</p>
          </div>
        );
      })}
    </div>
  );
}
