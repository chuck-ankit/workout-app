import { useState, useEffect } from 'react';
import { workoutData } from './data/workoutData';
import Header from './components/Header';
import DayTabs from './components/DayTabs';
import WorkoutCard from './components/WorkoutCard';
import InfoBoxes from './components/InfoBoxes';
import { supabase, hasSupabaseConfig } from './lib/supabaseClient';
import { getWeekStartDateString, getCurrentDayIndex } from './lib/workoutUtils';

// Single user ID for the app
const SINGLE_USER_ID = '00000000-0000-0000-0000-000000000000';

function App() {
  const [activeDay, setActiveDay] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const totalExercises = workoutData.reduce((total, day) => {
    if (day.isRest) return total;
    return total + day.exercises.length;
  }, 0);
  const nextRestDay = workoutData.find((day) => day.isRest)?.day || 'Rest Day';
  const todaysFocus = workoutData[activeDay]?.focus;

  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);

      if (hasSupabaseConfig && supabase) {
        await loadWorkoutProgress();
      } else {
        // No Supabase credentials, so fall back to local storage
        loadLocalProgress();
      }

      setActiveDay(getCurrentDayIndex());
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  const loadLocalProgress = () => {
    const saved = localStorage.getItem('workoutProgress');
    const lastWeekReset = localStorage.getItem('lastWeekReset');
    const currentWeekStart = getWeekStartDateString();

    // Check if we need to reset (new week started)
    if (lastWeekReset && lastWeekReset !== currentWeekStart) {
      // New week - reset progress
      localStorage.removeItem('workoutProgress');
      setCompletedExercises(new Set());
      setCompletedDays([]);
      localStorage.setItem('lastWeekReset', currentWeekStart);
    } else {
      // Same week - load saved progress
      if (saved) {
        try {
          const exerciseIds = new Set<string>(JSON.parse(saved) as string[]);
          setCompletedExercises(exerciseIds);
          updateCompletedDays(exerciseIds);
        } catch (e) {
          console.error('Error parsing localStorage data:', e);
          setCompletedExercises(new Set());
          setCompletedDays([]);
        }
      } else {
        setCompletedExercises(new Set());
        setCompletedDays([]);
      }
      // Update lastWeekReset if not set
      if (!lastWeekReset) {
        localStorage.setItem('lastWeekReset', currentWeekStart);
      }
    }
  };

  const loadWorkoutProgress = async () => {
    if (!hasSupabaseConfig || !supabase) {
      loadLocalProgress();
      return;
    }

    const weekStart = getWeekStartDateString();
    console.log('Loading progress for week:', weekStart);

    // Check if we need to reset (new week started) by comparing with stored week
    const lastWeekReset = localStorage.getItem('lastWeekReset');
    if (lastWeekReset && lastWeekReset !== weekStart) {
      // New week detected - reset progress
      console.log('New week detected, resetting progress');
      setCompletedExercises(new Set());
      setCompletedDays([]);
      localStorage.setItem('lastWeekReset', weekStart);
      localStorage.removeItem('workoutProgress');
      // Don't query database for old week data - we've already reset
      return;
    }

    // Load all exercise statuses for the current week (both completed and not completed)
    const { data, error } = await supabase
      .from('workout_progress')
      .select('exercise_id, day_of_week, completed')
      .eq('user_id', SINGLE_USER_ID)
      .eq('week_start_date', weekStart);

    if (error) {
      console.error('Error loading progress from database:', error);
      // Fallback to localStorage if database query fails
      console.log('Falling back to localStorage');
      loadLocalProgress();
      return;
    }

    console.log('Loaded progress data from database:', data);

    if (data && data.length > 0) {
      // Filter only completed exercises
      const completedData = data.filter((d) => d.completed === true);
      const exerciseIds = new Set(completedData.map((d) => d.exercise_id));
      console.log('Setting completed exercises from database:', Array.from(exerciseIds));
      setCompletedExercises(exerciseIds);
      updateCompletedDays(exerciseIds);
      // Sync to localStorage as backup
      localStorage.setItem('workoutProgress', JSON.stringify([...exerciseIds]));
      localStorage.setItem('lastWeekReset', weekStart);
    } else {
      // No data in database for this week, check localStorage as fallback
      console.log('No progress data found in database for this week, checking localStorage');
      const saved = localStorage.getItem('workoutProgress');
      if (saved) {
        try {
          const exerciseIds = new Set<string>(JSON.parse(saved) as string[]);
          console.log('Found progress in localStorage:', Array.from(exerciseIds));
          setCompletedExercises(exerciseIds);
          updateCompletedDays(exerciseIds);
        } catch (e) {
          console.error('Error parsing localStorage data:', e);
          setCompletedExercises(new Set());
          setCompletedDays([]);
        }
      } else {
        console.log('No progress data found anywhere - starting fresh');
        setCompletedExercises(new Set());
        setCompletedDays([]);
      }
      // Update lastWeekReset
      localStorage.setItem('lastWeekReset', weekStart);
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
    updateCompletedDays(newCompleted);

    // Always save to localStorage as backup
    localStorage.setItem('workoutProgress', JSON.stringify([...newCompleted]));

    // Save to database if Supabase is configured
    if (hasSupabaseConfig && supabase) {
      const dayNumberMatches = exerciseId.match(/\d+/g);
      const dayIndex = dayNumberMatches ? Number(dayNumberMatches[0]) : undefined;

      const weekStart = getWeekStartDateString();
      const progressData = {
        user_id: SINGLE_USER_ID,
        exercise_id: exerciseId,
        day_of_week: dayIndex,
        week_start_date: weekStart,
        completed: isCompleting,
        updated_at: new Date().toISOString(),
      };

      console.log('Saving exercise status to database:', progressData);

      // First, try to find existing record
      const { data: existingData, error: selectError } = await supabase
        .from('workout_progress')
        .select('id')
        .eq('user_id', SINGLE_USER_ID)
        .eq('exercise_id', exerciseId)
        .eq('week_start_date', weekStart)
        .maybeSingle();

      let error;
      if (selectError) {
        console.error('Error checking existing record:', selectError);
        error = selectError;
      } else if (existingData) {
        // Update existing record
        console.log('Updating existing record:', existingData.id);
        const { error: updateError } = await supabase
          .from('workout_progress')
          .update({
            completed: isCompleting,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingData.id);
        error = updateError;
      } else {
        // Insert new record
        console.log('Inserting new exercise status record');
        const { error: insertError } = await supabase
          .from('workout_progress')
          .insert(progressData);
        error = insertError;
      }

      if (error) {
        console.error('Error saving progress to database:', error);
        // Don't revert UI state - localStorage already saved
        // User can continue working, and we'll retry on next toggle
      } else {
        console.log('Exercise status saved successfully to database');
      }
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

  const weekProgress = calculateProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 bg-grid-pattern overflow-x-hidden relative">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-10 top-10 w-80 h-80 bg-teal-200/30 blur-3xl rounded-full" />
        <div className="absolute right-0 bottom-10 w-72 h-72 bg-cyan-200/30 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-8">
        <Header progress={weekProgress} isLoading={isLoading} />

        <div className="glass-panel rounded-3xl p-4 md:p-6 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="pill bg-teal-100 text-teal-800">Week Planner</span>
              <span className="text-sm md:text-base font-semibold text-gray-800">
                {todaysFocus || 'Choose a day to see the focus'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span className="pill bg-white text-gray-700 border border-gray-200">Next Rest: {nextRestDay}</span>
              <span className="pill bg-cyan-100 text-cyan-800 border border-cyan-200">
                {completedExercises.size}/{totalExercises} exercises completed
              </span>
            </div>
          </div>

          <DayTabs
            days={workoutData.map((d) => d.day)}
            activeDay={activeDay}
            onDayChange={setActiveDay}
            completedDays={completedDays}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel rounded-2xl p-4">
              <p className="text-xs font-semibold text-teal-700 uppercase tracking-[0.15em] mb-2">Weekly completion</p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-slate-900">{weekProgress}%</span>
                <span className="text-xs text-gray-500">Stay consistent</span>
              </div>
              <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 transition-all duration-700"
                  style={{ width: `${weekProgress}%` }}
                />
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-4">
              <p className="text-xs font-semibold text-cyan-700 uppercase tracking-[0.15em] mb-2">Today’s focus</p>
              <div className="space-y-1">
                <p className="text-lg font-semibold text-gray-900">{workoutData[activeDay]?.day}</p>
                <p className="text-sm text-gray-600">{todaysFocus}</p>
              </div>
              <div className="mt-3 inline-flex items-center gap-2 text-xs text-gray-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Dial in form and tempo
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-4">
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-[0.15em] mb-2">Recovery</p>
              <div className="space-y-1">
                <p className="text-lg font-semibold text-gray-900">{nextRestDay}</p>
                <p className="text-sm text-gray-600">Plan hydration and mobility work.</p>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                <span className="pill bg-emerald-50 text-emerald-700 border border-emerald-200">Sleep 7-8h</span>
                <span className="pill bg-blue-50 text-blue-700 border border-blue-200">3-4L water</span>
              </div>
            </div>
          </div>
        </div>

        <WorkoutCard
          workout={workoutData[activeDay]}
          completedExercises={completedExercises}
          onToggleExercise={toggleExercise}
          dayIndex={activeDay}
        />

        <InfoBoxes />

        <footer className="text-center text-gray-600 text-xs md:text-sm py-8">
          <p className="font-semibold">Stay consistent. Stay strong. Transform your life.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
