import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getChatMessages, saveMessage } from "@/lib/handlers/messageHandlers";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { params } = context;
  const { chatId } = await params; // Aguarda a resolução de 'params'
  if (!chatId) return new Response("Parâmetro chatId não encontrado", { status: 400 });

  try {
    const chat = await getChatMessages(chatId);
    if (!chat) return new Response("Chat não encontrado", { status: 404 });

    return NextResponse.json(chat.messages);
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return new Response("Erro ao buscar chat", { status: 500 });
  }
}


export async function POST(request, context) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { params } = context;
  const { chatId } = await params; // Aguarda a resolução de 'params'
  if (!chatId) return new Response("Parâmetro chatId não encontrado", { status: 400 });

  const { role, content } = await request.json();
  if (!role || !content) {
    return new Response("Dados incompletos", { status: 400 });
  }

  try {
    const message = await saveMessage(chatId, role, content);
    return NextResponse.json(message);
  } catch (error) {
    console.error("Erro ao salvar mensagem:", error);
    return new Response("Erro ao salvar mensagem", { status: 500 });
  }
}
