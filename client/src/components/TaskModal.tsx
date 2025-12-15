import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { LuTriangle, LuCalendar, LuUser, LuAlignLeft, LuFlag, LuListTodo } from 'react-icons/lu';
import type { Task } from '../types/task';
import { toast } from 'react-hot-toast';
import api from '../api/client';
import { ModalWrapper } from './ui/ModalWrapper';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Task>) => Promise<void>;
  initialData?: Task | null;
}

const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(100, 'Title limit is 100 chars'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().optional(),
  assignedToId: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

const fetchUsers = async () => {
  const { data } = await api.get('/users');
  return data as { id: string; name: string; email: string }[];
};

export const TaskModal = ({ isOpen, onClose, onSubmit, initialData }: TaskModalProps) => {
  // FIX: Removed 'enabled: isOpen' so it fetches users immediately in background.
  // Added staleTime so it doesn't refetch constantly.
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const formattedDate = initialData.dueDate 
          ? new Date(initialData.dueDate).toISOString().split('T')[0] 
          : '';

        reset({
          title: initialData.title,
          description: initialData.description || '',
          status: initialData.status,
          priority: initialData.priority,
          dueDate: formattedDate,
          // Ensure we default to empty string if null, so the select picks "Unassigned" correctly
          assignedToId: initialData.assignedToId || '', 
        });
      } else {
        reset({
          title: '',
          description: '',
          status: 'TODO',
          priority: 'LOW',
          dueDate: '',
          assignedToId: '',
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const onFormSubmit = async (data: TaskFormData) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save task.");
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none text-slate-700 placeholder:text-slate-400 font-medium";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1";

  return (
    <ModalWrapper 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Task' : 'Create New Task'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        
        {/* Title */}
        <div>
          <label className={labelClass}>Task Title <span className="text-red-500">*</span></label>
          <div className="relative">
            <input
              {...register('title')}
              placeholder="e.g., Q3 Financial Report"
              className={inputClass}
            />
          </div>
          {errors.title && (
            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-bold">
              <LuTriangle size={12} /> {errors.title.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Priority */}
          <div>
            <label className={labelClass}><span className="flex items-center gap-1"><LuFlag size={12}/> Priority</span></label>
            <div className="relative">
              <select {...register('priority')} className={`${inputClass} appearance-none`}>
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className={labelClass}><span className="flex items-center gap-1"><LuListTodo size={12}/> Status</span></label>
            <div className="relative">
              <select {...register('status')} className={`${inputClass} appearance-none`}>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          {/* Assign To */}
          <div>
            <label className={labelClass}><span className="flex items-center gap-1"><LuUser size={12}/> Assignee</span></label>
            <div className="relative">
              <select {...register('assignedToId')} className={`${inputClass} appearance-none`}>
                <option value="">Unassigned</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className={labelClass}><span className="flex items-center gap-1"><LuCalendar size={12}/> Due Date</span></label>
            <div className="relative">
              <input
                type="date"
                {...register('dueDate')}
                className={`${inputClass} text-slate-600`}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}><span className="flex items-center gap-1"><LuAlignLeft size={12}/> Description</span></label>
          <textarea
            {...register('description')}
            placeholder="Add details about this task..."
            className={`${inputClass} min-h-[120px] resize-y leading-relaxed`}
          />
        </div>

        {/* Footer Actions */}
        <div className="pt-6 flex gap-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {isSubmitting ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Task')}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};