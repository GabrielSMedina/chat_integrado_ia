import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { createChat, getChats, deleteChat } from "@/lib/handlers/chatHandlers";

export async function POST(req) {
  const session = await getServerSession(authOptions);  // Corrigido para chamar getServerSession com authOptions diretamente
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { title } = await req.json();

  try {
    const newChat = await createChat(session, title);
    return new Response(JSON.stringify(newChat), { status: 200 });
  } catch {
    return new Response("Erro interno", { status: 500 });
  }
}

export async function GET(req) {
  const session = await getServerSession(authOptions);  // Corrigido para chamar getServerSession com authOptions diretamente
  if (!session) return new Response("Unauthorized", { status: 401 });

  try {
    const chats = await getChats(session);
    return new Response(JSON.stringify(chats), { status: 200 });
  } catch {
    return new Response("Erro interno", { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);  // Corrigido para chamar getServerSession com authOptions diretamente
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("id") || searchParams.get("chatId");
  if (!chatId) return new Response("ID do chat não fornecido", { status: 400 });

  try {
    const deleted = await deleteChat(chatId);
    return new Response(JSON.stringify(deleted), { status: 200 });
  } catch {
    return new Response("Erro interno", { status: 500 });
  }
}
