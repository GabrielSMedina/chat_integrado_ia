import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createChat, getChats, deleteChat } from "@/lib/handlers/chatHandlers";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { title } = await req.json();

  try {
    const newChat = await createChat(session, title);
    return Response.json(newChat);
  } catch {
    return new Response("Erro interno", { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  try {
    const chats = await getChats(session);
    return Response.json(chats);
  } catch {
    return new Response("Erro interno", { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("id") || searchParams.get("chatId");
  if (!chatId) return new Response("ID do chat não fornecido", { status: 400 });

  try {
    const deleted = await deleteChat(chatId);
    return Response.json(deleted);
  } catch {
    return new Response("Erro interno", { status: 500 });
  }
}