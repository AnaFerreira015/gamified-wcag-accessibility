interface ExportProps {
  students: {
    name: string;
    progress: Record<string, number>;
    achievements: string[];
  }[];
}

export default function ExportButton({ students }: ExportProps) {
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(students, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dados-alunos.json';
    a.click();
  };

  return (
    <button
      onClick={exportJSON}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      Exportar JSON
    </button>
  );
}
