'use client';

import { useSession, signOut, signIn } from 'next-auth/react';
import { useEffect } from 'react';

export default function ChatPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log('Status da sessão:', status);
    if (session) {
      console.log('Informações da sessão:', session);
      // Faça algo com as informações do usuário logado (ex: carregar dados do chat)
    }
  }, [session, status]);

  if (status === 'loading') {
    return <p>Carregando informações da sessão...</p>;
  }

  if (status === 'unauthenticated') {
    return (
      <div>
        <p>Você precisa estar logado para acessar o chat.</p>
        <button onClick={() => signIn('google')}>Entrar com Google</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Bem-vindo ao Chat!</h1>
      {session?.user?.name && <p>Olá, {session.user.name}!</p>}
      {session?.user?.image && <img src={session.user.image} alt="Sua foto de perfil" style={{ borderRadius: '50%' }} />}
      <button onClick={() => signOut()}>Sair</button>
      {/* Conteúdo da sua tela de chat */}
    </div>
  );
}