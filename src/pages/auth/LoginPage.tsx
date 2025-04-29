import React, { useState } from 'react';

type UserType = 'teacher' | 'parent' | 'admin';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('teacher');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 提交登录表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // 使用后端API进行身份验证
      const response = await fetch('http://localhost:9999/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userType, email, password }),
      });
      
      if (response.status === 200) {
        const data = await response.json();
        console.log('Login successful:', data);
        
        // 创建与 AuthContext 期望格式一致的用户数据
        const userData = {
          email: data.user.email,
          profile: {
            id: data.user.id.toString(),
            user_type: data.user.userType,
            first_name: data.user.firstName,
            last_name: data.user.lastName,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        };
        
        // 将用户数据存储到 localStorage 中，以便 AuthContext 可以读取
        localStorage.setItem('user', JSON.stringify(userData));
        
        // 重定向到相应的页面
        switch (data.user.userType) {
          case 'admin':
            window.location.href = '/admin';
            break;
          case 'teacher':
            window.location.href = '/teacher';
            break;
          case 'parent':
            window.location.href = '/parent';
            break;
        }
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        setError(errorData.error || 'Invalid email or password');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };


  //demo email

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

          {
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select User Type
              </label>
              <div className="flex rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={() => setUserType('teacher')}
                  className={`flex-1 py-2 px-4 text-sm font-medium ${userType === 'teacher'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:text-purple-600 border border-gray-300'
                    } rounded-l-md`}
                >
                  Teacher
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('parent')}
                  className={`flex-1 py-2 px-4 text-sm font-medium ${userType === 'parent'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:text-purple-600 border-y border-gray-300'
                    }`}
                >
                  Parent
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('admin')}
                  className={`flex-1 py-2 px-4 text-sm font-medium ${userType === 'admin'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:text-purple-600 border border-gray-300'
                    } rounded-r-md`}
                >
                  Admin
                </button>
              </div>
            </div>
          }

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