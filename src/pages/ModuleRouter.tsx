import { useParams } from 'react-router-dom';
import ModuleQuiz from './ModuleQuiz';
import TeacherModuleOverview from './TeacherModuleOverview';
import { useAuth } from '../contexts/AuthContext';

export default function ModuleRouter() {
  const { id } = useParams();
  const { user } = useAuth();

  if (!id) return <p>Módulo inválido</p>;

  if (user?.role === 'teacher') {
    return <TeacherModuleOverview module={id} />;
  }

  return <ModuleQuiz module={id} />;
}
