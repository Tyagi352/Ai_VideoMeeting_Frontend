// Navbar.jsx - Calendly-style Navigation
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import Button from './Common/Button';

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const token = localStorage.getItem('token');

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:inline">MeetFlow</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#product" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
              Product
            </a>
            <a href="#solutions" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
              Solutions
            </a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
              Pricing
            </a>
            <a href="#resources" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
              Resources
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {token ? (
              <>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  onClick={() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-md transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <FiX className="w-6 h-6 text-gray-900" />
            ) : (
              <FiMenu className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 space-y-3">
            <a href="#product" className="block text-sm font-medium text-gray-600 hover:text-blue-600 py-2">
              Product
            </a>
            <a href="#solutions" className="block text-sm font-medium text-gray-600 hover:text-blue-600 py-2">
              Solutions
            </a>
            <a href="#pricing" className="block text-sm font-medium text-gray-600 hover:text-blue-600 py-2">
              Pricing
            </a>
            <div className="flex gap-2 pt-2">
              <Button variant="ghost" size="md" fullWidth onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="primary" size="md" fullWidth onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
