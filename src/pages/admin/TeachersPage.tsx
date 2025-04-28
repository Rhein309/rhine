import React, { useState } from 'react';
import { Search, Users, MapPin, BookOpen, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const TeachersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const locations = [
    { id: 'tsw', name: 'Tsz Wan Shan Centre' },
    { id: 'tko', name: 'Tseung Kwan O Centre' }
  ];

  const courses = [
    { id: 'phonics', name: 'Phonics Foundation' },
    { id: 'readers', name: 'Young Readers' }
  ];

  const teachers = [
    {
      id: 1,
      name: 'Sarah Lee',
      location: 'Tsz Wan Shan Centre',
      courses: ['Phonics Foundation', 'Young Readers'],
      experience: '5 years',
      qualifications: ['TEFL Certified', 'B.Ed in English'],
      contact: '+852 9876 5432',
      joinDate: '2024-01-01',
      status: 'active'
    },
    {
      id: 2,
      name: 'John Smith',
      location: 'Tseung Kwan O Centre',
      courses: ['Young Readers'],
      experience: '3 years',
      qualifications: ['CELTA', 'M.Ed'],
      contact: '+852 9876 1234',
      joinDate: '2024-02-01',
      status: 'active'
    }
  ];

  const filteredTeachers = teachers.filter(teacher => {
    const matchesLocation = selectedLocation === 'all' || teacher.location === locations.find(l => l.id === selectedLocation)?.name;
    const matchesCourse = selectedCourse === 'all' || teacher.courses.includes(courses.find(c => c.id === selectedCourse)?.name || '');
    const matchesSearch = 
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.qualifications.some(q => q.toLowerCase().includes(searchQuery.toLowerCase()));

    // Date filtering
    const teacherDate = parseISO(teacher.joinDate);
    const matchesStartDate = !startDate || teacherDate >= parseISO(startDate);
    const matchesEndDate = !endDate || teacherDate <= parseISO(endDate);

    return matchesLocation && matchesCourse && matchesSearch && matchesStartDate && matchesEndDate;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
        <button 
          onClick={() => window.location.href = '/admin/teachers/new'}
          className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          <Users className="w-4 h-4 mr-2" />
          Add Teacher
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="Join Date From"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="Join Date To"
            />
          </div>
        </div>
      </div>

      {/* Teachers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTeachers.map(teacher => (
          <div key={teacher.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{teacher.name}</h3>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  {teacher.location}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Joined {format(parseISO(teacher.joinDate), 'MMM d, yyyy')}
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                teacher.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {teacher.status}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Courses</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {teacher.courses.map((course, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700">Qualifications</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {teacher.qualifications.map((qualification, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {qualification}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Experience</h4>
                  <p className="text-sm text-gray-600 mt-1">{teacher.experience}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Contact</h4>
                  <p className="text-sm text-gray-600 mt-1">{teacher.contact}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button 
                onClick={() => window.location.href = `/admin/teachers/${teacher.id}`}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                View Schedule
              </button>
              <button 
                onClick={() => window.location.href = `/admin/teachers/${teacher.id}/edit`}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Edit Profile
              </button>
              <button 
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this teacher? This action cannot be undone.')) {
                    if (window.confirm('Please confirm again that you want to delete this teacher. All associated data will be permanently removed.')) {
                      // Handle delete logic here
                      console.log('Delete teacher:', teacher.id);
                    }
                  }
                }}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeachersPage;