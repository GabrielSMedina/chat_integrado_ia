'use client';
import { ChatMessage } from './ChatMessage';
import { useRef, useEffect } from 'react';

export const ChatMessages = ({ messages, assistantResponse }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, assistantResponse]);

  return (
    <div className="flex-1 overflow-y-auto p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} />
          ))
        )}
        
        {assistantResponse && (
          <ChatMessage role="assistant" content={assistantResponse} />
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-center py-10">
    <div className="bg-blue-100 p-4 rounded-full mb-4">
      <ChatIcon className="h-10 w-10 text-blue-600" />
    </div>
    <h2 className="text-xl font-semibold text-gray-700">Start a conversation</h2>
    <p className="text-gray-500 mt-2">Type a message below to begin chatting</p>
  </div>
);

const ChatIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);