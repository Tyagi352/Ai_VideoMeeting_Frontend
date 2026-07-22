// Sidebar.jsx - Dashboard Sidebar Navigation
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock3, House, Settings, Video, X } from 'lucide-react';
import Avatar from '../Common/Avatar';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const navItems = [
    { icon: House, label: 'Home', path: '/dashboard' },
    { icon: Video, label: 'Meet', path: '/meet' },
    { icon: Clock3, label: 'History', path: '/history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
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
        <div className="fixed inset-x-4 top-4 z-50 flex h-[calc(100vh-2rem)] max-w-72 flex-col rounded-[22px] border border-white/10 bg-[#111113]/95 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:left-6 sm:right-auto sm:w-72">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-violet-400/15 text-violet-300 ring-1 ring-violet-300/20">N</span>
              <h2 className="text-sm font-semibold tracking-tight text-zinc-100">Workspace</h2>
            </div>
            <button onClick={onClose} aria-label="Close menu" className="rounded-[10px] p-2 text-zinc-500 hover:bg-white/10 hover:text-zinc-200">
              <X size={18} />
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 space-y-1.5 px-3 py-5">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`group relative flex w-full items-center gap-3 rounded-[14px] px-3.5 py-3 text-sm font-medium transition duration-200 ${isActive(item.path)
                    ? 'bg-violet-400/12 text-violet-200 shadow-[inset_0_0_0_1px_rgba(167,139,250,0.16)]'
                    : 'text-zinc-500 hover:bg-white/[0.045] hover:text-zinc-100'
                  }`}
              >
                {isActive(item.path) && <span className="absolute -left-3 h-5 w-0.5 rounded-full bg-violet-400" />}
                <item.icon size={18} strokeWidth={isActive(item.path) ? 2.2 : 1.8} className="transition-transform duration-200 group-hover:scale-105" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Profile Section */}
          <div className="space-y-3 border-t border-white/10 p-4">
            <div className="flex items-center gap-3 rounded-[14px] bg-white/[0.035] p-2.5">
              <Avatar name={user.name || 'User'} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-100 truncate">{user.name}</p>
                <p className="text-xs text-zinc-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className="fixed left-4 top-24 z-40 hidden h-[calc(100vh-7rem)] w-60 flex-col rounded-[22px] border border-white/10 bg-[#111113]/90 shadow-[0_18px_55px_rgba(0,0,0,0.28)] backdrop-blur-2xl lg:flex xl:left-6">
      {/* Main Navigation */}
      <nav className="flex-1 space-y-1.5 px-3 py-5">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavClick(item.path)}
            className={`group relative flex w-full items-center gap-3 rounded-[14px] px-3.5 py-3 text-sm font-medium transition duration-200 ${isActive(item.path)
                ? 'bg-violet-400/12 text-violet-200 shadow-[inset_0_0_0_1px_rgba(167,139,250,0.16)]'
                : 'text-zinc-500 hover:bg-white/[0.045] hover:text-zinc-100'
              }`}
          >
            {isActive(item.path) && <span className="absolute -left-3 h-5 w-0.5 rounded-full bg-violet-400" />}
            <item.icon size={18} strokeWidth={isActive(item.path) ? 2.2 : 1.8} className="transition-transform duration-200 group-hover:scale-105" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="space-y-3 border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-[14px] bg-white/[0.035] p-2.5">
          <Avatar name={user.name || 'User'} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-100 truncate">{user.name}</p>
            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
