// QuickStats.jsx - Dashboard Stats
import React from 'react';
import { FiTrendingUp, FiCheckCircle, FiClock, FiUsers } from 'react-icons/fi';
import Card from '../Common/Card';

export default function QuickStats() {
  const stats = [
    {
      icon: FiTrendingUp,
      label: 'Total Meetings',
      value: '24',
      change: '+3 this week',
    },
    {
      icon: FiCheckCircle,
      label: 'Summaries Generated',
      value: '18',
      change: '75% completion',
    },
    {
      icon: FiClock,
      label: 'Hours Saved',
      value: '12.5h',
      change: 'est. by AI',
    },
    {
      icon: FiUsers,
      label: 'Team Members',
      value: '8',
      change: 'active today',
    },
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Stats</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
            </div>
            <p className="text-xs text-gray-500">{stat.change}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
