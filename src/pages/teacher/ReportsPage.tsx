import React, { useState } from 'react';
import { Search, Calendar, ChevronLeft, ChevronRight, FileText, Download } from 'lucide-react';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek } from 'date-fns';

const ReportsPage = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const courses = [
    { id: 'phonics', name: 'Phonics Foundation' },
    { id: 'readers', name: 'Young Readers' }
  ];

  const students = [
    { id: '1', name: 'Emily Wong' },
    { id: '2', name: 'Thomas Chan' },
    { id: '3', name: 'Sophie Lee' }
  ];

  const reports = [
    {
      id: 1,
      date: '2025-01-15',
      course: 'Phonics Foundation',
      student: 'Emily Wong',
      type: 'Weekly Progress',
      summary: 'Excellent progress in phonics recognition and blending skills',
      details: {
        attendance: '100%',
        participation: 'Active',
        homework: 'All completed',
        areas: ['Strong phonemic awareness', 'Good oral participation'],
        improvements: ['Practice writing skills']
      }
    },
    {
      id: 2,
      date: '2025-01-14',
      course: 'Young Readers',
      student: 'Thomas Chan',
      type: 'Weekly Progress',
      summary: 'Good improvement in reading comprehension',
      details: {
        attendance: '90%',
        participation: 'Good',
        homework: 'Mostly completed',
        areas: ['Good vocabulary', 'Improving comprehension'],
        improvements: ['Focus on inference skills']
      }
    }
  ];

  const handlePreviousWeek = () => {
    setCurrentWeek(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => addWeeks(prev, 1));
  };

  const weekStart = startOfWeek(currentWeek);
  const weekEnd = endOfWeek(currentWeek);

  const filteredReports = reports.filter(report => {
    const matchesCourse = selectedCourse === 'all' || report.course === courses.find(c => c.id === selectedCourse)?.name;
    const matchesStudent = selectedStudent === 'all' || report.student === students.find(s => s.id === selectedStudent)?.name;
    return matchesCourse && matchesStudent;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Weekly Reports</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <div className="flex items-center space-x-4">
            <button
              onClick={handlePreviousWeek}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-md"
            >
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900 font-medium">
                {format(weekStart, 'MMM d, yyyy')} - {format(weekEnd, 'MMM d, yyyy')}
              </span>
            </button>

            <button
              onClick={handleNextWeek}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{report.student}</h3>
                <p className="text-gray-500">{report.course}</p>
                <p className="text-sm text-gray-500 mt-1">{report.date}</p>
              </div>
              <button className="flex items-center text-purple-600 hover:text-purple-700">
                <Download className="w-4 h-4 mr-1" />
                Download Report
              </button>
            </div>

            <div className="mt-4">
              <p className="text-gray-700 mb-4">{report.summary}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Attendance</p>
                  <p className="font-medium text-gray-900">{report.details.attendance}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Participation</p>
                  <p className="font-medium text-gray-900">{report.details.participation}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Strong Areas</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {report.details.areas.map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Areas for Improvement</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {report.details.improvements.map((improvement, index) => (
                      <li key={index}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;