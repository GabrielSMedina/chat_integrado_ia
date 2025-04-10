'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ChatPage() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assistantResponse, setAssistantResponse] = useState('');

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`/api/chats/${chatId}`);
        if (!res.ok) throw new Error('Erro ao buscar mensagens');
        
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError('Falha ao carregar mensagens.');
      }
    }
    fetchMessages();
  }, [chatId]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    setError(null);
    setLoading(true);
    const userMessage = { role: 'user', content: input };

    try {
      await fetch(`/api/chats/${chatId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userMessage),
      });

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput('');
      setAssistantResponse(''); // Reseta o buffer de streaming

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok) throw new Error('Erro no streaming');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullResponse += chunk;
        setAssistantResponse(fullResponse); // Atualiza a UI a cada chunk
      }

      await fetch(`/api/chats/${chatId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'assistant',
          content: fullResponse,
        }),
      });

      setMessages(prev => [...prev, { role: 'assistant', content: fullResponse }]);
      setAssistantResponse('');

    } catch (err) {
      console.error(err);
      setError('Erro ao enviar mensagem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Lista de mensagens */}
      <div className="space-y-3 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`}
          >
            {msg.content}
          </div>
        ))}

        {/* Resposta do assistente em streaming */}
        {assistantResponse && (
          <div className="p-3 rounded-lg bg-gray-100">
            {assistantResponse}
          </div>
        )}
      </div>

      {/* Input de mensagem */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>

      {/* Exibição de erros */}
      {error && (
        <div className="mt-2 p-2 text-red-600 bg-red-50 rounded">
          {error}
        </div>
      )}
    </div>
  );
}