import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LuPlus, LuListFilter } from 'react-icons/lu';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { ViewTaskModal } from '../components/ViewTaskModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { useSocket } from '../context/SocketContext';
import api from '../api/client';
import type { Task, Priority, Status } from '../types/task';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
  // --- STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Filters
  const [filterStatus, setFilterStatus] = useState<Status | ''>('');
  const [filterPriority, setFilterPriority] = useState<Priority | ''>('');

  const queryClient = useQueryClient();
  const { socket } = useSocket();

  // --- REAL-TIME LISTENER ---
  useEffect(() => {
    if (!socket) return;

    // Listen for Task Updates (Create/Update/Delete)
    const handleTaskUpdate = () => {
      // Force React Query to re-fetch tasks immediately
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    };

    socket.on('task_updated', handleTaskUpdate);

    // Cleanup
    return () => {
      socket.off('task_updated', handleTaskUpdate);
    };
  }, [socket, queryClient]);

  // --- QUERIES ---
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', filterStatus, filterPriority],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (filterPriority) params.append('priority', filterPriority);
      const { data } = await api.get(`/tasks?${params.toString()}`);
      return data as Task[];
    },
  });

  // --- MUTATIONS ---
  const createMutation = useMutation({
    mutationFn: (newTask: Partial<Task>) => api.post('/tasks', newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully');
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<Task> & { id: string }) => 
      api.patch(`/tasks/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated successfully');
      setIsModalOpen(false);
      setEditingTask(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted');
    },
  });

  // --- HANDLERS ---
  const handleCreateTask = async (data: Partial<Task>) => {
    await createMutation.mutateAsync(data);
  };

  const handleUpdateTask = async (data: Partial<Task>) => {
    if (editingTask) {
      await updateMutation.mutateAsync({ ...data, id: editingTask.id });
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingTask) {
      deleteMutation.mutate(deletingTask.id);
      setDeletingTask(null); 
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Task Board</h1>
            <p className="text-slate-500">Manage your projects and track progress.</p>
          </div>
          
          <button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-medium"
          >
            <LuPlus size={20} />
            New Task
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm items-center">
          <div className="flex items-center gap-2 text-slate-500 mr-2">
            <LuListFilter />
            <span className="font-medium text-sm">Filters:</span>
          </div>
          
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Status | '')}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select 
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as Priority | '')}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        {/* Task Grid */}
        {isLoading ? (
          <div className="text-center py-20 text-slate-400">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500 mb-2">No tasks found.</p>
            <p className="text-sm text-slate-400">Try adjusting filters or create a new task.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(t) => {
                  setEditingTask(t);
                  setIsModalOpen(true);
                }}
                onDelete={(t) => setDeletingTask(t)} 
                onView={(t) => setViewingTask(t)}    
              />
            ))}
          </div>
        )}

        {/* --- MODALS --- */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          initialData={editingTask}
        />

        <ViewTaskModal
          isOpen={!!viewingTask}
          onClose={() => setViewingTask(null)}
          task={viewingTask}
        />

        <ConfirmDialog 
          isOpen={!!deletingTask}
          onClose={() => setDeletingTask(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Task"
          message={`Are you sure you want to delete "${deletingTask?.title}"? This action cannot be undone.`}
          confirmText="Delete Task"
          isDestructive={true}
        />

      </div>
    </DashboardLayout>
  );
}