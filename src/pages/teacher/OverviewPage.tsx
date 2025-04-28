import React, { useState } from 'react';
import { Search, Users, BookOpen, GraduationCap, MapPin } from 'lucide-react';

const OverviewPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseLocation, setSelectedCourseLocation] = useState('all');
  const [selectedStudentLocation, setSelectedStudentLocation] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');

  const locations = [
    { id: 'tsw', name: 'Tsz Wan Shan Centre' },
    { id: 'tko', name: 'Tseung Kwan O Centre' }
  ];

  const courses = [
    {
      id: 'phonics',
      name: 'Phonics Foundation',
      level: 'Beginner',
      ageGroup: '3-5 years',
      location: 'Tsz Wan Shan Centre',
      students: 12,
      schedule: 'Mon, Wed, Fri'
    },
    {
      id: 'readers',
      name: 'Young Readers',
      level: 'Intermediate',
      ageGroup: '5-7 years',
      location: 'Tseung Kwan O Centre',
      students: 8,
      schedule: 'Tue, Thu'
    }
  ];

  const students = [
    {
      id: 1,
      name: 'Emily Wong',
      age: 7,
      grade: 'Grade 2',
      location: 'Tsz Wan Shan Centre',
      courses: ['Phonics Foundation', 'Young Readers'],
      progress: 'Excellent'
    },
    {
      id: 2,
      name: 'Thomas Chan',
      age: 6,
      grade: 'Grade 1',
      location: 'Tseung Kwan O Centre',
      courses: ['Phonics Foundation'],
      progress: 'Good'
    }
  ];

  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];

  const filteredCourses = courses.filter(course => {
    const matchesLocation = selectedCourseLocation === 'all' || course.location === locations.find(l => l.id === selectedCourseLocation)?.name;
    return matchesLocation;
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
    const matchesCourse = selectedCourse === 'all' || student.courses.includes(
      courses.find(c => c.id === selectedCourse)?.name || ''
    );
    const matchesLocation = selectedStudentLocation === 'all' || student.location === locations.find(l => l.id === selectedStudentLocation)?.name;
    return matchesSearch && matchesGrade && matchesCourse && matchesLocation;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Overview</h1>

      {/* Course Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Available Courses</h2>
          <select
            value={selectedCourseLocation}
            onChange={(e) => setSelectedCourseLocation(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="all">All Locations</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>{location.name}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div key={course.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-medium text-gray-900">{course.name}</h3>
                  <p className="text-sm text-gray-500">{course.level}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {course.ageGroup}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {course.location}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  {course.students} students
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  {course.schedule}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Students</h2>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

          <select
            value={selectedStudentLocation}
            onChange={(e) => setSelectedStudentLocation(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="all">All Locations</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>{location.name}</option>
            ))}
          </select>

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
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrolled Courses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{student.age} years</div>
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
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      student.progress === 'Excellent' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.progress}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-purple-600 hover:text-purple-900">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;