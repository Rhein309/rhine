import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, AlertCircle } from 'lucide-react';

type UserType = 'parent' | 'teacher';

const SignupPage = () => {
  const [userType, setUserType] = useState<UserType>('parent');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Parent-specific fields
    childName: '',
    childAge: '',
    // Teacher-specific fields
    subject: '',
    experience: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    

    
    try {
      const response = await fetch('http://localhost:9999/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userType, formData }),
      });
      
      if (response.status === 200) {
        console.log('Registration successful');
        // 注册成功后重定向到登录页面
        window.location.href = '/login';
      } else {
        const errorData = await response.json();
        console.error('Registration failed:', errorData);
        setError(errorData.error || 'Registration failed, please try again later');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setError('Connection error, please try again later');
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center">
            <GraduationCap className="h-12 w-12 text-purple-600" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Create your account</h2>
        </div>

        <div className="mt-8">
          <div className="flex rounded-md shadow-sm mb-6">
            <button
              type="button"
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md ${
                userType === 'parent'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:text-purple-600'
              }`}
              onClick={() => setUserType('parent')}
            >
              Parent
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md ${
                userType === 'teacher'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:text-purple-600'
              }`}
              onClick={() => setUserType('teacher')}
            >
              Teacher
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

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
                value={formData.email}
                onChange={handleChange}
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
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {userType === 'parent' && (
              <>
                <div>
                  <label htmlFor="childName" className="block text-sm font-medium text-gray-700">
                    Child's Name
                  </label>
                  <input
                    id="childName"
                    name="childName"
                    type="text"
                    required
                    value={formData.childName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="childAge" className="block text-sm font-medium text-gray-700">
                    Child's Age
                  </label>
                  <select
                    id="childAge"
                    name="childAge"
                    required
                    value={formData.childAge}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select Age</option>
                    {Array.from({ length: 10 }, (_, i) => i + 3).map(age => (
                      <option key={age} value={age}>{age} years</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {userType === 'teacher' && (
              <>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject Expertise
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                    Years of Experience
                  </label>
                  <input
                    id="experience"
                    name="experience"
                    type="number"
                    min="0"
                    required
                    value={formData.experience}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;