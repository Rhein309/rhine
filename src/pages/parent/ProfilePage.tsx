import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, Calendar, GraduationCap } from 'lucide-react';

const ProfilePage = () => {
  const { profile } = useAuth();

  const parentInfo = {
    firstName: profile?.first_name || 'Parent',
    lastName: profile?.last_name || 'User',
    email: 'parent@example.com',
    phone: '+852 1234 5678',
    joinDate: '2024-01-01',
    children: [
      {
        name: 'Emily Wong',
        age: 7,
        enrolledCourses: ['Phonics Foundation', 'Young Readers'],
        joinDate: '2024-01-15'
      },
      {
        name: 'Thomas Wong',
        age: 5,
        enrolledCourses: ['Phonics Foundation'],
        joinDate: '2024-02-01'
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      {/* Parent Information */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Parent Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-gray-900">{`${parentInfo.firstName} ${parentInfo.lastName}`}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-900">{parentInfo.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-gray-900">{parentInfo.phone}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Join Date</p>
              <p className="text-gray-900">{parentInfo.joinDate}</p>
            </div>
          </div>
        </div>
        <button className="mt-6 text-purple-600 hover:text-purple-700 font-medium text-sm">
          Edit Information
        </button>
      </div>

      {/* Children Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Children</h2>
        <div className="space-y-6">
          {parentInfo.children.map((child, index) => (
            <div key={index} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-medium text-gray-900">{child.name}</h3>
                  <p className="text-sm text-gray-500">Age: {child.age} years old</p>
                </div>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  Edit
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Enrolled Courses</p>
                    <p className="text-gray-900">{child.enrolledCourses.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Join Date</p>
                    <p className="text-gray-900">{child.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;