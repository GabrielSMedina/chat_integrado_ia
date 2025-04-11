import { describe, it, expect, vi } from 'vitest';
import * as openaiHandlers from '../lib/handlers/openaiHandlers';

const mockStream = new ReadableStream({
  start(controller) {
    controller.enqueue(new TextEncoder().encode('resposta mockada'));
    controller.close();
  }
});

vi.mock('../lib/handlers/openaiHandlers', () => ({
  generateStreamingCompletion: vi.fn(() => Promise.resolve(mockStream))
}));

describe('generateStreamingCompletion', () => {
  it('deve retornar uma resposta simulada', async () => {
    const messages = [{ role: 'user', content: 'Olá!' }];
    const stream = await openaiHandlers.generateStreamingCompletion(messages);

    expect(stream).toBeInstanceOf(ReadableStream);
    expect(openaiHandlers.generateStreamingCompletion).toHaveBeenCalledWith(messages);
  });
});
