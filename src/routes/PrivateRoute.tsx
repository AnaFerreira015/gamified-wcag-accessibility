import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { JSX } from 'react';

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Carregando...</div>;
  }

  return user ? children : <Navigate to="/login" />;
}
