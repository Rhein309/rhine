import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, profile } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Courses', href: '/courses' },
    { name: 'Location', href: '/location' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-purple-600">Little Hands</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-medium transition-colors duration-200 ${
                  location.pathname === item.href
                    ? 'text-purple-600'
                    : 'text-gray-700 hover:text-purple-600'
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-700 hover:text-purple-600">
                <Globe className="w-5 h-5" />
                <span className="ml-1">EN</span>
              </button>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">
                    Welcome, {profile?.first_name}
                  </span>
                  <Link
                    to={`/${profile?.user_type}`}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                  >
                    My Account
                  </Link>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                  >
                    Sign in
                  </Link>
                  
                  <Link
                    to="/signup"
                    className="bg-white hover:bg-purple-50 text-purple-600 px-4 py-2 rounded-md border border-purple-600 transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block py-2 text-gray-700 hover:text-purple-600"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <div className="mt-4 space-y-2">
                <div className="text-gray-600 text-center">
                  Welcome, {profile?.first_name}
                </div>
                <Link
                  to={`/${profile?.user_type}`}
                  className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  My Account
                </Link>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <Link
                  to="/login"
                  className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="block w-full text-center bg-white hover:bg-purple-50 text-purple-600 px-4 py-2 rounded-md border border-purple-600"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;