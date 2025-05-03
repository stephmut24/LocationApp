import http from 'http';
import { Server } from 'socket.io';

export function initSocket(app) {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET','POST'],
      credentials: true
    }
  });
  io.on('connection', socket => {
    console.log('⚡️ Socket connecté:', socket.id);
    socket.on('disconnect', () => {
      console.log('🔌 Socket déconnecté:', socket.id);
    });
  });
  return { server, io };
}
