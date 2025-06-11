import { useModuleProgress } from '../hooks/useModuleProgress';

const modules = [
  { id: 'perceptible', title: 'Perceptível' },
  { id: 'operable', title: 'Operável' },
  { id: 'understandable', title: 'Compreensível' },
  { id: 'robust', title: 'Robusto' },
];

export default function Modules() {
  const { progress } = useModuleProgress();

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Módulos WCAG</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {modules.map((mod) => (
          <div key={mod.id} className="bg-white p-4 rounded shadow space-y-2">
            <h2 className="text-lg font-semibold">{mod.title}</h2>
            <p className="text-sm text-gray-500">Progresso no módulo</p>
            <div className="w-full">
              <div className="h-2 bg-gray-200 rounded">
                <div
                  className="h-full bg-green-500 rounded"
                  style={{ width: `${progress[mod.id] || 0}%` }}
                />
              </div>
              <p className="text-xs text-right mt-1">{progress[mod.id] || 0}%</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
