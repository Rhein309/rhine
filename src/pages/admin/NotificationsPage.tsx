import React, { useState } from 'react';
import { Bell, Search, Send } from 'lucide-react';

const NotificationsPage = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    {
      id: 1,
      type: 'announcement',
      title: 'Lunar New Year Holiday Schedule',
      message: 'Classes will be suspended from Feb 10-15 for Lunar New Year. Happy holidays!',
      recipients: 'All Users',
      date: '2025-01-15',
      status: 'sent'
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Parent-Teacher Meeting',
      message: 'Reminder for upcoming parent-teacher meetings next week.',
      recipients: 'Parents',
      date: '2025-01-14',
      status: 'scheduled'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'announcement':
        return 'bg-blue-100 text-blue-800';
      case 'reminder':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <button 
          onClick={() => window.location.href = '/admin/notifications/new'}
          className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          <Send className="w-4 h-4 mr-2" />
          Send Notification
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex space-x-2">
            {['all', 'announcement', 'reminder'].map((type) => (
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

          <div className="relative">
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
        {filteredNotifications.map((notification) => (
          <div key={notification.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className={`${getTypeColor(notification.type)} p-2 rounded-lg`}>
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{notification.title}</h3>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className="text-sm text-gray-500">To: {notification.recipients}</span>
                    <span className="text-sm text-gray-500">{notification.date}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      notification.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {notification.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;