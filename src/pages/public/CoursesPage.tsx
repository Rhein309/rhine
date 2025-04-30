import React, { useState, useEffect } from 'react';
import { Search, Clock, Users, Calendar } from 'lucide-react';

// 定义API返回的课程数据类型
interface ApiCourse {
  id: number;
  name: string;
  level: string;
  ageRange: string;
  location: string;
  schedule: string;
  time: string;
  teacher: string;
  enrolledStudents: number;
  maxStudents: number;
  fee: string;
  status: string;
  description?: string;
}

// 定义组件使用的课程数据类型
interface Course {
  id: number;
  name: string;
  type: 'online' | 'offline';
  ageRange: string;
  description: string;
  schedule: string;
  time: string;
  maxStudents: number;
  duration: string;
  fee: string;
}

const CoursesPage = () => {
  const [filters, setFilters] = useState({
    age: '',
    type: 'all',
    days: '',
    search: ''
  });
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:9999/courses');
        
        if (!response.ok) {
          throw new Error(`获取课程数据失败: ${response.status}`);
        }
        
        const data = await response.json() as ApiCourse[];
        
        // 将API返回的数据格式转换为组件需要的格式
        const formattedCourses = data.map((course: ApiCourse): Course => ({
          id: course.id,
          name: course.name,
          // 根据location判断课程类型（在线/线下）
          type: course.location.toLowerCase().includes('online') ? 'online' : 'offline',
          ageRange: course.ageRange,
          description: course.description || `${course.name} - ${course.level} level course for ages ${course.ageRange}`,
          schedule: course.schedule,
          time: course.time,
          maxStudents: course.maxStudents,
          duration: "12 weeks", // 假设所有课程都是12周
          fee: course.fee
        }));
        
        setCourses(formattedCourses);
      } catch (err: any) {
        console.error('获取课程数据时出错:', err);
        setError(err.message || '未知错误');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    if (filters.age && !course.ageRange.includes(filters.age)) return false;
    if (filters.type !== 'all' && course.type !== filters.type) return false;
    if (filters.search && !course.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Our Courses</h1>

      {loading && (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">加载课程数据中...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>加载课程数据时出错: {error}</p>
          <p>请稍后再试或联系管理员。</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  value={filters.age}
                  onChange={(e) => setFilters(prev => ({ ...prev, age: e.target.value }))}
                >
                  <option value="">All Ages</option>
                  <option value="3">3-5 years</option>
                  <option value="5">5-7 years</option>
                  <option value="7">7-9 years</option>
                  <option value="9">9-12 years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="all">All Types</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-10"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Course List */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800">{course.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        course.type === 'online' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {course.type.charAt(0).toUpperCase() + course.type.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span>Max {course.maxStudents} students</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{course.schedule}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{course.time}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-gray-600">Course Fee</p>
                        <p className="text-xl font-bold text-purple-600">{course.fee}</p>
                      </div>
                      <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600">没有找到符合条件的课程。</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CoursesPage;