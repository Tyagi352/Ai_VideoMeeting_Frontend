import { useEffect, useState } from "react";
import { getUser } from "../api/index.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Layout/Sidebar.jsx";
import Button from "../components/Common/Button.jsx";
import Card from "../components/Common/Card.jsx";
import Input from "../components/Common/Input.jsx";
import { FiPlus, FiVideo, FiLink, FiCheckCircle, FiLoader, FiAlertCircle, FiX, FiFileText } from "react-icons/fi";

export default function Meet() {
  const [roomInput, setRoomInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [summaryNotif, setSummaryNotif] = useState(null); // null | 'generating' | 'done' | 'error'
  const [summaryData, setSummaryData] = useState(null);   // { summary, transcript, audioUrl, roomId }
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const user = getUser();
  const nav = useNavigate();

  useEffect(() => {
    if (!user) {
      nav("/login");
      return;
    }
  }, [user, nav]);

  // Listen for background summary from Room hangup
  useEffect(() => {
    const bc = new BroadcastChannel('meeting-summary');
    bc.onmessage = (e) => {
      const { type, summary, transcript, audioUrl, roomId } = e.data;
      if (type === 'generating') {
        setSummaryNotif('generating');
        setSummaryData(null);
      } else if (type === 'done') {
        setSummaryNotif('done');
        setSummaryData({ summary, transcript, audioUrl, roomId });
      } else if (type === 'error') {
        setSummaryNotif('error');
      }
    };
    return () => bc.close();
  }, []);

  const createRandom = () => {
    const roomId = Math.random().toString(36).slice(2, 9);
    nav(`/room/${roomId}`);
  };

  const joinRoom = () => {
    if (!roomInput.trim()) {
      alert("Please enter a Room ID");
      return;
    }
    nav(`/room/${roomInput.trim()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ── Top Progress Banner ── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          transform: summaryNotif ? 'translateY(0)' : 'translateY(-110%)',
          transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          pointerEvents: summaryNotif ? 'auto' : 'none',
        }}
      >
        {/* Main banner body */}
        <div
          style={{
            background: summaryNotif === 'done'
              ? 'linear-gradient(90deg,#064e3b 0%,#065f46 50%,#047857 100%)'
              : summaryNotif === 'error'
              ? 'linear-gradient(90deg,#450a0a 0%,#7f1d1d 100%)'
              : 'linear-gradient(90deg,#1e1b4b 0%,#2e1065 50%,#1e1b4b 100%)',
            borderBottom: summaryNotif === 'done'
              ? '1px solid rgba(52,211,153,0.35)'
              : summaryNotif === 'error'
              ? '1px solid rgba(248,113,113,0.35)'
              : '1px solid rgba(139,92,246,0.35)',
            transition: 'background 0.6s ease, border-color 0.6s ease',
          }}
        >
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, height: 52 }}>

              {/* Left — icon + text */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                {summaryNotif === 'generating' && (
                  <span style={{ flexShrink: 0, display: 'flex', animation: 'spin 1.2s linear infinite' }}>
                    <FiLoader size={16} color="#a78bfa" />
                  </span>
                )}
                {summaryNotif === 'done' && (
                  <span style={{ flexShrink: 0 }}>
                    <FiCheckCircle size={16} color="#34d399" />
                  </span>
                )}
                {summaryNotif === 'error' && (
                  <span style={{ flexShrink: 0 }}>
                    <FiAlertCircle size={16} color="#f87171" />
                  </span>
                )}

                <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>
                  {summaryNotif === 'generating' && 'Generating AI meeting summary…'}
                  {summaryNotif === 'done' && '✨ Meeting summary is ready'}
                  {summaryNotif === 'error' && 'Failed to generate summary'}
                </span>

                <span style={{ fontSize: 12, color: summaryNotif === 'done' ? '#6ee7b7' : summaryNotif === 'error' ? '#fca5a5' : '#a78bfa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {summaryNotif === 'generating' && 'Processing audio in background · this may take a moment'}
                  {summaryNotif === 'done' && 'AI transcription and summary complete'}
                  {summaryNotif === 'error' && 'An error occurred while processing the recording'}
                </span>
              </div>

              {/* Right — actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                {summaryNotif === 'done' && summaryData && (
                  <button
                    onClick={() => setShowSummaryModal(true)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '5px 14px', borderRadius: 20,
                      background: 'rgba(52,211,153,0.2)',
                      border: '1px solid rgba(52,211,153,0.4)',
                      color: '#6ee7b7', fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(52,211,153,0.35)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(52,211,153,0.2)'}
                  >
                    <FiFileText size={12} /> View Summary
                  </button>
                )}
                <button
                  onClick={() => setSummaryNotif(null)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                >
                  <FiX size={13} />
                </button>
              </div>

            </div>
          </div>

          {/* Animated progress track */}
          <div style={{ height: 3, width: '100%', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            {summaryNotif === 'generating' && (
              <div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent 0%, #7c3aed 30%, #a78bfa 50%, #7c3aed 70%, transparent 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.6s ease-in-out infinite',
                  width: '100%',
                }}
              />
            )}
            {summaryNotif === 'done' && (
              <div style={{ height: '100%', width: '100%', background: '#34d399', transition: 'width 0.5s ease' }} />
            )}
            {summaryNotif === 'error' && (
              <div style={{ height: '100%', width: '100%', background: '#f87171' }} />
            )}
          </div>
        </div>
      </div>

      {/* Keyframe styles injected inline */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      {/* ── Summary Modal ── */}
      {showSummaryModal && summaryData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
          onClick={() => setShowSummaryModal(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg,#1e1b4b 0%,#0f0a2e 100%)',
              border: '1px solid rgba(167,139,250,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSummaryModal(false)}
              className="absolute top-4 right-4 text-violet-400 hover:text-white transition-colors"
            >
              <FiX size={20} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-emerald-400"><FiCheckCircle size={22} /></span>
              <h2 className="text-xl font-bold text-white">AI Meeting Summary</h2>
            </div>
            {summaryData.roomId && (
              <p className="text-xs text-violet-400 mb-4">Room: {summaryData.roomId}</p>
            )}
            <p className="text-sm text-violet-100 whitespace-pre-line leading-relaxed">
              {summaryData.summary}
            </p>

            {summaryData.transcript && (
              <details className="mt-5">
                <summary className="text-xs text-violet-400 cursor-pointer hover:text-violet-200 transition-colors">
                  Show full transcript
                </summary>
                <pre className="mt-2 text-xs text-violet-300 whitespace-pre-wrap leading-relaxed p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.1)' }}>
                  {summaryData.transcript}
                </pre>
              </details>
            )}

            {summaryData.audioUrl && (
              <a
                href={summaryData.audioUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-xs text-violet-300 underline hover:text-white transition-colors"
              >
                Download recording
              </a>
            )}
          </div>
        </div>
      )}

      <main className="lg:ml-64 pt-20 pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Header */}
          <div className="pt-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Start or Join a Meeting
            </h1>
            <p className="text-gray-600">
              Create a new video room or join an existing meeting with a Room ID
            </p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8">

            {/* Create New Room */}
            <Card className="bg-linear-to-br from-blue-50 to-blue-100 border-2 border-blue-300 h-full">
              <div className="space-y-6 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-600 text-white">
                    <FiPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Create New Room
                    </h2>
                    <p className="text-gray-700">
                      Start a new video meeting instantly. A unique Room ID will be generated for you to share with others.
                    </p>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={createRandom}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <FiPlus className="w-5 h-5" />
                  Create New Room
                </Button>
              </div>
            </Card>

            {/* Join Existing Room */}
            <Card className="bg-linear-to-br from-purple-50 to-purple-100 border-2 border-purple-300">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-600 text-white">
                    <FiLink className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Join Existing Room
                    </h2>
                    <p className="text-gray-700">
                      Enter a Room ID from your meeting invitation to join an existing call.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">
                      Room ID
                    </label>
                    <Input
                      type="text"
                      label=""
                      value={roomInput}
                      onChange={(e) => setRoomInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter Room ID (e.g., abc1234)"
                      className="border-violet-400/20"
                    />
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={joinRoom}
                    className="w-full"
                  >
                    Join Room
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Tips Section */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Tips</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
                  <FiVideo className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">HD Quality</h3>
                  <p className="text-sm text-gray-600">
                    Enjoy clear and crisp video with support for multiple participants
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-green-600 flex-shrink-0">
                  <FiLink className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Easy Sharing</h3>
                  <p className="text-sm text-gray-600">
                    Share your Room ID with anyone to let them join your meeting
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex-shrink-0">
                  <FiPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Auto Summary</h3>
                  <p className="text-sm text-gray-600">
                    Get AI-powered summaries automatically after each meeting
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
