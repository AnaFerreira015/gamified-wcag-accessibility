import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch(`http://localhost:3000/students/${user?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) throw new Error('Falha na atualização');

      const data = await res.json();
      setUser?.({ ...user, ...data }); 
      localStorage.setItem('user', JSON.stringify({ ...user, ...data }));
      setMessage('✅ Perfil atualizado com sucesso!');
      setPassword(''); 
    } catch (err) {
      console.error(err);
      setMessage('❌ Ocorreu um erro ao atualizar seu perfil.');
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4 text-gray-800">Editar Perfil</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nova Senha</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded"
            placeholder="Deixe em branco para manter"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Salvar
        </button>

        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </main>
  );
}
