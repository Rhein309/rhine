import React, { useState, useEffect } from 'react';
import { Search, GraduationCap, MapPin, BookOpen, Calendar, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import axios from 'axios';

// 定义数据类型
interface Student {
  id: number;
  name: string;
  age: number;
  grade: string;
  location: string;
  courses: string[];
  parent: string;
  contact: string;
  joinDate: string;
  status: string;
}

interface Location {
  id: string;
  name: string;
}

interface Course {
  id: string;
  name: string;
}

const StudentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // 状态管理
  const [locations, setLocations] = useState<Location[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [grades, setGrades] = useState<string[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API URL
  const API_URL = 'http://localhost:9999';

  // 获取所有数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 并行获取所有数据
        const [studentsRes, locationsRes, coursesRes, gradesRes] = await Promise.all([
          axios.get(`${API_URL}/students`),
          axios.get(`${API_URL}/locations`),
          axios.get(`${API_URL}/course-names`),
          axios.get(`${API_URL}/grades`)
        ]);
        
        setStudents(studentsRes.data);
        setLocations(locationsRes.data);
        setCourses(coursesRes.data);
        setGrades(gradesRes.data);
      } catch (err) {
        console.error('获取数据失败:', err);
        setError('获取数据失败，请检查服务器连接');
        
        // 如果API调用失败，使用默认数据
        setLocations([
          { id: 'tsw', name: 'Tsz Wan Shan Centre' },
          { id: 'tko', name: 'Tseung Kwan O Centre' }
        ]);
        setCourses([
          { id: 'phonics', name: 'Phonics Foundation' },
          { id: 'readers', name: 'Young Readers' }
        ]);
        setGrades(['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6']);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // 删除学生
  const handleDeleteStudent = async (studentId: number) => {
    if (window.confirm('确定要删除这名学生吗？此操作无法撤销。')) {
      if (window.confirm('请再次确认删除此学生。所有相关数据将被永久删除。')) {
        try {
          await axios.delete(`${API_URL}/students/${studentId}`);
          // 删除成功后更新学生列表
          setStudents(students.filter(student => student.id !== studentId));
        } catch (err) {
          console.error('删除学生失败:', err);
          alert('删除学生失败，请稍后再试');
        }
      }
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesLocation = selectedLocation === 'all' || student.location === locations.find(l => l.id === selectedLocation)?.name;
    const matchesCourse = selectedCourse === 'all' || student.courses.includes(courses.find(c => c.id === selectedCourse)?.name || '');
    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.parent.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Date filtering
    const studentDate = parseISO(student.joinDate);
    const matchesStartDate = !startDate || studentDate >= parseISO(startDate);
    const matchesEndDate = !endDate || studentDate <= parseISO(endDate);

    return matchesLocation && matchesCourse && matchesGrade && matchesSearch && matchesStartDate && matchesEndDate;
  });

  // 显示加载状态或错误信息
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <button 
          onClick={() => window.location.href = '/admin/students/new'}
          className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          <GraduationCap className="w-4 h-4 mr-2" />
          Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="all">All Locations</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>{location.name}</option>
            ))}
          </select>

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
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="all">All Grades</option>
            {grades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="Join Date From"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="Join Date To"
            />
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Courses
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Join Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parent
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
            {filteredStudents.map(student => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{student.name}</div>
                  <div className="text-sm text-gray-500">{student.age} years old</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.grade}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{student.location}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-2">
                    {student.courses.map((course, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{format(parseISO(student.joinDate), 'MMM d, yyyy')}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.parent}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{student.contact}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button 
                    onClick={() => window.location.href = `/admin/students/${student.id}`}
                    className="text-purple-600 hover:text-purple-900"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleDeleteStudent(student.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsPage;