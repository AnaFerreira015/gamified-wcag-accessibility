import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const roleLabel = user.role === 'student' ? 'Aluno' : 'Professor';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <nav className="flex flex-wrap gap-4">
          <Link to="/dashboard" className="text-gray-700 font-semibold hover:text-blue-600">Dashboard</Link>
          <Link to="/profile" className="text-gray-700 font-semibold hover:text-blue-600">Perfil</Link>
          <Link to="/module/perceptible" className="text-gray-700 font-semibold hover:text-blue-600">Perceptível</Link>
          <Link to="/module/operable" className="text-gray-700 font-semibold hover:text-blue-600">Operável</Link>
          <Link to="/module/understandable" className="text-gray-700 font-semibold hover:text-blue-600">Compreensível</Link>
          <Link to="/module/robust" className="text-gray-700 font-semibold hover:text-blue-600">Robusto</Link>
        </nav>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(prev => !prev)}
            className="flex items-center space-x-3 focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
              {initials}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{roleLabel}</p>
            </div>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-50">
              <Link
                to="/profile/edit"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Editar Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
