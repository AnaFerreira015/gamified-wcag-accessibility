import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow mb-4">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex space-x-6">
          <Link to="/dashboard" className="text-gray-700 font-semibold hover:text-blue-600">
            Dashboard
          </Link>
          <Link to="/profile" className="text-gray-700 font-semibold hover:text-blue-600">
            Perfil
          </Link>
          <Link to="/module/perceptible" className="text-gray-700 font-semibold hover:text-blue-600">
            Perceptível
          </Link>
          <Link to="/module/operable" className="text-gray-700 font-semibold hover:text-blue-600">
            Operável
          </Link>
          <Link to="/module/understandable" className="text-gray-700 font-semibold hover:text-blue-600">
            Compreensível
          </Link>
          <Link to="/module/robust" className="text-gray-700 font-semibold hover:text-blue-600">
            Robusto
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Sair
        </button>
      </div>
    </nav>
  );
}
