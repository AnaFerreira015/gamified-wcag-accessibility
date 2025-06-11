import { useEffect, useRef, useState } from 'react';
import { useAchievements } from '../hooks/useAchievements';
import UnlockedAchievementToast from '../components/UnlockedAchievementToast';
import { useModuleProgress } from '../hooks/useModuleProgress';

import confetti from 'canvas-confetti';

interface ResponseItem {
  question: string;
  selected: string;
  correct: string;
  isCorrect: boolean;
  time: number;
  attempt: number;
}

interface Question {
  id: number;
  module: string;
  text: string;
  options: string[] | string;
  correctIndex: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
}

export default function ModuleQuiz({ module: rawModule }: { module: string }) {
  const { updateProgress } = useModuleProgress();
  const { allAchievements } = useAchievements();
  const module = rawModule.toLowerCase();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [finished, setFinished] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [history, setHistory] = useState<ResponseItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const studentId = JSON.parse(localStorage.getItem('user') || '{}')?.id;

  useEffect(() => {
    fetch(`http://localhost:3000/questions/${module}`)
      .then(res => res.json())
      .then(data => setQuestions(data));
  }, [module]);

  useEffect(() => {
    if (timerActive) {
      intervalRef.current = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(intervalRef.current!);
  }, [timerActive, currentIndex]);

  function parseOptions(options: string[] | string): string[] {
    return typeof options === 'string' ? JSON.parse(options) : options;
  }

  const handleAnswer = async (idx: number) => {
    const q = questions[currentIndex];
    if (!q) return;

    const options = parseOptions(q.options);
    const isCorrect = q.correctIndex === idx;

    const newEntry: ResponseItem = {
      question: q.text,
      selected: options[idx],
      correct: options[q.correctIndex],
      isCorrect,
      time,
      attempt: attempts + 1,
    };

    setAnswered(true);
    setSelectedIndex(idx);
    setAttempts(a => a + 1);
    setTimerActive(false);
    setFeedback(isCorrect ? '✅ Correto!' : '❌ Incorreto.');

    await fetch('http://localhost:3000/quiz/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId,
        questionId: q.id,
        isCorrect,
        timeSpent: time,
        attemptNumber: attempts + 1,
      }),
    });

    const updatedHistory = [...history, newEntry];
    setHistory(updatedHistory);

    const correctAnswers = updatedHistory.filter(h => h.isCorrect).length;
    const percent = Math.round((correctAnswers / questions.length) * 100);

    await fetch(`http://localhost:3000/students/${studentId}/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [module]: percent }),
    });

    updateProgress(module, percent);

    if (isCorrect) {
      new Audio('/sounds/correct.mp3').play();
    } else {
      new Audio('/sounds/wrong.mp3').play();
    }

    setTimeout(() => {
      setAnswered(false);
      setSelectedIndex(null);
      setFeedback('');
      setTime(0);
      setTimerActive(true);

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(i => i + 1);
      } else {
        finalizeQuiz(updatedHistory);
      }
    }, 1500);
  };

  const finalizeQuiz = async (finalHistory: ResponseItem[]) => {
    setFinished(true);
    setTimerActive(false);

    const correct = finalHistory.filter(h => h.isCorrect).length;
    const percent = Math.round((correct / finalHistory.length) * 100);

    await fetch(`http://localhost:3000/students/${studentId}/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [module]: percent }),
    });

    updateProgress(module, percent);

    if (percent === 100) {
      const achievementId = `a_${module}`;

      await fetch(`http://localhost:3000/students/${studentId}/achievements`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ achievementId }),
      });

      const ach = allAchievements.find(a => a.id === achievementId);
      if (ach) {
        setUnlockedAchievement(ach);
        confetti();
      }
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setFinished(false);
    setAttempts(0);
    setTime(0);
    setTimerActive(true);
    setHistory([]);
    setUnlockedAchievement(null);
  };

  if (!questions.length) return <p>Carregando perguntas...</p>;

  if (finished) {
    return (
      <div className="p-4 space-y-6">
        <h2 className="text-2xl font-bold">Quiz finalizado!</h2>
        <p className="text-gray-700">
          Pontuação: {history.filter(h => h.isCorrect).length} / {questions.length}
        </p>

        {unlockedAchievement && (
          <UnlockedAchievementToast
            title={unlockedAchievement.title}
            description={unlockedAchievement.description}
          />
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Resumo por pergunta:</h3>
          <ul className="space-y-3">
            {history.map((item, idx) => (
              <li key={idx} className="p-3 rounded border bg-white shadow-sm">
                <p className="font-medium">
                  {item.isCorrect ? '✅' : '❌'} {item.question}
                </p>
                <p className="text-sm text-gray-600">Sua resposta: {item.selected}</p>
                {!item.isCorrect && (
                  <p className="text-sm text-red-500">Correta: {item.correct}</p>
                )}
                <p className="text-sm text-gray-500">
                  Tempo: {item.time}s — Tentativa: {item.attempt}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={resetQuiz}
          className="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Refazer quiz
        </button>
      </div>
    );
  }

  const q = questions[currentIndex];
  const options = parseOptions(q.options);

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center text-blue-700">Quiz - {module}</h1>

        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 text-right">
          Pergunta {currentIndex + 1} de {questions.length}
        </p>

        <p className="mb-1 font-medium text-gray-800">{q.text}</p>
        <p className="text-sm text-gray-500">⏱ Tempo: {time}s | Tentativas: {attempts}</p>

        <ul className="space-y-2">
          {options.map((opt, idx) => {
            const isCorrect = answered && idx === q.correctIndex;
            const isWrong = answered && idx !== q.correctIndex && idx === selectedIndex;

            return (
              <li key={idx}>
                <button
                  disabled={answered}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full px-4 py-2 rounded-lg border transition font-medium text-left
                    ${isCorrect ? 'bg-green-100 border-green-500 text-green-800' : ''}
                    ${isWrong ? 'bg-red-100 border-red-500 text-red-800' : ''}
                    ${!answered ? 'hover:bg-blue-50 border-gray-300' : 'cursor-not-allowed opacity-80'}`}
                >
                  {opt}
                </button>
              </li>
            );
          })}
        </ul>

        <div
          ref={liveRef}
          className="sr-only"
          aria-live="assertive"
          role="alert"
        >
          {feedback}
        </div>
      </div>
    </main>
  );
}
