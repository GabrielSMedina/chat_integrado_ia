import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';

export const useChat = () => {
  const { chatId } = useParams();
  const [state, setState] = useState({
    messages: [],
    input: '',
    loading: false,
    error: null,
    assistantResponse: ''
  });

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/chats/${chatId}`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setState(prev => ({ ...prev, messages: Array.isArray(data) ? data : [] }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to load messages' }));
    }
  }, [chatId]);

  const handleSend = useCallback(async () => {
    if (!state.input.trim() || state.loading) return;

    setState(prev => ({ ...prev, loading: true, error: null }));
    const userMessage = { role: 'user', content: state.input };

    try {
      await fetch(`/api/chats/${chatId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userMessage),
      });

      const updatedMessages = [...state.messages, userMessage];
      setState(prev => ({
        ...prev,
        messages: updatedMessages,
        input: '',
        assistantResponse: ''
      }));

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok) throw new Error('Streaming error');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        fullResponse += chunk;
        setState(prev => ({ ...prev, assistantResponse: fullResponse }));
      }

      await fetch(`/api/chats/${chatId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'assistant',
          content: fullResponse,
        }),
      });

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, { role: 'assistant', content: fullResponse }],
        assistantResponse: ''
      }));

    } catch (err) {
      setState(prev => ({ ...prev, error: 'Error sending message' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.input, state.messages, chatId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    ...state,
    setInput: (input) => setState(prev => ({ ...prev, input })),
    handleSend
  };
};