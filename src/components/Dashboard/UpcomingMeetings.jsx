// UpcomingMeetings.jsx - Upcoming Meetings Card
import React from 'react';
import { FiCalendar, FiUsers, FiArrowRight } from 'react-icons/fi';
import Card from '../Common/Card';
import Button from '../Common/Button';
import Avatar from '../Common/Avatar';

export default function UpcomingMeetings({ meetings = [] }) {
  // Sample data if none provided
  const sampleMeetings = meetings.length === 0 ? [
    {
      id: 1,
      title: 'Q1 Planning',
      date: '2024-01-20',
      time: '10:00 AM',
      participants: ['Alice', 'Bob', 'Charlie'],
    },
    {
      id: 2,
      title: 'Design Review',
      date: '2024-01-20',
      time: '2:00 PM',
      participants: ['Sarah', 'Tom'],
    },
    {
      id: 3,
      title: 'Team Standup',
      date: '2024-01-21',
      time: '9:00 AM',
      participants: ['Dev Team'],
    },
  ] : meetings;

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Upcoming Meetings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sampleMeetings.map((meeting) => (
          <Card key={meeting.id} hoverable className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {meeting.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <FiCalendar className="w-4 h-4" />
                <span>{meeting.date} at {meeting.time}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FiUsers className="w-4 h-4 text-gray-600" />
              <div className="flex -space-x-2">
                {meeting.participants.slice(0, 3).map((participant, idx) => (
                  <Avatar
                    key={idx}
                    name={participant}
                    size="sm"
                    className="border-2 border-white"
                  />
                ))}
              </div>
              {meeting.participants.length > 3 && (
                <span className="text-xs text-gray-600">
                  +{meeting.participants.length - 3}
                </span>
              )}
            </div>

            <Button variant="primary" size="md" fullWidth>
              Join Meeting
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
