import React, { useState } from 'react';
import { Search, GraduationCap, MapPin, BookOpen, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const StudentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
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

  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];

  const students = [
    {
      id: 1,
      name: 'Emily Wong',
      age: 7,
      grade: 'Grade 2',
      location: 'Tsz Wan Shan Centre',
      courses: ['Phonics Foundation', 'Young Readers'],
      parent: 'Sarah Wong',
      contact: '+852 9876 5432',
      joinDate: '2025-01-01',
      status: 'active'
    },
    {
      id: 2,
      name: 'Thomas Chan',
      age: 6,
      grade: 'Grade 1',
      location: 'Tseung Kwan O Centre',
      courses: ['Phonics Foundation'],
      parent: 'David Chan',
      contact: '+852 9876 1234',
      joinDate: '2025-01-05',
      status: 'active'
    }
  ];

  const filteredStudents = students.filter(student => {
    const matchesLocation = selectedLocation === 'all' || student.location === locations.find(l => l.id === selectedLocation)?.name;
    const matchesCourse = selectedCourse === 'all' || student.courses.includes(courses.find(c => c.id === selectedCourse)?.name || '');
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.parent.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Date filtering
    const studentDate = parseISO(student.joinDate);
    const matchesStartDate = !startDate || studentDate >= parseISO(startDate);
    const matchesEndDate = !endDate || studentDate <= parseISO(endDate);

    return matchesLocation && matchesCourse && matchesGrade && matchesSearch && matchesStartDate && matchesEndDate;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <button 
          onClick={() => window.location.href = '/admin/students/new'}
          className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          <GraduationCap className="w-4 h-4 mr-2" />
          Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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

          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="all">All Grades</option>
            {grades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
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

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Courses
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Join Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map(student => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{student.name}</div>
                  <div className="text-sm text-gray-500">{student.age} years old</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.grade}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{student.location}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-2">
                    {student.courses.map((course, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{format(parseISO(student.joinDate), 'MMM d, yyyy')}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.parent}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{student.contact}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button 
                    onClick={() => window.location.href = `/admin/students/${student.id}`}
                    className="text-purple-600 hover:text-purple-900"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
                        if (window.confirm('Please confirm again that you want to delete this student. All associated data will be permanently removed.')) {
                          // Handle delete logic here
                          console.log('Delete student:', student.id);
                        }
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsPage;