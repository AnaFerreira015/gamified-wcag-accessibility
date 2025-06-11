interface Student {
  name: string;
  progress: {
    perceptible: number;
    operable: number;
    understandable: number;
    robust: number;
  };
  achievements: string[];
}

const mockStudents: Student[] = [
  {
    name: 'Ana Paula',
    progress: { perceptible: 100, operable: 70, understandable: 85, robust: 60 },
    achievements: ['a_perceptible'],
  },
  {
    name: 'Carlos Silva',
    progress: { perceptible: 90, operable: 80, understandable: 70, robust: 40 },
    achievements: [],
  },
  {
    name: 'Bruna Torres',
    progress: { perceptible: 100, operable: 100, understandable: 100, robust: 100 },
    achievements: ['a_perceptible', 'a_operable', 'a_understandable', 'a_robust'],
  },
];

export default function StudentRanking() {
  const ranked = [...mockStudents].sort((a, b) => {
    const avgA = Object.values(a.progress).reduce((s, v) => s + v, 0) / 4;
    const avgB = Object.values(b.progress).reduce((s, v) => s + v, 0) / 4;
    return avgB - avgA;
  });

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Ranking de Alunos</h1>

        <ol className="space-y-3">
          {ranked.map((student, index) => (
            <li key={index} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <span className="font-medium text-gray-800">{index + 1}. {student.name}</span>
                <p className="text-sm text-gray-500">
                  {student.achievements.length} conquista(s) — Progresso médio: {Math.round(Object.values(student.progress).reduce((s, v) => s + v, 0) / 4)}%
                </p>
              </div>
              <span className="text-lg font-bold text-blue-600">🏅 {student.achievements.length}</span>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}