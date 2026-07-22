import { useEffect, useState } from "react";
import { getUser } from "../api/index.js";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Layout/Sidebar.jsx";
import Button from "../components/Common/Button.jsx";
import Card from "../components/Common/Card.jsx";
import QuickStats from "../components/Dashboard/QuickStats.jsx";
import UpcomingMeetings from "../components/Dashboard/UpcomingMeetings.jsx";
import RecentSummaries from "../components/Dashboard/RecentSummaries.jsx";
import { ArrowUpRight, Check, CirclePlay, Sparkles, Users, Video } from "lucide-react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = getUser();
  const nav = useNavigate();

  useEffect(() => {
    if (!user) {
      nav("/login");
      return;
    }
  }, [user, nav]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-64 px-4 pb-16 pt-10 md:px-8 lg:pt-12">
        <div className="mx-auto max-w-[1320px] space-y-12">
          <section className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                <Sparkles size={15} /> Your workspace
              </div>
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-gray-900 md:text-6xl">
                Make every conversation <span className="text-violet-300">count.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-gray-600">
                Welcome back, {user?.name || "User"}. Bring your team together, capture the important moments, and turn meetings into momentum.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:pb-1">
              <Link to="/meet"><Button size="lg"><Video size={18} /> Start a meeting</Button></Link>
              <Link to="/history"><Button variant="secondary" size="lg">View history <ArrowUpRight size={17} /></Button></Link>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[24px] border border-violet-300/20 bg-violet-400/[0.08] p-6 md:p-8">
            <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-violet-400/15 blur-3xl" />
            <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-xl">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-violet-200"><CirclePlay size={16} /> Your next best action</div>
                <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Ready to start a focused session?</h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">Open a room in seconds. NexaCall will take care of the recording and AI-powered recap.</p>
              </div>
              <Link to="/meet"><Button variant="light" size="lg">Open meeting room <ArrowUpRight size={17} /></Button></Link>
            </div>
          </section>

          <QuickStats />

          <div className="grid gap-8 xl:grid-cols-[1.35fr_0.65fr]">
            <UpcomingMeetings />
            <Card className="flex flex-col justify-between gap-8">
              <div>
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-[14px] bg-emerald-400/10 text-emerald-300"><Check size={20} /></div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">Built for clarity</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">Less admin. More progress.</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">Every meeting becomes searchable, shareable context for your team.</p>
              </div>
              <div className="space-y-3 border-t border-white/10 pt-5 text-sm text-gray-600">
                <div className="flex items-center gap-3"><Check size={16} className="text-emerald-300" /> Automatic transcripts</div>
                <div className="flex items-center gap-3"><Check size={16} className="text-emerald-300" /> AI-generated summaries</div>
                <div className="flex items-center gap-3"><Users size={16} className="text-emerald-300" /> One shared workspace</div>
              </div>
            </Card>
          </div>

          <RecentSummaries />
        </div>
      </main>
    </div>
  );
}
