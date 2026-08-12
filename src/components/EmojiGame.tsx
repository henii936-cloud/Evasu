import React, { useState } from 'react';
import { Check, Lightbulb } from 'lucide-react';
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
    <div className="w-full flex flex-col gap-3 animate-fadeIn">
      {/* Question Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm text-center">
        {/* Title & Question */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {question.category || 'Emoji Puzzle'}
          </span>
          {question.hint && (
            <button
              type="button"
              onClick={() => {
                setShowHint(!showHint);
                sounds.playClick();
              }}
              className="text-[11px] font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <Lightbulb className="w-3 h-3 text-amber-500" />
              <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
            </button>
          )}
        </div>

        <h2 className="text-lg font-extrabold text-slate-900 mb-0.5">
          {question.title}
        </h2>
        <p className="text-xs font-medium text-slate-500 mb-3">
          {question.questionText}
        </p>

        {/* Emojis Display */}
        <div className="bg-slate-50 rounded-xl p-4 my-1 border border-slate-100 flex items-center justify-center gap-2 flex-wrap">
          {question.emojis?.map((emoji, idx) => (
            <span key={idx} className="text-3xl sm:text-4xl select-none">
              {emoji}
            </span>
          ))}
        </div>

        {/* Hint Box */}
        {showHint && question.hint && (
          <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 text-left font-medium">
            💡 <strong>Hint:</strong> {question.hint}
          </div>
        )}
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 gap-2">
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
              className={`w-full p-3.5 rounded-xl font-bold text-left transition-all flex items-center justify-between border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isSelected ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {optionLetters[idx]}
                </span>
                <span className="text-sm">{option}</span>
              </div>

              {isSelected && <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

