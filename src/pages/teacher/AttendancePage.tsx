import React, { useState } from 'react';
import { Search, Calendar, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek } from 'date-fns';

const TakeAttendance = ({ onCancel }: { onCancel: () => void }) => {
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<{[key: string]: { status: 'present' | 'absent' | null, notes: string }}>({});

  const courses = [
    { id: 'phonics', name: 'Phonics Foundation' },
    { id: 'readers', name: 'Young Readers' }
  ];

  const students = [
    { id: '1', name: 'Emily Wong' },
    { id: '2', name: 'Thomas Chan' },
    { id: '3', name: 'Sophie Lee' }
  ];

  const handleStatusChange = (studentId: string, status: 'present' | 'absent') => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], notes }
    }));
  };

  const handleSubmit = () => {
    if (window.confirm('Are you sure you want to submit the attendance?')) {
      if (window.confirm('Please confirm again to submit the attendance.')) {
        // Handle attendance submission
        console.log('Attendance data:', attendanceData);
        onCancel(); // Return to main page after submission
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Take Attendance</h1>
        <button
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-800"
        >
          Back to Records
        </button>
      </div>

      {/* Course Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Course
        </label>
        <select
          value={selectedClass?.id || ''}
          onChange={(e) => {
            const course = courses.find(c => c.id === e.target.value);
            setSelectedClass(course);
            // Initialize attendance data for all students
            const initialData = students.reduce((acc: any, student: any) => {
              acc[student.id] = { status: null, notes: '' };
              return acc;
            }, {});
            setAttendanceData(initialData);
          }}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        >
          <option value="">Select a course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
      </div>

      {selectedClass && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            {students.map(student => (
              <div key={student.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleStatusChange(student.id, 'present')}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        attendanceData[student.id]?.status === 'present'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700'
                      }`}
                    >
                      <Check className="w-4 h-4 inline-block mr-1" />
                      Present
                    </button>
                    <button
                      onClick={() => handleStatusChange(student.id, 'absent')}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        attendanceData[student.id]?.status === 'absent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700'
                      }`}
                    >
                      <X className="w-4 h-4 inline-block mr-1" />
                      Absent
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Add notes (optional)"
                  value={attendanceData[student.id]?.notes || ''}
                  onChange={(e) => handleNotesChange(student.id, e.target.value)}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            ))}
          </div>

          <div className="mt-8">
            <button
              onClick={handleSubmit}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200"
            >
              Submit Attendance
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AttendanceRecords = ({ onTakeAttendance }: { onTakeAttendance: () => void }) => {
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

  const attendanceRecords = [
    {
      id: 1,
      date: '2025-01-15',
      course: 'Phonics Foundation',
      student: 'Emily Wong',
      status: 'present',
      arrivalTime: '09:55 AM',
      leavingTime: '11:00 AM',
      notes: 'Participated actively in class'
    },
    {
      id: 2,
      date: '2025-01-15',
      course: 'Phonics Foundation',
      student: 'Thomas Chan',
      status: 'absent',
      notes: 'Parent notified - sick leave'
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

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesCourse = selectedCourse === 'all' || record.course === courses.find(c => c.id === selectedCourse)?.name;
    const matchesStudent = selectedStudent === 'all' || record.student === students.find(s => s.id === selectedStudent)?.name;
    return matchesCourse && matchesStudent;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Attendance Records</h1>
        <button
          onClick={onTakeAttendance}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          Take Attendance
        </button>
      </div>

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

      {/* Attendance Records */}
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
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRecords.map((record) => (
              <tr key={record.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.course}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.student}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    record.status === 'present' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {record.status === 'present' ? (
                      <Check className="w-3 h-3 mr-1" />
                    ) : (
                      <X className="w-3 h-3 mr-1" />
                    )}
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.status === 'present' ? (
                    <>
                      {record.arrivalTime} - {record.leavingTime}
                    </>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {record.notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AttendancePage = () => {
  const [activeTab, setActiveTab] = useState<'take' | 'records'>('records');

  return (
    <div className="max-w-6xl mx-auto">
      {activeTab === 'take' ? (
        <TakeAttendance onCancel={() => setActiveTab('records')} />
      ) : (
        <AttendanceRecords onTakeAttendance={() => setActiveTab('take')} />
      )}
    </div>
  );
};

export default AttendancePage;