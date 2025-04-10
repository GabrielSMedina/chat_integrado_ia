export const LoadingIndicator = ({ fullPage = false }) => (
  <div
    className={`flex items-center justify-center ${fullPage ? 'h-screen' : ''}`}
  >
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);
