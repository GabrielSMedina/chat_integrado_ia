'use client';

import { useChat } from '../hooks/useChat';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';

export const ChatContainer = () => {
  const { messages, input, setInput, loading, error, assistantResponse, handleSend } = useChat();
  
  return (
    <div className="chat-container">
      <ChatHeader />
      <ChatMessages 
        messages={messages} 
        assistantResponse={assistantResponse} 
      />
      <ChatInput
        input={input}
        setInput={setInput}
        loading={loading}
        error={error}
        handleSend={handleSend}
      />
    </div>
  );
};