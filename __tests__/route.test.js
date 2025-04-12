import { describe, it, expect, vi, beforeEach } from "vitest";
import { getChatMessages, saveMessage } from "@/lib/handlers/messageHandlers";

vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      chat: {
        findUnique: vi.fn(),
      },
      message: {
        count: vi.fn(),
        create: vi.fn(),
      },
    },
  };
});

import { prisma } from "@/lib/prisma";

describe("getChatMessages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna mensagens do chat", async () => {
    prisma.chat.findUnique.mockResolvedValueOnce({
      messages: [
        { role: "user", content: "olá" },
        { role: "assistant", content: "oi!" },
      ],
    });

    const result = await getChatMessages("abc123");

    expect(result.messages).toEqual([
      { role: "user", content: "olá" },
      { role: "assistant", content: "oi!" },
    ]);
  });
});

describe("saveMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  

  it("salva e retorna a mensagem", async () => {
    prisma.message.count.mockResolvedValueOnce(0);
    prisma.message.create.mockResolvedValueOnce({
      id: "mock-id",
      chatId: "abc123",
      role: "user",
      content: "mensagem teste",
      createdAt: new Date(),
    });

    const msg = await saveMessage("abc123", "user", "mensagem teste");

    expect(msg).toMatchObject({
      id: "mock-id",
      chatId: "abc123",
      role: "user",
      content: "mensagem teste",
    });
  });
});
