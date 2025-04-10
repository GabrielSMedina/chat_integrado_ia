export const Input = ({ className = '', ...props }) => {
    return (
      <input
        className={`p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm ${className}`}
        {...props}
      />
    );
  };