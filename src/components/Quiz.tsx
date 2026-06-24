"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Award } from "lucide-react";

export interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuizProps {
  moduleTitle: string;
  questions: Question[];
}

export function Quiz({ moduleTitle, questions }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleOptionClick = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIndex);
    setIsAnswered(true);

    if (optionIndex === questions[currentQuestionIndex].correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (showResults) {
    return (
      <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm space-y-6 max-w-2xl mx-auto not-prose">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 text-blue-600 mb-2">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">{moduleTitle} - Quiz Complete!</h3>
          <p className="text-slate-800 font-medium">
            You scored <span className="font-black text-blue-600 text-lg">{score}</span> out of{" "}
            <span className="font-bold text-slate-900">{questions.length}</span> questions.
          </p>
          <div className="w-full bg-slate-100 rounded-full h-2.5 max-w-xs mx-auto">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${(score / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-center">
          <button
            onClick={handleRestart}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-lg transition-colors shadow-sm"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm space-y-6 max-w-2xl mx-auto not-prose">
      {/* Quiz Header */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <span className="text-xs font-black uppercase tracking-wider text-slate-500">
          Self-Assessment Challenge
        </span>
        <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
      </div>

      {/* Question */}
      <div className="space-y-4">
        <h4 className="text-base font-extrabold text-slate-900 leading-snug">
          {currentQuestion.question}
        </h4>

        {/* Options */}
        <div className="space-y-2">
          {currentQuestion.options.map((option, idx) => {
            let optionStyle = "border-slate-200 bg-white text-slate-850 hover:bg-slate-50 hover:border-slate-300";
            let Icon = null;

            if (isAnswered) {
              const isCorrect = idx === currentQuestion.correctIndex;
              const isSelected = idx === selectedOption;

              if (isCorrect) {
                optionStyle = "border-emerald-300 bg-emerald-50 text-emerald-900 font-bold";
                Icon = <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />;
              } else if (isSelected) {
                optionStyle = "border-rose-300 bg-rose-50 text-rose-900 font-bold";
                Icon = <XCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />;
              } else {
                optionStyle = "border-slate-100 bg-white text-slate-400 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleOptionClick(idx)}
                className={`w-full flex items-center justify-between p-3.5 rounded-lg border text-sm text-left transition-all ${optionStyle}`}
              >
                <span>{option}</span>
                {Icon}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation Banner */}
      {isAnswered && (
        <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-200 flex gap-3 text-sm animate-fade-in">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-black text-blue-900">Explanation</h5>
            <p className="text-slate-850 leading-relaxed font-semibold">{currentQuestion.explanation}</p>
          </div>
        </div>
      )}

      {/* Next Button */}
      {isAnswered && (
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={handleNext}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition-colors shadow-sm"
          >
            {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
          </button>
        </div>
      )}
    </div>
  );
}
