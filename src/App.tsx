/**
 * Hope of the Kingdom - Gamified Biblical Quiz Application
 * Built with React, Tailwind CSS, Motion, and Web Audio API
 */

import React, { useState, useEffect, useRef } from 'react';
import { QUESTIONS_POOL } from './data/questions';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { EmojiGame } from './components/EmojiGame';
import { TypingQuestion } from './components/TypingQuestion';
import { FeedbackBanner } from './components/FeedbackBanner';
import { WinnerScreen } from './components/WinnerScreen';
import { Leaderboard } from './components/Leaderboard';
import { HomeView } from './components/HomeView';
import { MobileFrame } from './components/MobileFrame';
import { AdminModal } from './components/AdminModal';
import { sounds } from './utils/audio';
import { getUserStats, saveUserStats, getRemainingWinnerSlots } from './utils/storage';
import { Heart, RotateCcw, AlertTriangle, Play, Trophy } from 'lucide-react';

export default function App() {
  // Navigation & Screen View State
  const [view, setView] = useState<'home' | 'quiz' | 'leaderboard' | 'win' | 'gameover'>('home');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // User Stats & Gamification
  const [stats, setStats] = useState(getUserStats());
  const [hearts, setHearts] = useState<number>(3);
  const [score, setScore] = useState<number>(0);

  // Quiz Gameplay State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [feedbackState, setFeedbackState] = useState<{
    show: boolean;
    isCorrect: boolean;
    isTimeout?: boolean;
  }>({ show: false, isCorrect: false });

  // Timer state
  const currentQuestion = QUESTIONS_POOL[currentQuestionIdx];
  const [timeLeft, setTimeLeft] = useState<number>(currentQuestion?.timeLimitSeconds || 120);
  const [quizStartTime, setQuizStartTime] = useState<number>(Date.now());
  const [totalTimeTaken, setTotalTimeTaken] = useState<number>(0);

  // Sync sound class
  useEffect(() => {
    sounds.enabled = soundEnabled;
  }, [soundEnabled]);

  // Main Timer Countdown Loop
  useEffect(() => {
    if (view !== 'quiz' || feedbackState.show) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeExpired();
          return 0;
        }
        if (prev <= 10) {
          sounds.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [view, currentQuestionIdx, feedbackState.show]);

  // Handle Timer Expiration
  const handleTimeExpired = () => {
    sounds.playWrong();
    const newHearts = Math.max(0, hearts - 1);
    setHearts(newHearts);

    setFeedbackState({
      show: true,
      isCorrect: false,
      isTimeout: true,
    });
  };

  // Start Quiz
  const startQuiz = () => {
    setCurrentQuestionIdx(0);
    setHearts(3);
    setScore(0);
    setSelectedOption(undefined);
    setTypedAnswer('');
    setFeedbackState({ show: false, isCorrect: false });
    setTimeLeft(QUESTIONS_POOL[0].timeLimitSeconds);
    setQuizStartTime(Date.now());
    setView('quiz');
  };

  // Check Answer Handler
  const handleCheckAnswer = () => {
    if (feedbackState.show) return;

    let isCorrect = false;

    if (currentQuestion.type === 'emoji') {
      if (!selectedOption) return;
      isCorrect = selectedOption.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
    } else {
      if (!typedAnswer.trim()) return;
      const cleanUser = typedAnswer.trim().toLowerCase().replace(/[^\w\s]/gi, '');
      const cleanTarget = currentQuestion.correctAnswer.trim().toLowerCase().replace(/[^\w\s]/gi, '');

      const isExact = cleanUser === cleanTarget;
      const isAcceptable = currentQuestion.acceptableAnswers?.some(
        (alt) => alt.trim().toLowerCase().replace(/[^\w\s]/gi, '') === cleanUser
      );

      isCorrect = isExact || !!isAcceptable;
    }

    if (isCorrect) {
      sounds.playCorrect();
      setScore((prev) => prev + 1);
      // Award XP
      const updatedStats = { ...stats, totalXp: stats.totalXp + 20 };
      setStats(updatedStats);
      saveUserStats(updatedStats);
    } else {
      sounds.playWrong();
      setHearts((prev) => Math.max(0, prev - 1));
    }

    setFeedbackState({
      show: true,
      isCorrect,
      isTimeout: false,
    });
  };

  // Move to Next Question or Complete
  const handleNextQuestion = () => {
    setFeedbackState({ show: false, isCorrect: false });

    // Check if hearts ran out
    if (hearts <= 0) {
      setView('gameover');
      return;
    }

    const nextIdx = currentQuestionIdx + 1;
    if (nextIdx < QUESTIONS_POOL.length) {
      setCurrentQuestionIdx(nextIdx);
      setSelectedOption(undefined);
      setTypedAnswer('');
      setTimeLeft(QUESTIONS_POOL[nextIdx].timeLimitSeconds);
    } else {
      // Completed all 10 questions!
      const totalSeconds = Math.round((Date.now() - quizStartTime) / 1000);
      setTotalTimeTaken(totalSeconds);
      setView('win');
    }
  };

  return (
    <MobileFrame>
      {/* Top Header */}
      <Header
        hearts={hearts}
        streak={stats.streakDays}
        xp={stats.totalXp}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        remainingPrizes={getRemainingWinnerSlots()}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenLeaderboard={() => setView('leaderboard')}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 p-3 sm:p-4 max-w-lg mx-auto w-full overflow-hidden flex flex-col justify-between">
        {view === 'home' && (
          <HomeView
            onStartQuiz={startQuiz}
            onOpenLeaderboard={() => setView('leaderboard')}
            xp={stats.totalXp}
            streak={stats.streakDays}
          />
        )}

        {view === 'quiz' && (
          <div className="flex-1 flex flex-col justify-between animate-fadeIn py-1">
            {/* Gamified Progress Bar & Timers */}
            <ProgressBar
              currentStep={currentQuestionIdx + 1}
              totalSteps={QUESTIONS_POOL.length}
              questionType={currentQuestion.type}
              timeLeft={timeLeft}
              totalTimeSeconds={currentQuestion.timeLimitSeconds}
            />

            {/* Question Screen View */}
            <div className="flex-1 flex flex-col justify-center">
              {currentQuestion.type === 'emoji' ? (
                <EmojiGame
                  question={currentQuestion}
                  selectedOption={selectedOption}
                  onSelectOption={(opt) => setSelectedOption(opt)}
                  disabled={feedbackState.show}
                />
              ) : (
                <TypingQuestion
                  question={currentQuestion}
                  typedAnswer={typedAnswer}
                  onTypeAnswer={(val) => setTypedAnswer(val)}
                  onSubmit={handleCheckAnswer}
                  disabled={feedbackState.show}
                />
              )}
            </div>

            {/* Check Answer Button (When Feedback is Not Active) */}
            {!feedbackState.show && (
              <div className="pt-2 shrink-0">
                <button
                  type="button"
                  disabled={
                    currentQuestion.type === 'emoji'
                      ? !selectedOption
                      : !typedAnswer.trim()
                  }
                  onClick={handleCheckAnswer}
                  className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-sm active:translate-y-0.5 disabled:cursor-not-allowed"
                >
                  CHECK ANSWER
                </button>
              </div>
            )}

            {/* Bottom Feedback Banner */}
            {feedbackState.show && (
              <FeedbackBanner
                isCorrect={feedbackState.isCorrect}
                correctAnswer={currentQuestion.correctAnswer}
                scriptureRef={currentQuestion.scriptureRef}
                explanation={currentQuestion.explanation}
                onNext={handleNextQuestion}
                isTimeout={feedbackState.isTimeout}
              />
            )}
          </div>
        )}

        {view === 'win' && (
          <WinnerScreen
            score={score}
            totalQuestions={QUESTIONS_POOL.length}
            timeTakenSeconds={totalTimeTaken || 320}
            heartsRemaining={hearts}
            onRestart={startQuiz}
            onOpenLeaderboard={() => setView('leaderboard')}
          />
        )}

        {view === 'leaderboard' && (
          <Leaderboard onBack={() => setView('home')} />
        )}

        {view === 'gameover' && (
          <div className="max-w-md mx-auto py-10 px-4 text-center space-y-5 animate-fadeIn">
            <div className="w-20 h-20 bg-rose-100 dark:bg-rose-950 text-rose-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner border-2 border-rose-300">
              <Heart className="w-10 h-10 stroke-[2.5]" />
            </div>

            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 uppercase">
              Out of Hearts!
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto leading-relaxed font-medium">
              You ran out of hearts on question {currentQuestionIdx + 1}. Don't worry! Faith grows through perseverance.
            </p>

            <div className="pt-4 space-y-2">
              <button
                onClick={startQuiz}
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-base uppercase tracking-wider shadow-[0_4px_0_0_#b45309] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>TRY AGAIN (REFILL HEARTS)</span>
              </button>

              <button
                onClick={() => setView('home')}
                className="w-full py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs uppercase"
              >
                RETURN HOME
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Admin / Dev Testing Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onJumpToWin={() => {
          setScore(10);
          setTotalTimeTaken(280);
          setView('win');
        }}
        onResetUserHearts={() => setHearts(3)}
      />
    </MobileFrame>
  );
}
