import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, Lightbulb, Sparkles, Send, XCircle } from 'lucide-react';
import { Question } from '../types';
import { sounds } from '../utils/audio';

interface TypingQuestionProps {
  question: Question;
  typedAnswer: string;
  onTypeAnswer: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

export const TypingQuestion: React.FC<TypingQuestionProps> = ({
  question,
  typedAnswer,
  onTypeAnswer,
  onSubmit,
  disabled,
}) => {
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on question mount
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [question.id, disabled]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && typedAnswer.trim() && !disabled) {
      onSubmit();
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 animate-fadeIn">
      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xl border-2 border-blue-200 dark:border-blue-900/50 relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold text-xs uppercase tracking-wider border border-blue-200 dark:border-blue-800">
            <Keyboard className="w-3.5 h-3.5" />
            {question.category || 'Typing Quest'}
          </span>

          {/* Hint Trigger */}
          {question.hint && (
            <button
              type="button"
              onClick={() => {
                setShowHint(!showHint);
                sounds.playClick();
              }}
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{showHint ? 'Hide Hint' : 'Need Hint?'}</span>
            </button>
          )}
        </div>

        {/* Question Title */}
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">
          {question.title}
        </h2>

        {/* Verse Highlight Card */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-blue-50 dark:from-blue-950/60 dark:via-slate-900 dark:to-indigo-950/40 p-5 rounded-2xl border-2 border-blue-200/80 dark:border-blue-800/60 my-2 shadow-inner">
          <p className="text-base sm:text-lg font-serif italic text-slate-800 dark:text-slate-200 leading-relaxed">
            "{question.questionText}"
          </p>
          <div className="mt-3 text-right">
            <span className="inline-block bg-blue-200/70 dark:bg-blue-900/80 text-blue-900 dark:text-blue-200 text-xs font-bold px-2.5 py-0.5 rounded-md">
              {question.scriptureRef}
            </span>
          </div>
        </div>

        {/* Hint Box */}
        {showHint && question.hint && (
          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/80 border-l-4 border-amber-400 rounded-r-xl text-xs text-amber-900 dark:text-amber-200 font-medium animate-fadeIn">
            💡 <strong>Hint:</strong> {question.hint}
          </div>
        )}
      </div>

      {/* Typing Input Box */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-lg flex flex-col gap-3">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
          Type your scripture answer below:
        </label>

        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            disabled={disabled}
            value={typedAnswer}
            onChange={(e) => onTypeAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type missing word or answer..."
            className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 text-slate-900 dark:text-slate-100 text-base sm:text-lg font-bold rounded-2xl px-4 py-3.5 pr-20 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
          />

          {typedAnswer && !disabled && (
            <button
              type="button"
              onClick={() => onTypeAnswer('')}
              className="absolute right-12 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}

          <button
            type="button"
            disabled={disabled || !typedAnswer.trim()}
            onClick={() => {
              if (typedAnswer.trim()) {
                onSubmit();
              }
            }}
            className="absolute right-2 p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold transition-all disabled:cursor-not-allowed shadow"
            title="Submit Answer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 px-1 font-medium">
          💡 Press <kbd className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-mono">Enter ↵</kbd> on your keyboard or tap the send button to submit.
        </p>
      </div>
    </div>
  );
};
