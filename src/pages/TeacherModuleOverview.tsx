import { useEffect, useState } from 'react';
import { Pencil, Trash2, Save, X } from 'lucide-react';
import ActionButton from '../components/ActionButton';

interface Question {
  id: number;
  module: string;
  text: string;
  options: string[] | string;
  correctIndex: number;
}

export default function TeacherModuleOverview({ module }: { module: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedText, setEditedText] = useState('');
  const [editedOptions, setEditedOptions] = useState<string[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3000/questions/${module}`)
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(() => setError('Erro ao carregar perguntas.'))
      .finally(() => setLoading(false));
  }, [module]);

  const parseOptions = (options: string[] | string): string[] => {
    return typeof options === 'string' ? JSON.parse(options) : options;
  };

  const handleDelete = async (id: number) => {
    const confirm = window.confirm('Tem certeza que deseja excluir esta pergunta?');
    if (!confirm) return;

    try {
      await fetch(`http://localhost:3000/questions/${id}`, { method: 'DELETE' });
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch {
      alert('Erro ao excluir a pergunta.');
    }
  };

  const handleSave = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: editedText,
          options: editedOptions,
        }),
      });

      setEditingId(null);
      setEditedText('');
      setEditedOptions([]);

      setQuestions(prev =>
        prev.map(q =>
          q.id === id ? { ...q, text: editedText, options: editedOptions } : q
        )
      );
    } catch (err) {
      console.error('Erro ao salvar pergunta:', err);
      alert('Erro ao salvar pergunta.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Perguntas do módulo: {module.charAt(0).toUpperCase() + module.slice(1)}
        </h1>

        {loading && <p>Carregando perguntas...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <ul className="space-y-4">
          {questions.map((q, idx) => {
            const options = parseOptions(q.options);
            const isEditing = editingId === q.id;

            return (
              <li key={q.id} className="bg-white p-4 rounded shadow">
                {isEditing ? (
                  <>
                    <input
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="border rounded px-2 py-1 w-full text-sm mb-2"
                    />

                    <ul className="space-y-2">
                      {editedOptions.map((opt, i) => (
                        <li key={i}>
                          <input
                            value={opt}
                            onChange={(e) => {
                              const updated = [...editedOptions];
                              updated[i] = e.target.value;
                              setEditedOptions(updated);
                            }}
                            className="border rounded px-2 py-1 w-full text-sm"
                          />
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    <p className="text-gray-700 text-sm">
                      {idx + 1}. {q.text}
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-700">
                      {options.map((opt, i) => (
                        <li key={i}>
                          {i === q.correctIndex ? '✅' : '➖'} {opt}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <div className="mt-3 flex gap-2">
                  {editingId === q.id ? (
                    <>
                      <ActionButton onClick={() => handleSave(q.id)} color="green" aria-label="Salvar">
                        <Save size={16} /> Salvar
                      </ActionButton>
                      <ActionButton onClick={() => setEditingId(null)} color="gray" aria-label="Cancelar">
                        <X size={16} /> Cancelar
                      </ActionButton>
                    </>
                  ) : (
                    <ActionButton
                      onClick={() => {
                        setEditingId(q.id);
                        setEditedText(q.text);
                        setEditedOptions(parseOptions(q.options));
                      }}
                      color="blue"
                      aria-label="Editar"
                    >
                      <Pencil size={16} /> Editar
                    </ActionButton>
                  )}
                  <ActionButton onClick={() => handleDelete(q.id)} color="red" aria-label="Excluir">
                    <Trash2 size={16} /> Excluir
                  </ActionButton>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
