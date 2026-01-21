import { useState, useEffect, useMemo, useCallback, lazy, Suspense, useRef } from 'react';
import { workoutData } from './data/workoutData';
import Header from './components/Header';
import DayTabs from './components/DayTabs';
import { supabase, hasSupabaseConfig } from './lib/supabaseClient';
import { getWeekStartDateString, getCurrentDayIndex } from './lib/workoutUtils';

// Filter out browser extension errors
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args[0];
  if (typeof message === 'string' && 
      (message.includes('Could not establish connection') || 
       message.includes('Receiving end does not exist'))) {
    return; // Suppress browser extension errors
  }
  originalConsoleError.apply(console, args);
};

// Lazy load components that are not immediately needed
const InfoBoxes = lazy(() => import('./components/InfoBoxes'));
const WorkoutCard = lazy(() => import('./components/WorkoutCard'));

// Single user ID for the app
const SINGLE_USER_ID = '00000000-0000-0000-0000-000000000000';

function App() {
  const [activeDay, setActiveDay] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use refs to avoid stale closures and prevent unnecessary re-renders
  const completedExercisesRef = useRef(completedExercises);
  completedExercisesRef.current = completedExercises;
  
  // Memoize expensive calculations
  const totalExercises = useMemo(() => {
    return workoutData.reduce((total, day) => {
      if (day.isRest) return total;
      return total + day.exercises.length;
    }, 0);
  }, []);

  const nextRestDay = useMemo(() => {
    return workoutData.find((day) => day.isRest)?.day || 'Rest Day';
  }, []);

  const todaysFocus = useMemo(() => {
    return workoutData[activeDay]?.focus;
  }, [activeDay]);

  const updateCompletedDays = useCallback((completed: Set<string>) => {
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
  }, []);

  const loadLocalProgress = useCallback(() => {
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
  }, [updateCompletedDays]);

  const loadWorkoutProgress = useCallback(async () => {
    if (!hasSupabaseConfig || !supabase) {
      loadLocalProgress();
      return;
    }

    // Check if we've previously determined the table doesn't exist
    const tableExists = localStorage.getItem('supabase_table_exists');
    if (tableExists === 'false') {
      // Table doesn't exist, skip Supabase queries to avoid 404 errors
      loadLocalProgress();
      return;
    }

    const weekStart = getWeekStartDateString();

    // Check if we need to reset (new week started) by comparing with stored week
    const lastWeekReset = localStorage.getItem('lastWeekReset');
    if (lastWeekReset && lastWeekReset !== weekStart) {
      // New week detected - reset progress
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
      // Filter out browser extension errors and network errors that are expected
      const errorMessage = error.message || '';
      if (errorMessage.includes('Could not establish connection') || 
          errorMessage.includes('Receiving end does not exist') ||
          errorMessage.includes('Failed to fetch') ||
          error.code === 'PGRST205') {
        // Table doesn't exist or network error - cache this to avoid future errors
        if (error.code === 'PGRST205') {
          localStorage.setItem('supabase_table_exists', 'false');
        }
        // Fallback to localStorage silently for these expected errors
        loadLocalProgress();
        return;
      }
      // Other unexpected errors - log them
      console.error('Error loading progress from database:', error);
      // Fallback to localStorage if database query fails
      loadLocalProgress();
      return;
    }

    // Table exists and query succeeded - cache this
    localStorage.setItem('supabase_table_exists', 'true');

    if (data && data.length > 0) {
      // Filter only completed exercises
      const completedData = data.filter((d) => d.completed === true);
      const exerciseIds = new Set(completedData.map((d) => d.exercise_id));
      setCompletedExercises(exerciseIds);
      updateCompletedDays(exerciseIds);
      // Sync to localStorage as backup
      localStorage.setItem('workoutProgress', JSON.stringify([...exerciseIds]));
      localStorage.setItem('lastWeekReset', weekStart);
    } else {
      // No data in database for this week, check localStorage as fallback
      const saved = localStorage.getItem('workoutProgress');
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
      // Update lastWeekReset
      localStorage.setItem('lastWeekReset', weekStart);
    }
  }, [loadLocalProgress, updateCompletedDays]);

  // Debounced localStorage sync to reduce writes
  const debouncedLocalStorageSync = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (exercises: Set<string>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          localStorage.setItem('workoutProgress', JSON.stringify([...exercises]));
        }, 300); // 300ms debounce
      };
    })(),
    []
  );

  const toggleExercise = useCallback(async (exerciseId: string) => {
    setCompletedExercises((prev) => {
      const newCompleted = new Set(prev);
      const isCompleting = !newCompleted.has(exerciseId);

      if (isCompleting) {
        newCompleted.add(exerciseId);
      } else {
        newCompleted.delete(exerciseId);
      }

      // Debounced localStorage sync
      debouncedLocalStorageSync(newCompleted);

      // Update completed days
      updateCompletedDays(newCompleted);

      // Save to database if Supabase is configured (async, non-blocking)
      if (hasSupabaseConfig && supabase) {
        // Check if table exists - skip if we know it doesn't
        const tableExists = localStorage.getItem('supabase_table_exists');
        if (tableExists !== 'false') {
          // Use requestIdleCallback for non-critical database operations
          const saveToDatabase = () => {
            // Only proceed with database operations if table might exist
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

            // Fire and forget - don't block UI
            (async () => {
              try {
                // First, try to find existing record
                const { data: existingData, error: selectError } = await supabase
                  .from('workout_progress')
                  .select('id')
                  .eq('user_id', SINGLE_USER_ID)
                  .eq('exercise_id', exerciseId)
                  .eq('week_start_date', weekStart)
                  .maybeSingle();

                if (selectError) {
                  // Filter out browser extension errors and network errors that are expected
                  const errorMessage = selectError.message || '';
                  if (errorMessage.includes('Could not establish connection') || 
                      errorMessage.includes('Receiving end does not exist') ||
                      errorMessage.includes('Failed to fetch') ||
                      selectError.code === 'PGRST205') {
                    // Table doesn't exist or network error - cache this to avoid future errors
                    if (selectError.code === 'PGRST205') {
                      localStorage.setItem('supabase_table_exists', 'false');
                    }
                  } else {
                    console.error('Error checking existing record:', selectError);
                  }
                  return;
                }

                if (existingData) {
                  // Update existing record
                  const { error: updateError } = await supabase
                    .from('workout_progress')
                    .update({
                      completed: isCompleting,
                      updated_at: new Date().toISOString(),
                    })
                    .eq('id', existingData.id);
                  
                  if (updateError) {
                    // Filter out browser extension errors and network errors that are expected
                    const errorMessage = updateError.message || '';
                    if (errorMessage.includes('Could not establish connection') || 
                        errorMessage.includes('Receiving end does not exist') ||
                        errorMessage.includes('Failed to fetch') ||
                        updateError.code === 'PGRST205') {
                      // Table doesn't exist or network error - cache this to avoid future errors
                      if (updateError.code === 'PGRST205') {
                        localStorage.setItem('supabase_table_exists', 'false');
                      }
                    } else {
                      console.error('Error updating progress to database:', updateError);
                    }
                  } else {
                    // Success - ensure table exists flag is set
                    localStorage.setItem('supabase_table_exists', 'true');
                  }
                } else {
                  // Insert new record
                  const { error: insertError } = await supabase
                    .from('workout_progress')
                    .insert(progressData);
                  
                  if (insertError) {
                    // Filter out browser extension errors and network errors that are expected
                    const errorMessage = insertError.message || '';
                    if (errorMessage.includes('Could not establish connection') || 
                        errorMessage.includes('Receiving end does not exist') ||
                        errorMessage.includes('Failed to fetch') ||
                        insertError.code === 'PGRST205') {
                      // Table doesn't exist or network error - cache this to avoid future errors
                      if (insertError.code === 'PGRST205') {
                        localStorage.setItem('supabase_table_exists', 'false');
                      }
                    } else {
                      console.error('Error inserting progress to database:', insertError);
                    }
                  } else {
                    // Success - ensure table exists flag is set
                    localStorage.setItem('supabase_table_exists', 'true');
                  }
                }
              } catch (error) {
                console.error('Error saving progress to database:', error);
              }
            })();
          };

          // Use requestIdleCallback if available, otherwise setTimeout with 0 delay
          if (window.requestIdleCallback) {
            window.requestIdleCallback(saveToDatabase);
          } else {
            setTimeout(saveToDatabase, 0);
          }
        }
      }

      return newCompleted;
    });
  }, [updateCompletedDays]);

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
  }, [loadWorkoutProgress, loadLocalProgress]);

  const weekProgress = useMemo(() => {
    return totalExercises === 0 ? 0 : Math.round((completedExercises.size / totalExercises) * 100);
  }, [completedExercises.size, totalExercises]);

  const dayNames = useMemo(() => workoutData.map((d) => d.day), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 bg-grid-pattern overflow-x-hidden relative optimize-render">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-10 top-10 w-80 h-80 bg-teal-200/30 blur-3xl rounded-full" />
        <div className="absolute right-0 bottom-10 w-72 h-72 bg-cyan-200/30 blur-3xl rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-8 optimize-render">
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
            days={dayNames}
            activeDay={activeDay}
            onDayChange={setActiveDay}
            completedDays={completedDays}
          />

                  </div>

        <Suspense fallback={
          <div className="glass-panel bg-white/90 rounded-3xl shadow-2xl overflow-hidden border border-white/70 p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        }>
          <WorkoutCard
            workout={workoutData[activeDay]}
            completedExercises={completedExercises}
            onToggleExercise={toggleExercise}
            dayIndex={activeDay}
          />
        </Suspense>

        <Suspense fallback={<div className="h-48" />}>
          <InfoBoxes />
        </Suspense>

        <footer className="text-center text-gray-600 text-xs md:text-sm py-8">
          <p className="font-semibold">Stay consistent. Stay strong. Transform your life.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
