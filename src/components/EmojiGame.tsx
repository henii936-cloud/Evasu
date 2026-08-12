import React, { useState } from 'react';
import { HelpCircle, Check, Lightbulb, Sparkles } from 'lucide-react';
import { Question } from '../types';
import { sounds } from '../utils/audio';

interface EmojiGameProps {
  question: Question;
  selectedOption: string | undefined;
  onSelectOption: (option: string) => void;
  disabled: boolean;
}

export const EmojiGame: React.FC<EmojiGameProps> = ({
  question,
  selectedOption,
  onSelectOption,
  disabled,
}) => {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="w-full flex flex-col gap-4 animate-fadeIn">
      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xl border-2 border-purple-200 dark:border-purple-900/50 relative overflow-hidden">
        {/* Top Decorative Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-extrabold text-xs uppercase tracking-wider border border-purple-200 dark:border-purple-800">
            <Sparkles className="w-3.5 h-3.5" />
            {question.category || 'Emoji Puzzle'}
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

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
          {question.title}
        </h2>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">
          {question.questionText}
        </p>

        {/* Big Emoji Showcase Canvas */}
        <div className="bg-gradient-to-br from-purple-50 via-amber-50/50 to-purple-100/70 dark:from-purple-950/50 dark:via-slate-900 dark:to-purple-900/30 rounded-2xl p-6 sm:p-8 my-2 border-2 border-purple-200/80 dark:border-purple-800/50 flex items-center justify-center gap-3 sm:gap-4 flex-wrap shadow-inner min-h-[120px]">
          {question.emojis?.map((emoji, idx) => (
            <span
              key={idx}
              className="text-4xl sm:text-5xl hover:scale-125 transition-transform duration-200 filter drop-shadow select-none animate-bounce"
              style={{ animationDelay: `${idx * 150}ms`, animationDuration: '2s' }}
            >
              {emoji}
            </span>
          ))}
        </div>

        {/* Hint Box */}
        {showHint && question.hint && (
          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/80 border-l-4 border-amber-400 rounded-r-xl text-xs text-amber-900 dark:text-amber-200 font-medium animate-fadeIn">
            💡 <strong>Hint:</strong> {question.hint}
          </div>
        )}
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 gap-3 mt-1">
        {question.options?.map((option, idx) => {
          const isSelected = selectedOption === option;
          const optionLetters = ['A', 'B', 'C', 'D'];

          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (!disabled) {
                  onSelectOption(option);
                  sounds.playClick();
                }
              }}
              className={`w-full p-4 rounded-2xl font-extrabold text-left transition-all duration-150 flex items-center justify-between group border-2 ${
                isSelected
                  ? 'bg-purple-600 text-white border-purple-700 shadow-[0_4px_0_0_#581c87] translate-y-0.5'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 hover:border-purple-300 dark:hover:border-purple-700 shadow-[0_4px_0_0_#cbd5e1] dark:shadow-[0_4px_0_0_#1e293b] active:translate-y-1 active:shadow-none'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                    isSelected
                      ? 'bg-purple-700 text-white'
                      : 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 group-hover:bg-purple-200'
                  }`}
                >
                  {optionLetters[idx]}
                </span>
                <span className="text-base sm:text-lg">{option}</span>
              </div>

              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-white text-purple-700 flex items-center justify-center">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
