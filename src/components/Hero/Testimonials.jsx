// Testimonials.jsx - Social Proof Section
import React from 'react';
import Card from '../Common/Card';
import Avatar from '../Common/Avatar';

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        'MeetFlow transformed how our team manages meetings. The AI summaries save us hours every week.',
      author: 'Sarah Johnson',
      role: 'Product Manager',
      company: 'TechCorp',
      avatar: 'SJ',
    },
    {
      quote:
        'Finally, a meeting tool that actually helps us remember what we discussed. Game changer.',
      author: 'Michael Chen',
      role: 'CEO',
      company: 'StartupXYZ',
      avatar: 'MC',
    },
    {
      quote:
        'The scheduling and summaries are so smooth. Our team adoption was instant.',
      author: 'Emily Rodriguez',
      role: 'HR Director',
      company: 'Global Solutions',
      avatar: 'ER',
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Trusted by Teams Worldwide
          </h2>
          <p className="text-xl text-gray-600">
            See what professionals are saying about MeetFlow
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="space-y-4">
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ★
                  </span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 italic">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <Avatar name={testimonial.author} size="md" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-gray-600">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
