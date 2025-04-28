import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, School, Calendar } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { 
      name: 'Total Students', 
      value: '156', 
      icon: Users, 
      change: '+12%', 
      changeType: 'increase',
      link: '/admin/students'
    },
    { 
      name: 'Active Courses', 
      value: '24', 
      icon: BookOpen, 
      change: '+2', 
      changeType: 'increase',
      link: '/admin/courses'
    },
    { 
      name: 'Teachers', 
      value: '18', 
      icon: School, 
      change: '0', 
      changeType: 'neutral',
      link: '/admin/teachers'
    },
    { 
      name: 'Classes Today', 
      value: '42', 
      icon: Calendar, 
      change: '-3', 
      changeType: 'decrease',
      link: '/admin/courses'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div 
            key={stat.name} 
            className="bg-white rounded-lg p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200"
            onClick={() => navigate(stat.link)}
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-8 h-8 text-purple-600" />
              <span className={`text-sm font-medium ${
                stat.changeType === 'increase' ? 'text-green-600' :
                stat.changeType === 'decrease' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600">{stat.name}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          {/* Add activity content here */}
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          {/* Add status content here */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;