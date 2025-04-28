import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek } from 'date-fns';

const AttendancePage = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const attendanceRecords = [
    {
      id: 1,
      date: '2025-01-15',
      time: '15:00',
      course: 'Phonics Foundation',
      teacher: 'Ms. Sarah',
      location: 'Online',
      leavingTime: '16:00',
      status: 'present'
    },
    {
      id: 2,
      date: '2025-01-13',
      time: '14:00',
      course: 'Young Readers',
      teacher: 'Mr. John',
      location: 'Tsz Wan Shan Centre',
      leavingTime: '15:00',
      status: 'present'
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

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Attendance Record</h1>

      {/* Week Selector */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
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

      {/* Attendance Records */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 gap-4 p-4 bg-gray-50 border-b border-gray-200">
          <div className="text-sm font-medium text-gray-500">Date</div>
          <div className="text-sm font-medium text-gray-500">Time</div>
          <div className="text-sm font-medium text-gray-500">Course</div>
          <div className="text-sm font-medium text-gray-500">Teacher</div>
          <div className="text-sm font-medium text-gray-500">Location</div>
          <div className="text-sm font-medium text-gray-500">Leaving Time</div>
          <div className="text-sm font-medium text-gray-500">Status</div>
        </div>

        <div className="divide-y divide-gray-200">
          {attendanceRecords.map(record => (
            <div key={record.id} className="grid grid-cols-7 gap-4 p-4 hover:bg-gray-50">
              <div className="text-gray-900">{record.date}</div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                {record.time}
              </div>
              <div className="text-gray-900">{record.course}</div>
              <div className="text-gray-600">{record.teacher}</div>
              <div className="text-gray-600">{record.location}</div>
              <div className="text-gray-600">{record.leavingTime}</div>
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {record.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;