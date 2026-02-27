import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { socket } from '../Socket/socket';
import Peer from 'simple-peer';
import { getUser, sendAudio } from '../api/index.js';
import Toast from '../components/Toast.jsx';
import RecordingIndicator from '../components/MeetingRoom/RecordingIndicator.jsx';
import ControlBar from '../components/MeetingRoom/ControlBar.jsx';
import { FiMic, FiStopCircle, FiPhoneOff, FiCopy, FiDownload, FiVideo } from 'react-icons/fi';

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const localVideoRef = useRef(null);
  const remoteVideosRef = useRef({});
  const peersRef = useRef({});
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const localStreamRef = useRef(null);
  const roomJoinedRef = useRef(false);

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingMimeType, setRecordingMimeType] = useState('audio/webm');
  
  // Waiting room state
  const [isWaiting, setIsWaiting] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [waitingParticipants, setWaitingParticipants] = useState([]);

  const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Force update
  const [, setTick] = useState(0);
  const forceUpdate = () => setTick((tick) => tick + 1);

  // --- Audio Recording ---
  const startRecording = () => {
    const stream = localStreamRef.current;
    if (!stream) {
      setToastMsg('No stream available');
      return;
    }

    try {
      // Try to create MediaRecorder without options first (most reliable)
      let mediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(stream);
      } catch (e) {
        console.warn('MediaRecorder without options failed, trying with audio/webm:', e);
        try {
          mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        } catch (e2) {
          console.warn('MediaRecorder with audio/webm failed, trying with audio/mp4:', e2);
          mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/mp4' });
        }
      }

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Detect actual MIME type being used
      const actualMimeType = mediaRecorder.mimeType || 'audio/webm';
      setRecordingMimeType(actualMimeType);
      console.log('Recording with MIME type:', actualMimeType);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        setToastMsg('Recording error: ' + event.error);
        setIsRecording(false);
      };

      mediaRecorder.onstop = () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: actualMimeType });
          setAudioUrl(URL.createObjectURL(audioBlob));
        }
        setToastMsg('Recording stopped');
      };

      mediaRecorder.start();
      setIsRecording(true);
      setToastMsg('Recording started');
    } catch (err) {
      console.error('Failed to start recording:', err);
      setToastMsg('Failed to start recording: ' + err.message);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setToastMsg('Recording stopped');
    }
  };

  // --- Video Chat Setup ---
  // --- Video Chat Setup ---
  useEffect(() => {
    let isMounted = true;
    const user = getUser();
    if (!user) {
      navigate('/login');
      return;
    }

    let localStream;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        localVideoRef.current.srcObject = stream;
        localStream = stream;
        localStreamRef.current = stream;

        // Join room
        socket.emit('join-room', roomId, user.id);
        roomJoinedRef.current = true;

        // Waiting room: participant was admitted
        socket.on('participant-admitted', () => {
          setIsWaiting(false);
          setToastMsg('You have been admitted!');
        });

        // Waiting room: participant is waiting
        socket.on('waiting-for-admission', () => {
          setIsWaiting(true);
          setIsHost(false);
          setToastMsg('Waiting for host to admit you...');
        });

        // Waiting room: host notification of waiting participants
        socket.on('participant-waiting', (data) => {
          setIsHost(true);
          setWaitingParticipants([...data.waitingList]);
          setToastMsg(`Participant waiting: ${data.userId}`);
        });

        // Waiting room: updated waiting list
        socket.on('waiting-list-updated', (data) => {
          setWaitingParticipants([...data.waitingList]);
        });

        // Existing users
        socket.on('all-users', (users) => {
          users.forEach((u) => {
            if (!u || !u.socketId) return;
            // Prevent duplicate peers if all-users fires multiple times or for existing peers
            if (peersRef.current[u.socketId]) return;
            
            const peer = createPeer(u.socketId, socket.id, localStream);
            peersRef.current[u.socketId] = peer;
          });
        });

        // New user joined
        socket.on('user-connected', (socketId) => {
          console.log('User connected:', socketId);
          // Do not initiate connection here. Wait for the new user to initiate (send signal).
          // The new user will receive 'all-users' and initiate connections.
        });

        // User disconnected
        socket.on('user-disconnected', (socketId) => {
          if (peersRef.current[socketId]) peersRef.current[socketId].destroy();
          delete peersRef.current[socketId];
          if (remoteVideosRef.current[socketId]) delete remoteVideosRef.current[socketId];
          forceUpdate();
        });

        // Signal handling
        socket.on('signal', ({ from, signal }) => {
          if (isWaiting) {
            console.log('Ignoring signal while waiting for admission');
            return;
          }
          if (!peersRef.current[from]) {
            const peer = addPeer(signal, from, localStream);
            peersRef.current[from] = peer;
          } else {
            peersRef.current[from].signal(signal);
          }
        });

        // Reconnect
        socket.on('connect', () => {
          if (roomJoinedRef.current) socket.emit('join-room', roomId, getUser()?.id);
        });

        socket.on('connect_error', (err) => console.error('Socket connect error', err));
      })
      .catch((err) => {
        if (isMounted) console.error('getUserMedia error:', err);
      });

    return () => {
      isMounted = false;
      try { 
        if (roomJoinedRef.current) socket.emit('leave-room', roomId, getUser()?.id); 
      } catch (e) {}

      socket.off('all-users');
      socket.off('user-connected');
      socket.off('signal');
      socket.off('user-disconnected');
      socket.off('connect');
      socket.off('connect_error');
      socket.off('waiting-for-admission');
      socket.off('participant-admitted');
      socket.off('participant-waiting');
      socket.off('waiting-list-updated');

      if (localStream) localStream.getTracks().forEach((track) => track.stop());
      Object.keys(peersRef.current).forEach((k) => peersRef.current[k].destroy());
      peersRef.current = {};
      remoteVideosRef.current = {};
    };
  }, [roomId, navigate]);

  // --- Peer Helpers ---
  const createPeer = (userToSignal, callerId, stream) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (signal) => {
      socket.emit('signal', { to: userToSignal, from: callerId, signal });
    });

    peer.on('stream', (remoteStream) => {
      remoteVideosRef.current[userToSignal] = remoteStream;
      forceUpdate();
    });

    peer.on('close', () => {
      delete remoteVideosRef.current[userToSignal];
      delete peersRef.current[userToSignal];
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
      forceUpdate();
    });

    peer.on('close', () => {
      delete remoteVideosRef.current[callerId];
      delete peersRef.current[callerId];
      forceUpdate();
    });

    peer.signal(incomingSignal);
    return peer;
  };

  // --- Waiting Room: Admit Participant ---
  const admitParticipant = (socketId) => {
    socket.emit('admit-participant', { roomId, socketId });
    setToastMsg(`Admitted participant ${socketId.slice(0, 4)}`);
  };

  // --- End Call ---
  const endCall = async () => {
    // Stop recording if active
    if (mediaRecorderRef.current && isRecording) {
      await new Promise((resolve) => {
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: recordingMimeType });
          setAudioUrl(URL.createObjectURL(audioBlob));
          resolve();
        };
        mediaRecorderRef.current.stop();
      });
    }

    // Leave room
    socket.emit('leave-room', roomId, socket.id);

    // If no audio chunks, redirect to dashboard
    if (audioChunksRef.current.length === 0) {
      setToastMsg('No audio recorded');
      navigate('/dashboard');
      return;
    }

    // Create summary from audio
    const audioBlob = new Blob(audioChunksRef.current, { type: recordingMimeType });
    console.log('Audio blob created:', { size: audioBlob.size, type: audioBlob.type });
    
    const formData = new FormData();
    formData.append('audio', audioBlob, 'meeting.webm');
    formData.append('roomId', roomId);
    formData.append('participants', JSON.stringify([getUser()?.id]));

    setIsGenerating(true);
    setToastMsg('Processing audio... this may take a minute');
    try {
      const response = await sendAudio(formData);
      console.log('Summary response:', response);
      setAiSummary(response.summary || 'No summary returned');
      setTranscript(response.transcript || '');
      if (response.audioUrl) setAudioUrl(response.audioUrl);
      setToastMsg('Meeting summary generated!');
      
      // Redirect to dashboard after 2 seconds to show the summary
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000); 
    } catch (err) {
      console.error('Error sending audio:', err);
      const errorMsg = err.message || 'Failed to create summary';
      setToastMsg(`Error: ${errorMsg}. Redirecting...`);
      // Still redirect even if summary fails
      setTimeout(() => {
        navigate('/dashboard');
      }, 2500);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 to-gray-800 flex flex-col">
      {/* Header */}
      <div className="bg-gray-950 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">AI Video Meeting</h1>
            <div className="flex items-center gap-3">
              <code className="bg-gray-800 text-green-400 px-3 py-1 rounded font-mono text-sm">{roomId}</code>
              <button onClick={() => { navigator.clipboard.writeText(roomId); setToastMsg('Room ID copied'); }} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded text-sm flex items-center gap-2 transition"><FiCopy /> Copy</button>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-400">{Object.keys(peersRef.current).length + 1}</div>
            <div className="text-gray-400 text-sm">Active Participants</div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {isWaiting ? (
            // Waiting Room UI
            <div className="flex flex-col items-center justify-center h-96 lg:h-96">
              <div className="bg-gray-800 rounded-xl border-2 border-yellow-500 p-12 text-center max-w-md">
                <div className="text-6xl mb-4 animate-pulse">⏳</div>
                <h2 className="text-2xl font-bold text-white mb-2">Waiting for Admission</h2>
                <p className="text-gray-300 mb-4">The host will admit you shortly. Your video and audio are ready.</p>
                <div className="bg-gray-700 rounded p-3">
                  <p className="text-gray-400 text-sm">Your camera and microphone are active and working properly.</p>
                </div>
              </div>
            </div>
          ) : (
            // Normal Meeting UI
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Local Video */}
              <div className="lg:col-span-2">
                <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl h-96 lg:h-full">
                  <video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 px-3 py-2 rounded text-white text-sm font-medium">🎥 You</div>
                </div>
              </div>

              {/* Remote Videos */}
              <div className="lg:col-span-2">
                {Object.keys(remoteVideosRef.current).length === 0 ? (
                  <div className="bg-gray-800 rounded-xl border border-gray-700 h-96 lg:h-full flex flex-col items-center justify-center p-6">
                    <div className="text-5xl mb-4">👥</div>
                    <p className="text-gray-300 text-center font-medium mb-2">Waiting for participants...</p>
                    <p className="text-gray-500 text-sm text-center">Share your Room ID with others to join this meeting</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 h-96 lg:h-full">
                    {Object.keys(remoteVideosRef.current).map((id) => (
                      <div key={id} className="relative bg-black rounded-xl overflow-hidden shadow-lg">
                        <video
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                          ref={(el) => el && (el.srcObject = remoteVideosRef.current[id])}
                        />
                        <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 px-3 py-1 rounded text-white text-xs font-medium">👤 Participant {id.slice(0, 4)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Host Admission Panel */}
      {isHost && waitingParticipants.length > 0 && (
        <div className="bg-yellow-900 border-t border-yellow-700 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-white font-semibold">{waitingParticipants.length} Participant{waitingParticipants.length !== 1 ? 's' : ''} Waiting</h3>
                <p className="text-yellow-100 text-sm">Review and admit participants to join the meeting</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {waitingParticipants.map((socketId) => (
                  <button
                    key={socketId}
                    onClick={() => admitParticipant(socketId)}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition"
                  >
                    Admit {socketId.slice(0, 4)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls & End Call */}
      <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex gap-2 flex-wrap items-center">
          <button onClick={startRecording} disabled={isRecording || isGenerating} className="px-4 py-2 bg-green-500 text-white rounded flex items-center gap-2"><FiMic /> Start</button>
          <button onClick={stopRecording} disabled={!isRecording || isGenerating} className="px-4 py-2 bg-red-500 text-white rounded flex items-center gap-2"><FiStopCircle /> Stop</button>
          <button
            onClick={() => {
              const s = localStreamRef.current;
              if (!s) return;
              s.getAudioTracks().forEach((t) => (t.enabled = isMuted));
              setIsMuted((m) => !m);
              setToastMsg(isMuted ? 'Unmuted' : 'Muted');
            }}
            className="px-3 py-1 bg-gray-200 rounded flex items-center gap-2"
          >
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
          <button
            onClick={() => {
              const s = localStreamRef.current;
              if (!s) return;
              s.getVideoTracks().forEach((t) => (t.enabled = !isCamOff));
              setIsCamOff((c) => !c);
              setToastMsg(isCamOff ? 'Camera started' : 'Camera stopped');
            }}
            className="px-3 py-1 bg-gray-200 rounded flex items-center gap-2"
          >
            {isCamOff ? 'Start Camera' : 'Stop Camera'}
          </button>
        </div>

        <button 
          onClick={endCall}  
          className="bg-red-600 text-white px-4 py-2 cursor-pointer rounded flex items-center gap-2">
          <FiPhoneOff /> End Call
        </button>
      </div>

      {/* AI Summary */}
      {isGenerating && (
        <div className="mt-4 max-w-3xl bg-yellow-50 p-4 rounded shadow border mx-auto">
          <h3 className="font-semibold">Generating summary...</h3>
          <p className="mt-2 text-gray-700">This may take up to a minute.</p>
        </div>
      )}

      {aiSummary && (
        <div className="mt-4 max-w-3xl bg-white p-4 rounded shadow mx-auto">
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

      {/* Audio Playback */}
      {audioUrl && (
        <div className="mt-2 max-w-3xl mx-auto">
          <audio controls src={audioUrl} className="w-full"></audio>
        </div>
      )}

      <Toast message={toastMsg} onClose={() => setToastMsg('')} />
    </div>
  );
}
