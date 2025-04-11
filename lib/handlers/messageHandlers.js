import { prisma } from "@/lib/prisma";

export async function getChatMessages(chatId) {
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: { messages: true },
  });

  return chat;
}

export async function saveMessage(chatId, role, content) {
  const existingMessages = await prisma.message.count({ where: { chatId } });

  return prisma.message.create({
    data: {
      chatId,
      role,
      content,
      index: existingMessages,
    },
  });
}