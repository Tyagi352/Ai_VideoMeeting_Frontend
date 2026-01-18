// FeaturesSection.jsx - Features Showcase
import React from 'react';
import { FiCalendar, FiVideo, FiTrendingUp } from 'react-icons/fi';
import Card from '../Common/Card';

export default function FeaturesSection() {
  const features = [
    {
      icon: FiCalendar,
      title: 'Smart Scheduling',
      description: 'Calendly-like integration with one-click meeting links and automatic reminders.',
    },
    {
      icon: FiVideo,
      title: 'Crystal Clear Video',
      description: 'HD video conferencing with support for multiple participants and screen sharing.',
    },
    {
      icon: FiTrendingUp,
      title: 'AI-Powered Summaries',
      description: 'Automatic transcription, key points extraction, and action item identification.',
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to make your meetings more productive and your summaries more actionable.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} hoverable className="space-y-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
