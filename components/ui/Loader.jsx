'use client';

export const Loader = ({
  size = 'medium',
  className = '',
  variant = 'primary',
}) => {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-6 w-6 border-3',
    large: 'h-8 w-8 border-4',
  };

  const variantClasses = {
    primary: 'border-blue-500 border-t-transparent',
    secondary: 'border-gray-500 border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  return (
    <div
      className={`inline-block rounded-full animate-spin ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
