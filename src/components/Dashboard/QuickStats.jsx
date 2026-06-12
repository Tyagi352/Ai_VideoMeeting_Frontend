// QuickStats.jsx - Dashboard Stats
import React, { useEffect, useState } from 'react';
import { FiTrendingUp, FiCheckCircle, FiClock, FiUsers } from 'react-icons/fi';
import Card from '../Common/Card';
import { fetchSummaries } from '../../api/index.js';

export default function QuickStats() {
  const [totalMeetings, setTotalMeetings] = useState(0);
  const [totalSummaries, setTotalSummaries] = useState(0);
  const [hoursSaved, setHoursSaved] = useState('0h');
  const [teamMembers, setTeamMembers] = useState(0);
  const [weekMeetings, setWeekMeetings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const summaries = await fetchSummaries();
        if (!Array.isArray(summaries)) {
          setLoading(false);
          return;
        }

        // Total summaries generated
        setTotalSummaries(summaries.length);

        // Total unique meetings (by roomId)
        const uniqueRooms = new Set(summaries.map((s) => s.roomId));
        setTotalMeetings(uniqueRooms.size);

        // Meetings this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const thisWeek = summaries.filter(
          (s) => new Date(s.createdAt) >= oneWeekAgo
        );
        setWeekMeetings(thisWeek.length);

        // Estimated hours saved (approx 0.5h per summary)
        const saved = (summaries.length * 0.5).toFixed(1);
        setHoursSaved(`${saved}h`);

        // Unique team members across all meetings
        const memberSet = new Set();
        summaries.forEach((s) => {
          if (Array.isArray(s.participants)) {
            s.participants.forEach((p) => memberSet.add(typeof p === 'object' ? p._id : p));
          }
        });
        setTeamMembers(memberSet.size);
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const stats = [
    {
      icon: FiTrendingUp,
      label: 'Total Meetings',
      value: loading ? '—' : String(totalMeetings),
      change: loading ? '' : `+${weekMeetings} this week`,
    },
    {
      icon: FiCheckCircle,
      label: 'Summaries Generated',
      value: loading ? '—' : String(totalSummaries),
      change: loading ? '' : totalMeetings > 0
        ? `${Math.round((totalSummaries / totalMeetings) * 100)}% completion`
        : '0% completion',
    },
    {
      icon: FiClock,
      label: 'Hours Saved',
      value: loading ? '—' : hoursSaved,
      change: 'est. by AI',
    },
    {
      icon: FiUsers,
      label: 'Team Members',
      value: loading ? '—' : String(teamMembers),
      change: 'across all meetings',
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
