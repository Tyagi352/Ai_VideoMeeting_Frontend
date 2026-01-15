import { useEffect, useState } from "react";
import { getUser, fetchSummaries, deleteSummary } from "../api/index.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { FiTrash2, FiArrowLeft, FiDownload, FiVideo } from "react-icons/fi";

export default function History() {
  const [summaries, setSummaries] = useState([]);
  const [deleting, setDeleting] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
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
  }, [user, nav]);

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
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => nav("/dashboard")}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition"
          >
            <FiArrowLeft className="text-lg" />
            Back to Dashboard
          </button>

          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
              Complete Meeting History
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Access all your recorded meeting summaries, transcripts, and
              insights. View, search, and manage your complete meeting history.
            </p>
          </div>
        </div>

        {/* Summary Count */}
        {summaries.length > 0 && (
          <div className="mb-8 text-center">
            <div className="inline-block bg-white/80 backdrop-blur-xl px-8 py-4 rounded-2xl shadow-lg border border-blue-100">
              <p className="text-gray-700 font-semibold">
                Total Meetings: <span className="text-blue-600 text-xl">{summaries.length}</span>
              </p>
            </div>
          </div>
        )}

        {/* SUMMARIES */}
        <section className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-blue-100 p-10 animate-slideUp">
          {summaries.length === 0 ? (
            <div className="py-24 text-center">
              <FiVideo className="mx-auto text-7xl text-blue-400 mb-6 animate-pulse" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                No Meeting History
              </h3>
              <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                Once you host or join a video call, your meeting summaries
                will appear here for future reference.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {summaries.map((s) => (
                <div
                  key={s._id}
                  className="p-7 bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-blue-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start gap-6 mb-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="text-xs font-bold bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full">
                          Room ID: {s.roomId}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(s.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Meeting Summary
                      </h3>
                      
                      <div className="text-gray-800 leading-relaxed">
                        {expandedId === s._id ? (
                          <p>{s.summary}</p>
                        ) : (
                          <p className="line-clamp-3">{s.summary}</p>
                        )}
                      </div>

                      {s.summary && s.summary.length > 200 && (
                        <button
                          onClick={() => setExpandedId(expandedId === s._id ? null : s._id)}
                          className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-semibold transition"
                        >
                          {expandedId === s._id ? "Show Less" : "Read More"}
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="text-center bg-blue-600/10 px-5 py-4 rounded-xl">
                        <div className="text-3xl font-extrabold text-blue-700">
                          {s.participants.length}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Participants
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Transcript and Audio */}
                  <div className="border-t border-blue-200 pt-4">
                    <details className="text-sm">
                      <summary className="cursor-pointer font-semibold text-gray-700 hover:text-blue-600 transition">
                        View Transcript
                      </summary>
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {s.transcript || "Transcript not available"}
                        </p>
                      </div>
                    </details>
                  </div>

                  {/* Audio and Delete Buttons */}
                  <div className="flex gap-3 mt-4 flex-wrap">
                    {s.audioUrl && (
                      <a
                        href={s.audioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-2 transition"
                      >
                        <FiDownload />
                        Download Audio
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(s._id)}
                      disabled={deleting === s._id}
                      className="ml-auto px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg flex items-center gap-2 transition text-sm font-medium"
                    >
                      <FiTrash2 className="text-lg" />
                      {deleting === s._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
