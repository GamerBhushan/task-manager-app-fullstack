import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LuBell } from 'react-icons/lu';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
// FIX: Using the correct path as requested
import api from '../api/client';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  userId: string;
}

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  // Fetch Notifications
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await api.get('/notifications');
      return data as Notification[];
    },
    refetchInterval: false 
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Mark as Read Mutation
  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  // Real-time Listener
  useEffect(() => {
    if (!socket || !user) return;

    const handleNotification = (newNotif: Notification) => {
      if (newNotif.userId === user.id) {
        toast('New Notification', { icon: '🔔' });
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }
    };

    socket.on('notification', handleNotification);
    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket, user, queryClient]);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
      >
        <LuBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border border-white"></span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-20 overflow-hidden">
            <div className="p-3 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-slate-700 text-sm">Notifications</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="p-4 text-center text-sm text-slate-400">No notifications</p>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    onClick={() => {
                      if (!notif.isRead) markReadMutation.mutate(notif.id);
                    }}
                    className={`p-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${!notif.isRead ? 'bg-indigo-50/50' : ''}`}
                  >
                    <p className={`text-sm ${!notif.isRead ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                      {notif.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};