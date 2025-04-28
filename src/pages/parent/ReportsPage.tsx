import React, { useState } from 'react';
import { Search, Calendar, ChevronLeft, ChevronRight, FileText, Notebook as Robot } from 'lucide-react';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek } from 'date-fns';

const ReportsPage = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const courses = [
    { id: 'phonics', name: 'Phonics Foundation' },
    { id: 'readers', name: 'Young Readers' }
  ];

  const reports = [
    {
      id: 1,
      date: '2025-01-15',
      course: 'Phonics Foundation',
      teacher: 'Ms. Sarah',
      type: 'Teacher Report',
      summary: 'Emily has shown excellent progress in identifying and blending consonant sounds. She actively participates in class activities and helps other students.',
      details: {
        strengths: ['Strong phonemic awareness', 'Active class participation'],
        areasForImprovement: ['Practice writing letters more neatly'],
        recommendations: ['Continue daily reading practice at home']
      }
    },
    {
      id: 2,
      date: '2025-01-15',
      course: 'Phonics Foundation',
      type: 'AI Analysis',
      summary: 'Based on recent assessments and class performance, Emily demonstrates consistent improvement in phonics skills with a 15% increase in accuracy over the past month.',
      details: {
        progressMetrics: {
          phonemicAwareness: '95%',
          letterRecognition: '90%',
          blendingSkills: '85%'
        },
        recommendations: [
          'Focus on complex consonant blends',
          'Incorporate more sight word practice'
        ]
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

  const filteredReports = reports.filter(report => 
    selectedCourse === 'all' || report.course === courses.find(c => c.id === selectedCourse)?.name
  );

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Weekly Reports</h1>

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

        {/* Reports List */}
        <div className="space-y-6">
          {filteredReports.map(report => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    {report.type === 'Teacher Report' ? (
                      <FileText className="w-5 h-5 text-purple-600" />
                    ) : (
                      <Robot className="w-5 h-5 text-blue-600" />
                    )}
                    <h3 className="font-medium text-gray-900">{report.course}</h3>
                  </div>
                  <div className="mt-1 space-x-2">
                    <span className="text-sm text-gray-500">{report.date}</span>
                    {report.teacher && (
                      <span className="text-sm text-gray-500">by {report.teacher}</span>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  report.type === 'Teacher Report' 
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {report.type}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{report.summary}</p>

              {report.type === 'Teacher Report' ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Strengths</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {report.details.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Areas for Improvement</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {report.details.areasForImprovement.map((area, index) => (
                        <li key={index}>{area}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {report.details.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Progress Metrics</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(report.details.progressMetrics).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-500">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                          <div className="text-2xl font-bold text-gray-900">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">AI Recommendations</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {report.details.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;