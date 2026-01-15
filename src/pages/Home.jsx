import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getUser } from "../api/index.js";
import Navbar from "../components/Navbar.jsx";

export default function Home() {
  const nav = useNavigate();
  const user = getUser();

  useEffect(() => {
    if (user) {
      nav("/dashboard");
    }
  }, [user, nav]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <Navbar />

      {/* HERO */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 animate-fadeIn">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          AI-Powered Video Meetings <br />
          <span className="text-blue-600">That Work for You</span>
        </h1>

        <p className="text-lg text-gray-600 max-w-3xl leading-relaxed mb-10">
          Host secure, real-time video calls and let AI automatically generate
          meeting summaries, key discussion points, and participant insights —
          so you focus on conversations, not note-taking.
        </p>

        <div className="flex gap-6 mb-14">
          <Link
            to="/signup"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-all"
          >
            Get Started Free
          </Link>

          <Link
            to="/login"
            className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all"
          >
            Sign In
          </Link>
        </div>

        <div className="flex gap-8 text-sm text-gray-500">
          <span>🔒 Secure Rooms</span>
          <span>🎥 HD Video Calls</span>
          <span>🧠 AI Summaries</span>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-10 animate-slideUp">

          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition">
            <div className="text-4xl mb-4">🎥</div>
            <h3 className="text-xl font-bold mb-3">Crystal-Clear Video Calls</h3>
            <p className="text-gray-600 leading-relaxed">
              Enjoy smooth one-to-one video meetings with low latency and
              secure peer-to-peer connections — no complicated setup required.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-bold mb-3">AI-Generated Summaries</h3>
            <p className="text-gray-600 leading-relaxed">
              After every call, AI automatically generates meeting summaries,
              highlights, and participant details for easy review later.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-3">Instant Room Creation</h3>
            <p className="text-gray-600 leading-relaxed">
              Create or join meetings instantly with a unique Room ID — no
              downloads, no friction, just click and connect.
            </p>
          </div>

        </div>
      </section>

      {/* WHY US */}
      <section className="bg-blue-600 text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center animate-fadeIn">
          <h2 className="text-4xl font-extrabold mb-6">
            Why Choose NexaCall?
          </h2>
          <p className="text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
            Unlike traditional video conferencing tools, NexaCall combines
            real-time communication with AI intelligence — saving time,
            increasing productivity, and ensuring nothing important is missed.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div>
              <h4 className="font-bold mb-2">✔ Smart Automation</h4>
              <p className="text-blue-100">
                AI handles summaries and insights automatically.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">✔ Privacy-First</h4>
              <p className="text-blue-100">
                Secure rooms with controlled access.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">✔ Built for Developers</h4>
              <p className="text-blue-100">
                Fast, modern, and scalable MERN-based architecture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 text-center animate-slideUp">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
          Start Smarter Meetings Today
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Create your first AI-powered meeting in seconds and experience
          effortless collaboration like never before.
        </p>

        <Link
          to="/signup"
          className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-all"
        >
          Create Free Account
        </Link>
      </section>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out both; }
        .animate-slideUp { animation: slideUp 0.9s ease-out both; }
      `}</style>
    </div>
  );
}
