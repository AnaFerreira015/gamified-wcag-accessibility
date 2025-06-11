import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './routes/PrivateRoute';
import Profile from './pages/Profile';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import ModuleRouter from './pages/ModuleRouter';
import AppHeader from './components/AppHeader';
import EditProfile from './pages/EditProfile';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppHeader />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />

          <Route path="/profile/edit" element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          } />

          <Route path="/module/:id" element={
            <PrivateRoute>
              <ModuleRouter />
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}