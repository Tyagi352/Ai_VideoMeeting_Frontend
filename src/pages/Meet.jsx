import { useEffect, useState } from "react";
import { getUser } from "../api/index.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Layout/Sidebar.jsx";
import Button from "../components/Common/Button.jsx";
import Card from "../components/Common/Card.jsx";
import { FiPlus, FiVideo, FiLink } from "react-icons/fi";

export default function Meet() {
  const [roomInput, setRoomInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = getUser();
  const nav = useNavigate();

  useEffect(() => {
    if (!user) {
      nav("/login");
      return;
    }
  }, [user, nav]);

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
                    <input
                      type="text"
                      value={roomInput}
                      onChange={(e) => setRoomInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter Room ID (e.g., abc1234)"
                      className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-900 placeholder-gray-500"
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
