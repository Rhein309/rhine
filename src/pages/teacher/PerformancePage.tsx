import React, { useState } from 'react';
import { Search, BarChart, TrendingUp, Users } from 'lucide-react';

const PerformancePage = () => {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState('all');

  const courses = [
    { id: 'phonics', name: 'Phonics Foundation' },
    { id: 'readers', name: 'Young Readers' }
  ];

  const students = [
    { id: '1', name: 'Emily Wong' },
    { id: '2', name: 'Thomas Chan' },
    { id: '3', name: 'Sophie Lee' }
  ];

  const performanceData = {
    courseStats: [
      {
        course: 'Phonics Foundation',
        averageGrade: 92,
        attendanceRate: 95,
        participationRate: 90,
        homeworkCompletion: 98
      },
      {
        course: 'Young Readers',
        averageGrade: 88,
        attendanceRate: 92,
        participationRate: 85,
        homeworkCompletion: 95
      }
    ],
    studentStats: [
      {
        student: 'Emily Wong',
        course: 'Phonics Foundation',
        averageGrade: 95,
        attendanceRate: 98,
        participationRate: 95,
        homeworkCompletion: 100,
        trend: 'improving'
      },
      {
        student: 'Thomas Chan',
        course: 'Young Readers',
        averageGrade: 85,
        attendanceRate: 90,
        participationRate: 80,
        homeworkCompletion: 95,
        trend: 'stable'
      }
    ]
  };

  const filteredStats = performanceData.studentStats.filter(stat => {
    const matchesCourse = selectedCourse === 'all' || stat.course === courses.find(c => c.id === selectedCourse)?.name;
    const matchesStudent = selectedStudent === 'all' || stat.student === students.find(s => s.id === selectedStudent)?.name;
    return matchesCourse && matchesStudent;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Performance Tracking</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="all">All Students</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>{student.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceData.courseStats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-4">{stat.course}</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Grade</span>
                  <span className="font-medium text-gray-900">{stat.averageGrade}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Attendance</span>
                  <span className="font-medium text-gray-900">{stat.attendanceRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Participation</span>
                  <span className="font-medium text-gray-900">{stat.participationRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Homework</span>
                  <span className="font-medium text-gray-900">{stat.homeworkCompletion}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Performance */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Individual Performance</h2>
        <div className="space-y-6">
          {filteredStats.map((stat, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{stat.student}</h3>
                  <p className="text-gray-500">{stat.course}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  stat.trend === 'improving' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.trend.charAt(0).toUpperCase() + stat.trend.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Average Grade</div>
                  <div className="text-2xl font-bold text-gray-900">{stat.averageGrade}%</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Attendance</div>
                  <div className="text-2xl font-bold text-gray-900">{stat.attendanceRate}%</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Participation</div>
                  <div className="text-2xl font-bold text-gray-900">{stat.participationRate}%</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Homework</div>
                  <div className="text-2xl font-bold text-gray-900">{stat.homeworkCompletion}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;