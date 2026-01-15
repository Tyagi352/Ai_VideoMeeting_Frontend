import { Link, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../api/index.js';
import { FiLogOut, FiUser, FiHome, FiClock } from 'react-icons/fi';

export default function Navbar() {
  const user = getUser();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  return (
    <nav className="w-full bg-white shadow-sm py-3 px-6 flex justify-between items-center position-sticky-top top-0 z-50">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold text-lg text-blue-600 flex items-center gap-2"><FiHome />NexaCall</Link>
        <Link to="/dashboard" className="text-sm text-gray-600 hover:text-blue-600">Dashboard</Link>
        {user && (
          <Link to="/history" className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1">
            <FiClock className="text-lg" />
            History
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>

            <div className="flex items-center gap-2 text-sm text-gray-700"><FiUser /> {user.name}</div>
            <button onClick={handleLogout} className="text-sm bg-red-500 text-white px-3 py-1 rounded flex items-center gap-2"><FiLogOut /> Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-gray-700 hover:text-blue-600">Login</Link>
            <Link to="/signup" className="text-sm text-gray-700 hover:text-blue-600">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
