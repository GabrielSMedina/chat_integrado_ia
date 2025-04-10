import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { title } = await req.json();

  try {
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {},
      create: {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      },
    });

    const newChat = await prisma.chat.create({
      data: {
        title,
        userId: user.id,
      },
    });

    return Response.json(newChat);
  } catch (err) {
    console.error("Erro ao criar chat:", err);
    return new Response("Erro interno", { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const chats = await prisma.chat.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(chats);
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('id') || searchParams.get('chatId');

    if (!chatId) {
      return new Response("ID do chat não fornecido", { status: 400 });
    }

    await prisma.message.deleteMany({
      where: { chatId: chatId },
    });

    const deletedChat = await prisma.chat.delete({
      where: { id: chatId },
    });

    return Response.json(deletedChat);
  } catch (err) {
    console.error("Erro ao deletar chat:", err);
    return new Response("Erro interno", { status: 500 });
  }
}