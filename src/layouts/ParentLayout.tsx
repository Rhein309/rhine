import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  User, Wallet, Bell, BookOpen, Calendar, 
  FileText, ClipboardList, GraduationCap,
  MessageSquare, HelpCircle, LogOut
} from 'lucide-react';
import { signOut } from '../lib/supabase';

const ParentLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navigation = [
    { name: 'My Profile', icon: User, href: '/parent/profile' },
    { name: 'My Wallet', icon: Wallet, href: '/parent/wallet' },
    { name: 'Notifications', icon: Bell, href: '/parent/notifications' },
    { name: 'Courses', icon: BookOpen, href: '/parent/courses' },
    { name: 'My Bookings', icon: Calendar, href: '/parent/bookings' },
    { name: 'Course Materials', icon: FileText, href: '/parent/materials' },
    { name: 'Attendance Record', icon: ClipboardList, href: '/parent/attendance' },
    { name: 'Grades Record', icon: GraduationCap, href: '/parent/grades' },
    { name: 'Weekly Reports', icon: FileText, href: '/parent/reports' },
    { name: 'Discussion Forum', icon: MessageSquare, href: '/parent/forum' },
    { name: 'My Enquiries', icon: HelpCircle, href: '/parent/enquiries' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
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
      <div className="flex-1 pl-64">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ParentLayout;