import React, { useState } from 'react';
import { Search, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek } from 'date-fns';

const GradesPage = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const courses = [
    { id: 'phonics', name: 'Phonics Foundation' },
    { id: 'readers', name: 'Young Readers' }
  ];

  const grades = [
    {
      id: 1,
      date: '2025-01-15',
      course: 'Phonics Foundation',
      type: 'Quiz',
      title: 'Short Vowels Quiz',
      score: '95%',
      teacher: 'Ms. Sarah',
      feedback: 'Excellent understanding of short vowel sounds!'
    },
    {
      id: 2,
      date: '2025-01-13',
      course: 'Young Readers',
      type: 'Homework',
      title: 'Reading Comprehension Exercise',
      score: '88%',
      teacher: 'Mr. John',
      feedback: 'Good work on main idea identification. Keep practicing inference skills.'
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
    switch (type.toLowerCase()) {
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Grades Record</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="all">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>

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

        {/* Grades List */}
        <div className="space-y-4">
          {filteredGrades.map(grade => (
            <div key={grade.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">{grade.title}</h3>
                  <p className="text-gray-600">{grade.course}</p>
                </div>
                <span className="text-xl font-bold text-gray-900">{grade.score}</span>
              </div>
              <div className="flex items-center space-x-4 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(grade.type)}`}>
                  {grade.type}
                </span>
                <span className="text-sm text-gray-500">{grade.date}</span>
                <span className="text-sm text-gray-500">Teacher: {grade.teacher}</span>
              </div>
              <p className="text-gray-600 text-sm">{grade.feedback}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GradesPage;