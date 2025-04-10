export const Button = ({ 
  children, 
  onClick, 
  disabled, 
  className = '', 
  variant = 'default',
  size = 'medium',
  ...props 
}) => {
  const baseStyles = 'rounded-full transition-all shadow-md flex items-center justify-center font-medium';
  
  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  const variantStyles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    ghost: 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-100',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};