import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Users, Settings, Bell, Database,
  FileText, ClipboardList, MessageSquare,
  HelpCircle, LogOut, GraduationCap,
  BookOpen
} from 'lucide-react';
import { signOut } from '../lib/supabase';

const AdminLayout = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', icon: Database, href: '/admin' },
    { name: 'Students', icon: GraduationCap, href: '/admin/students' },
    { name: 'Teachers', icon: Users, href: '/admin/teachers' },
    { name: 'Courses', icon: BookOpen, href: '/admin/courses' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
    { name: 'Notifications', icon: Bell, href: '/admin/notifications' },
    { name: 'Reports', icon: FileText, href: '/admin/reports' },
    { name: 'Logs', icon: ClipboardList, href: '/admin/logs' },
    { name: 'Messages', icon: MessageSquare, href: '/admin/messages' },
    { name: 'Support', icon: HelpCircle, href: '/admin/support' }
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 bg-white border-b border-gray-200">
            <Link to="/" className="text-2xl font-bold text-purple-600">
              Little Hands
            </Link>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1">
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

      <div className="pl-64">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;