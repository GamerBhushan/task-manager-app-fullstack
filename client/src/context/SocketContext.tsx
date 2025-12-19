import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth(); 

  useEffect(() => {
    // 1. Only connect if user is logged in
    if (user) {
      const token = localStorage.getItem('token');
      
      // ---------------------------------------------------------
      // FIX: Dynamically determine the URL
      // ---------------------------------------------------------
      
      // A. Get the API URL from the environment (or default to localhost for dev)
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      // B. Strip the "/api" suffix because Socket.io connects to the ROOT domain
      // Example: "https://my-app.com/api" becomes "https://my-app.com"
      const socketUrl = apiUrl.replace('/api', '');

      console.log("🔌 Connecting Socket to:", socketUrl);

      const socketInstance = io(socketUrl, {
        auth: { token }, 
        transports: ['websocket', 'polling'], // Allow polling fallback for better stability
        reconnection: true,
        withCredentials: true, // Important for CORS
      });

      socketInstance.on('connect', () => {
        console.log("🟢 Socket Connected:", socketInstance.id);
        setIsConnected(true);
      });

      socketInstance.on('connect_error', (err) => {
        console.error("🔴 Socket Connection Error:", err.message);
      });

      socketInstance.on('disconnect', () => {
        console.log("🔴 Socket Disconnected");
        setIsConnected(false);
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    } else {
      // 2. If user logs out, close socket
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [user]); 

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};