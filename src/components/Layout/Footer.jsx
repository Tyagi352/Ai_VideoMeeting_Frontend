// Footer.jsx - Footer Component
import React from 'react';
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="font-bold text-gray-900">MeetFlow</span>
            </div>
            <p className="text-sm text-gray-600">
              Meetings that matter. Summaries that stick.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition">Features</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition">Pricing</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition">Security</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition">About</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition">Blog</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition">Careers</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition">Privacy</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition">Terms</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            © 2024 MeetFlow. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-blue-600 transition">
              <FiGithub className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition">
              <FiTwitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition">
              <FiLinkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
