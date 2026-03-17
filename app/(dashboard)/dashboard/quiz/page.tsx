"use client";
import React, { useState } from "react";

const sampleQuestions = [
  {
    question: "What is React?",
    options: ["A library for building UI", "A database", "A CSS framework", "A programming language"],
    answer: 0,
  },
  {
    question: "Which hook is used for state management?",
    options: ["useEffect", "useState", "useRef", "useCallback"],
    answer: 1,
  },
  {
    question: "What does JSX stand for?",
    options: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Extension"],
    answer: 0,
  },
];

export default function QuizPage() {
  const [selected, setSelected] = useState(Array(sampleQuestions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qIdx: number, optIdx: number) => {
    const updated = [...selected];
    updated[qIdx] = optIdx;
    setSelected(updated);
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // Analytics calculation
  const correctCount = submitted
    ? sampleQuestions.reduce((acc, q, idx) => acc + (selected[idx] === q.answer ? 1 : 0), 0)
    : 0;
  const incorrectCount = submitted
    ? sampleQuestions.length - correctCount
    : 0;
  const percentage = submitted
    ? Math.round((correctCount / sampleQuestions.length) * 100)
    : 0;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Quiz</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {sampleQuestions.map((q, qIdx) => (
          <div key={qIdx} className="border rounded-lg p-4 bg-white shadow">
            <div className="font-semibold mb-2">{q.question}</div>
            <div className="space-y-2">
              {q.options.map((opt, optIdx) => (
                <label key={optIdx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`q${qIdx}`}
                    value={optIdx}
                    checked={selected[qIdx] === optIdx}
                    onChange={() => handleSelect(qIdx, optIdx)}
                    disabled={submitted}
                  />
                  {opt}
                </label>
              ))}
            </div>
            {submitted && selected[qIdx] !== null && (
              <div className={
                selected[qIdx] === q.answer
                  ? "text-green-600 mt-2"
                  : "text-red-600 mt-2"
              }>
                {selected[qIdx] === q.answer ? "Correct!" : "Incorrect."}
              </div>
            )}
          </div>
        ))}
        <button type="submit" className="bg-primary text-white rounded-lg px-4 py-2 font-semibold hover:bg-primary/90 transition w-full" disabled={submitted}>
          Submit Answers
        </button>
      </form>
      {submitted && (
        <div className="mt-8 p-4 border rounded-lg bg-gray-50 shadow">
          <h2 className="text-xl font-semibold mb-2">Quiz Analytics</h2>
          <p className="mb-1">Correct Answers: <span className="font-bold text-green-600">{correctCount}</span></p>
          <p className="mb-1">Incorrect Answers: <span className="font-bold text-red-600">{incorrectCount}</span></p>
          <p className="mb-1">Score: <span className="font-bold">{correctCount} / {sampleQuestions.length}</span></p>
          <p className="mb-1">Percentage: <span className="font-bold">{percentage}%</span></p>
        </div>
      )}
    </div>
  );
}
