import React, { useState, useEffect } from 'react';
import { Search, Calendar, ChevronLeft, ChevronRight, Check, X, Clock, Download, AlertCircle } from 'lucide-react';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, parseISO } from 'date-fns';
import axios from 'axios';
import { zhCN } from 'date-fns/locale';

// 定义接口
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

  // 从API获取课程数据
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // 尝试从API获取数据
        try {
          const response = await axios.get('http://localhost:9999/courses');
          
          // 转换课程数据格式
          const formattedCourses = response.data.map((course: any) => ({
            id: course.id,
            name: course.name,
            schedule: course.schedule || 'N/A',
            time: course.time || 'N/A',
            location: course.location || 'N/A'
          }));
          
          setCourses(formattedCourses);
          
          // 构建班级数据
          const formattedClasses = response.data.map((course: any) => {
            // 获取该课程的学生
            return {
              id: course.id,
              course: course.name,
              schedule: course.schedule || 'N/A',
              time: course.time || 'N/A',
              location: course.location || 'N/A',
              students: [] // 初始化为空数组，后续会填充
            };
          });
          
          // 获取学生数据并分配到相应的班级
          const studentsResponse = await axios.get('http://localhost:9999/students');
          
          // 更新班级中的学生数据
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
          console.error('获取课程数据失败:', err);
          setError('获取课程数据失败，使用默认数据');
          
          // 如果API调用失败，使用默认数据
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
    if (window.confirm('确定要提交出勤记录吗？')) {
      if (window.confirm('请再次确认提交出勤记录。')) {
        setSubmitting(true);
        
        try {
          // 准备提交数据
          const records = Object.entries(attendanceData).map(([studentId, data]) => {
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
              notes: data.notes
            };
          });
          
          // 提交到API
          // 注意：这里应该调用实际的API，但由于没有实际的后端API，我们只是模拟提交
          console.log('提交出勤数据:', records);
          
          // 模拟API调用延迟
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          alert('出勤记录提交成功！');
          onCancel(); // 提交成功后返回主页面
        } catch (error) {
          console.error('提交出勤记录失败:', error);
          alert('提交出勤记录失败，请重试。');
        } finally {
          setSubmitting(false);
        }
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">记录出勤</h1>
        <button
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-800"
          disabled={submitting}
        >
          返回记录
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
          {/* 课程和日期选择 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择课程
                </label>
                <select
                  value={selectedClass?.id || ''}
                  onChange={(e) => {
                    const class_ = classes.find(c => c.id.toString() === e.target.value);
                    setSelectedClass(class_ || null);
                    
                    // 初始化所有学生的出勤数据
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
                  <option value="">选择课程</option>
                  {classes.map(class_ => (
                    <option key={class_.id} value={class_.id}>{class_.course}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择日期
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
            <p className="text-sm text-gray-500">地点: {selectedClass.location}</p>
          </div>
          
          <div className="space-y-6">
            {selectedClass.students.map(student => (
              <div key={student.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
                    {student.parent && (
                      <p className="text-sm text-gray-500">家长: {student.parent}</p>
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
                      出席
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
                      迟到
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
                      缺席
                    </button>
                  </div>
                </div>
                
                {(attendanceData[student.id]?.status === 'present' || attendanceData[student.id]?.status === 'late') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        到达时间
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
                        离开时间
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
                  placeholder="添加备注（可选）"
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
                  提交中...
                </span>
              ) : (
                '提交出勤记录'
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

  // 从API获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 尝试从API获取数据
        try {
          // 获取课程数据
          const coursesResponse = await axios.get('http://localhost:9999/courses');
          const formattedCourses = coursesResponse.data.map((course: any) => ({
            id: course.id,
            name: course.name
          }));
          setCourses(formattedCourses);
          
          // 获取学生数据
          const studentsResponse = await axios.get('http://localhost:9999/students');
          const formattedStudents = studentsResponse.data.map((student: any) => ({
            id: student.id,
            name: student.name
          }));
          setStudents(formattedStudents);
          
          // 获取出勤记录数据
          // 注意：这里应该有一个实际的API端点来获取出勤记录，但由于没有实际的后端API，我们使用模拟数据
          // const attendanceResponse = await axios.get('http://localhost:9999/attendance');
          // setAttendanceRecords(attendanceResponse.data);
          
          // 使用模拟数据
          const mockAttendanceRecords = [
            {
              id: 1,
              date: '2025-01-15',
              course: formattedCourses[0]?.name || 'Phonics Foundation',
              student: formattedStudents[0]?.name || 'Emily Wong',
              status: 'present' as const,
              arrivalTime: '09:55 AM',
              leavingTime: '11:00 AM',
              notes: '课堂参与度高'
            },
            {
              id: 2,
              date: '2025-01-15',
              course: formattedCourses[0]?.name || 'Phonics Foundation',
              student: formattedStudents[1]?.name || 'Thomas Chan',
              status: 'absent' as const,
              notes: '家长已通知 - 病假'
            },
            {
              id: 3,
              date: '2025-01-16',
              course: formattedCourses[1]?.name || 'Young Readers',
              student: formattedStudents[2]?.name || 'Sophie Lee',
              status: 'late' as const,
              arrivalTime: '10:15 AM',
              leavingTime: '11:30 AM',
              notes: '迟到15分钟，交通拥堵'
            }
          ];
          
          setAttendanceRecords(mockAttendanceRecords);
          setError(null);
        } catch (err) {
          console.error('获取数据失败:', err);
          setError('获取数据失败，使用默认数据');
          
          // 如果API调用失败，使用默认数据
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
              notes: '课堂参与度高'
            },
            {
              id: 2,
              date: '2025-01-15',
              course: 'Phonics Foundation',
              student: 'Thomas Chan',
              status: 'absent' as const,
              notes: '家长已通知 - 病假'
            },
            {
              id: 3,
              date: '2025-01-16',
              course: 'Young Readers',
              student: 'Sophie Lee',
              status: 'late' as const,
              arrivalTime: '10:15 AM',
              leavingTime: '11:30 AM',
              notes: '迟到15分钟，交通拥堵'
            }
          ];
          
          setAttendanceRecords(defaultAttendanceRecords);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePreviousWeek = () => {
    setCurrentWeek(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => addWeeks(prev, 1));
  };

  const weekStart = startOfWeek(currentWeek, { locale: zhCN });
  const weekEnd = endOfWeek(currentWeek, { locale: zhCN });

  const filteredRecords = attendanceRecords.filter(record => {
    const matchesCourse = selectedCourse === 'all' || record.course === courses.find(c => c.id.toString() === selectedCourse)?.name;
    const matchesStudent = selectedStudent === 'all' || record.student === students.find(s => s.id.toString() === selectedStudent)?.name;
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    
    // 检查日期是否在选定的周内
    const recordDate = parseISO(record.date);
    const isInSelectedWeek = recordDate >= weekStart && recordDate <= weekEnd;
    
    return matchesCourse && matchesStudent && matchesStatus && isInSelectedWeek;
  });

  // 计算出勤率统计
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
    // 创建CSV内容
    const headers = ['日期', '课程', '学生', '状态', '到达时间', '离开时间', '备注'];
    const rows = filteredRecords.map(record => [
      record.date,
      record.course,
      record.student,
      record.status === 'present' ? '出席' : record.status === 'late' ? '迟到' : '缺席',
      record.arrivalTime || '',
      record.leavingTime || '',
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
    link.setAttribute('download', `出勤记录_${format(weekStart, 'yyyyMMdd')}_${format(weekEnd, 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">出勤记录</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleExportAttendance}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md transition-colors duration-200 flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            导出记录
          </button>
          <button
            onClick={onTakeAttendance}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
          >
            记录出勤
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
          {/* 出勤率统计 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">出勤率统计</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-green-800 font-medium">出席</span>
                  <span className="text-green-800 font-bold text-xl">{stats.present}%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2.5 mt-2">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${stats.present}%` }}></div>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-yellow-800 font-medium">迟到</span>
                  <span className="text-yellow-800 font-bold text-xl">{stats.late}%</span>
                </div>
                <div className="w-full bg-yellow-200 rounded-full h-2.5 mt-2">
                  <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: `${stats.late}%` }}></div>
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-red-800 font-medium">缺席</span>
                  <span className="text-red-800 font-bold text-xl">{stats.absent}%</span>
                </div>
                <div className="w-full bg-red-200 rounded-full h-2.5 mt-2">
                  <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${stats.absent}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* 筛选器 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="all">所有课程</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.name}</option>
                ))}
              </select>

              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="all">所有学生</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>{student.name}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="all">所有状态</option>
                <option value="present">出席</option>
                <option value="late">迟到</option>
                <option value="absent">缺席</option>
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
                    {format(weekStart, 'yyyy年MM月dd日', { locale: zhCN })} - {format(weekEnd, 'yyyy年MM月dd日', { locale: zhCN })}
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

      {/* 出勤记录表格 */}
      {!loading && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredRecords.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              没有找到符合条件的出勤记录
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    日期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    课程
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    学生
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    备注
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
                        {record.status === 'present' ? '出席' : record.status === 'late' ? '迟到' : '缺席'}
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