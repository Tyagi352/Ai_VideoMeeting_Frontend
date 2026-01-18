// HowItWorks.jsx - How It Works Section
import React from 'react';
import { FiPlus } from 'react-icons/fi';

export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Create',
      description: 'Generate a unique meeting link and share it with participants.',
    },
    {
      number: '2',
      title: 'Meet',
      description: 'Join crystal-clear video calls with screen sharing and recording.',
    },
    {
      number: '3',
      title: 'Summarize',
      description: 'Get AI-generated summaries with key points and action items automatically.',
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            Simple steps to productive meetings
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step Card */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-blue-600">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600 max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>

              {/* Connector Line - Hide on mobile and last item */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-linear-to-r from-blue-300 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
