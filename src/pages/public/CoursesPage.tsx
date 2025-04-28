import React, { useState } from 'react';
import { Search, Clock, Users, Calendar } from 'lucide-react';

const CoursesPage = () => {
  const [filters, setFilters] = useState({
    age: '',
    type: 'all',
    days: '',
    search: ''
  });

  const courses = [
    {
      name: "Phonics Foundation",
      type: "offline",
      ageRange: "3-5",
      description: "Introduces children to the sounds of letters and builds the foundation for reading and writing in English.",
      schedule: "Mon, Wed, Fri",
      time: "3:00 PM - 4:00 PM",
      maxStudents: 6,
      duration: "12 weeks",
      fee: "HKD 3,600"
    },
    {
      name: "Online Young Readers",
      type: "online",
      ageRange: "5-7",
      description: "Interactive online sessions focusing on reading fluency and comprehension.",
      schedule: "Tue, Thu",
      time: "4:00 PM - 5:00 PM",
      maxStudents: 6,
      duration: "12 weeks",
      fee: "HKD 3,200"
    },
    // Add more courses as needed
  ];

  const filteredCourses = courses.filter(course => {
    if (filters.age && !course.ageRange.includes(filters.age)) return false;
    if (filters.type !== 'all' && course.type !== filters.type) return false;
    if (filters.search && !course.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Our Courses</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              value={filters.age}
              onChange={(e) => setFilters(prev => ({ ...prev, age: e.target.value }))}
            >
              <option value="">All Ages</option>
              <option value="3">3-5 years</option>
              <option value="5">5-7 years</option>
              <option value="7">7-9 years</option>
              <option value="9">9-12 years</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="all">All Types</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-10"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{course.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  course.type === 'online' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {course.type.charAt(0).toUpperCase() + course.type.slice(1)}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{course.description}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Max {course.maxStudents} students</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{course.schedule}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{course.time}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <p className="text-gray-600">Course Fee</p>
                  <p className="text-xl font-bold text-purple-600">{course.fee}</p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;