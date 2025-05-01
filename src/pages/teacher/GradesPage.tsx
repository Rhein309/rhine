import React, { useState, useEffect } from 'react';
import { Search, Calendar, ChevronLeft, ChevronRight, Plus, X, AlertCircle, Check, Filter, ArrowUp, ArrowDown } from 'lucide-react';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, parseISO } from 'date-fns';
import axios from 'axios';

// 定义接口
interface Student {
  id: number;
  name: string;
  age: number;
  parent: string;
  contact: string;
}

interface Course {
  id: number | string;
  name: string;
}

interface Class {
  id: number;
  course: string;
  schedule: string;
  time: string;
  location: string;
  students: Student[];
}

interface Grade {
  id: number;
  date: string;
  course: string;
  courseId: number | string;
  type: 'quiz' | 'exam' | 'assignment' | 'homework';
  title: string;
  student: string;
  studentId: number;
  score: number;
  maxScore: number;
  feedback: string;
}

interface GradeFormData {
  date: string;
  courseId: number | string;
  studentId: number;
  type: 'quiz' | 'exam' | 'assignment' | 'homework';
  title: string;
  score: number;
  maxScore: number;
  feedback: string;
}

interface BatchGradeData {
  date: string;
  courseId: number | string;
  type: 'quiz' | 'exam' | 'assignment' | 'homework';
  title: string;
  maxScore: number;
  studentGrades: {
    studentId: number;
    score: number;
    feedback: string;
  }[];
}

interface Notification {
  type: 'success' | 'error';
  message: string;
}

