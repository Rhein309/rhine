import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Check, X, Download, AlertCircle, Filter, BarChart2 } from 'lucide-react';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, parseISO, subMonths } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import axios from 'axios';

// 定义接口
interface AttendanceRecord {
  id: number | string;
  date: string;
  time: string;
  course: string;
  teacher: string;
  location: string;
  leavingTime: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

interface MonthlyStats {
  month: string;
  present: number;
  late: number;
  absent: number;
  total: number;
}

const AttendancePage = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<string[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);

  // 从API获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 尝试从API获取数据
        try {
          // 在实际应用中，这里应该调用API获取数据
          // const response = await axios.get('http://localhost:9999/parent/attendance');
          // setAttendanceRecords(response.data);
          
          // 使用模拟数据
          const mockRecords: AttendanceRecord[] = [
            {
              id: 1,
              date: '2025-01-15',
              time: '15:00',
              course: 'Phonics Foundation',
              teacher: 'Ms. Sarah',
              location: 'Online',
              leavingTime: '16:00',
              status: 'present',
              notes: 'Active participation'
            },
            {
              id: 2,
              date: '2025-01-13',
              time: '14:00',
              course: 'Young Readers',
              teacher: 'Mr. John',
              location: 'Tsz Wan Shan Centre',
              leavingTime: '15:00',
              status: 'present',
              notes: 'Completed all reading tasks'
            },
            {
              id: 3,
              date: '2025-01-20',
              time: '15:00',
              course: 'Phonics Foundation',
              teacher: 'Ms. Sarah',
              location: 'Online',
              leavingTime: '16:00',
              status: 'absent',
              notes: 'Sick leave'
            },
            {
              id: 4,
              date: '2025-01-22',
              time: '14:00',
              course: 'Young Readers',
              teacher: 'Mr. John',
              location: 'Tsz Wan Shan Centre',
              leavingTime: '15:00',
              status: 'late',
              notes: 'Late by 10 minutes, traffic jam'
            },
            {
              id: 5,
              date: '2025-01-27',
              time: '15:00',
              course: 'Phonics Foundation',
              teacher: 'Ms. Sarah',
              location: 'Online',
              leavingTime: '16:00',
              status: 'present',
              notes: 'Completed all homework'
            },
            {
              id: 6,
              date: '2025-01-29',
              time: '14:00',
              course: 'Young Readers',
              teacher: 'Mr. John',
              location: 'Tsz Wan Shan Centre',
              leavingTime: '15:00',
              status: 'present',
              notes: 'Reading skills improved'
            },
            {
              id: 7,
              date: '2025-02-03',
              time: '15:00',
              course: 'Phonics Foundation',
              teacher: 'Ms. Sarah',
              location: 'Online',
              leavingTime: '16:00',
              status: 'present',
              notes: 'Actively participated in class discussion'
            },
            {
              id: 8,
              date: '2025-02-05',
              time: '14:00',
              course: 'Young Readers',
              teacher: 'Mr. John',
              location: 'Tsz Wan Shan Centre',
              leavingTime: '15:00',
              status: 'late',
              notes: 'Late by 5 minutes'
            }
          ];
          
          setAttendanceRecords(mockRecords);
          
          // 提取所有课程
          const uniqueCourses = Array.from(new Set(mockRecords.map(record => record.course)));
          setCourses(uniqueCourses);
          
          // 生成月度统计数据
          generateMonthlyStats(mockRecords);
          
          setError(null);
        } catch (err) {
          console.error('Failed to fetch data:', err);
          setError('Failed to fetch data, please try again later');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 生成月度统计数据
  const generateMonthlyStats = (records: AttendanceRecord[]) => {
    const now = new Date();
    const stats: MonthlyStats[] = [];
    
    // 生成过去6个月的统计数据
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStr = format(monthDate, 'yyyy-MM');
      const monthName = format(monthDate, 'MMM yyyy', { locale: zhCN });
      
      // 筛选当月记录
      const monthRecords = records.filter(record => record.date.startsWith(monthStr));
      const total = monthRecords.length;
      const present = monthRecords.filter(r => r.status === 'present').length;
      const late = monthRecords.filter(r => r.status === 'late').length;
      const absent = monthRecords.filter(r => r.status === 'absent').length;
      
      stats.push({
        month: monthName,
        present,
        late,
        absent,
        total
      });
    }
    
    setMonthlyStats(stats);
  };

