export function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function parseJSON<T>(jsonString: string | null | undefined, defaultValue: T): T {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString);
  } catch {
    return defaultValue;
  }
}

export function calculateScore(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function getReadinessLevel(averageScore: number, lessonsCompleted: number): string {
  if (lessonsCompleted < 5) return 'Beginner';
  if (lessonsCompleted < 15) return averageScore >= 85 ? 'Junior' : 'Beginner';
  if (lessonsCompleted < 30) {
    if (averageScore >= 90) return 'Mid';
    if (averageScore >= 75) return 'Junior';
    return 'Beginner';
  }
  if (lessonsCompleted < 45) {
    if (averageScore >= 95) return 'Senior';
    if (averageScore >= 85) return 'Mid';
    if (averageScore >= 70) return 'Junior';
    return 'Beginner';
  }
  // 45+ lessons
  if (averageScore >= 95) return 'Expert';
  if (averageScore >= 90) return 'Senior';
  if (averageScore >= 80) return 'Mid';
  return 'Junior';
}

export function shouldRemediate(quizScore: number): boolean {
  return quizScore < 60;
}

export function shouldAdvance(quizScore: number): boolean {
  return quizScore > 85;
}

export function formatDate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function calculateStreak(progressRecords: Array<{ date: string }>): number {
  if (progressRecords.length === 0) return 0;

  // Sort by date descending
  const sorted = progressRecords
    .map(p => new Date(p.date))
    .sort((a, b) => b.getTime() - a.getTime());

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let streak = 0;
  let currentDate = new Date(sorted[0]);
  currentDate.setHours(0, 0, 0, 0);

  // Check if most recent is today or yesterday
  if (currentDate.getTime() !== today.getTime() && currentDate.getTime() !== yesterday.getTime()) {
    return 0;
  }

  for (let i = 0; i < sorted.length; i++) {
    const recordDate = new Date(sorted[i]);
    recordDate.setHours(0, 0, 0, 0);

    if (i === 0) {
      streak = 1;
      currentDate = recordDate;
      continue;
    }

    const expectedDate = new Date(currentDate);
    expectedDate.setDate(expectedDate.getDate() - 1);

    if (recordDate.getTime() === expectedDate.getTime()) {
      streak++;
      currentDate = recordDate;
    } else if (recordDate.getTime() < expectedDate.getTime()) {
      break;
    }
  }

  return streak;
}
