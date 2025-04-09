'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ChatPage() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`/api/chats/${chatId}`);
    
        if (!res.ok) {
          console.error("Erro ao buscar mensagens:", res.statusText);
          setMessages([]); // ou mantenha o anterior, depende do seu UX
          return;
        }
    
        const data = await res.json();
    
        // Garantir que o dado é um array
        if (!Array.isArray(data)) {
          console.error("Formato inesperado de mensagens:", data);
          setMessages([]);
          return;
        }
    
        setMessages(data);
      } catch (err) {
        console.error("Erro na requisição:", err);
        setMessages([]);
      }
    }
    

    fetchMessages();
  }, [chatId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setError(null);
    setLoading(true);

    // 1. Cria a mensagem do usuário
    const userMessage = {
      role: 'user',
      content: input,
    };

    try {
      // 2. Salva no banco
      await fetch(`/api/chats/${chatId}`, {
        method: 'POST',
        body: JSON.stringify(userMessage),
      });

      // 3. Atualiza localmente
      const updatedMessages = [...messages, { ...userMessage, index: messages.length }];
      setMessages(updatedMessages);
      setInput('');

      // 4. Chama o ChatGPT
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      const assistantMessage = {
        role: 'assistant',
        content: data.response,
      };

      // 5. Salva a resposta no banco
      await fetch(`/api/chats/${chatId}`, {
        method: 'POST',
        body: JSON.stringify(assistantMessage),
      });

      // 6. Atualiza localmente
      setMessages((prev) => [...prev, { ...assistantMessage, index: prev.length }]);
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      setError('Erro ao enviar mensagem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded ${
              msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-200 text-left'
            }`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="text-gray-500 italic text-sm mt-2">Pensando...</div>
        )}

        {error && (
          <div className="text-red-500 mt-2 text-sm">{error}</div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleSend}
          disabled={loading}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
