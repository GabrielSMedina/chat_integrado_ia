import { vi } from 'vitest';

export default {
  user: {
    upsert: vi.fn(),
    findUnique: vi.fn(),
  },
  chat: {
    create: vi.fn(),
    findMany: vi.fn(),
  },
};
