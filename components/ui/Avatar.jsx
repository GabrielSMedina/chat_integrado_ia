export const Avatar = ({ src, alt, size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12',
  };

  return (
    <div
      className={`inline-block rounded-full overflow-hidden border-2 border-blue-200 ${sizeClasses[size]} ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default-avatar.png';
          }}
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 font-medium">
            {alt?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
      )}
    </div>
  );
};
