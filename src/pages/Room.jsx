import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { socket } from '../Socket/socket';
import Peer from 'simple-peer';
import { getUser, sendAudio } from '../api/index.js';
import Toast from '../components/Toast.jsx';
import ControlBar from '../components/MeetingRoom/ControlBar.jsx';
import RecordingIndicator from '../components/MeetingRoom/RecordingIndicator.jsx';
import { FiMic, FiStopCircle, FiDownload, FiVideo } from 'react-icons/fi';

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideosRef = useRef({}); // store multiple remote streams
  const peersRef = useRef({}); // store multiple peers
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const localStreamRef = useRef(null);
  const roomJoinedRef = useRef(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);

  // --- Audio Recording ---
  const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [isGenerating, setIsGenerating] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startRecording = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      setAudioUrl(URL.createObjectURL(audioBlob));
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // --- Video Chat ---
  useEffect(() => {
    const user = getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    let localStream;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        localStream = stream;
        localStreamRef.current = stream;

        // Join and mark
        socket.emit('join-room', roomId, getUser()?.id);
        roomJoinedRef.current = true;

        // Server sends existing sockets in the room
        socket.on('all-users', (users) => {
          users.forEach((u) => {
            if (!u || !u.socketId) return;
            const peer = createPeer(u.socketId, socket.id, localStream);
            peersRef.current[u.socketId] = peer;
          });
        });

        // New user connected (someone joined after we did) — UI notice only
        socket.on('user-connected', (socketId) => {
          console.log('User connected:', socketId);
        });

        // User disconnected
        socket.on('user-disconnected', (socketId) => {
          console.log('User disconnected:', socketId);
          if (peersRef.current[socketId]) {
            try { peersRef.current[socketId].destroy(); } catch (e) {}
            delete peersRef.current[socketId];
          }
          if (remoteVideosRef.current[socketId]) delete remoteVideosRef.current[socketId];
          forceUpdate();
        });

        // Incoming signal
        socket.on('signal', ({ from, signal }) => {
          if (!peersRef.current[from]) {
            const peer = addPeer(signal, from, localStream);
            peersRef.current[from] = peer;
          } else {
            peersRef.current[from].signal(signal);
          }
        });

        // Reconnect handler — rejoin the room if needed
        socket.on('connect', () => {
          console.log('Socket reconnected:', socket.id);
          if (roomJoinedRef.current) {
            socket.emit('join-room', roomId, getUser()?.id);
          }
        });

        socket.on('connect_error', (err) => console.error('Socket connect error', err));
      })
      .catch((err) => console.error('getUserMedia error:', err));

    return () => {
      // Inform others we're leaving
      try { socket.emit('leave-room', roomId, getUser()?.id); } catch (e) {}

      socket.off('all-users');
      socket.off('user-connected');
      socket.off('signal');
      socket.off('user-disconnected');
      socket.off('connect');
      socket.off('connect_error');

      if (localStream) localStream.getTracks().forEach((track) => track.stop());

      Object.keys(peersRef.current).forEach((k) => {
        try { peersRef.current[k].destroy(); } catch (e) {}
        delete peersRef.current[k];
      });

      remoteVideosRef.current = {};
    };
  }, [roomId, navigate]);

  // --- Peer Functions ---
  const createPeer = (userToSignal, callerId, stream) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (signal) => {
      socket.emit('signal', { to: userToSignal, from: callerId, signal });
    });

    peer.on('stream', (remoteStream) => {
      remoteVideosRef.current[userToSignal] = remoteStream;
      forceUpdate(); // refresh UI
    });

    peer.on('close', () => {
      delete remoteVideosRef.current[userToSignal];
      try { delete peersRef.current[userToSignal]; } catch (e) {}
      forceUpdate();
    });

    return peer;
  };

  const addPeer = (incomingSignal, callerId, stream) => {
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (signal) => {
      socket.emit('signal', { to: callerId, from: socket.id, signal });
    });

    peer.on('stream', (remoteStream) => {
      remoteVideosRef.current[callerId] = remoteStream;
      forceUpdate(); // refresh UI
    });

    peer.on('close', () => {
      delete remoteVideosRef.current[callerId];
      try { delete peersRef.current[callerId]; } catch (e) {}
      forceUpdate();
    });

    peer.signal(incomingSignal);
    return peer;
  };

  // --- Force update for remote streams ---
  const [, setTick] = useState(0);
  const forceUpdate = () => setTick((tick) => tick + 1);

  // --- End Call & Send Summary ---
  const endCall = async () => {
    if (mediaRecorderRef.current && isRecording) stopRecording();

    // Leave room so others know
    socket.emit('leave-room', roomId, socket.id);

    setTimeout(async () => {
      if (audioChunksRef.current.length === 0) return;
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'meeting.webm');
      formData.append('roomId', roomId);
      formData.append('participants', JSON.stringify([getUser()?.id]));

      setIsGenerating(true);
      try {
        const response = await sendAudio(formData);
        setAiSummary(response.summary || 'No summary returned');
        setTranscript(response.transcript || '');
        if (response.audioUrl) setAudioUrl(`${BACKEND_URL}${response.audioUrl}`);
        alert('Meeting summary generated!');
        console.log('Summary response:', response);
      } catch (err) {
        console.error('Error sending audio:', err);
        alert('Failed to send audio for summary.');
      } finally {
        setIsGenerating(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#09090B] px-4 pb-32 pt-6 text-zinc-100 sm:px-6 lg:px-8">
      <RecordingIndicator isRecording={isRecording} />
      <header className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 pb-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]" /> Live room</div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Room <span className="text-zinc-500">/</span> {roomId}</h2>
        </div>
        <div className="hidden items-center gap-3 text-sm text-zinc-500 sm:flex"><span>{Object.keys(peersRef.current).length + 1} participant{Object.keys(peersRef.current).length === 0 ? '' : 's'}</span><button onClick={() => { navigator.clipboard.writeText(roomId); setToastMsg('Room ID copied'); }} className="rounded-[12px] border border-white/10 bg-white/[0.04] px-3 py-2 text-zinc-300 hover:bg-white/[0.08]">Copy room ID</button></div>
      </header>

      <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="group relative min-h-[260px] overflow-hidden rounded-[22px] border border-violet-300/30 bg-zinc-900 shadow-[0_18px_60px_rgba(0,0,0,.3)] md:col-span-2 xl:col-span-2">
          <video ref={localVideoRef} autoPlay muted playsInline className="h-full min-h-[260px] w-full bg-black object-cover" />
          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between"><span className="rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">You · {isCamOff ? 'camera off' : 'presenting'}</span><span className="rounded-full bg-violet-400/15 px-2.5 py-1 text-[11px] text-violet-200">Host</span></div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-2 xl:col-span-1 xl:grid-cols-1">
          {Object.keys(remoteVideosRef.current).map((id) => (
            <div key={id} className="relative min-h-[180px] overflow-hidden rounded-[20px] border border-white/10 bg-zinc-900 shadow-[0_12px_40px_rgba(0,0,0,.25)]">
              <video autoPlay playsInline className="h-full min-h-[180px] w-full bg-black object-cover" ref={(el) => el && (el.srcObject = remoteVideosRef.current[id])} />
              <span className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs text-zinc-200 backdrop-blur-md">Participant</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Summary */}
      {isGenerating && (
        <div className="nc-panel mt-4 max-w-3xl p-5">
          <h3 className="font-semibold">Generating summary...</h3>
          <p className="mt-2 text-gray-700">This may take up to a minute.</p>
        </div>
      )}

      {aiSummary && (
        <div className="nc-card mt-4 max-w-3xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2"><FiVideo /> AI Meeting Summary</h3>
              <p className="mt-2 text-gray-700 whitespace-pre-line">{aiSummary}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {audioUrl && (
                <a href={audioUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline flex items-center gap-2"><FiDownload /> Download</a>
              )}
            </div>
          </div>

          {transcript && (
            <details className="mt-3 text-sm text-gray-600">
              <summary className="cursor-pointer">Show transcript</summary>
              <pre className="whitespace-pre-wrap mt-2 text-xs">{transcript}</pre>
            </details>
          )}
        </div>
      )}

      <div className="fixed bottom-24 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-[16px] border border-white/10 bg-[#111113]/90 px-2 py-2 shadow-[0_14px_45px_rgba(0,0,0,.35)] backdrop-blur-xl">
        <button onClick={startRecording} disabled={isRecording || isGenerating} title="Start recording" className="rounded-[11px] p-2.5 text-zinc-400 hover:bg-white/10 hover:text-emerald-300 disabled:opacity-40"><FiMic /></button>
        <button onClick={stopRecording} disabled={!isRecording || isGenerating} title="Stop recording" className="rounded-[11px] p-2.5 text-zinc-400 hover:bg-white/10 hover:text-red-300 disabled:opacity-40"><FiStopCircle /></button>
      </div>

      <ControlBar
        isMuted={isMuted}
        isCameraOff={isCamOff}
        onMicrophone={() => {
          const stream = localStreamRef.current;
          if (!stream) return;
          stream.getAudioTracks().forEach((track) => (track.enabled = isMuted));
          setIsMuted((muted) => !muted);
          setToastMsg(isMuted ? 'Unmuted' : 'Muted');
        }}
        onCamera={() => {
          const stream = localStreamRef.current;
          if (!stream) return;
          stream.getVideoTracks().forEach((track) => (track.enabled = isCamOff));
          setIsCamOff((cameraOff) => !cameraOff);
          setToastMsg(isCamOff ? 'Camera started' : 'Camera stopped');
        }}
        onScreenShare={() => setToastMsg('Screen sharing is not available yet')}
        onEndCall={endCall}
      />

      {/* Audio Playback */}
      {audioUrl && (
        <div className="mt-2">
          <audio controls src={audioUrl}></audio>
        </div>
      )}

      <Toast message={toastMsg} onClose={() => setToastMsg('')} />
    </div>
  )

}
