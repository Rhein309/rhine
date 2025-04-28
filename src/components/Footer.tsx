import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold text-purple-400">Little Hands</span>
            </div>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/p/Little-Hands-Learning-Centre-100084786672630/"
                target="_blank"
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <Link to="/location" className="text-gray-400 hover:text-white transition-colors duration-200">
                <MapPin className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">Home</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-200">About Us</Link></li>
              <li><Link to="/courses" className="text-gray-400 hover:text-white transition-colors duration-200">Courses</Link></li>
              <li><Link to="/location" className="text-gray-400 hover:text-white transition-colors duration-200">Location</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Little Hands Learning Centre. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;