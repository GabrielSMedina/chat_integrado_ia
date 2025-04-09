"use client";

import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      redirect("/chats");
    }
  }, [status]);

  if (status === "loading") return <p>Carregando...</p>;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl mb-4">Entrar</h1>
      <button
        onClick={() => signIn("google")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Entrar com Google
      </button>
    </div>
  );
}
