import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, type User } from '../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface StudentOverview {
  id: string;
  name: string;
  percent: number;
  completedModules: number;
  achievements: string[];
  lastActivity: string;
}

const COLORS = ['#4ade80', '#facc15', '#f87171'];

export default function TeacherDashboard() {
  const { user } = useAuth() as { user: User };
  const [classOverview, setClassOverview] = useState<StudentOverview[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'teacher') return;
  
    fetch(`http://localhost:3000/teacher/overview`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          console.error("Resposta inválida do backend:", data);
          return;
        }
      
        const safeData = data.map((s: any) => ({
          id: s.id ?? s.name ?? Math.random().toString(36).substring(2),
          name: s.name ?? 'Sem nome',
          percent: typeof s.percent === 'number' ? s.percent : 0,
          completedModules: typeof s.completedModules === 'number' ? s.completedModules : 0,
          achievements: Array.isArray(s.achievements) ? s.achievements : [],
          lastActivity: s.lastActivity ?? null,
        }));
      
        setClassOverview(safeData);
      });
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

  const getProgressColor = (percent: number) => {
    if (percent < 30) return 'text-red-600';
    if (percent < 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const exportToCSV = () => {
    const header = 'Nome,Progresso,Conquistas,Última Atividade\n';
    const rows = classOverview.map((s) => {
      const nome = s.name || 'Desconhecido';
      const progresso = s.percent ?? 0;
      const conquistas = Array.isArray(s.achievements) ? s.achievements.length : 0;
      const ultima = s.lastActivity ? formatDate(s.lastActivity) : 'N/A';
  
      return `${nome},${progresso}%,${conquistas},${ultima}`;
    }).join('\n');
  
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'turma.csv';
    a.click();
  };  

  const filtered = classOverview.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  console.log('filtered: ', filtered);

  const progressDistribution = [
    { label: '0-29%', count: classOverview.filter(s => s.percent < 30).length },
    { label: '30-59%', count: classOverview.filter(s => s.percent >= 30 && s.percent < 60).length },
    { label: '60-100%', count: classOverview.filter(s => s.percent >= 60).length },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Resumo da Turma 👩‍🏫</h1>

        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrar por nome..."
            className="px-3 py-2 border rounded w-full max-w-xs"
          />
          <button
            onClick={exportToCSV}
            className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Exportar CSV
          </button>
        </div>

        {/* Gráfico de barras */}
        <div className="bg-white p-4 mb-6 rounded shadow">
          <h2 className="font-semibold text-gray-800 mb-2">Distribuição de Progresso</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={progressDistribution}>
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count">
                {progressDistribution.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {filtered.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2">
            {filtered.map((s) => (
              <li key={s.id || s.name} className="bg-white p-4 rounded shadow-sm">
                <p className="font-semibold text-gray-800 text-lg">🎓 {s.name}</p>
                <p className={`text-sm ${getProgressColor(s.percent)}`}>Progresso: {s.percent}%</p>
                <p className="text-sm text-gray-600">
                  Módulos completos: {typeof s.completedModules === 'number' ? s.completedModules : 0}/4
                </p>
                <p className="text-sm text-gray-600">
                  Conquistas: {Array.isArray(s.achievements) ? s.achievements.length : 0}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Última atividade: {s.lastActivity ? formatDate(s.lastActivity) : 'N/A'}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 mt-4">Nenhum aluno encontrado.</p>
        )}
      </div>
    </main>
  );
}
