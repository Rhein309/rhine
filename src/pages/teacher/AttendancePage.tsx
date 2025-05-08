import React, { useState, useEffect } from 'react';
import { Search, Calendar, ChevronLeft, ChevronRight, Check, X, Clock, Download, AlertCircle } from 'lucide-react';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, parseISO } from 'date-fns';
import axios from 'axios';
import { zhCN } from 'date-fns/locale';

// Define interfaces
interface Course {
  id: number | string;
  name: string;
  schedule?: string;
  time?: string;
  location?: string;
}

interface Student {
  id: number | string;
  name: string;
  age?: number;
  parent?: string;
  contact?: string;
}

interface Class {
  id: number | string;
  course: string;
  schedule?: string;
  time?: string;
  location?: string;
  students: Student[];
}

interface AttendanceRecord {
  id: number | string;
  date: string;
  course: string;
  student: string;
  status: 'present' | 'absent' | 'late';
  arrivalTime?: string;
  leavingTime?: string;
  notes?: string;
}

const TakeAttendance = ({ onCancel }: { onCancel: () => void }) => {
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [attendanceData, setAttendanceData] = useState<{[key: string]: { status: 'present' | 'absent' | 'late' | null, notes: string, arrivalTime?: string, leavingTime?: string }}>({});
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch course data from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Try to fetch data from API
        try {
          const response = await axios.get('http://localhost:9999/courses');
          
          // Format course data
          const formattedCourses = response.data.map((course: any) => ({
            id: course.id,
            name: course.name,
            schedule: course.schedule || 'N/A',
            time: course.time || 'N/A',
            location: course.location || 'N/A'
          }));
          
          setCourses(formattedCourses);
          
          // Build class data
          const formattedClasses = response.data.map((course: any) => {
            // Get students for this course
            return {
              id: course.id,
              course: course.name,
              schedule: course.schedule || 'N/A',
              time: course.time || 'N/A',
              location: course.location || 'N/A',
              students: [] // Initialize as empty array, will fill later
            };
          });
          
          // Fetch students and assign to classes
          const studentsResponse = await axios.get('http://localhost:9999/students');
          
          // Update students in classes
          const classesWithStudents = formattedClasses.map((class_: Class) => {
            const classStudents = studentsResponse.data.filter((student: any) =>
              student.courses.includes(class_.id.toString())
            ).map((student: any) => ({
              id: student.id,
              name: student.name,
              age: student.age,
              parent: student.parent,
              contact: student.contact
            }));
            
            return {
              ...class_,
              students: classStudents
            };
          });
          
          setClasses(classesWithStudents);
          setError(null);
        } catch (err) {
          console.error('Failed to fetch course data:', err);
          setError('Failed to fetch course data, using default data');
          
          // Use default data if API fails
          const defaultCourses = [
            { id: 'phonics', name: 'Phonics Foundation', schedule: 'Mon, Wed, Fri', time: '10:00 AM - 11:00 AM', location: 'Room 101' },
            { id: 'readers', name: 'Young Readers', schedule: 'Tue, Thu', time: '11:30 AM - 12:30 PM', location: 'Online' }
          ];
          
          setCourses(defaultCourses);
          
          const defaultClasses = [
            {
              id: 'phonics',
              course: 'Phonics Foundation',
              schedule: 'Mon, Wed, Fri',
              time: '10:00 AM - 11:00 AM',
              location: 'Room 101',
              students: [
                { id: '1', name: 'Emily Wong', age: 7, parent: 'Sarah Wong', contact: '+852 9876 5432' },
                { id: '2', name: 'Thomas Chan', age: 6, parent: 'David Chan', contact: '+852 9876 1234' },
                { id: '3', name: 'Sophie Lee', age: 7, parent: 'Michelle Lee', contact: '+852 9876 7890' }
              ]
            },
            {
              id: 'readers',
              course: 'Young Readers',
              schedule: 'Tue, Thu',
              time: '11:30 AM - 12:30 PM',
              location: 'Online',
              students: [
                { id: '4', name: 'Jason Lam', age: 8, parent: 'Peter Lam', contact: '+852 9876 4321' },
                { id: '5', name: 'Alice Chen', age: 8, parent: 'Mary Chen', contact: '+852 9876 8765' }
              ]
            }
          ];
          
          setClasses(defaultClasses);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
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

  const handleTimeChange = (studentId: string, field: 'arrivalTime' | 'leavingTime', value: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value }
    }));
  };

  const handleSubmit = async () => {
    if (window.confirm('Are you sure you want to submit the attendance records?')) {
      if (window.confirm('Please confirm again to submit the attendance records.')) {
        setSubmitting(true);
        
        try {
          // Prepare data to submit
          const records = Object.entries(attendanceData)
            .filter(([_, data]) => data.status !== null) // Only submit records with a status
            .map(([studentId, data]) => {
              const student = selectedClass?.students.find(s => s.id.toString() === studentId);
              
              return {
                courseId: selectedClass?.id,
                courseName: selectedClass?.course,
                studentId: studentId,
                studentName: student?.name,
                date: selectedDate,
                status: data.status,
                arrivalTime: data.arrivalTime || '',
                leavingTime: data.leavingTime || '',
                notes: data.notes || ''
              };
            });
          
          if (records.length === 0) {
            alert('No attendance records to submit. Please mark at least one student.');
            setSubmitting(false);
            return;
          }
          
          // Submit to API
          console.log('Submitting attendance data:', records);
          
          const response = await axios.post('http://localhost:9999/attendance', records);
          
          if (response.status === 200) {
            alert('Attendance records submitted successfully!');
            onCancel(); // Return to main page after submit
          }
        } catch (error) {
          console.error('Failed to submit attendance records:', error);
          alert('Failed to submit attendance records, please try again.');
        } finally {
          setSubmitting(false);
        }
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
          disabled={submitting}
        >
          Back to Records
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Course and date selection */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Course
                </label>
                <select
                  value={selectedClass?.id || ''}
                  onChange={(e) => {
                    const class_ = classes.find(c => c.id.toString() === e.target.value);
                    setSelectedClass(class_ || null);
                    
                    // Initialize attendance data for all students
                    if (class_) {
                      const initialData = class_.students.reduce((acc: any, student: any) => {
                        acc[student.id] = {
                          status: null,
                          notes: '',
                          arrivalTime: '',
                          leavingTime: ''
                        };
                        return acc;
                      }, {});
                      setAttendanceData(initialData);
                    } else {
                      setAttendanceData({});
                    }
                  }}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  disabled={submitting}
                >
                  <option value="">Select Course</option>
                  {classes.map(class_ => (
                    <option key={class_.id} value={class_.id}>{class_.course}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  disabled={submitting}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {selectedClass && !loading && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {selectedClass.course} • {selectedClass.schedule} • {selectedClass.time}
            </h2>
            <p className="text-sm text-gray-500">Location: {selectedClass.location}</p>
          </div>
          
          <div className="space-y-6">
            {selectedClass.students.map(student => (
              <div key={student.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
                    {student.parent && (
                      <p className="text-sm text-gray-500">Parent: {student.parent}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleStatusChange(student.id.toString(), 'present')}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        attendanceData[student.id]?.status === 'present'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700'
                      }`}
                      disabled={submitting}
                    >
                      <Check className="w-4 h-4 inline-block mr-1" />
                      Present
                    </button>
                    <button
                      onClick={() => handleStatusChange(student.id.toString(), 'late')}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        attendanceData[student.id]?.status === 'late'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-700'
                      }`}
                      disabled={submitting}
                    >
                      <Clock className="w-4 h-4 inline-block mr-1" />
                      Late
                    </button>
                    <button
                      onClick={() => handleStatusChange(student.id.toString(), 'absent')}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        attendanceData[student.id]?.status === 'absent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700'
                      }`}
                      disabled={submitting}
                    >
                      <X className="w-4 h-4 inline-block mr-1" />
                      Absent
                    </button>
                  </div>
                </div>
                
                {(attendanceData[student.id]?.status === 'present' || attendanceData[student.id]?.status === 'late') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Arrival Time
                      </label>
                      <input
                        type="time"
                        value={attendanceData[student.id]?.arrivalTime || ''}
                        onChange={(e) => handleTimeChange(student.id.toString(), 'arrivalTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Leaving Time
                      </label>
                      <input
                        type="time"
                        value={attendanceData[student.id]?.leavingTime || ''}
                        onChange={(e) => handleTimeChange(student.id.toString(), 'leavingTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                )}
                
                <input
                  type="text"
                  placeholder="Add notes (optional)"
                  value={attendanceData[student.id]?.notes || ''}
                  onChange={(e) => handleNotesChange(student.id.toString(), e.target.value)}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  disabled={submitting}
                />
              </div>
            ))}
          </div>

          <div className="mt-8">
            <button
              onClick={handleSubmit}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Submitting...
                </span>
              ) : (
                'Submit Attendance'
              )}
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
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch data from API
        try {
          // Fetch courses
          const coursesResponse = await axios.get('http://localhost:9999/courses');
          const formattedCourses = coursesResponse.data.map((course: any) => ({
            id: course.id,
            name: course.name
          }));
          setCourses(formattedCourses);
          
          // Fetch students
          const studentsResponse = await axios.get('http://localhost:9999/students');
          const formattedStudents = studentsResponse.data.map((student: any) => ({
            id: student.id,
            name: student.name
          }));
          setStudents(formattedStudents);
          
          // Fetch attendance records for the current week
          const weekStart = format(startOfWeek(currentWeek, { locale: zhCN }), 'yyyy-MM-dd');
          const weekEnd = format(endOfWeek(currentWeek, { locale: zhCN }), 'yyyy-MM-dd');
          
          const attendanceResponse = await axios.get('http://localhost:9999/attendance', {
            params: {
              dateFrom: weekStart,
              dateTo: weekEnd,
              courseId: selectedCourse !== 'all' ? selectedCourse : undefined,
              studentId: selectedStudent !== 'all' ? selectedStudent : undefined,
              status: selectedStatus !== 'all' ? selectedStatus : undefined
            }
          });
          
          setAttendanceRecords(attendanceResponse.data);
          setError(null);
        } catch (err) {
          console.error('Failed to fetch data:', err);
          setError('Failed to fetch data, using default data');
          
          // Use default data if API fails
          const defaultCourses = [
            { id: 'phonics', name: 'Phonics Foundation' },
            { id: 'readers', name: 'Young Readers' }
          ];
          setCourses(defaultCourses);
          
          const defaultStudents = [
            { id: '1', name: 'Emily Wong' },
            { id: '2', name: 'Thomas Chan' },
            { id: '3', name: 'Sophie Lee' }
          ];
          setStudents(defaultStudents);
          
          const defaultAttendanceRecords = [
            {
              id: 1,
              date: '2025-01-15',
              course: 'Phonics Foundation',
              student: 'Emily Wong',
              status: 'present' as const,
              arrivalTime: '09:55 AM',
              leavingTime: '11:00 AM',
              notes: 'Active participation in class'
            },
            {
              id: 2,
              date: '2025-01-15',
              course: 'Phonics Foundation',
              student: 'Thomas Chan',
              status: 'absent' as const,
              notes: 'Parent notified - sick leave'
            },
            {
              id: 3,
              date: '2025-01-16',
              course: 'Young Readers',
              student: 'Sophie Lee',
              status: 'late' as const,
              arrivalTime: '10:15 AM',
              leavingTime: '11:30 AM',
              notes: '15 minutes late, traffic jam'
            }
          ];
          
          setAttendanceRecords(defaultAttendanceRecords);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentWeek, selectedCourse, selectedStudent, selectedStatus]);

  const handlePreviousWeek = () => {
    setCurrentWeek(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => addWeeks(prev, 1));
  };
  
  // Refresh attendance data when filters change
  useEffect(() => {
    // This will be triggered when any of the dependencies change
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        
        const weekStart = format(startOfWeek(currentWeek, { locale: zhCN }), 'yyyy-MM-dd');
        const weekEnd = format(endOfWeek(currentWeek, { locale: zhCN }), 'yyyy-MM-dd');
        
        const response = await axios.get('http://localhost:9999/attendance', {
          params: {
            dateFrom: weekStart,
            dateTo: weekEnd,
            courseId: selectedCourse !== 'all' ? selectedCourse : undefined,
            studentId: selectedStudent !== 'all' ? selectedStudent : undefined,
            status: selectedStatus !== 'all' ? selectedStatus : undefined
          }
        });
        
        setAttendanceRecords(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch attendance data:', err);
        setError('Failed to fetch attendance data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttendanceData();
  }, [currentWeek, selectedCourse, selectedStudent, selectedStatus]);

  const weekStart = startOfWeek(currentWeek, { locale: zhCN });
  const weekEnd = endOfWeek(currentWeek, { locale: zhCN });

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesCourse = selectedCourse === 'all' || record.course === courses.find(c => c.id.toString() === selectedCourse)?.name;
    const matchesStudent = selectedStudent === 'all' || record.student === students.find(s => s.id.toString() === selectedStudent)?.name;
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    
    // Check if date is in selected week
    const recordDate = parseISO(record.date);
    const isInSelectedWeek = recordDate >= weekStart && recordDate <= weekEnd;
    
    return matchesCourse && matchesStudent && matchesStatus && isInSelectedWeek;
  });

  // Calculate attendance statistics
  const calculateAttendanceStats = () => {
    if (attendanceRecords.length === 0) return { present: 0, late: 0, absent: 0 };
    
    const total = filteredRecords.length;
    const presentCount = filteredRecords.filter(r => r.status === 'present').length;
    const lateCount = filteredRecords.filter(r => r.status === 'late').length;
    const absentCount = filteredRecords.filter(r => r.status === 'absent').length;
    
    return {
      present: Math.round((presentCount / total) * 100) || 0,
      late: Math.round((lateCount / total) * 100) || 0,
      absent: Math.round((absentCount / total) * 100) || 0
    };
  };

  const stats = calculateAttendanceStats();

  const handleExportAttendance = () => {
    // Create CSV content
    const headers = ['Date', 'Course', 'Student', 'Status', 'Arrival Time', 'Leaving Time', 'Notes'];
    const rows = filteredRecords.map(record => [
      record.date,
      record.course,
      record.student,
      record.status === 'present' ? 'Present' : record.status === 'late' ? 'Late' : 'Absent',
      record.arrivalTime || '',
      record.leavingTime || '',
      record.notes || ''
    ]);
    
    // Escape CSV values to handle commas and quotes
    const escapeCSV = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => escapeCSV(String(cell))).join(','))
    ].join('\n');
    
    // Create Blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Attendance_Records_${format(weekStart, 'yyyyMMdd')}_${format(weekEnd, 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Attendance Records</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleExportAttendance}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Records
          </button>
          <button
            onClick={onTakeAttendance}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
          >
            Take Attendance
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Attendance statistics */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Attendance Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-green-800 font-medium">Present</span>
                  <span className="text-green-800 font-bold text-xl">{stats.present}%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2.5 mt-2">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${stats.present}%` }}></div>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-yellow-800 font-medium">Late</span>
                  <span className="text-yellow-800 font-bold text-xl">{stats.late}%</span>
                </div>
                <div className="w-full bg-yellow-200 rounded-full h-2.5 mt-2">
                  <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: `${stats.late}%` }}></div>
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-red-800 font-medium">Absent</span>
                  <span className="text-red-800 font-bold text-xl">{stats.absent}%</span>
                </div>
                <div className="w-full bg-red-200 rounded-full h-2.5 mt-2">
                  <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${stats.absent}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="present">Present</option>
                <option value="late">Late</option>
                <option value="absent">Absent</option>
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
                    {format(weekStart, 'MMM dd, yyyy', { locale: zhCN })} - {format(weekEnd, 'MMM dd, yyyy', { locale: zhCN })}
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
        </>
      )}

      {/* Attendance records table */}
      {!loading && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredRecords.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No attendance records found
            </div>
          ) : (
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
                          : record.status === 'late'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status === 'present' ? (
                          <Check className="w-3 h-3 mr-1" />
                        ) : record.status === 'late' ? (
                          <Clock className="w-3 h-3 mr-1" />
                        ) : (
                          <X className="w-3 h-3 mr-1" />
                        )}
                        {record.status === 'present' ? 'Present' : record.status === 'late' ? 'Late' : 'Absent'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.status === 'present' || record.status === 'late' ? (
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
          )}
        </div>
      )}
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