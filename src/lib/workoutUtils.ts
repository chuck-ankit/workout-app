export const getWeekStartDate = (date: Date = new Date()): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

export const getWeekStartDateString = (date: Date = new Date()): string => {
  const weekStart = getWeekStartDate(date);
  return weekStart.toISOString().split('T')[0];
};

export const isWeekReset = (lastResetDate: string | null): boolean => {
  if (!lastResetDate) return true;

  const lastReset = new Date(lastResetDate);
  const today = new Date();
  const currentWeekStart = getWeekStartDate(today);

  return lastReset < currentWeekStart;
};

export const getCurrentDayIndex = (): number => {
  const today = new Date().getDay();
  return today === 0 ? 6 : today - 1;
};
