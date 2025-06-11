import { useEffect, useState, useCallback } from 'react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
}

export const useAchievements = () => {
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Buscar conquistas desbloqueadas do usuário
  const refetchAchievements = useCallback(() => {
    if (!user?.id) return;

    fetch(`http://localhost:3000/students/${user.id}/achievements`)
      .then((res) => res.json())
      .then((data) => setUnlocked(data))
      .catch((err) => console.error('Erro ao carregar conquistas desbloqueadas:', err));
  }, [user?.id]);

  useEffect(() => {
    refetchAchievements();

    fetch('http://localhost:3000/achievements')
      .then((res) => res.json())
      .then((data) => setAllAchievements(data))
      .catch((err) => console.error('Erro ao carregar todas as conquistas:', err));
  }, [refetchAchievements]);

  const isUnlocked = (id: string) => unlocked.includes(id);

  return {
    unlocked,
    isUnlocked,
    allAchievements,
    refetchAchievements,
  };
};
