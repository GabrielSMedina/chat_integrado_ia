import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as messageHandlers from '@/lib/handlers/messageHandlers';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    chat: {
      findUnique: vi.fn(),
    },
    message: {
      count: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe('messageHandlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getChatMessages deve retornar o chat com mensagens', async () => {
    prisma.chat.findUnique.mockResolvedValue({ id: 'chat1', messages: [] });

    const result = await messageHandlers.getChatMessages('chat1');
    expect(result.id).toBe('chat1');
  });

  it('saveMessage deve criar uma nova mensagem com índice correto', async () => {
    prisma.message.count.mockResolvedValue(2);
    prisma.message.create.mockResolvedValue({
      id: 'msg-id',
      content: 'Mensagem Teste',
      role: 'user',
      index: 2,
    });

    const result = await messageHandlers.saveMessage('chat-id', 'Mensagem Teste', 'user');
    expect(result.index).toBe(2);
  });
});
