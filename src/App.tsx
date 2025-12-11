import { useState, useEffect } from 'react';
import { workoutData } from './data/workoutData';
import Header from './components/Header';
import DayTabs from './components/DayTabs';
import WorkoutCard from './components/WorkoutCard';
import InfoBoxes from './components/InfoBoxes';
import { supabase, hasSupabaseConfig } from './lib/supabaseClient';
import { getWeekStartDateString, isWeekReset, getCurrentDayIndex } from './lib/workoutUtils';

function App() {
  const [activeDay, setActiveDay] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);

      if (hasSupabaseConfig && supabase) {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          await loadWorkoutProgress(session.user.id);
        } else {
          loadLocalProgress();
        }
      } else {
        // No Supabase credentials, so fall back to local storage immediately.
        loadLocalProgress();
      }

      setActiveDay(getCurrentDayIndex());
      setIsLoading(false);
    };

    initializeApp();

    if (hasSupabaseConfig && supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          await loadWorkoutProgress(session.user.id);
        } else {
          setUser(null);
          loadLocalProgress();
        }
      });

      return () => {
        subscription?.unsubscribe();
      };
    }

    return;
  }, []);

  const loadLocalProgress = () => {
    const saved = localStorage.getItem('workoutProgress');
    const reset = localStorage.getItem('lastWeekReset');

    if (isWeekReset(reset)) {
      localStorage.removeItem('workoutProgress');
      localStorage.removeItem('lastWeekReset');
      setCompletedExercises(new Set());
      setCompletedDays([]);
      localStorage.setItem('lastWeekReset', getWeekStartDateString());
    } else {
      if (saved) {
        setCompletedExercises(new Set(JSON.parse(saved)));
      }
    }
  };

  const loadWorkoutProgress = async (userId: string) => {
    if (!hasSupabaseConfig || !supabase) {
      loadLocalProgress();
      return;
    }

    const weekStart = getWeekStartDateString();

    const { data, error } = await supabase
      .from('workout_progress')
      .select('exercise_id, day_of_week')
      .eq('user_id', userId)
      .eq('week_start_date', weekStart)
      .eq('completed', true);

    if (error) {
      console.error('Error loading progress:', error);
      loadLocalProgress();
      return;
    }

    if (data && data.length > 0) {
      const exerciseIds = new Set(data.map((d) => d.exercise_id));
      setCompletedExercises(exerciseIds);

      const daysWithCompleted = Array.from(new Set(data.map((d) => d.day_of_week)));
      const completedDaysWithAllExercises = daysWithCompleted.filter((dayIndex) => {
        const dayExercises = workoutData[dayIndex].exercises.length;
        const completedInDay = data.filter((d) => d.day_of_week === dayIndex).length;
        return dayExercises > 0 && completedInDay === dayExercises;
      });
      setCompletedDays(completedDaysWithAllExercises);
    }
  };

  const toggleExercise = async (exerciseId: string) => {
    const newCompleted = new Set(completedExercises);
    const isCompleting = !newCompleted.has(exerciseId);

    if (isCompleting) {
      newCompleted.add(exerciseId);
    } else {
      newCompleted.delete(exerciseId);
    }

    setCompletedExercises(newCompleted);

    if (user) {
      const [dayIndex] = exerciseId.match(/\d+/g)!.map(Number);

      const { error } = await supabase.from('workout_progress').upsert(
        {
          user_id: user.id,
          exercise_id: exerciseId,
          day_of_week: dayIndex,
          week_start_date: getWeekStartDateString(),
          completed: isCompleting,
        },
        { onConflict: 'user_id,exercise_id,week_start_date' }
      );

      if (error) {
        console.error('Error saving progress:', error);
        const revertCompleted = new Set(completedExercises);
        setCompletedExercises(revertCompleted);
      } else {
        updateCompletedDays(newCompleted);
      }
    } else {
      localStorage.setItem('workoutProgress', JSON.stringify([...newCompleted]));
      updateCompletedDays(newCompleted);
    }
  };

  const updateCompletedDays = (completed: Set<string>) => {
    const dayCompletion: Record<number, number> = {};

    workoutData.forEach((day, dayIndex) => {
      dayCompletion[dayIndex] = 0;
      if (!day.isRest) {
        day.exercises.forEach((_, exIndex) => {
          if (completed.has(`d${dayIndex}-e${exIndex}`)) {
            dayCompletion[dayIndex]++;
          }
        });
      }
    });

    const newCompletedDays = Object.keys(dayCompletion)
      .map(Number)
      .filter((dayIndex) => {
        const dayExercises = workoutData[dayIndex].exercises.length;
        return dayExercises > 0 && dayCompletion[dayIndex] === dayExercises;
      });

    setCompletedDays(newCompletedDays);
  };

  const calculateProgress = () => {
    let totalExercises = 0;
    workoutData.forEach((day) => {
      if (!day.isRest) {
        totalExercises += day.exercises.length;
      }
    });
    return totalExercises === 0 ? 0 : Math.round((completedExercises.size / totalExercises) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-100 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 py-6 md:py-8">
        <Header progress={calculateProgress()} isLoading={isLoading} />

        <DayTabs
          days={workoutData.map((d) => d.day)}
          activeDay={activeDay}
          onDayChange={setActiveDay}
          completedDays={completedDays}
        />

        <WorkoutCard
          workout={workoutData[activeDay]}
          completedExercises={completedExercises}
          onToggleExercise={toggleExercise}
          dayIndex={activeDay}
        />

        <InfoBoxes />

        <footer className="mt-12 text-center text-gray-600 text-xs md:text-sm py-8">
          <p className="font-semibold">Stay consistent. Stay strong. Transform your life.</p>
          {user && <p className="text-gray-500 mt-2">Synced with your account</p>}
        </footer>
      </div>
    </div>
  );
}

export default App;
