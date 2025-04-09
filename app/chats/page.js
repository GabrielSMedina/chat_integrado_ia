"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ChatsPage() {
  const { data: session, status } = useSession();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatToDelete, setChatToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/chats")
        .then((res) => res.json())
        .then((data) => {
          setChats(data);
          setLoading(false);
        });
    }
  }, [status]);

  const handleCreateChat = async () => {
    const now = new Date();
    const title = `Chat criado em ${now.toLocaleDateString()} às ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

    const res = await fetch("/api/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (res.ok) {
      const newChat = await res.json();
      router.push(`/chats/${newChat.id}`);
    }
  };

  const confirmDelete = (chatId) => {
    setChatToDelete(chatId);
  };

  const handleConfirmDelete = async () => {
    if (!chatToDelete) return;

    const res = await fetch(`/api/chats/${chatToDelete}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setChats(chats.filter((chat) => chat.id !== chatToDelete));
    }

    setChatToDelete(null);
  };

  if (status === "loading" || loading) return <p>Carregando...</p>;
  if (status === "unauthenticated") return <p>Não autenticado.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto relative min-h-screen">
      {/* Usuário no canto superior direito */}
      <div className="absolute top-6 right-6 flex items-center gap-4">
        <img
          src={session.user.image}
          alt="User"
          className="w-10 h-10 rounded-full border border-gray-300"
        />
        <div className="text-right">
          <p className="font-medium text-sm">{session.user.name}</p>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="mt-1 px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Título e botão */}
      <h1 className="text-3xl font-bold mb-4">Seus Chats</h1>
      <div className="mb-6">
        <button
          onClick={handleCreateChat}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Criar novo chat
        </button>
      </div>

      {/* Lista de chats */}
      {chats.length === 0 ? (
        <p className="text-gray-500">Nenhum chat encontrado.</p>
      ) : (
        <ul className="space-y-3">
          {chats.map((chat) => (
            <li
              key={chat.id}
              className="flex items-center justify-between border p-4 rounded shadow-sm hover:bg-gray-50 transition"
            >
              <div
                className="flex-1 cursor-pointer hover:underline"
                onClick={() => router.push(`/chats/${chat.id}`)}
              >
                {chat.title || "Sem título"}
              </div>
              <button
                onClick={() => confirmDelete(chat.id)}
                className="ml-4 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Modal de confirmação */}
      {chatToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <p className="mb-4">Tem certeza que deseja excluir este chat?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setChatToDelete(null)}
                className="px-4 py-1 rounded border hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