const GradesPage = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddGradeModal, setShowAddGradeModal] = useState(false);
  const [showBatchGradeModal, setShowBatchGradeModal] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [gradeFormData, setGradeFormData] = useState<GradeFormData>({
    date: format(new Date(), 'yyyy-MM-dd'),
    courseId: '',
    studentId: 0,
    type: 'quiz',
    title: '',
    score: 0,
    maxScore: 100,
    feedback: ''
  });
  const [batchGradeData, setBatchGradeData] = useState<BatchGradeData>({
    date: format(new Date(), 'yyyy-MM-dd'),
    courseId: '',
    type: 'quiz',
    title: '',
    maxScore: 100,
    studentGrades: []
  });
  const [selectedClassForBatch, setSelectedClassForBatch] = useState<Class | null>(null);

  // 从API获取课程和成绩数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 获取课程数据
        const coursesResponse = await axios.get('http://localhost:9999/courses');
        
        // 转换课程数据格式
        const formattedCourses = coursesResponse.data.map((course: any) => ({
          id: course.id,
          name: course.name
        }));
        
        setCourses(formattedCourses);
        
        // 构建班级数据
        const formattedClasses = coursesResponse.data.map((course: any) => ({
          id: course.id,
          course: course.name,
          schedule: course.schedule || 'N/A',
          time: course.time || 'N/A',
          location: course.location || 'N/A',
          students: course.students || [] // 假设API返回的课程数据中包含学生信息
        }));
        
        setClasses(formattedClasses);
        
        // 获取成绩数据
        const gradesResponse = await axios.get('http://localhost:9999/grades');
        setGrades(gradesResponse.data);
        
        setError(null);
      } catch (err) {
        console.error('获取数据失败:', err);
        setError('Failed to fetch data, please try again later');
        
        // 如果API调用失败，使用默认数据（仅用于开发/测试）
        setCourses([
          { id: 'phonics', name: 'Phonics Foundation' },
          { id: 'readers', name: 'Young Readers' }
        ]);
        
        setClasses([
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
        ]);
        
        setGrades([
          {
            id: 1,
            date: '2025-01-15',
            course: 'Phonics Foundation',
            courseId: 'phonics',
            type: 'quiz',
            title: 'Week 3 Quiz',
            student: 'Emily Wong',
            studentId: 1,
            score: 95,
            maxScore: 100,
            feedback: 'Excellent understanding of short vowel sounds'
          },
          {
            id: 2,
            date: '2025-01-14',
            course: 'Young Readers',
            courseId: 'readers',
            type: 'homework',
            title: 'Reading Comprehension Exercise',
            student: 'Thomas Chan',
            studentId: 2,
            score: 85,
            maxScore: 100,
            feedback: 'Good work on main idea identification'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 处理周导航
  const handlePreviousWeek = () => {
    setCurrentWeek(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => addWeeks(prev, 1));
  };

  const weekStart = startOfWeek(currentWeek);
  const weekEnd = endOfWeek(currentWeek);

  // 获取评估类型的颜色
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quiz':
        return 'bg-purple-100 text-purple-800';
      case 'exam':
        return 'bg-blue-100 text-blue-800';
      case 'assignment':
        return 'bg-yellow-100 text-yellow-800';
      case 'homework':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 处理排序
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 过滤和排序成绩
  const filteredAndSortedGrades = grades
    .filter(grade => {
      // 课程过滤
      const courseMatch = selectedCourse === 'all' || grade.courseId === selectedCourse;
      
      // 类型过滤
      const typeMatch = selectedType === 'all' || grade.type === selectedType;
      
      // 搜索过滤（学生姓名或评估标题）
      const searchMatch = searchQuery === '' ||
        grade.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grade.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      return courseMatch && typeMatch && searchMatch;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      
      let comparison = 0;
      
      switch (sortField) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'course':
          comparison = a.course.localeCompare(b.course);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'student':
          comparison = a.student.localeCompare(b.student);
          break;
        case 'score':
          comparison = (a.score / a.maxScore) - (b.score / b.maxScore);
          break;
        default:
          return 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
  // 处理添加单个成绩表单变更
  const handleGradeFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGradeFormData(prev => ({
      ...prev,
      [name]: name === 'score' || name === 'maxScore' || name === 'studentId' ? Number(value) : value
    }));
  };

  // 处理添加单个成绩提交
  const handleSubmitGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!gradeFormData.courseId || !gradeFormData.studentId || !gradeFormData.title || gradeFormData.score < 0) {
      setNotification({
        type: 'error',
        message: 'Please fill in all required fields and ensure the score is positive'
      });
      return;
    }
    
    try {
      // 获取课程和学生名称
      const course = courses.find(c => c.id === gradeFormData.courseId);
      const selectedClass = classes.find(c => c.course === course?.name);
      const student = selectedClass?.students.find(s => s.id === gradeFormData.studentId);
      
      if (!course || !student) {
        throw new Error('无法找到所选课程或学生');
      }
      
      const newGrade: Omit<Grade, 'id'> = {
        date: gradeFormData.date,
        course: course.name,
        courseId: course.id,
        type: gradeFormData.type,
        title: gradeFormData.title,
        student: student.name,
        studentId: student.id,
        score: gradeFormData.score,
        maxScore: gradeFormData.maxScore,
        feedback: gradeFormData.feedback
      };
      
      // 发送到API
      const response = await axios.post('http://localhost:9999/grades', newGrade);
      
      // 更新本地状态
      setGrades(prev => [...prev, { ...response.data, id: response.data.id || Date.now() }]);
      
      // 显示成功通知
      setNotification({
        type: 'success',
        message: 'Grade added successfully'
      });
      
      // 重置表单并关闭模态框
      setGradeFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        courseId: '',
        studentId: 0,
        type: 'quiz',
        title: '',
        score: 0,
        maxScore: 100,
        feedback: ''
      });
      setShowAddGradeModal(false);
      
    } catch (err) {
      console.error('添加成绩失败:', err);
      
      // 显示错误通知
      setNotification({
        type: 'error',
        message: 'Failed to add grade, please try again later'
      });
      
      // 模拟成功（仅用于开发/测试）
      const course = courses.find(c => c.id === gradeFormData.courseId);
      const selectedClass = classes.find(c => c.course === course?.name);
      const student = selectedClass?.students.find(s => s.id === gradeFormData.studentId);
      
      if (course && student) {
        const newGrade: Grade = {
          id: Date.now(),
          date: gradeFormData.date,
          course: course.name,
          courseId: course.id,
          type: gradeFormData.type,
          title: gradeFormData.title,
          student: student.name,
          studentId: student.id,
          score: gradeFormData.score,
          maxScore: gradeFormData.maxScore,
          feedback: gradeFormData.feedback
        };
        
        setGrades(prev => [...prev, newGrade]);
        setNotification({
          type: 'success',
          message: 'Grade added successfully (mock)'
        });
        setGradeFormData({
          date: format(new Date(), 'yyyy-MM-dd'),
          courseId: '',
          studentId: 0,
          type: 'quiz',
          title: '',
          score: 0,
          maxScore: 100,
          feedback: ''
        });
        setShowAddGradeModal(false);
      }
    }
  };

  // 处理批量评分课程选择
  const handleBatchCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseId = e.target.value;
    setBatchGradeData(prev => ({ ...prev, courseId }));
    
    // 找到对应的班级
    const course = courses.find(c => c.id === courseId);
    const selectedClass = classes.find(c => c.course === course?.name);
    
    if (selectedClass) {
      setSelectedClassForBatch(selectedClass);
      
      // 初始化学生成绩数据
      const initialStudentGrades = selectedClass.students.map(student => ({
        studentId: student.id,
        score: 0,
        feedback: ''
      }));
      
      setBatchGradeData(prev => ({
        ...prev,
        studentGrades: initialStudentGrades
      }));
    } else {
      setSelectedClassForBatch(null);
      setBatchGradeData(prev => ({
        ...prev,
        studentGrades: []
      }));
    }
  };

  // 处理批量评分表单变更
  const handleBatchFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBatchGradeData(prev => ({
      ...prev,
      [name]: name === 'maxScore' ? Number(value) : value
    }));
  };

  // 处理批量评分学生分数变更
  const handleStudentScoreChange = (studentId: number, field: 'score' | 'feedback', value: string | number) => {
    setBatchGradeData(prev => ({
      ...prev,
      studentGrades: prev.studentGrades.map(sg =>
        sg.studentId === studentId
          ? { ...sg, [field]: field === 'score' ? Number(value) : value }
          : sg
      )
    }));
  };

  // 处理批量评分提交
  const handleSubmitBatchGrades = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!batchGradeData.courseId || !batchGradeData.title || batchGradeData.maxScore <= 0) {
      setNotification({
        type: 'error',
        message: 'Please fill in all required fields and ensure max score is positive'
      });
      return;
    }
    
    try {
      // 获取课程
      const course = courses.find(c => c.id === batchGradeData.courseId);
      
      if (!course) {
        throw new Error('无法找到所选课程');
      }
      
      // 创建批量成绩数据
      const batchGrades = batchGradeData.studentGrades.map(sg => {
        const student = selectedClassForBatch?.students.find(s => s.id === sg.studentId);
        
        if (!student) {
          throw new Error(`无法找到ID为${sg.studentId}的学生`);
        }
        
        return {
          date: batchGradeData.date,
          course: course.name,
          courseId: course.id,
          type: batchGradeData.type,
          title: batchGradeData.title,
          student: student.name,
          studentId: student.id,
          score: sg.score,
          maxScore: batchGradeData.maxScore,
          feedback: sg.feedback
        };
      });
      
      // 发送到API
      const response = await axios.post('http://localhost:9999/grades/batch', batchGrades);
      
      // 更新本地状态
      const newGrades = response.data.map((grade: any, index: number) => ({
        ...grade,
        id: grade.id || Date.now() + index
      }));
      
      setGrades(prev => [...prev, ...newGrades]);
      
      // 显示成功通知
      setNotification({
        type: 'success',
        message: `Successfully added ${batchGrades.length} grade records`
      });
      
      // 重置表单并关闭模态框
      setBatchGradeData({
        date: format(new Date(), 'yyyy-MM-dd'),
        courseId: '',
        type: 'quiz',
        title: '',
        maxScore: 100,
        studentGrades: []
      });
      setSelectedClassForBatch(null);
      setShowBatchGradeModal(false);
      
    } catch (err) {
      console.error('批量添加成绩失败:', err);
      
      // 显示错误通知
      setNotification({
        type: 'error',
        message: 'Failed to add grades in batch, please try again later'
      });
      
      // 模拟成功（仅用于开发/测试）
      const course = courses.find(c => c.id === batchGradeData.courseId);
      
      if (course && selectedClassForBatch) {
        const newGrades = batchGradeData.studentGrades.map((sg, index) => {
          const student = selectedClassForBatch.students.find(s => s.id === sg.studentId);
          
          return {
            id: Date.now() + index,
            date: batchGradeData.date,
            course: course.name,
            courseId: course.id,
            type: batchGradeData.type,
            title: batchGradeData.title,
            student: student?.name || 'Unknown Student',
            studentId: sg.studentId,
            score: sg.score,
            maxScore: batchGradeData.maxScore,
            feedback: sg.feedback
          };
        });
        
        setGrades(prev => [...prev, ...newGrades]);
        setNotification({
          type: 'success',
          message: `Successfully added ${newGrades.length} grade records (mock)`
        });
        setBatchGradeData({
          date: format(new Date(), 'yyyy-MM-dd'),
          courseId: '',
          type: 'quiz',
          title: '',
          maxScore: 100,
          studentGrades: []
        });
        setSelectedClassForBatch(null);
        setShowBatchGradeModal(false);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Grades Record</h1>
        <button
          onClick={() => setShowAddGradeModal(true)}
          className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Grade
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="course-filter" className="block text-sm font-medium text-gray-700 mb-1">Course</label>
            <select
              id="course-filter"
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
          
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">Assessment Type</label>
            <select
              id="type-filter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            >
              <option value="all">All Types</option>
              <option value="quiz">Quiz</option>
              <option value="exam">Exam</option>
              <option value="assignment">Assignment</option>
              <option value="homework">Homework</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="search-filter" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <input
                id="search-filter"
                type="text"
                placeholder="Search student or assessment title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowBatchGradeModal(true)}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Batch Add Grades
            </button>
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
      </div>

      {/* Notification */}
      {notification && (
        <div className={`mb-4 p-4 rounded-md ${notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} flex items-center justify-between`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <Check className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            <p>{notification.message}</p>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    Date
                    {sortField === 'date' && (
                      sortDirection === 'asc' ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('course')}
                >
                  <div className="flex items-center">
                    Course
                    {sortField === 'course' && (
                      sortDirection === 'asc' ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center">
                    Type
                    {sortField === 'type' && (
                      sortDirection === 'asc' ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center">
                    Title
                    {sortField === 'title' && (
                      sortDirection === 'asc' ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('student')}
                >
                  <div className="flex items-center">
                    Student
                    {sortField === 'student' && (
                      sortDirection === 'asc' ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('score')}
                >
                  <div className="flex items-center">
                    Score
                    {sortField === 'score' && (
                      sortDirection === 'asc' ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feedback
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedGrades.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No grade records found
                  </td>
                </tr>
              ) : (
                filteredAndSortedGrades.map((grade) => (
                  <tr key={grade.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(grade.type)}`}>
                        {grade.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.student}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.score}/{grade.maxScore}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {grade.feedback}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Single Grade Modal */}
      {showAddGradeModal && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Add Grade</h2>
            <button
              onClick={() => setShowAddGradeModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmitGrade}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={gradeFormData.date}
                  onChange={handleGradeFormChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">
                  Course
                </label>
                <select
                  id="courseId"
                  name="courseId"
                  value={gradeFormData.courseId}
                  onChange={handleGradeFormChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                  Student
                </label>
                <select
                  id="studentId"
                  name="studentId"
                  value={gradeFormData.studentId}
                  onChange={handleGradeFormChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                  disabled={!gradeFormData.courseId}
                >
                  <option value={0}>Select Student</option>
                  {gradeFormData.courseId && classes
                    .find(c => c.course === courses.find(course => course.id === gradeFormData.courseId)?.name)
                    ?.students.map(student => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))
                  }
                </select>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Assessment Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={gradeFormData.type}
                  onChange={handleGradeFormChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                >
                  <option value="quiz">Quiz</option>
                  <option value="exam">Exam</option>
                  <option value="assignment">Assignment</option>
                  <option value="homework">Homework</option>
                </select>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Assessment Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={gradeFormData.title}
                  onChange={handleGradeFormChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="e.g. Week 3 Quiz"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-1">
                    Score
                  </label>
                  <input
                    type="number"
                    id="score"
                    name="score"
                    value={gradeFormData.score}
                    onChange={handleGradeFormChange}
                    min="0"
                    max={gradeFormData.maxScore}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="maxScore" className="block text-sm font-medium text-gray-700 mb-1">
                    Max Score
                  </label>
                  <input
                    type="number"
                    id="maxScore"
                    name="maxScore"
                    value={gradeFormData.maxScore}
                    onChange={handleGradeFormChange}
                    min="1"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                Feedback
              </label>
              <textarea
                id="feedback"
                name="feedback"
                value={gradeFormData.feedback}
                onChange={handleGradeFormChange}
                rows={3}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="Provide detailed feedback..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddGradeModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
              >
                Save Grade
              </button>
            </div>
          </form>
        </div>
      </div>
      )}

      {/* Batch Add Grades Modal */}
      {showBatchGradeModal && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Batch Add Grades</h2>
            <button
              onClick={() => setShowBatchGradeModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmitBatchGrades}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label htmlFor="batch-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="batch-date"
                  name="date"
                  value={batchGradeData.date}
                  onChange={handleBatchFormChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="batch-courseId" className="block text-sm font-medium text-gray-700 mb-1">
                  Course
                </label>
                <select
                  id="batch-courseId"
                  name="courseId"
                  value={batchGradeData.courseId}
                  onChange={handleBatchCourseChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="batch-type" className="block text-sm font-medium text-gray-700 mb-1">
                  Assessment Type
                </label>
                <select
                  id="batch-type"
                  name="type"
                  value={batchGradeData.type}
                  onChange={handleBatchFormChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                >
                  <option value="quiz">Quiz</option>
                  <option value="exam">Exam</option>
                  <option value="assignment">Assignment</option>
                  <option value="homework">Homework</option>
                </select>
              </div>

              <div>
                <label htmlFor="batch-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Assessment Title
                </label>
                <input
                  type="text"
                  id="batch-title"
                  name="title"
                  value={batchGradeData.title}
                  onChange={handleBatchFormChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="e.g. Midterm Exam"
                  required
                />
              </div>

              <div>
                <label htmlFor="batch-maxScore" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Score
                </label>
                <input
                  type="number"
                  id="batch-maxScore"
                  name="maxScore"
                  value={batchGradeData.maxScore}
                  onChange={handleBatchFormChange}
                  min="1"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            {selectedClassForBatch && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Student Grades</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-12 gap-4 mb-2 font-medium text-gray-700">
                    <div className="col-span-4">Student</div>
                    <div className="col-span-2">Score</div>
                    <div className="col-span-6">Feedback</div>
                  </div>
                  <div className="space-y-3">
                    {batchGradeData.studentGrades.map((sg) => {
                      const student = selectedClassForBatch?.students.find(s => s.id === sg.studentId);
                      return (
                        <div key={sg.studentId} className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-4">
                            <div className="text-sm font-medium text-gray-900">{student?.name}</div>
                            <div className="text-xs text-gray-500">Parent: {student?.parent}</div>
                          </div>
                          <div className="col-span-2">
                            <input
                              type="number"
                              value={sg.score}
                              onChange={(e) => handleStudentScoreChange(sg.studentId, 'score', e.target.value)}
                              min="0"
                              max={batchGradeData.maxScore}
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                              required
                            />
                          </div>
                          <div className="col-span-6">
                            <input
                              type="text"
                              value={sg.feedback}
                              onChange={(e) => handleStudentScoreChange(sg.studentId, 'feedback', e.target.value)}
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                              placeholder="Feedback (optional)"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowBatchGradeModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
                disabled={!selectedClassForBatch}
              >
                Save All Grades
              </button>
            </div>
          </form>
        </div>
      </div>
      )}
    </div>
  );
};

export default GradesPage;