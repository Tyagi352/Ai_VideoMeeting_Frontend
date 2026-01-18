import { useState, useEffect } from "react";
import { login, getUser } from "../api/index.js";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Card from "../components/Common/Card.jsx";
import Input from "../components/Common/Input.jsx";
import Button from "../components/Common/Button.jsx";

export default function Login() {
  const nav = useNavigate();
  const currentUser = getUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) {
      nav("/dashboard");
    }
  }, [currentUser, nav]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const res = await login(email, password);
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        nav("/dashboard");
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-20 px-4 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to access your meetings and summaries
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                required
              />

              <Button 
                type="submit" 
                variant="primary" 
                size="md" 
                className="w-full"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center text-sm">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
                  Create one
                </Link>
              </p>
            </div>

            {/* Footer Info */}
            <div className="text-center text-xs text-gray-500 border-t pt-4">
              Secure login Â· AI summaries Â· Private meetings
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
