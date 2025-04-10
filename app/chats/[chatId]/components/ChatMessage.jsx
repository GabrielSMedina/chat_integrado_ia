export const ChatMessage = ({ role, content }) => {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] p-4 rounded-2xl ${
          isUser
            ? 'bg-blue-600 text-white rounded-tr-none'
            : 'bg-white text-gray-800 shadow-sm rounded-tl-none border border-gray-100'
        }`}
      >
        {content}
      </div>
    </div>
  );
};
