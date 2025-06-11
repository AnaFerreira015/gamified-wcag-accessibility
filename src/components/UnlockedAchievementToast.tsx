import { useEffect, useState } from 'react';

interface Props {
  title: string;
  description: string;
}

export default function UnlockedAchievementToast({ title, description }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg w-80 z-50 transition-opacity duration-300"
      role="alert"
      aria-live="polite"
    >
      <p className="font-semibold text-lg">🏆 {title}</p>
      <p className="text-sm mt-1">{description}</p>
    </div>
  );
}
