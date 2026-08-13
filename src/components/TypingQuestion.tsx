import React, { useEffect, useRef } from 'react';
import { Send, XCircle } from 'lucide-react';
import { Question } from '../types';

interface TypingQuestionProps {
  question: Question;
  questionNumber?: number;
  totalQuestions?: number;
  typedAnswer: string;
  onTypeAnswer: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

export const TypingQuestion: React.FC<TypingQuestionProps> = ({
  question,
  questionNumber = 1,
  totalQuestions = 10,
  typedAnswer,
  onTypeAnswer,
  onSubmit,
  disabled,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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
    <div className="w-full flex flex-col gap-3 animate-fadeIn">
      {/* Question Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        {/* Category & Question Number */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {question.category || 'Typing Quest'}
          </span>
          <span className="bg-slate-100 text-slate-800 text-[11px] font-extrabold px-2 py-0.5 rounded-md border border-slate-200 font-mono">
            Question {questionNumber}/{totalQuestions}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-extrabold text-slate-900 mb-1">
          {question.title}
        </h2>

        {/* Emojis Display if present */}
        {question.emojis && question.emojis.length > 0 ? (
          <div className="flex flex-col gap-2 my-2">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-center gap-2.5 flex-wrap shadow-inner">
              {question.emojis.map((emoji, idx) => (
                <span key={idx} className="text-3xl sm:text-4xl select-none hover:scale-110 transition-transform">
                  {emoji}
                </span>
              ))}
            </div>
            <p className="text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
              {question.questionText}
            </p>
          </div>
        ) : (
          /* Verse Card for Standard Fill-in questions */
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 my-1">
            <p className="text-sm font-serif italic text-slate-800 leading-relaxed">
              "{question.questionText}"
            </p>
            {question.scriptureRef && (
              <div className="mt-1.5 text-right">
                <span className="inline-block bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                  {question.scriptureRef}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            disabled={disabled}
            value={typedAnswer}
            onChange={(e) => onTypeAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type answer..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-slate-800 text-slate-900 text-sm font-semibold rounded-xl px-3.5 py-3 pr-16 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal"
          />

          {typedAnswer && !disabled && (
            <button
              type="button"
              onClick={() => onTypeAnswer('')}
              className="absolute right-10 text-slate-400 hover:text-slate-600 p-1"
            >
              <XCircle className="w-4 h-4" />
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
            className="absolute right-1.5 p-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white font-bold transition-all disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

