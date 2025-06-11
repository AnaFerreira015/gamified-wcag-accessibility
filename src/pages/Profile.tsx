import { useModuleProgress } from '../hooks/useModuleProgress';
import { useAchievements } from '../hooks/useAchievements';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Student {
  id: number;
  name: string;
  percent: number;
  completedModules: number;
}

export default function Profile() {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher';

  const { progress, refetchProgress } = useModuleProgress();
  const { unlocked, allAchievements } = useAchievements();

  const [classOverview, setClassOverview] = useState<Student[]>([]);

  useEffect(() => {
    if (isStudent) {
      refetchProgress();
    }

    if (isTeacher) {
      fetch('http://localhost:3000/teacher/overview')
        .then(res => res.json())
        .then(setClassOverview);
    }
  }, [isStudent, isTeacher]);

  const moduleKeys = Object.keys(progress).filter(k =>
    ['perceptible', 'operable', 'understandable', 'robust'].includes(k)
  );

  const completedModules = moduleKeys.filter(id => progress[id] >= 50).length;
  const percentComplete =
    moduleKeys.length > 0
      ? Math.round((completedModules / moduleKeys.length) * 100)
      : 0;

  const averageProgress = classOverview.length
    ? Math.round(classOverview.reduce((sum, s) => sum + s.percent, 0) / classOverview.length)
    : 0;

  const fullyCompleted = classOverview.filter((s) => s.completedModules >= 4).length;
  const strugglingStudents = classOverview.filter((s) => s.percent < 50).length;

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {isStudent && (
          <section>
            <h1 className="text-2xl font-bold text-gray-800">Seu Progresso Geral</h1>
            <p className="mt-2 text-gray-600 text-sm">
              Módulos finalizados: {completedModules} de {moduleKeys.length} ({percentComplete}%)
            </p>

            <div className="w-full mt-4 bg-gray-200 h-3 rounded-full">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </section>
        )}

        {isTeacher && (
          <section>
            <h1 className="text-2xl font-bold text-gray-800">Resumo da Turma</h1>
            <div className="mt-2 space-y-2 text-sm text-gray-700">
              <p>👩‍🎓 Alunos cadastrados: <strong>{classOverview.length}</strong></p>
              <p>📊 Progresso médio: <strong>{averageProgress}%</strong></p>
              <p>🏁 Alunos com todos os módulos: <strong>{fullyCompleted}</strong></p>
              <p>⚠️ Alunos com baixo progresso (&lt;50%): <strong>{strugglingStudents}</strong></p>
            </div>

            <div className="mt-4">
              <Link
                to="/dashboard"
                className="inline-block px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
              >
                Ver detalhamento da turma
              </Link>
            </div>
          </section>
        )}

        {isStudent && (
          <section aria-labelledby="achievements-title">
            <h2 id="achievements-title" className="text-xl font-semibold text-gray-800 mt-6">Conquistas Desbloqueadas</h2>
            <div className="grid gap-4 mt-4 sm:grid-cols-2">
              {allAchievements.map((ach) => {
                const isUnlocked = unlocked.includes(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`p-4 rounded shadow transition ${
                      isUnlocked ? 'bg-green-100 text-green-800' : 'bg-gray-200 opacity-50'
                    }`}
                  >
                    <h3 className="text-lg font-medium text-gray-900">
                      {isUnlocked ? '🏅 ' : '🔒 '}
                      {ach.title}
                    </h3>
                    <p className="text-sm text-gray-600">{ach.description}</p>
                  </div>
                );
              })}
              {unlocked.length === 0 && (
                <p className="text-center text-sm text-gray-500 col-span-full">
                  Você ainda não desbloqueou nenhuma conquista.
                </p>
              )}
            </div>
          </section>
        )}
      </div>

      <div className="text-right mt-6">
        <Link
          to="/profile/edit"
          className="inline-block px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
        >
          Editar perfil
        </Link>
      </div>
    </main>
  );
}
