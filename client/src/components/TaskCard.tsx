import type { Task } from '../types/task';
import { LuCalendar, LuPencil, LuTrash2, LuEye, LuUser } from 'react-icons/lu';
import { format } from 'date-fns';
import { getPriorityColor, getStatusColor } from '../types/task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onView: (task: Task) => void;
}

export const TaskCard = ({ task, onEdit, onDelete, onView }: TaskCardProps) => {
  return (
    <div className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out relative overflow-hidden flex flex-col h-full">
      
      {/* Priority Line */}
      <div className={`absolute top-0 left-0 w-full h-1 ${
        task.priority === 'HIGH' ? 'bg-red-500' : task.priority === 'MEDIUM' ? 'bg-amber-400' : 'bg-blue-400'
      }`}></div>

      {/* Header */}
      <div className="flex justify-between items-start mb-3 mt-1">
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wide ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        
        {/* Actions */}
        <div className="flex gap-1">
          <button onClick={() => onView(task)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
            <LuEye size={16} />
          </button>
          <button onClick={() => onEdit(task)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
            <LuPencil size={16} />
          </button>
          <button onClick={() => onDelete(task)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
            <LuTrash2 size={16} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 onClick={() => onView(task)} className="font-bold text-slate-800 text-lg mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors cursor-pointer">
        {task.title}
      </h3>
      
      {/* Description */}
      <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-grow">
        {task.description || "No description provided."}
      </p>

      {/* Footer Info */}
      <div className="mt-auto space-y-3 pt-3 border-t border-slate-100">
        
        {/* FIX: Show Assignee Name */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <LuUser size={14} className="text-slate-400" />
          {task.assignedTo ? (
            <span className="font-medium text-slate-700">{task.assignedTo.name}</span>
          ) : (
            <span className="text-slate-400 italic">Unassigned</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase border ${getStatusColor(task.status)}`}>
            {task.status.replace('_', ' ')}
          </div>

          {task.dueDate && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
              <LuCalendar className="text-slate-400" size={14} />
              {format(new Date(task.dueDate), 'MMM d')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};