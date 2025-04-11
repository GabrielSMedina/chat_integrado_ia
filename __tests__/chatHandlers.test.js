import { describe, it, expect, vi, beforeEach } from "vitest";
import { createChat, getChats } from "../lib/handlers/chatHandlers";

vi.mock("../lib/prisma", () => {
  return {
    prisma: {
      user: {
        upsert: vi.fn().mockResolvedValue({ id: 1, email: "test@example.com" }),
      },
      chat: {
        create: vi.fn().mockResolvedValue({ id: 1, title: "Novo Chat" }),
        findMany: vi.fn().mockResolvedValue([
          { id: 1, title: "Chat 1", createdAt: new Date() },
          { id: 2, title: "Chat 2", createdAt: new Date() },
        ]),
      },
    },
  };
});

describe("chatHandlers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("cria um novo chat corretamente", async () => {
    const session = {
      user: {
        email: "test@example.com",
      },
    };

    const result = await createChat(session, "Novo Chat");

    expect(result).toEqual({ id: 1, title: "Novo Chat" });
  });

  it("retorna os chats do usuário", async () => {
    const session = {
      user: {
        email: "test@example.com",
      },
    };

    const result = await getChats(session);

    expect(result).toEqual([
      { id: 1, title: "Chat 1", createdAt: expect.any(Date) },
      { id: 2, title: "Chat 2", createdAt: expect.any(Date) },
    ]);
  });
});
