import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { socket } from '../Socket/socket';
import Peer from 'simple-peer';
import { getUser, sendAudio } from '../api/index.js';
import Toast from '../components/Toast.jsx';
import ControlBar from '../components/MeetingRoom/ControlBar.jsx';
import RecordingIndicator from '../components/MeetingRoom/RecordingIndicator.jsx';
import { FiMic, FiStopCircle, FiDownload, FiVideo, FiFileText, FiHome, FiPhoneOff } from 'react-icons/fi';

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
  const [callEnded, setCallEnded] = useState(false);      // true after hangup — shows post-call overlay
  const audioChunksSnapshotRef = useRef([]); // frozen copy of chunks taken at hangup time

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
    let cancelled = false; // prevent double-registration in React StrictMode

    socket.off('user-connected');
    socket.off('signal');
    socket.off('all-users');
    socket.off('user-disconnected');

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (cancelled) {
          // Effect was already cleaned up (React StrictMode double-invoke);
          // stop the stream and bail out without registering any listeners.
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
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


            if (!peersRef.current[u.socketId]) {

              const peer = createPeer(
                u.socketId,
                socket.id,
                localStream
              );

              peersRef.current[u.socketId] = peer;

            }

          });

        });

        // New user connected (someone joined after we did) — UI notice only
        // socket.on('user-connected', (socketId) => {
        //   console.log('User connected:', socketId);
        // });

        // user-connected: a NEW user joined AFTER us.
        // We do NOT create a peer here — the new user (who received `all-users`
        // with our socketId) will act as the initiator and send us an offer.
        // Our `signal` handler below will call addPeer() when their offer arrives.
        socket.on('user-connected', ({ socketId, userId }) => {
          console.log("New user connected (waiting for their offer):", socketId);
          // Clean up any stale peer for this id just in case
          if (peersRef.current[socketId]) {
            try { peersRef.current[socketId].destroy(); } catch (e) {}
            delete peersRef.current[socketId];
          }
        });

        // User disconnected
        socket.on('user-disconnected', (socketId) => {
          console.log('User disconnected:', socketId);
          if (peersRef.current[socketId]) {
            try { peersRef.current[socketId].destroy(); } catch (e) { }
            delete peersRef.current[socketId];
          }
          if (remoteVideosRef.current[socketId]) delete remoteVideosRef.current[socketId];
          forceUpdate();
        });

        // Incoming signal
        // Incoming signal
        socket.on('signal', ({ from, signal }) => {

          console.log("Received signal from:", from);

          if (peersRef.current[from]) {

            const peer = peersRef.current[from];

            if (!peer.destroyed) {
              // Guard: ignore signals when the connection is already complete (stable state).
              // This handles both duplicate-listener scenarios and out-of-order retransmits.
              const pc = peer._pc;
              const signalingState = pc ? pc.signalingState : null;

              if (signalingState === 'stable' && (signal.type === 'answer' || signal.type === 'offer')) {
                console.log("Ignoring signal in stable state for:", from, signal.type);
                return;
              }

              try {
                peer.signal(signal);
              } catch (err) {
                console.log("Ignoring signal error:", err.message);
              }
            }

            return;
          }

          // No peer yet — this is an incoming offer, create a non-initiator peer
          const peer = addPeer(
            signal,
            from,
            localStream
          );

          peersRef.current[from] = peer;

        });

        // socket.on('user-connected', ({ socketId, userId }) => {
        //   console.log("New user connected:", socketId);

        //   if (!peersRef.current[socketId]) {

        //     const peer = createPeer(
        //       socketId,
        //       socket.id,
        //       localStream
        //     );

        //     peersRef.current[socketId] = peer;
        //   }
        // });

        // Reconnect handler — rejoin the room if needed
        // socket.on('connect', () => {
        //   console.log('Socket reconnected:', socket.id);
        //   if (roomJoinedRef.current) {
        //     socket.emit('join-room', roomId, getUser()?.id);
        //   }
        // });

        socket.on('connect_error', (err) => console.error('Socket connect error', err));
      })
      .catch((err) => console.error('getUserMedia error:', err));

    return () => {
      cancelled = true; // signal the async getUserMedia .then() to abort

      // Inform others we're leaving
      try { socket.emit('leave-room', roomId, getUser()?.id); } catch (e) { }

      socket.off('all-users');
      socket.off('user-connected');
      socket.off('signal');
      socket.off('user-disconnected');
      socket.off('connect');
      socket.off('connect_error');

      if (localStream) localStream.getTracks().forEach((track) => track.stop());

      Object.keys(peersRef.current).forEach((k) => {
        try { peersRef.current[k].destroy(); } catch (e) { }
        delete peersRef.current[k];
      });

      remoteVideosRef.current = {};
    };
  }, [roomId, navigate]);

  // --- Peer Functions ---
  const createPeer = (userToSignal, callerId, stream) => {

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream
    });


    peer.on('signal', (signal) => {

      if (peer.destroyed) return;


      socket.emit('signal', {
        to: userToSignal,
        from: callerId,
        signal
      });

    });


    peer.on('stream', (remoteStream) => {

      console.log(
        "REMOTE STREAM RECEIVED:",
        userToSignal
      );


      remoteVideosRef.current[userToSignal] = remoteStream;

      forceUpdate();

    });


    peer.on('error', (err) => {
      console.log(
        "Peer error:",
        err.message
      );
    });


    peer.on('close', () => {

      delete remoteVideosRef.current[userToSignal];

      delete peersRef.current[userToSignal];

      forceUpdate();

    });


    return peer;

  };

  const addPeer = (incomingSignal, callerId, stream) => {

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream
    });


    peer.on('signal', (signal) => {

      if (peer.destroyed) return;


      socket.emit('signal', {
        to: callerId,
        from: socket.id,
        signal
      });

    });


    peer.on('stream', (remoteStream) => {


      console.log(
        "REMOTE STREAM RECEIVED FROM:",
        callerId
      );


      remoteVideosRef.current[callerId] = remoteStream;

      forceUpdate();

    });


    peer.on('error', (err) => {

      console.log(
        "Peer error:",
        err.message
      );

    });


    peer.on('close', () => {

      delete remoteVideosRef.current[callerId];

      delete peersRef.current[callerId];

      forceUpdate();

    });


    peer.signal(incomingSignal);


    return peer;

  };

  // --- Force update for remote streams ---
  const [, setTick] = useState(0);
  const forceUpdate = () => setTick((tick) => tick + 1);

  // --- End Call & Post-Call Actions ---

  // Step 1: red hangup button — disconnect from room/peers, stay on page
  const endCall = () => {
    // Stop recording and snapshot the chunks now
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    audioChunksSnapshotRef.current = [...audioChunksRef.current];

    // Leave the room so other participants are notified
    socket.emit('leave-room', roomId, socket.id);

    // Destroy all peer connections
    Object.keys(peersRef.current).forEach((k) => {
      try { peersRef.current[k].destroy(); } catch (e) {}
      delete peersRef.current[k];
    });
    remoteVideosRef.current = {};

    // Stop all local media tracks so camera/mic light turns off
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
    }

    // Drop socket listeners — we're done with this room
    socket.off('all-users');
    socket.off('user-connected');
    socket.off('signal');
    socket.off('user-disconnected');
    socket.off('connect_error');

    // Stay on page — show the post-call overlay
    setCallEnded(true);
    forceUpdate();
  };

  // Step 2a: user clicks "Create Summary" — navigate + fire background generation
  const createSummary = () => {
    const chunks = audioChunksSnapshotRef.current;
    const audioBlob = chunks.length > 0
      ? new Blob(chunks, { type: 'audio/webm' })
      : null;

    navigate('/meet');

    if (audioBlob) {
      const bc = new BroadcastChannel('meeting-summary');
      bc.postMessage({ type: 'generating', roomId });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'meeting.webm');
      formData.append('roomId', roomId);
      formData.append('participants', JSON.stringify([getUser()?.id]));

      sendAudio(formData)
        .then((response) => {
          bc.postMessage({
            type: 'done',
            roomId,
            summary: response.summary || 'No summary returned',
            transcript: response.transcript || '',
            audioUrl: response.audioUrl ? `${BACKEND_URL}${response.audioUrl}` : null,
          });
        })
        .catch((err) => {
          console.error('Background summary error:', err);
          bc.postMessage({ type: 'error', roomId });
        })
        .finally(() => bc.close());
    }
  };

  // Step 2b: user clicks "Go Home" — navigate without generating summary
  const goHome = () => navigate('/meet');


  return (
    <div className="relative min-h-screen bg-[#09090B] px-4 pb-32 pt-6 text-zinc-100 sm:px-6 lg:px-8">
      <RecordingIndicator isRecording={isRecording} />
      <header className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 pb-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
            <span className={`h-2 w-2 rounded-full ${callEnded ? 'bg-zinc-500' : 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]'}`} />
            {callEnded ? 'Call ended' : 'Live room'}
          </div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Room <span className="text-zinc-500">/</span> {roomId}</h2>
        </div>
        <div className="hidden items-center gap-3 text-sm text-zinc-500 sm:flex">
          <span>{Object.keys(peersRef.current).length + 1} participant{Object.keys(peersRef.current).length === 0 ? '' : 's'}</span>
          <button onClick={() => { navigator.clipboard.writeText(roomId); setToastMsg('Room ID copied'); }} className="rounded-[12px] border border-white/10 bg-white/[0.04] px-3 py-2 text-zinc-300 hover:bg-white/[0.08]">Copy room ID</button>
        </div>
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

      {/* Recording toolbar */}
      {!callEnded && (
        <div className="fixed bottom-24 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-[16px] border border-white/10 bg-[#111113]/90 px-2 py-2 shadow-[0_14px_45px_rgba(0,0,0,.35)] backdrop-blur-xl">
          <button onClick={startRecording} disabled={isRecording} title="Start recording" className="rounded-[11px] p-2.5 text-zinc-400 hover:bg-white/10 hover:text-emerald-300 disabled:opacity-40"><FiMic /></button>
          <button onClick={stopRecording} disabled={!isRecording} title="Stop recording" className="rounded-[11px] p-2.5 text-zinc-400 hover:bg-white/10 hover:text-red-300 disabled:opacity-40"><FiStopCircle /></button>
        </div>
      )}

      {/* Live control bar — hidden after call ends */}
      {!callEnded && (
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
      )}

      {/* ── Post-Call Overlay ── */}
      {callEnded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(18px)' }}
        >
          <div
            className="w-full max-w-md mx-4 rounded-[28px] p-8 text-center"
            style={{
              background: 'linear-gradient(160deg,#18122b 0%,#0f0a1e 100%)',
              border: '1px solid rgba(139,92,246,0.2)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.08)',
            }}
          >
            {/* Icon */}
            <div
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}
            >
              <FiPhoneOff size={26} color="#f87171" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Call Ended</h2>
            <p className="text-sm text-zinc-400 mb-8">
              You've left the room. What would you like to do next?
            </p>

            <div className="flex flex-col gap-3">
              {/* Primary — Create Summary */}
              {audioChunksSnapshotRef.current.length > 0 ? (
                <button
                  onClick={createSummary}
                  className="group relative w-full overflow-hidden rounded-[16px] px-6 py-4 text-sm font-semibold text-white transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg,#6d28d9 0%,#7c3aed 50%,#8b5cf6 100%)',
                    boxShadow: '0 8px_32px rgba(109,40,217,0.45)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <span className="flex items-center justify-center gap-2.5">
                    <FiFileText size={16} />
                    Create AI Summary
                  </span>
                  <span className="mt-1 block text-[11px] font-normal text-violet-200 opacity-80">
                    Transcribe your recording and generate a meeting summary
                  </span>
                </button>
              ) : (
                <div
                  className="w-full rounded-[16px] px-6 py-4 text-sm text-zinc-500"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <FiFileText size={15} />
                    No recording available for summary
                  </span>
                  <span className="mt-1 block text-xs text-zinc-600">Start recording before the call ends to generate a summary</span>
                </div>
              )}

              {/* Secondary — Go Home */}
              <button
                onClick={goHome}
                className="w-full rounded-[16px] px-6 py-3.5 text-sm font-medium text-zinc-300 transition-all duration-150"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = ''; }}
              >
                <span className="flex items-center justify-center gap-2">
                  <FiHome size={15} />
                  Go to Home
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toastMsg} onClose={() => setToastMsg('')} />
    </div>
  )

}
