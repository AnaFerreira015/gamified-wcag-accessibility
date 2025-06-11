import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, type User } from '../contexts/AuthContext';
import TeacherDashboard from './TeacherDashboard';

export default function Dashboard() {
  const { user } = useAuth() as { user: User };
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [achievements, setAchievements] = useState<string[]>([]);
  const [classOverview, setClassOverview] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Aluno
    if (user.role === 'student') {
      fetch(`http://localhost:3000/students/${user.id}/progress`)
        .then(res => res.json())
        .then(data => {
          const keys = ['perceptible', 'operable', 'understandable', 'robust'];
          const filtered = Object.fromEntries(
            Object.entries(data)
              .filter(([key]) => keys.includes(key))
              .map(([key, val]) => [key, Number(val)])
          ) as Record<string, number>;
        
          setProgress(filtered);
        });

      fetch(`http://localhost:3000/students/${user.id}/achievements`)
        .then(res => res.json())
        .then(setAchievements);
    }

    // Professor
    if (user.role === 'teacher') {
      fetch(`http://localhost:3000/teacher/overview`)
        .then(res => res.json())
        .then(setClassOverview);
    }
  }, [user]);

  console.log('classOverview: ', classOverview);

  if (!user) return <Navigate to="/login" />;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Olá, {user.name} 👋
        </h1>

        {user.role === 'student' && (
          <section className="space-y-4">
            <div className="p-4 bg-white shadow rounded-lg">
              <h2 className="text-lg font-semibold text-gray-700">Seu Progresso</h2>
              <ul className="mt-2 space-y-2 text-sm text-gray-600">
                {Object.entries(progress)
                  .filter(([key]) => ['perceptible', 'operable', 'understandable', 'robust'].includes(key))
                  .map(([key, val]) => (
                    <li key={key}>
                      ✔ {key.charAt(0).toUpperCase() + key.slice(1)} — {val}%
                    </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-white shadow rounded-lg">
              <h2 className="text-lg font-semibold text-gray-700">Conquistas</h2>
              <ul className="mt-1 text-sm text-gray-600 space-y-1">
                {achievements.length > 0 ? (
                  achievements.map(id => (
                    <li key={id}>🏅 {id}</li>
                  ))
                ) : (
                  <li className="text-gray-400">Nenhuma conquista ainda.</li>
                )}
              </ul>
            </div>
          </section>
        )}

        {user.role === 'teacher' && <TeacherDashboard />}
      </div>
    </main>
  );
}