  const handlePreviousWeek = () => {
    setCurrentWeek(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => addWeeks(prev, 1));
  };

  const weekStart = startOfWeek(currentWeek, { locale: zhCN });
  const weekEnd = endOfWeek(currentWeek, { locale: zhCN });

  // 筛选记录
  const filteredRecords = attendanceRecords.filter(record => {
    const matchesCourse = selectedCourse === 'all' || record.course === selectedCourse;
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    
    // 检查日期是否在选定的周内
    const recordDate = parseISO(record.date);
    const isInSelectedWeek = recordDate >= weekStart && recordDate <= weekEnd;
    
    return matchesCourse && matchesStatus && isInSelectedWeek;
  });

  // 计算出勤率统计
  const calculateAttendanceStats = () => {
    if (attendanceRecords.length === 0) return { present: 0, late: 0, absent: 0 };
    
    const total = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
    const lateCount = attendanceRecords.filter(r => r.status === 'late').length;
    const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;
    
    return {
      present: Math.round((presentCount / total) * 100) || 0,
      late: Math.round((lateCount / total) * 100) || 0,
      absent: Math.round((absentCount / total) * 100) || 0
    };
  };

  const stats = calculateAttendanceStats();

  const handleExportAttendance = () => {
    // 创建CSV内容
    const headers = ['Date', 'Time', 'Course', 'Teacher', 'Location', 'Leaving Time', 'Status', 'Notes'];
    const rows = filteredRecords.map(record => [
      record.date,
      record.time,
      record.course,
      record.teacher,
      record.location,
      record.leavingTime,
      record.status === 'present' ? 'Present' : record.status === 'late' ? 'Late' : 'Absent',
      record.notes || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // 创建Blob并下载
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Attendance_${format(weekStart, 'yyyyMMdd')}_${format(weekEnd, 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Attendance Records</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button
            onClick={handleExportAttendance}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Records
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
          {/* Attendance Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Attendance Statistics</h2>
              <div className="flex items-center text-sm text-gray-500">
                <BarChart2 className="w-4 h-4 mr-1" />
                Total Classes: {attendanceRecords.length}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
            
            {/* Monthly Trend Chart */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Monthly Attendance Trend</h3>
              <div className="h-48 flex items-end space-x-2">
                {monthlyStats.map((month, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col-reverse h-40">
                      {month.total > 0 && (
                        <>
                          <div 
                            className="w-full bg-green-500" 
                            style={{ height: `${(month.present / month.total) * 100}%` }}
                            title={`Present: ${month.present} classes`}
                          ></div>
                          <div 
                            className="w-full bg-yellow-500" 
                            style={{ height: `${(month.late / month.total) * 100}%` }}
                            title={`Late: ${month.late} classes`}
                          ></div>
                          <div 
                            className="w-full bg-red-500" 
                            style={{ height: `${(month.absent / month.total) * 100}%` }}
                            title={`Absent: ${month.absent} classes`}
                          ></div>
                        </>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-2 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                      {month.month}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-2 space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 mr-1"></div>
                  <span className="text-xs text-gray-600">Present</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 mr-1"></div>
                  <span className="text-xs text-gray-600">Late</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 mr-1"></div>
                  <span className="text-xs text-gray-600">Absent</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  >
                    <option value="all">All Courses</option>
                    {courses.map((course, index) => (
                      <option key={index} value={course}>{course}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attendance Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  >
                    <option value="all">All Status</option>
                    <option value="present">Present</option>
                    <option value="late">Late</option>
                    <option value="absent">Absent</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Range
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handlePreviousWeek}
                      className="p-2 hover:bg-gray-100 rounded-md"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    
                    <button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-md flex-grow"
                    >
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-900 font-medium">
                        {format(weekStart, 'yyyy-MM-dd', { locale: zhCN })} - {format(weekEnd, 'yyyy-MM-dd', { locale: zhCN })}
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
            </div>
          )}

          {/* Attendance Records */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {filteredRecords.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No attendance records found
              </div>
            ) : (
              <div>
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
                  {filteredRecords.map(record => (
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AttendancePage;