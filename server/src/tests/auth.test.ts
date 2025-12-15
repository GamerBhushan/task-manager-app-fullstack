import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// FIX: Add <any> generic to jest.fn() so it accepts return values
const mockFindUnique = jest.fn<any>();
const mockCreate = jest.fn<any>();
const mockUpdate = jest.fn<any>();
const mockCompare = jest.fn<any>();
const mockHash = jest.fn<any>();
const mockSign = jest.fn<any>(() => 'mock-token');

// Mock Prisma
jest.unstable_mockModule('../lib/prisma.js', () => ({
  default: {
    user: {
      findUnique: mockFindUnique,
      create: mockCreate,
      update: mockUpdate,
    },
  },
}));

// Mock Bcrypt
jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    compare: mockCompare,
    hash: mockHash,
  },
}));

// Mock JWT
jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    sign: mockSign,
  },
}));

// Import Service DYNAMICALLY (after mocks are defined)
const { AuthService } = await import('../services/auth.service.js');

describe('AuthService', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Successful Login
  it('should return user and token on valid login', async () => {
    // Setup Mock Returns
    mockFindUnique.mockResolvedValue({
      id: '1',
      email: 'test@test.com',
      password: 'hashedpassword',
      name: 'Test User'
    });
    mockCompare.mockResolvedValue(true);

    const result: any = await AuthService.login({ email: 'test@test.com', password: 'password' });
    
    expect(result).toHaveProperty('token');
    expect(result.user.email).toBe('test@test.com');
    expect(mockFindUnique).toHaveBeenCalledTimes(1);
  });

  // Test 2: Invalid Password
  it('should throw error on invalid password', async () => {
    mockFindUnique.mockResolvedValue({
      id: '1',
      email: 'test@test.com',
      password: 'hashedpassword',
    });
    mockCompare.mockResolvedValue(false); // Password mismatch

    await expect(AuthService.login({ email: 'test@test.com', password: 'wrong' }))
      .rejects.toThrow('Invalid credentials');
  });

  // Test 3: User Not Found
  it('should throw error if user does not exist', async () => {
    mockFindUnique.mockResolvedValue(null); // User not found

    await expect(AuthService.login({ email: 'notfound@test.com', password: 'password' }))
      .rejects.toThrow('Invalid credentials');
  });
});