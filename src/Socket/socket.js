import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_API_URL;
export const socket = io(URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

socket.on('connect_error', (err) => console.error('Socket connect error', err));
socket.on('reconnect_attempt', (attempt) => console.log('Socket reconnect attempt', attempt));

export default socket;
