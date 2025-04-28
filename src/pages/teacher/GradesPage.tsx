import React, { useState } from 'react';
import { Search, Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek } from 'date-fns';

const GradesPage = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddGradeModal, setShowAddGradeModal] = useState(false);

  const courses = [
    { id: 'phonics', name: 'Phonics Foundation' },
    { id: 'readers', name: 'Young Readers' }
  ];

  const grades = [
    {
      id: 1,
      date: '2025-01-15',
      course: 'Phonics Foundation',
      type: 'quiz',
      title: 'Week 3 Quiz',
      student: 'Emily Wong',
      score: 95,
      maxScore: 100,
      feedback: 'Excellent understanding of short vowel sounds'
    },
    {
      id: 2,
      date: '2025-01-14',
      course: 'Young Readers',
      type: 'homework',
      title: 'Reading Comprehension Exercise',
      student: 'Thomas Chan',
      score: 85,
      maxScore: 100,
      feedback: 'Good work on main idea identification'
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quiz':
        return 'bg-purple-100 text-purple-800';
      case 'test':
        return 'bg-blue-100 text-blue-800';
      case 'homework':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredGrades = grades.filter(grade => 
    selectedCourse === 'all' || grade.course === courses.find(c => c.id === selectedCourse)?.name
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Grades Record</h1>
        <button
          onClick={() => setShowAddGradeModal(true)}
          className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Grade
        </button>
      </div>

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

      {/* Grades List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Feedback
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredGrades.map((grade) => (
              <tr key={grade.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {grade.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {grade.course}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(grade.type)}`}>
                    {grade.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {grade.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {grade.student}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {grade.score}/{grade.maxScore}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {grade.feedback}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradesPage;