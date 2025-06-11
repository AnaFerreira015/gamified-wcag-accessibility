// import { useAuth } from '../contexts/AuthContext';

// export default function HeaderMenu() {
//   const { user } = useAuth();

//   if (!user) return null;

//   const initials = user.name
//     .split(' ')
//     .map(part => part[0])
//     .join('')
//     .toUpperCase()
//     .slice(0, 2);

//   const roleLabel = user.role === 'student' ? 'Aluno' : 'Professor';

//   return (
//     <header className="bg-white shadow p-4 flex items-center justify-between">
//       <h1 className="text-xl font-bold text-gray-800">Acessibilidade WCAG</h1>
//       <div className="flex items-center space-x-3">
//         <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
//           {initials}
//         </div>
//         <div className="text-right">
//           <p className="text-sm font-medium text-gray-800">{user.name}</p>
//           <p className="text-xs text-gray-500">{roleLabel}</p>
//         </div>
//       </div>
//     </header>
//   );
// }
