import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from 'next/server';


export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const chat = await prisma.chat.findUnique({
    where: { id: params.chatId },
    include: { messages: true },
  });

  if (!chat) {
    return new Response("Chat não encontrado", { status: 404 });
  }

  return Response.json(chat.messages);
}


export async function DELETE(request) {
  const { pathname } = new URL(request.url);
  const chatId = pathname.split('/').pop();

  try {
    // Primeiro, deletar as mensagens vinculadas
    await prisma.message.deleteMany({
      where: { chatId },
    });

    // Agora sim pode deletar o chat
    await prisma.chat.delete({
      where: { id: chatId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar chat:', error);
    return NextResponse.json({ error: 'Erro interno ao deletar chat.' }, { status: 500 });
  }
}


export async function POST(req, context) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  console.log("➡️ POST /api/chats/[chatId] chamado");

  // Desestruturando o params de context
  const { params } = context;
  const chatId = params.chatId;
  console.log("📎 params.chatId:", chatId);

  let body;
  try {
    body = await req.json();
    console.log("📨 Body recebido:", body);
  } catch (err) {
    console.error("❌ Erro ao fazer parsing do body:", err);
    return new Response("Body inválido", { status: 400 });
  }

  const { role, content } = body;

  if (!role || !content) {
    console.warn("⚠️ Role ou content ausente:", { role, content });
    return new Response("Dados incompletos", { status: 400 });
  }

  try {
    // Conta quantas mensagens já existem neste chat
    const existingMessages = await prisma.message.count({
      where: { chatId },
    });
    console.log("📊 Total de mensagens anteriores:", existingMessages);

    // Cria a nova mensagem
    const message = await prisma.message.create({
      data: {
        chatId,
        role,
        content,
        index: existingMessages, // define a ordem
      },
    });

    console.log("✅ Mensagem salva:", message);
    return new Response(JSON.stringify(message), { status: 200 });
  } catch (err) {
    console.error("❌ Erro ao salvar mensagem:", err);
    return new Response("Erro ao salvar mensagem", { status: 500 });
  }
}

