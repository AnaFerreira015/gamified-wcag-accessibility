interface UserCardProps {
  name: string;
  progress: number;
}

export default function UserCard({ name, progress }: UserCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
      <div>
        <p className="font-semibold text-gray-800">{name}</p>
        <p className="text-sm text-gray-500">{progress}% completo</p>
      </div>
      <div className="text-sm font-bold text-blue-600">{progress}%</div>
    </div>
  );
}
