export type QuestionType = 'emoji' | 'typing';

export interface Question {
  id: number;
  type: QuestionType;
  title: string;
  questionText: string;
  scriptureRef: string;
  explanation: string;
  timeLimitSeconds: number; // 120s for emoji, 60s for typing
  
  // Emoji game fields
  emojis?: string[];
  options?: string[]; // Multiple choice options for emoji decoding
  correctAnswer: string; // Correct answer text
  acceptableAnswers?: string[]; // Alternative spellings/synonyms for typing
  hint?: string;
  category?: string; // 'Miracles', 'Old Testament', 'Parables', 'Prophets', etc.
}

export interface WinnerClaim {
  id: string;
  name: string;
  claimedAt: string;
  cardCode: string; // 13 digit card code e.g. "8492-3019-4821-7"
  score: number;
  timeTakenSeconds: number;
  isCurrentUser?: boolean;
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  hearts: number;
  streak: number;
  xp: number;
  answers: {
    questionId: number;
    userAnswer: string;
    isCorrect: boolean;
    timeSpentSeconds: number;
  }[];
  status: 'idle' | 'playing' | 'feedback' | 'completed' | 'gameover';
  selectedOption?: string;
  typedAnswer: string;
  isCorrect?: boolean;
  timeLeft: number;
  timerActive: boolean;
  startTime: number;
}

export interface UserStats {
  totalXp: number;
  streakDays: number;
  gamesCompleted: number;
  claimedCardCode?: string;
  badges: string[];
}
