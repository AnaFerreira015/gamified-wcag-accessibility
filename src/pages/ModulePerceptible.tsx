// import { useState } from 'react';
// import { useModuleProgress } from '../hooks/useModuleProgress';
// import UnlockedAchievementToast from '../components/UnlockedAchievementToast';
// import { ACHIEVEMENTS, useAchievements } from '../hooks/useAchievements';

// interface Question {
//   id: string;
//   text: string;
//   options: string[];
//   correct: number;
// }

// const questions: Question[] = [
//   {
//     id: 'q1',
//     text: 'Qual das alternativas está mais alinhada ao princípio "Perceptível" da WCAG?',
//     options: [
//       'Permitir que o usuário controle o tempo de uma ação',
//       'Exibir texto alternativo em imagens importantes',
//       'Evitar animações rápidas',
//       'Oferecer navegação consistente',
//     ],
//     correct: 1,
//   },
// ];

// export default function ModulePerceptible() {
//   const { progress, updateProgress } = useModuleProgress();
//   const [selected, setSelected] = useState<number | null>(null);
//   const [answered, setAnswered] = useState(false);

//   const currentQuestion = questions[0];

//   const { unlocked, unlock } = useAchievements();
//   const [justUnlocked, setJustUnlocked] = useState(false);

//   const handleSubmit = () => {
//     const isCorrect = selected === currentQuestion.correct;
  
//     if (isCorrect) {
//       updateProgress('perceptible', 100);
//       const alreadyUnlocked = unlocked.includes('a_perceptible');
//       unlock('a_perceptible');
  
//       if (!alreadyUnlocked) {
//         setJustUnlocked(true); 
//       }
//     }
  
//     setAnswered(true);
//   };

//   return (
//     <>
//       {justUnlocked && (
//         <UnlockedAchievementToast
//           title="Mestre do Perceptível"
//           description="Você concluiu 100% do módulo Perceptível!"
//         />
//       )}
  
//       <main className="min-h-screen bg-gray-50 p-6">
//         <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6 space-y-4">
//           <h1 className="text-xl font-bold text-gray-800">Módulo: Perceptível</h1>
//           <p className="text-sm text-gray-600">Progresso atual: {progress['perceptible'] || 0}%</p>
  
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleSubmit();
//             }}
//             aria-labelledby="question-title"
//           >
//             <fieldset className="space-y-2">
//               <legend id="question-title" className="text-lg font-medium text-gray-700">
//                 {currentQuestion.text}
//               </legend>
  
//               {currentQuestion.options.map((option, idx) => (
//                 <label
//                   key={idx}
//                   className="flex items-center space-x-2 cursor-pointer"
//                 >
//                   <input
//                     type="radio"
//                     name="answer"
//                     value={idx}
//                     checked={selected === idx}
//                     onChange={() => setSelected(idx)}
//                     className="accent-blue-600"
//                   />
//                   <span className="text-gray-800">{option}</span>
//                 </label>
//               ))}
//             </fieldset>
  
//             <button
//               type="submit"
//               disabled={selected === null || answered}
//               className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//             >
//               Responder
//             </button>
  
//             {answered && (
//               <div className="mt-4 p-3 rounded text-sm font-medium" role="alert">
//                 {selected === currentQuestion.correct ? (
//                   <div className="bg-green-100 text-green-800">
//                     ✅ Resposta correta! Você concluiu o módulo.
//                   </div>
//                 ) : (
//                   <div className="bg-red-100 text-red-800">
//                     ❌ Resposta incorreta. Tente novamente mais tarde.
//                   </div>
//                 )}
//               </div>
//             )}
//           </form>
//         </div>
//       </main>
//     </>
//   );  
// }
