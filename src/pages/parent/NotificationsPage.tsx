import React, { useState } from 'react';
import { Bell, BookOpen, Calendar, FileText, GraduationCap } from 'lucide-react';

const NotificationsPage = () => {
  const [filter, setFilter] = useState('all');

  const notifications = [
    {
      id: 1,
      type: 'announcement',
      title: 'Lunar New Year Holiday Schedule',
      message: 'Classes will be suspended from Feb 10-15 for Lunar New Year. Happy holidays!',
      date: '2025-01-15',
      read: false
    },
    {
      id: 2,
      type: 'booking',
      title: 'Class Booking Confirmed',
      message: 'Your booking for Phonics Foundation (Mon, Wed, Fri 3-4pm) has been confirmed.',
      date: '2025-01-14',
      read: true
    },
    {
      id: 3,
      type: 'attendance',
      title: 'Attendance Record Updated',
      message: 'Emily\'s attendance for Phonics Foundation on Jan 13 has been recorded.',
      date: '2025-01-13',
      read: true
    },
    {
      id: 4,
      type: 'grade',
      title: 'New Grade Report Available',
      message: 'Emily\'s grade report for Young Readers Week 2 is now available.',
      date: '2025-01-12',
      read: false
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'announcement':
        return <Bell className="w-5 h-5" />;
      case 'booking':
        return <Calendar className="w-5 h-5" />;
      case 'attendance':
        return <FileText className="w-5 h-5" />;
      case 'grade':
        return <GraduationCap className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'announcement':
        return 'text-purple-500';
      case 'booking':
        return 'text-blue-500';
      case 'attendance':
        return 'text-green-500';
      case 'grade':
        return 'text-amber-500';
      default:
        return 'text-gray-500';
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Notifications</h1>

      {/* Filters */}
      <div className="flex space-x-2 mb-6">
        {['all', 'announcement', 'booking', 'attendance', 'grade'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === type
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
        {filteredNotifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`p-4 ${notification.read ? 'bg-white' : 'bg-purple-50'}`}
          >
            <div className="flex items-start space-x-4">
              <div className={`${getIconColor(notification.type)} mt-1`}>
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{notification.title}</h3>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                  </div>
                  <span className="text-sm text-gray-500">{notification.date}</span>
                </div>
                {!notification.read && (
                  <span className="inline-block mt-2 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                    New
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;