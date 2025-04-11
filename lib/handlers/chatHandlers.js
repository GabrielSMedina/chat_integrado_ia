import { prisma } from "@/lib/prisma";

export async function createChat(session, title) {
  const user = await prisma.user.upsert({
    where: { email: session.user.email },
    update: {},
    create: {
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
    },
  });

  return prisma.chat.create({
    data: {
      title,
      userId: user.id,
    },
  });
}

export async function getChats(session) {
  return prisma.chat.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteChat(chatId) {
  await prisma.message.deleteMany({ where: { chatId } });
  return prisma.chat.delete({ where: { id: chatId } });
}