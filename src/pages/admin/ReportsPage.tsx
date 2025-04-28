import React, { useState } from 'react';
import { Search, Download, FileText, Users, BookOpen } from 'lucide-react';

const ReportsPage = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  const reports = [
    {
      id: 1,
      title: 'Monthly Student Attendance Report',
      type: 'attendance',
      date: '2025-01-15',
      description: 'Detailed attendance statistics for all classes',
      stats: {
        totalStudents: 156,
        averageAttendance: '92%',
        missedClasses: 24
      }
    },
    {
      id: 2,
      title: 'Teacher Performance Review',
      type: 'performance',
      date: '2025-01-14',
      description: 'Quarterly teacher evaluation and metrics',
      stats: {
        totalTeachers: 18,
        averageRating: 4.5,
        classesCompleted: 450
      }
    },
    {
      id: 3,
      title: 'Financial Summary',
      type: 'financial',
      date: '2025-01-13',
      description: 'Monthly revenue and expense breakdown',
      stats: {
        revenue: 'HKD 250,000',
        expenses: 'HKD 180,000',
        profit: 'HKD 70,000'
      }
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'attendance':
        return <Users className="w-5 h-5" />;
      case 'performance':
        return <BookOpen className="w-5 h-5" />;
      case 'financial':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'attendance':
        return 'bg-blue-100 text-blue-800';
      case 'performance':
        return 'bg-green-100 text-green-800';
      case 'financial':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesDate = !selectedDate || report.date === selectedDate;
    return matchesType && matchesDate;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Reports</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="all">All Reports</option>
            <option value="attendance">Attendance</option>
            <option value="performance">Performance</option>
            <option value="financial">Financial</option>
          </select>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4">
                <div className={`${getTypeColor(report.type)} p-2 rounded-lg`}>
                  {getTypeIcon(report.type)}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
                  <p className="text-gray-600 mt-1">{report.description}</p>
                  <p className="text-sm text-gray-500 mt-2">{report.date}</p>
                </div>
              </div>
              <button className="flex items-center text-purple-600 hover:text-purple-700">
                <Download className="w-4 h-4 mr-1" />
                Download
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {Object.entries(report.stats).map(([key, value]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-xl font-semibold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;