import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  User, BookOpen, Bell, FileText, 
  ClipboardList, GraduationCap, BarChart, 
  MessageSquare, HelpCircle, LogOut,
  LayoutDashboard
} from 'lucide-react';
import { signOut } from '../lib/supabase';

const TeacherLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/teacher' },
    { name: 'My Profile', icon: User, href: '/teacher/profile' },
    { name: 'Overview', icon: BookOpen, href: '/teacher/overview' },
    { name: 'My Classes', icon: BookOpen, href: '/teacher/classes' },
    { name: 'Notifications', icon: Bell, href: '/teacher/notifications' },
    { name: 'Course Materials', icon: FileText, href: '/teacher/materials' },
    { name: 'Attendance Records', icon: ClipboardList, href: '/teacher/attendance' },
    { name: 'Grades Record', icon: GraduationCap, href: '/teacher/grades' },
    { name: 'Weekly Reports', icon: FileText, href: '/teacher/reports' },
    { name: 'Performance Tracking', icon: BarChart, href: '/teacher/performance' },
    { name: 'Discussion Forum', icon: MessageSquare, href: '/teacher/forum' },
    { name: 'My Enquiries', icon: HelpCircle, href: '/teacher/enquiries' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 bg-white border-b border-gray-200">
            <Link to="/" className="text-2xl font-bold text-purple-600">
              Little Hands
            </Link>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-purple-100 text-purple-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-purple-600'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-purple-600 rounded-md"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;