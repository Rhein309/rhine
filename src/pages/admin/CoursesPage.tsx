import React, { useState } from 'react';
import { Search, BookOpen, Users, Clock, MapPin } from 'lucide-react';

const CoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const locations = [
    { id: 'tsw', name: 'Tsz Wan Shan Centre' },
    { id: 'tko', name: 'Tseung Kwan O Centre' }
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const courses = [
    {
      id: 1,
      name: 'Phonics Foundation',
      level: 'Beginner',
      ageRange: '3-5 years',
      location: 'Tsz Wan Shan Centre',
      schedule: 'Mon, Wed, Fri',
      time: '3:00 PM - 4:00 PM',
      teacher: 'Sarah Lee',
      enrolledStudents: 6,
      maxStudents: 8,
      fee: 'HKD 3,600',
      status: 'active'
    },
    {
      id: 2,
      name: 'Young Readers',
      level: 'Intermediate',
      ageRange: '5-7 years',
      location: 'Tseung Kwan O Centre',
      schedule: 'Tue, Thu',
      time: '4:00 PM - 5:00 PM',
      teacher: 'John Smith',
      enrolledStudents: 4,
      maxStudents: 6,
      fee: 'HKD 3,200',
      status: 'active'
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesLocation = selectedLocation === 'all' || course.location === locations.find(l => l.id === selectedLocation)?.name;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLocation && matchesLevel && matchesSearch;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
        <button 
          onClick={() => window.location.href = '/admin/courses/new'}
          className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Add Course
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="all">All Locations</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>{location.name}</option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="all">All Levels</option>
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          <div className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <div key={course.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{course.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-500">{course.level}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{course.ageRange}</span>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  course.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {course.status}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-2" />
                  {course.location}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  {course.schedule} • {course.time}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-2" />
                  {course.enrolledStudents}/{course.maxStudents} students
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Course Fee</p>
                    <p className="text-lg font-medium text-gray-900">{course.fee}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Teacher</p>
                    <p className="text-sm font-medium text-gray-900">{course.teacher}</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button 
                    onClick={() => window.location.href = `/admin/courses/${course.id}`}
                    className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => window.location.href = `/admin/courses/${course.id}/edit`}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    Edit Course
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
                        if (window.confirm('Please confirm again that you want to delete this course. All associated data will be permanently removed.')) {
                          // Handle delete logic here
                          console.log('Delete course:', course.id);
                        }
                      }
                    }}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;