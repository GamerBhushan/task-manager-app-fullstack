import { ModalWrapper } from './ui/ModalWrapper';
import type { Task } from '../types/task';
import { LuCalendar, LuUser, LuClock,  } from 'react-icons/lu';
import { format } from 'date-fns';
import { getPriorityColor, getStatusColor } from '../types/task';

interface ViewTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewTaskModal = ({ task, isOpen, onClose }: ViewTaskModalProps) => {
  if (!task) return null;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Task Details" maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>
              {task.priority} Priority
            </span>
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${getStatusColor(task.status)}`}>
              {task.status.replace('_', ' ')}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 break-words leading-tight">
            {task.title}
          </h3>
        </div>

        <div className="h-px bg-slate-100" />

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm text-slate-500">
              <LuCalendar size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase">Due Date</p>
              <p className="text-sm font-semibold text-slate-700">
                {task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : 'No Deadline'}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm text-slate-500">
              <LuUser size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase">Assigned To</p>
              <p className="text-sm font-semibold text-slate-700">
                {task.assignedTo?.name || 'Unassigned'}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
            Description
          </h4>
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 min-h-[120px] text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
            {task.description || "No description provided."}
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center gap-2 text-xs text-slate-400 pt-4 border-t border-slate-100">
          <LuClock size={12} />
          <span>Created on {format(new Date(task.createdAt), 'MMM d, yyyy')} by {task.creator?.name || 'Unknown'}</span>
        </div>
      </div>
    </ModalWrapper>
  );
};