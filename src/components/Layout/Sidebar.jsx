// Sidebar.jsx - Dashboard Sidebar Navigation
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiVideo, FiClock, FiSettings, FiLogOut, FiX } from 'react-icons/fi';
import Avatar from '../Common/Avatar';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const navItems = [
    { icon: FiHome, label: 'Home', path: '/dashboard' },
    { icon: FiVideo, label: 'Meet', path: '/meet' },
    { icon: FiClock, label: 'History', path: '/history' },
    { icon: FiSettings, label: 'Settings', path: '/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavClick = (path) => {
    navigate(path);
    if (isOpen) onClose();
  };

  // Mobile overlay
  if (isOpen) {
    return (
      <>
        <div 
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
        <div className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-gray-200 flex flex-col z-50 shadow-lg">
          <div className="flex justify-between items-center px-4 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Menu</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Profile Section */}
          <div className="px-4 py-4 border-t border-gray-200 space-y-3">
            <div className="flex items-center gap-3">
              <Avatar name={user.name || 'User'} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className="hidden lg:flex fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 flex-col">
      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavClick(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition ${
              isActive(item.path)
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="px-4 py-4 border-t border-gray-200 space-y-3">
        <div className="flex items-center gap-3">
          <Avatar name={user.name || 'User'} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
