import Papa from 'papaparse';

export default function ExportCSVButton({ students }: { students: any[] }) {
  const handleExport = () => {
    const csv = Papa.unparse(
      students.map((s) => ({
        Nome: s.name,
        Perceptível: s.progress.perceptible,
        Operável: s.progress.operable,
        Compreensível: s.progress.understandable,
        Robusto: s.progress.robust,
        Conquistas: s.achievements.join(', '),
      }))
    );

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dados-alunos.csv';
    a.click();
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
    >
      Exportar CSV
    </button>
  );
}
