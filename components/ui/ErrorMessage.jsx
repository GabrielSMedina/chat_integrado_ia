'use client';

import { ExclamationCircleIcon } from './icons/ExclamationCircleIcon';

export const ErrorMessage = ({
  message,
  className = '',
  variant = 'default',
}) => {
  if (!message) return null;

  const variants = {
    default: 'bg-red-50 text-red-600',
    warning: 'bg-yellow-50 text-yellow-600',
    info: 'bg-blue-50 text-blue-600',
  };

  return (
    <div
      className={`p-3 rounded-lg flex items-start gap-2 ${variants[variant]} ${className}`}
    >
      <ExclamationCircleIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};
