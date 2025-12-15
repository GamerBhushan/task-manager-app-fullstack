export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type Status = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  
  dueDate?: string | Date | null; 
  
  createdAt: string;
  
  // Relations
  creatorId: string;
  // FIX: Added the creator object definition
  creator?: {
    id: string;
    name: string;
  };

  assignedToId?: string | null; 
  assignedTo?: {
    id: string;
    name: string;
    email?: string;
  };
}

// Keep your existing helper functions below...
export const getPriorityColor = (p: Priority) => {
  switch (p) {
    case 'HIGH': return 'text-red-600 bg-red-50 border-red-200';
    case 'MEDIUM': return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'LOW': return 'text-blue-600 bg-blue-50 border-blue-200';
    default: return 'text-gray-600 bg-gray-50';
  }
};

export const getStatusColor = (s: Status) => {
  switch (s) {
    case 'COMPLETED': return 'text-green-600 bg-green-50 border-green-200';
    case 'IN_PROGRESS': return 'text-purple-600 bg-purple-50 border-purple-200';
    default: return 'text-slate-600 bg-slate-100 border-slate-200';
  }
};