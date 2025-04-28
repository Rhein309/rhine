import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, AlertCircle } from 'lucide-react';
import { signIn, UserType } from '../../lib/supabase';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('teacher');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  //submit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      //form
      await signIn(email, password, userType);
      
      // Redirect based on user type
      const response = await fetch('http://localhost:9999/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userType, email, password }),
      });
      if (response.ok) {
        console.log('login successful');
      } else {
        console.error('login failed');
      }
    }  catch (err) {
      setError('Invalid email or password');
      setLoading(false);
    }
  };


//demo email
  const isDemoEmail = email === 'skkaur2003@gmail.com';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center">
            <GraduationCap className="h-12 w-12 text-purple-600" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {isDemoEmail && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select User Type
              </label>
              <div className="flex rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={() => setUserType('teacher')}
                  className={`flex-1 py-2 px-4 text-sm font-medium ${
                    userType === 'teacher'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:text-purple-600 border border-gray-300'
                  } rounded-l-md`}
                >
                  Teacher
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('parent')}
                  className={`flex-1 py-2 px-4 text-sm font-medium ${
                    userType === 'parent'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:text-purple-600 border-y border-gray-300'
                  }`}
                >
                  Parent
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('admin')}
                  className={`flex-1 py-2 px-4 text-sm font-medium ${
                    userType === 'admin'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:text-purple-600 border border-gray-300'
                  } rounded-r-md`}
                >
                  Admin
                </button>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-purple-600 hover:text-purple-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;