import { createSession, validateSession, deleteSession, cleanupExpiredSessions } from '@/lib/session';

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-token'),
}));

// Mock the prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    session: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('session utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSession', () => {
    it('should create a session with UUID token and 24h expiry', async () => {
      const userId = 'user-123';
      const mockSession = {
        id: 'uuid-session-id',
        userId,
        token: 'mock-uuid-token',
        expiresAt: expect.any(Date),
        createdAt: expect.any(Date),
      };

      (mockPrisma.session.create as jest.Mock).mockResolvedValue(mockSession);

      const token = await createSession(userId);

      expect(mockPrisma.session.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId,
          token: 'mock-uuid-token',
          expiresAt: expect.any(Date),
        }),
      });
      expect(token).toBe('mock-uuid-token');
    });

    it('should set expiry to 24 hours from now', async () => {
      const userId = 'user-123';
      const beforeCreate = Date.now();

      (mockPrisma.session.create as jest.Mock).mockImplementation(async ({ data }) => ({
        id: 'uuid-session-id',
        userId,
        token: data.token,
        expiresAt: data.expiresAt,
        createdAt: new Date(),
      }));

      await createSession(userId);

      const createCall = (mockPrisma.session.create as jest.Mock).mock.calls[0][0];
      const expiryTime = createCall.data.expiresAt.getTime();
      const expectedExpiry = beforeCreate + 24 * 60 * 60 * 1000;
      
      // Allow 5 second tolerance for test execution time
      expect(Math.abs(expiryTime - expectedExpiry)).toBeLessThan(5000);
    });
  });

  describe('validateSession', () => {
    it('should return userId for valid unexpired session', async () => {
      const token = 'valid-token';
      const userId = 'user-123';
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

      (mockPrisma.session.findUnique as jest.Mock).mockResolvedValue({
        id: 'session-id',
        userId,
        token,
        expiresAt: futureDate,
        createdAt: new Date(),
      });

      const result = await validateSession(token);

      expect(result).toBe(userId);
      expect(mockPrisma.session.findUnique).toHaveBeenCalledWith({
        where: { token },
      });
    });

    it('should return null for missing token', async () => {
      const result = await validateSession('');

      expect(result).toBeNull();
      expect(mockPrisma.session.findUnique).not.toHaveBeenCalled();
    });

    it('should return null for non-existent token', async () => {
      (mockPrisma.session.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await validateSession('non-existent-token');

      expect(result).toBeNull();
    });

    it('should return null for expired session', async () => {
      const token = 'expired-token';
      const pastDate = new Date(Date.now() - 1000);

      (mockPrisma.session.findUnique as jest.Mock).mockResolvedValue({
        id: 'session-id',
        userId: 'user-123',
        token,
        expiresAt: pastDate,
        createdAt: new Date(),
      });

      const result = await validateSession(token);

      expect(result).toBeNull();
    });
  });

  describe('deleteSession', () => {
    it('should delete session from DB', async () => {
      const token = 'token-to-delete';

      (mockPrisma.session.delete as jest.Mock).mockResolvedValue({} as any);

      await deleteSession(token);

      expect(mockPrisma.session.delete).toHaveBeenCalledWith({
        where: { token },
      });
    });

    it('should not throw if session does not exist', async () => {
      const token = 'non-existent-token';

      (mockPrisma.session.delete as jest.Mock).mockRejectedValue(
        new Error('Session not found')
      );

      await expect(deleteSession(token)).resolves.not.toThrow();
    });
  });

  describe('cleanupExpiredSessions', () => {
    it('should delete all expired sessions and return count', async () => {
      const deletedCount = 5;

      (mockPrisma.session.deleteMany as jest.Mock).mockResolvedValue({
        count: deletedCount,
      });

      const result = await cleanupExpiredSessions();

      expect(result).toBe(deletedCount);
      expect(mockPrisma.session.deleteMany).toHaveBeenCalledWith({
        where: {
          expiresAt: {
            lt: expect.any(Date),
          },
        },
      });
    });

    it('should return 0 when no expired sessions exist', async () => {
      (mockPrisma.session.deleteMany as jest.Mock).mockResolvedValue({ count: 0 });

      const result = await cleanupExpiredSessions();

      expect(result).toBe(0);
    });
  });
});
