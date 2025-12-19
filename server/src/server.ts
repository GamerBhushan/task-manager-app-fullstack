import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import router from './routes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// 1. READ & PARSE THE URLS
const rawClientUrl = process.env.CLIENT_URL || "";

// This turns "url1,url2" into ["url1", "url2"]
// It also handles single URLs correctly.
const allowedOrigins = rawClientUrl.split(',').map(url => url.trim());

console.log(`🛡️ Allowed Origins:`, allowedOrigins);

// 2. Configure Socket.IO
export const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins, // <--- Pass the Array here
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
  }
});

// 3. Configure Express CORS
app.use(cors({
  origin: allowedOrigins, // <--- Pass the Array here
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

app.get("/", (req, res) => {
  res.send({
    activeStatus: true,
    error: false,
  });
});

// 5. Start
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});