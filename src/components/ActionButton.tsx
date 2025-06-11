import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  color?: 'blue' | 'green' | 'red' | 'gray';
}

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-400',
  green: 'bg-green-700 hover:bg-green-800 focus:ring-green-500',
  red: 'bg-red-700 hover:bg-red-800 focus:ring-red-500',
  gray: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-400',
};

export default function ActionButton({
  children,
  color = 'blue',
  className = '',
  ...props
}: ActionButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        'inline-flex items-center gap-1 text-white px-3 py-1 text-sm rounded focus:outline-none focus:ring-2 transition-colors',
        colorClasses[color],
        className
      )}
    >
      {children}
    </button>
  );
}
