import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Users, BookOpen, Clock, Calendar, BarChart as ChartBar } from 'lucide-react';

const TeacherDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [showAllActivities, setShowAllActivities] = useState(false);

  const quickActions = [
    {
      title: 'View Courses',
      icon: BookOpen,
      description: 'Browse and manage your courses',
      link: '/teacher/classes',
      color: 'bg-blue-500'
    },
    {
      title: 'My Schedule',
      icon: Calendar,
      description: 'Check your upcoming classes',
      link: '/teacher/classes',
      color: 'bg-purple-500'
    },
    {
      title: 'Course Materials',
      icon: BookOpen,
      description: 'Access your teaching materials',
      link: '/teacher/materials',
      color: 'bg-green-500'
    },
    {
      title: 'Notifications',
      icon: Clock,
      description: 'View your latest updates',
      link: '/teacher/notifications',
      color: 'bg-amber-500'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'grade',
      description: 'Submitted grades for Phonics Foundation Week 3 Quiz',
      time: '30 minutes ago',
      link: '/teacher/grades'
    },
    {
      id: 2,
      type: 'attendance',
      description: 'Marked attendance for Young Readers morning class',
      time: '1 hour ago',
      link: '/teacher/attendance'
    },
    {
      id: 3,
      type: 'material',
      description: 'Uploaded new study materials for Grammar Class',
      time: '2 hours ago',
      link: '/teacher/materials'
    },
    {
      id: 4,
      type: 'grade',
      description: 'Updated grades for Young Readers Week 2 Assignment',
      time: '3 hours ago',
      link: '/teacher/grades'
    },
    {
      id: 5,
      type: 'attendance',
      description: 'Marked attendance for Advanced English afternoon class',
      time: '4 hours ago',
      link: '/teacher/attendance'
    },
    {
      id: 6,
      type: 'material',
      description: 'Added new vocabulary worksheets for Phonics Foundation',
      time: '5 hours ago',
      link: '/teacher/materials'
    }
  ];

  const upcomingClasses = [
    {
      id: 1,
      course: 'Phonics Foundation',
      time: '10:00 AM - 11:00 AM',
      students: 6,
      room: 'Room 101'
    },
    {
      id: 2,
      course: 'Young Readers',
      time: '11:30 AM - 12:30 PM',
      students: 5,
      room: 'Online'
    }
  ];

  const displayedActivities = showAllActivities ? recentActivities : recentActivities.slice(0, 3);

  return (
    <div>
      {/* Stats Overview */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile?.first_name}!</h1>
          <p className="text-gray-600 mt-2">Here's an overview of your classes and activities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <div
              key={index}
              onClick={() => navigate(action.link)}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Classes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Today's Classes</h2>
            <div className="space-y-4">
              {upcomingClasses.map((class_) => (
                <div key={class_.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{class_.course}</h3>
                    <p className="text-sm text-gray-500">{class_.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{class_.room}</p>
                    <p className="text-sm text-gray-500">{class_.students} students</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/teacher/classes')}
              className="mt-4 text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              View Full Schedule
            </button>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {displayedActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  onClick={() => navigate(activity.link)}
                  className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
                >
                  <div className="flex-shrink-0">
                    {activity.type === 'grade' && <ChartBar className="w-5 h-5 text-blue-500" />}
                    {activity.type === 'attendance' && <Clock className="w-5 h-5 text-green-500" />}
                    {activity.type === 'material' && <BookOpen className="w-5 h-5 text-purple-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{activity.description}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowAllActivities(!showAllActivities)}
              className="mt-4 text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              {showAllActivities ? 'Show Less' : 'View More Activities'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;