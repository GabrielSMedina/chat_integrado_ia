import { describe, test, expect, vi } from 'vitest';

vi.mock('openai', () => {
  return {
    OpenAI: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [{ message: { content: 'resposta mockada' } }]
          })
        }
      }
    }))
  };
});

import { generateStreamingCompletion } from '@/lib/handlers/openaiHandlers';

describe('openaiHandlers', () => {
  test('generateStreamingCompletion retorna resposta mockada', async () => {
    const messages = [{ role: 'user', content: 'Olá' }];
    const result = await generateStreamingCompletion(messages);

    expect(result).toBeDefined();
  });
});
