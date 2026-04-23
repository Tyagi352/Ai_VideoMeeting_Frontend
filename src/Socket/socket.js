import { io } from 'socket.io-client';

const URL = "https://ai-video-meeting-backend-1jo9.vercel.app";
export const socket = io(URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

socket.on('connect_error', (err) => console.error('Socket connect error', err));
socket.on('reconnect_attempt', (attempt) => console.log('Socket reconnect attempt', attempt));

export default socket;
