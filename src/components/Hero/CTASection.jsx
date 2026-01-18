// CTASection.jsx - Call to Action Section
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Common/Button';

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-32 bg-linear-to-br from-blue-600 to-blue-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          Ready to Transform Your Meetings?
        </h2>

        {/* Subheading */}
        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
          Join teams that have already discovered a better way to meet and summarize.
          Start your 14-day free trial today.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/signup')}
            className="bg-white text-blue-600 hover:bg-blue-50"
          >
            Start Free Trial
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              /* Scroll to contact form or open demo */
            }}
            className="border-2 border-white text-white hover:bg-blue-600"
          >
            Schedule Demo
          </Button>
        </div>

        {/* Trust Text */}
        <p className="text-blue-100 text-sm">
          ✓ No credit card required • ✓ Instant setup • ✓ 24/7 support
        </p>
      </div>
    </section>
  );
}
