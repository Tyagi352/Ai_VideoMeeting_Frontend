import { useEffect, useState } from "react";
import { getUser } from "../api/index.js";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Layout/Sidebar.jsx";
import Button from "../components/Common/Button.jsx";
import Card from "../components/Common/Card.jsx";
import Badge from "../components/Common/Badge.jsx";
import Avatar from "../components/Common/Avatar.jsx";
import { FiLogOut, FiUser, FiShield, FiBell } from "react-icons/fi";

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = getUser();
  const nav = useNavigate();

  useEffect(() => {
    if (!user) {
      nav("/login");
      return;
    }
  }, [user, nav]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      nav("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="lg:ml-64 pt-20 pb-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="pt-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Settings
            </h1>
            <p className="text-gray-600">
              Manage your account and preferences
            </p>
          </div>

          {/* Profile Section */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FiUser className="w-6 h-6" />
                Profile Information
              </h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar name={user?.name || "User"} size="lg" />
                <div>
                  <p className="text-sm text-gray-600 mb-2">Profile Picture</p>
                  <Button variant="secondary" size="sm" disabled>
                    Change Photo (Coming Soon)
                  </Button>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <p className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900">
                    {user?.name || "Not provided"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <p className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900">
                    {user?.email || "Not provided"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Status
                  </label>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">Active</Badge>
                    <span className="text-sm text-gray-600">Your account is active and verified</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Security Section */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
              <FiShield className="w-6 h-6" />
              Security & Privacy
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Password</p>
                  <p className="text-sm text-gray-600">Manage your account password</p>
                </div>
                <Button variant="secondary" size="sm" disabled>
                  Change (Coming Soon)
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">Add extra security to your account</p>
                </div>
                <Button variant="secondary" size="sm" disabled>
                  Enable (Coming Soon)
                </Button>
              </div>
            </div>
          </Card>

          {/* Notifications Section */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
              <FiBell className="w-6 h-6" />
              Notifications
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive updates about your meetings</p>
                </div>
                <input 
                  type="checkbox" 
                  defaultChecked 
                  disabled
                  className="w-5 h-5 text-blue-600"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="font-medium text-gray-900">Meeting Reminders</p>
                  <p className="text-sm text-gray-600">Get reminded before your scheduled meetings</p>
                </div>
                <input 
                  type="checkbox" 
                  defaultChecked 
                  disabled
                  className="w-5 h-5 text-blue-600"
                />
              </div>
            </div>
          </Card>

          {/* Logout Section */}
          <Card className="bg-linear-to-br from-red-50 to-red-100 border-2 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FiLogOut className="w-6 h-6 text-red-600" />
                  Logout
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Sign out of your account and end your session
                </p>
              </div>
              <Button 
                variant="danger" 
                size="lg"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </Card>

          {/* Account Info */}
          <Card className="bg-gray-50 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Information</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Account created: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Not available"}</p>
              <p>User ID: {user?._id || "Not available"}</p>
              <p>Email verified: Yes</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
