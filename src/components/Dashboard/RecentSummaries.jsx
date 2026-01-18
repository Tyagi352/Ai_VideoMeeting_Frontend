// RecentSummaries.jsx - Recent Meeting Summaries
import React from 'react';
import { FiChevronRight, FiDownload } from 'react-icons/fi';
import Card from '../Common/Card';
import Badge from '../Common/Badge';

export default function RecentSummaries() {
  const summaries = [
    {
      id: 1,
      title: 'Q1 Product Roadmap',
      date: '2024-01-19',
      duration: '45 min',
      status: 'completed',
      keyPoints: 3,
    },
    {
      id: 2,
      title: 'Engineering Standup',
      date: '2024-01-19',
      duration: '15 min',
      status: 'completed',
      keyPoints: 5,
    },
    {
      id: 3,
      title: 'Client Presentation',
      date: '2024-01-18',
      duration: '60 min',
      status: 'processing',
      keyPoints: null,
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Recent Summaries</h2>
        <a href="/history" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
          View All
          <FiChevronRight className="w-4 h-4" />
        </a>
      </div>

      <div className="space-y-3">
        {summaries.map((summary) => (
          <Card key={summary.id} hoverable clickable className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900">
                {summary.title}
              </h3>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-gray-600">
                  {summary.date}
                </span>
                <span className="text-sm text-gray-600">
                  {summary.duration}
                </span>
                <Badge
                  variant={summary.status === 'completed' ? 'success' : 'warning'}
                  size="sm"
                >
                  {summary.status === 'completed' ? 'Ready' : 'Processing...'}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {summary.keyPoints && (
                <span className="text-sm font-medium text-gray-600">
                  {summary.keyPoints} points
                </span>
              )}
              <FiDownload className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
