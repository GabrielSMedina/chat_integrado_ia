"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div className="flex h-screen justify-center items-center">Carregando...</div>;
  }

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-6">Bem-vindo ao ChatGPT App</h1>
      <p className="text-lg text-gray-700 mb-10">
        Um app simples para conversar com a IA.
      </p>

      {session ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-md">
            Você está logado como <strong>{session.user?.name}</strong>
          </p>

          <div className="flex gap-4">
            <Link
              href="/chats"
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Ir para seus chats
            </Link>

            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => signIn()}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Fazer login com Google
        </button>
      )}
    </main>
  );
}
