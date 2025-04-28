import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Calendar, BookOpen, FileText } from 'lucide-react';

const ParentDashboard = () => {
  const { profile } = useAuth();

  const quickActions = [
    {
      title: 'View Courses',
      icon: BookOpen,
      description: 'Browse and enroll in available courses',
      link: '/parent/courses',
      color: 'bg-blue-500'
    },
    {
      title: 'My Bookings',
      icon: Calendar,
      description: 'Check your upcoming classes',
      link: '/parent/bookings',
      color: 'bg-purple-500'
    },
    {
      title: 'Course Materials',
      icon: FileText,
      description: 'Access your learning materials',
      link: '/parent/materials',
      color: 'bg-green-500'
    },
    {
      title: 'Notifications',
      icon: Bell,
      description: 'View your latest updates',
      link: '/parent/notifications',
      color: 'bg-amber-500'
    }
  ];

  const recentNotifications = [
    {
      id: 1,
      title: 'New Grade Report Available',
      course: 'Phonics Foundation',
      date: '2025-01-15'
    },
    {
      id: 2,
      title: 'Upcoming Holiday Notice',
      course: 'System',
      date: '2025-01-14'
    },
    {
      id: 3,
      title: 'Course Material Updated',
      course: 'Young Readers',
      date: '2025-01-13'
    }
  ];

  const upcomingClasses = [
    {
      id: 1,
      course: 'Phonics Foundation',
      date: '2025-01-16',
      time: '15:00 - 16:00',
      teacher: 'Ms. Sarah'
    },
    {
      id: 2,
      course: 'Young Readers',
      date: '2025-01-17',
      time: '14:00 - 15:00',
      teacher: 'Mr. John'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile?.first_name}!</h1>
        <p className="text-gray-600 mt-2">Here's an overview of your child's learning journey</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
            <p className="text-gray-600 text-sm">{action.description}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Notifications */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
          <div className="space-y-4">
            {recentNotifications.map((notification) => (
              <div key={notification.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <h3 className="font-medium text-gray-900">{notification.title}</h3>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-600">{notification.course}</span>
                  <span className="text-sm text-gray-500">{notification.date}</span>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/parent/notifications"
            className="mt-4 inline-block text-purple-600 hover:text-purple-700 font-medium"
          >
            View all notifications
          </Link>
        </div>

        {/* Upcoming Classes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Classes</h2>
          <div className="space-y-4">
            {upcomingClasses.map((class_) => (
              <div key={class_.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <h3 className="font-medium text-gray-900">{class_.course}</h3>
                <div className="mt-1 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{class_.date}</span>
                    <span className="text-sm text-gray-600">{class_.time}</span>
                  </div>
                  <p className="text-sm text-gray-500">Teacher: {class_.teacher}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/parent/bookings"
            className="mt-4 inline-block text-purple-600 hover:text-purple-700 font-medium"
          >
            View full schedule
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;