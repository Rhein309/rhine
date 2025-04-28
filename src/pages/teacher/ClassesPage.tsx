import React, { useState } from 'react';
import { Search, Users, Clock, MapPin, Check, X } from 'lucide-react';

const ClassesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [showTakeAttendance, setShowTakeAttendance] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<{[key: string]: { status: 'present' | 'absent' | null, notes: string }}>({});

  const courses = [
    { id: 'phonics', name: 'Phonics Foundation' },
    { id: 'readers', name: 'Young Readers' }
  ];

  const classes = [
    {
      id: 1,
      course: 'Phonics Foundation',
      schedule: 'Mon, Wed, Fri',
      time: '10:00 AM - 11:00 AM',
      location: 'Room 101',
      students: [
        { id: 1, name: 'Emily Wong', age: 7, parent: 'Sarah Wong', contact: '+852 9876 5432' },
        { id: 2, name: 'Thomas Chan', age: 6, parent: 'David Chan', contact: '+852 9876 1234' },
        { id: 3, name: 'Sophie Lee', age: 7, parent: 'Michelle Lee', contact: '+852 9876 7890' }
      ]
    },
    {
      id: 2,
      course: 'Young Readers',
      schedule: 'Tue, Thu',
      time: '11:30 AM - 12:30 PM',
      location: 'Online',
      students: [
        { id: 4, name: 'Jason Lam', age: 8, parent: 'Peter Lam', contact: '+852 9876 4321' },
        { id: 5, name: 'Alice Chen', age: 8, parent: 'Mary Chen', contact: '+852 9876 8765' }
      ]
    }
  ];

  const filteredClasses = classes.filter(class_ => 
    (selectedCourse === 'all' || class_.course === courses.find(c => c.id === selectedCourse)?.name) &&
    (searchQuery === '' || 
      class_.students.some(student => 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.parent.toLowerCase().includes(searchQuery.toLowerCase())
      ))
  );

  const handleTakeAttendance = (class_: any) => {
    setSelectedClass(class_);
    // Initialize attendance data for all students
    const initialData = class_.students.reduce((acc: any, student: any) => {
      acc[student.id] = { status: null, notes: '' };
      return acc;
    }, {});
    setAttendanceData(initialData);
    setShowTakeAttendance(true);
  };

  const handleStatusChange = (studentId: number, status: 'present' | 'absent') => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleNotesChange = (studentId: number, notes: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], notes }
    }));
  };

  const handleSubmitAttendance = () => {
    if (window.confirm('Are you sure you want to submit the attendance?')) {
      if (window.confirm('Please confirm again to submit the attendance.')) {
        // Handle attendance submission
        console.log('Attendance data:', attendanceData);
        setShowTakeAttendance(false);
        setSelectedClass(null);
        setAttendanceData({});
      }
    }
  };

  if (showTakeAttendance && selectedClass) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Take Attendance</h1>
            <p className="text-gray-600 mt-2">
              {selectedClass.course} • {selectedClass.time}
            </p>
          </div>
          <button
            onClick={() => setShowTakeAttendance(false)}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            {selectedClass.students.map((student: any) => (
              <div key={student.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-500">Parent: {student.parent}</p>
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
              onClick={handleSubmitAttendance}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200"
            >
              Submit Attendance
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Classes</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
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

          <div className="relative">
            <input
              type="text"
              placeholder="Search students or parents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Classes List */}
      <div className="space-y-6">
        {filteredClasses.map(class_ => (
          <div key={class_.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Class Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{class_.course}</h2>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{class_.schedule} • {class_.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{class_.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{class_.students.length} students</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleTakeAttendance(class_)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                  Take Attendance
                </button>
              </div>
            </div>

            {/* Students List */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Age
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parent Name
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
                  {class_.students.map(student => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.age} years</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.parent}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.contact}</div>
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
        ))}
      </div>
    </div>
  );
};

export default ClassesPage;