'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export const useChatList = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [state, setState] = useState({
    chats: [],
    loading: true,
    error: null,
    chatToDelete: null
  });

  useEffect(() => {
    if (status === 'authenticated') {
      fetchChats();
    }
  }, [status]);

  const fetchChats = async () => {
    try {
      const res = await fetch('/api/chats');
      if (!res.ok) throw new Error('Failed to fetch chats');
      const data = await res.json();
      setState(prev => ({ ...prev, chats: data, loading: false }));
    } catch (err) {
      setState(prev => ({ ...prev, error: err.message, loading: false }));
    }
  };

  const handleCreateChat = async () => {
    try {
      const now = new Date();
      const title = `Chat ${now.toLocaleString()}`;
      
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      if (res.ok) {
        const newChat = await res.json();
        router.push(`/chats/${newChat.id}`);
      }
    } catch (err) {
      setState(prev => ({ ...prev, error: err.message }));
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      const res = await fetch(`/api/chats?id=${chatId}`, {
        method: 'DELETE',
      });
    
      if (res.ok) {
        setState(prev => ({
          ...prev,
          chats: prev.chats.filter(chat => chat.id !== chatId),
          chatToDelete: null
        }));
      }
    } catch (err) {
      setState(prev => ({ ...prev, error: err.message }));
    }
  };

  return {
    ...state,
    session,
    handleCreateChat,
    handleDeleteChat,
    setChatToDelete: (chatId) => setState(prev => ({ ...prev, chatToDelete: chatId })),
    signOut: () => signOut({ callbackUrl: '/login' })
  };
};