import { useEffect, useState } from "react";
import { getUser, fetchSummaries, deleteSummary } from "../api/index.js";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { FiPlus, FiSearch, FiVideo, FiTrash2, FiArrowRight } from "react-icons/fi";

export default function Dashboard() {
  const [summaries, setSummaries] = useState([]);
  const [roomInput, setRoomInput] = useState("");
  const [deleting, setDeleting] = useState(null);
  const user = getUser();
  const nav = useNavigate();

  useEffect(() => {
    if (!user) {
      nav("/login");
      return;
    }
    const load = async () => {
      const data = await fetchSummaries();
      setSummaries(data || []);
    };
    load();
  }, []);

  const createRandom = () => {
    nav(`/room/${Math.random().toString(36).slice(2, 9)}`);
  };

  const joinRoom = () => {
    if (!roomInput) return;
    nav(`/room/${roomInput}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this meeting summary?")) {
      return;
    }
    
    try {
      setDeleting(id);
      await deleteSummary(id);
      setSummaries(summaries.filter(s => s._id !== id));
      alert("Meeting summary deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete summary: " + err.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-16">

        {/* HERO */}
        <section className="mb-20 text-center animate-fadeIn">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
            NexaCall Video Meetings
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Host real-time video calls, collaborate seamlessly, and receive
            intelligent AI-generated summaries, transcripts, and insights —
            all in one modern dashboard.
          </p>

          <div className="mt-8 flex justify-center gap-4 text-sm text-gray-500">
            <span>🔒 Secure Rooms</span>
            <span>🎥 Real-time Video</span>
            <span>🧠 AI Summaries</span>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="mb-16 bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-xl border border-blue-100 animate-slideUp">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Start or Join a Meeting
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl">
            Instantly create a private video room or join an existing meeting
            using a Room ID shared by your team.
          </p>

          <div className="flex flex-wrap gap-6 items-center">
            <button
              onClick={createRandom}
              className="px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-2xl flex items-center gap-3 font-semibold transition-all duration-300 hover:scale-105 shadow-xl"
            >
              <FiPlus className="text-xl" />
              Create New Room
            </button>

            <div className="flex gap-4 items-center flex-1 min-w-[280px]">
              <input
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && joinRoom()}
                placeholder="Enter Room ID"
                className="flex-1 px-6 py-5 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <button
                onClick={joinRoom}
                className="px-8 py-5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-blue-600 hover:to-sky-700 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Join
              </button>
            </div>
          </div>
        </section>

        {/* SUMMARIES */}
        <section className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-blue-100 p-10 animate-slideUp">
          <div className="mb-10 flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3 mb-3">
                <FiSearch className="text-blue-600" />
                Recent AI Meeting Summaries
              </h2>
              <p className="text-gray-600 max-w-2xl">
                Your latest meetings are displayed here. View all summaries in the complete history.
              </p>
            </div>
            {summaries.length > 2 && (
              <Link
                to="/history"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 transition whitespace-nowrap"
              >
                View All History
                <FiArrowRight />
              </Link>
            )}
          </div>

          {summaries.length === 0 ? (
            <div className="py-24 text-center">
              <FiVideo className="mx-auto text-7xl text-blue-400 mb-6 animate-pulse" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                No Meetings Yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                Once you host or join a video call, AI will automatically
                generate summaries and insights that appear here for quick
                review and reference.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {summaries.slice(0, 2).map((s) => (
                  <div
                    key={s._id}
                    className="p-7 bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-blue-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start gap-6">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className="text-xs font-bold bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full">
                            Room ID: {s.roomId}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(s.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <p className="text-gray-800 leading-relaxed line-clamp-3">
                          {s.summary}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-4">
                        <div className="text-center bg-blue-600/10 px-5 py-4 rounded-xl">
                          <div className="text-3xl font-extrabold text-blue-700">
                            {s.participants.length}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            Participants
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(s._id)}
                          disabled={deleting === s._id}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg flex items-center gap-2 transition text-sm font-medium"
                        >
                          <FiTrash2 className="text-lg" />
                          {deleting === s._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {summaries.length > 2 && (
                <div className="mt-12 text-center p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                  <p className="text-gray-700 font-semibold mb-4">
                    You have <span className="text-blue-600 text-lg">{summaries.length - 2}</span> more meeting summaries
                  </p>
                  <Link
                    to="/history"
                    className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 transition"
                  >
                    View Complete History
                    <FiArrowRight />
                  </Link>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out both; }
        .animate-slideUp { animation: slideUp 0.9s ease-out both; }
      `}</style>
    </div>
  );
}
