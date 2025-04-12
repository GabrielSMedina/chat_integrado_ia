import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(req, props) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { message } = await req.json();
  const chatId = params.chatId;

  const userMsgCount = await prisma.message.count({ where: { chatId } });

  await prisma.message.create({
    data: {
      role: "user",
      content: message,
      chatId,
      index: userMsgCount,
    },
  });

  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { index: "asc" },
  });

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4omini",
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    }),
  });

  const data = await response.json();
  const aiMessage = data.choices?.[0]?.message?.content ?? "Erro ao gerar resposta.";

  const aiMsgCount = await prisma.message.count({ where: { chatId } });

  const assistantMessage = await prisma.message.create({
    data: {
      role: "assistant",
      content: aiMessage,
      chatId,
      index: aiMsgCount,
    },
  });

  return Response.json(assistantMessage);
}