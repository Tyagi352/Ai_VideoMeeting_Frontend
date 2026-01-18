// HeroSection.jsx - Landing Page Hero
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 md:py-32 bg-white overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-blue-50 to-indigo-100 rounded-full blur-3xl -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Meetings That Matter.
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-700">
                  {' '}Summaries That Stick.
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Schedule video meetings, auto-generate AI summaries, and extract action items—all in one place. Focus on the discussion, not the notes.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/signup')}
              >
                Start Free
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  // Scroll to demo or open video
                }}
              >
                Watch Demo
              </Button>
            </div>

            {/* Trust Text */}
            <div className="text-sm text-gray-600">
              ✓ No credit card required • ✓ 14-day free trial • ✓ Cancel anytime
            </div>
          </div>

          {/* Right Visual - Mockup/Illustration */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Placeholder for mockup image or animated illustration */}
              <div className="bg-linear-to-br from-gray-100 to-gray-200 rounded-2xl p-8 aspect-square flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-4">🎥</div>
                  <p className="text-gray-600">Professional Video Meeting UI</p>
                  <p className="text-sm text-gray-500 mt-2">(Replace with actual mockup)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
