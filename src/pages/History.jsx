import { useEffect, useState } from "react";
import { getUser, fetchSummaries, deleteSummary } from "../api/index.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Layout/Sidebar.jsx";
import Card from "../components/Common/Card.jsx";
import Badge from "../components/Common/Badge.jsx";
import RecentSummaries from "../components/Dashboard/RecentSummaries.jsx";
import { FiTrash2, FiVideo } from "react-icons/fi";

export default function History() {
  const [summaries, setSummaries] = useState([]);
  const [deleting, setDeleting] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = getUser();
  const nav = useNavigate();

  useEffect(() => {
    if (!user) {
      nav("/login");
      return;
    }
    const load = async () => {
      try {
        const data = await fetchSummaries();
        setSummaries(data || []);
      } catch (err) {
        console.error("Failed to load summaries:", err);
        if (err.message.includes("401") || err.message.includes("Token is invalid")) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            nav("/login");
        }
      }
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
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-64 pt-20 pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Meeting History
            </h1>
            <p className="text-gray-600">
              Access all your recorded meetings, summaries, and insights
            </p>
          </div>

          {/* Summary Count */}
          {summaries.length > 0 && (
            <Card className="bg-linear-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700 font-medium">Total Meetings</p>
                  <p className="text-3xl font-bold text-blue-600">{summaries.length}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Summaries */}
          {summaries.length === 0 ? (
            <Card>
              <div className="py-16 text-center">
                <FiVideo className="mx-auto text-5xl text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Meeting History
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Your meeting summaries will appear here after you host or join a call
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {summaries.map((s) => (
                <Card key={s._id} hoverable>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-6">
                      <div className="flex-1">
                        <div className="flex gap-2 mb-3 flex-wrap">
                          <Badge variant="default">Room: {s.roomId}</Badge>
                          <span className="text-xs text-gray-500 mt-2">
                            {new Date(s.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-700 line-clamp-3">
                          {s.summary}
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {s.participants?.length || 0}
                        </div>
                        <div className="text-xs text-gray-600">
                          People
                        </div>
                      </div>
                    </div>

                    {/* Transcript */}
                    {s.transcript && (
                      <details className="text-sm border-t pt-3">
                        <summary className="cursor-pointer font-semibold text-gray-700 hover:text-blue-600 transition">
                          View Transcript
                        </summary>
                        <div className="mt-3 p-3 bg-gray-50 rounded text-gray-700 text-sm">
                          {s.transcript}
                        </div>
                      </details>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t">
                      {s.audioUrl && (
                        <a
                          href={s.audioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm transition"
                        >
                          Download Audio
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(s._id)}
                        disabled={deleting === s._id}
                        className="ml-auto px-3 py-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded text-sm font-medium transition"
                      >
                        {deleting === s._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
