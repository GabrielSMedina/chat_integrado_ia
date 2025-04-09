'use client';

import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <div>
      <h1>Faça login para continuar</h1>
      <button onClick={() => signIn('google')}>
        <img src="/google-logo.png" alt="Google Logo" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
        Entrar com Google
      </button>
    </div>
  );
}