import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// 1. Define Mocks
const mockCreate = jest.fn<any>();
const mockEmit = jest.fn<any>();

// 2. Mock Modules (ESM Style)
// We mock prisma.task.create
jest.unstable_mockModule('../lib/prisma.js', () => ({
  default: {
    task: {
      create: mockCreate,
    },
  },
}));

// We mock io.emit from server.js
jest.unstable_mockModule('../server.js', () => ({
  io: {
    emit: mockEmit,
  },
}));

// 3. Import Controller DYNAMICALLY (After mocks are defined)
const { createTask } = await import('../controllers/task.controller.js');

describe('Task Controller - Create Task', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        title: 'Test Task',
        priority: 'HIGH',
        status: 'TODO',
        dueDate: '2023-12-31',
      },
      user: { id: 'user-123' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // Test 1: Successful Creation
  it('should create a task successfully', async () => {
    // Setup Mock Return
    const mockTask = { ...req.body, id: 'task-1', creatorId: 'user-123' };
    mockCreate.mockResolvedValue(mockTask);

    await createTask(req, res);

    // Verify DB call
    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        title: 'Test Task',
        creatorId: 'user-123'
      })
    }));

    // Verify Socket Emit
    expect(mockEmit).toHaveBeenCalledWith('task_updated', { type: 'CREATE', task: mockTask });

    // Verify Response
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockTask);
  });

// Test 2: Date Bug Fix (Empty String)
  it('should handle empty string dueDate by converting to undefined', async () => {
    req.body.dueDate = ''; 
    mockCreate.mockResolvedValue({ ...req.body, id: 'task-1' });

    await createTask(req, res);

    // Get the arguments passed to prisma.create
    const calls = mockCreate.mock.calls;
    
    // FIX: Add '!' after calls[0] to tell TypeScript it's not undefined
    const args = calls[0]![0] as any;

    // Verify dueDate was converted to undefined
    expect(args.data.dueDate).toBeUndefined();
  });;

  // Test 3: Error Handling
  it('should return 400 if database fails', async () => {
    mockCreate.mockRejectedValue(new Error('DB Error'));

    await createTask(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create task' });
  });
});