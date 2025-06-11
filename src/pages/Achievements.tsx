import { useEffect, useState } from 'react';
import { useAchievements } from '../hooks/useAchievements';

interface Badge {
  id: string;
  title: string;
  description: string;
}

export default function Achievements() {
  const { unlocked } = useAchievements();
  const [allAchievements, setAllAchievements] = useState<Badge[]>([]);

  const badgeColors: Record<string, string> = {
    a_perceptible: 'bg-blue-100 text-blue-800',
    a_operable: 'bg-green-100 text-green-800',
    a_understandable: 'bg-yellow-100 text-yellow-800',
    a_robust: 'bg-purple-100 text-purple-800',
  };

  useEffect(() => {
    fetch('http://localhost:3000/achievements')
      .then(res => res.json())
      .then(setAllAchievements)
      .catch(err => console.error('Erro ao carregar conquistas:', err));
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <section aria-labelledby="achievements-title">
        <h1 id="achievements-title" className="text-2xl font-bold mb-6 text-gray-800">Suas Conquistas</h1>
        <ul className="grid gap-4 sm:grid-cols-2">
          {allAchievements.map((badge) => {
            const isUnlocked = unlocked.includes(badge.id);
            return (
              <li
                key={badge.id}
                className={`p-4 rounded shadow ${badgeColors[badge.id] || 'bg-gray-200'} ${isUnlocked ? '' : 'opacity-50'}`}
                aria-label={isUnlocked ? 'Conquista desbloqueada' : 'Conquista bloqueada'}
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  {isUnlocked ? '🏅 ' : '🔒 '}
                  {badge.title}
                </h2>
                <p className="text-sm text-gray-600">{badge.description}</p>
              </li>
            );
          })}
          {unlocked.length === 0 && (
            <li className="col-span-full text-center text-sm text-gray-500">
              Você ainda não desbloqueou nenhuma conquista.
            </li>
          )}
        </ul>
      </section>
    </main>
  );
}
