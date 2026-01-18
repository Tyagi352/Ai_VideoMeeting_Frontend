import { useEffect, useState } from "react";
import { getUser } from "../api/index.js";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Layout/Sidebar.jsx";
import Button from "../components/Common/Button.jsx";
import Card from "../components/Common/Card.jsx";
import QuickStats from "../components/Dashboard/QuickStats.jsx";
import UpcomingMeetings from "../components/Dashboard/UpcomingMeetings.jsx";
import { FiVideo, FiCheck, FiUsers, FiZap } from "react-icons/fi";

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

      <main className="lg:ml-64 pt-20 pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Welcome Section */}
          <div className="pt-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name || "User"}
            </h1>
            <p className="text-gray-600">
              Connect with your team, record meetings, and get AI-powered summaries
            </p>
          </div>

          {/* Quick Stats */}
          <QuickStats />

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-linear-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-200 rounded-lg">
                  <FiVideo className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">HD Video Calls</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Crystal clear video conferencing with multiple participants
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-linear-to-br from-green-50 to-green-100 border border-green-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-200 rounded-lg">
                  <FiZap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Summaries</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Automatic meeting transcripts and intelligent summaries
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-linear-to-br from-purple-50 to-purple-100 border border-purple-200">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-200 rounded-lg">
                  <FiUsers className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Team Collaboration</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Seamlessly collaborate with your entire team in one place
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* CTA Section */}
          <Card className="bg-linear-to-r from-blue-600 to-blue-700">
            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Ready to start a meeting?
              </h2>
              <p className="text-blue-100">
                Go to the Meet section to create a new room or join an existing meeting
              </p>
              <Link to="/meet">
                <Button variant="light" size="lg" className="w-full md:w-auto">
                  Go to Meetings →
                </Button>
              </Link>
            </div>
          </Card>

          {/* Upcoming Meetings */}
          <UpcomingMeetings />

          {/* How It Works */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                  1
                </div>
                <h3 className="font-semibold text-gray-900">Create or Join</h3>
                <p className="text-gray-600 text-sm">
                  Create a new room or join one using a meeting link
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                  2
                </div>
                <h3 className="font-semibold text-gray-900">Start Meeting</h3>
                <p className="text-gray-600 text-sm">
                  Connect with your team and start recording
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                  3
                </div>
                <h3 className="font-semibold text-gray-900">Get AI Summary</h3>
                <p className="text-gray-600 text-sm">
                  Receive automatic summaries in your history
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
