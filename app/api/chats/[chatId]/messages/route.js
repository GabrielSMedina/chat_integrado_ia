import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { role, content } = await req.json();
  const chatId = params.chatId;

  // Conta quantas mensagens já existem para definir o índice da nova
  const count = await prisma.message.count({ where: { chatId } });

  // Salva a mensagem do usuário
  const userMessage = await prisma.message.create({
    data: {
      role,
      content,
      chatId,
      index: count,
    },
  });

  // Busca todas as mensagens anteriores para enviar para a API da OpenAI
  const previousMessages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { index: "asc" },
  });

  // Monta o formato esperado pela OpenAI
  const openaiMessages = previousMessages.map(m => ({
    role: m.role,
    content: m.content,
  }));

  // Adiciona a nova mensagem do usuário
  openaiMessages.push({ role, content });

  // Chamada à API da OpenAI
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: openaiMessages,
    }),
  });

  const data = await response.json();
  const assistantReply = data.choices[0].message.content;

  // Salva a resposta da IA no banco
  const assistantMessage = await prisma.message.create({
    data: {
      role: "assistant",
      content: assistantReply,
      chatId,
      index: count + 1,
    },
  });

  // Retorna ambas mensagens
  return Response.json([userMessage, assistantMessage]);
}

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const messages = await prisma.message.findMany({
    where: { chatId: params.chatId },
    orderBy: { index: "asc" },
  });

  return Response.json(messages);
}
