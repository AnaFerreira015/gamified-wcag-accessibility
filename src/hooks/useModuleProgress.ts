import { useEffect, useState } from 'react';

export interface ModuleProgress {
  [moduleId: string]: number;
}

export const useModuleProgress = () => {
  const [progress, setProgress] = useState<ModuleProgress>({});
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchFromBackend = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`http://localhost:3000/students/${user.id}/progress`);
      const data = await res.json();
      const keys = ['perceptible', 'operable', 'understandable', 'robust'];
      const filtered = Object.fromEntries(
        Object.entries(data)
          .filter(([key]) => keys.includes(key))
          .map(([key, val]) => [key, Number(val)])
      ) as ModuleProgress;

      setProgress(filtered);
      localStorage.setItem('progress', JSON.stringify(filtered));
    } catch (err) {
      console.error('Erro ao buscar progresso do backend', err);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('progress');
    if (saved) setProgress(JSON.parse(saved));
    fetchFromBackend();
  }, [user?.id]);

  const updateProgress = (moduleId: string, value: number) => {
    const updated = { ...progress, [moduleId]: value };
    setProgress(updated);
    localStorage.setItem('progress', JSON.stringify(updated));
  };

  return { progress, updateProgress, refetchProgress: fetchFromBackend };
};
