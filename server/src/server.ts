import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import router from './routes.js';
import prisma from './lib/prisma.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// 1. Configure Socket.IO with CORS
export const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Allow Frontend
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
  }
});

// 2. Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));
app.use(express.json());

// 3. Socket Connection Logging (For Debugging)
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// 4. Routes
app.use('/api', router);

// 5. Start
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});