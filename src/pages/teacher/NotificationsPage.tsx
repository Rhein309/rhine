import React, { useState } from 'react';
import { Bell, BookOpen, Calendar, FileText, GraduationCap } from 'lucide-react';

const NotificationsPage = () => {
  const [filter, setFilter] = useState('all');

  const notifications = [
    {
      id: 1,
      type: 'attendance',
      title: 'Attendance Reminder',
      message: 'Please mark attendance for Phonics Foundation class at 10:00 AM',
      date: '2025-01-15',
      read: false
    },
    {
      id: 2,
      type: 'grade',
      title: 'Grade Submission Due',
      message: 'Weekly grades for Young Readers class are due today',
      date: '2025-01-14',
      read: true
    },
    {
      id: 3,
      type: 'admin',
      title: 'Staff Meeting',
      message: 'Monthly staff meeting scheduled for Friday at 3 PM',
      date: '2025-01-13',
      read: false
    },
    {
      id: 4,
      type: 'material',
      title: 'New Course Materials Available',
      message: 'New teaching materials have been uploaded for Phonics Foundation',
      date: '2025-01-12',
      read: true
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'attendance':
        return <Calendar className="w-5 h-5" />;
      case 'grade':
        return <GraduationCap className="w-5 h-5" />;
      case 'admin':
        return <Bell className="w-5 h-5" />;
      case 'material':
        return <BookOpen className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'attendance':
        return 'text-blue-500';
      case 'grade':
        return 'text-green-500';
      case 'admin':
        return 'text-purple-500';
      case 'material':
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
        {['all', 'attendance', 'grade', 'admin', 'material'].map((type) => (
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