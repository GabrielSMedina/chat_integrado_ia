import { describe, it, expect, vi } from 'vitest';

async function getMessagesHandler(req, res) {
  if (!req.session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return res.status(200).json({ messages: [] });
}

describe('getMessagesHandler', () => {
  it('deve retornar 401 se o usuário não estiver logado', async () => {
    const req = { session: null };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await getMessagesHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });
});
