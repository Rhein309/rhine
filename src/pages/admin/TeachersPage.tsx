import React, { useState, useEffect } from 'react';
import { Search, Users, MapPin, BookOpen, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface Teacher {
  id: number;
  name: string;
  location: string;
  courses: string[];
  experience: string;
  qualifications: string[];
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

const TeachersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [locations, setLocations] = useState<Location[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 获取位置数据
    fetch('http://localhost:9999/locations')
      .then(response => {
        if (!response.ok) {
          throw new Error('获取位置数据失败');
        }
        return response.json();
      })
      .then(data => {
        setLocations(data);
      })
      .catch(err => {
        console.error('获取位置数据错误:', err);
        setError('获取位置数据失败');
      });

    // 获取课程数据
    fetch('http://localhost:9999/course-names')
      .then(response => {
        if (!response.ok) {
          throw new Error('获取课程数据失败');
        }
        return response.json();
      })
      .then(data => {
        setCourses(data);
      })
      .catch(err => {
        console.error('获取课程数据错误:', err);
        setError('获取课程数据失败');
      });

    // 获取教师数据
    fetch('http://localhost:9999/teachers')
      .then(response => {
        if (!response.ok) {
          throw new Error('获取教师数据失败');
        }
        return response.json();
      })
      .then(data => {
        setTeachers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('获取教师数据错误:', err);
        setError('获取教师数据失败');
        setLoading(false);
      });
  }, []);

  const filteredTeachers = teachers.filter(teacher => {
    const matchesLocation = selectedLocation === 'all' || teacher.location === locations.find(l => l.id === selectedLocation)?.name;
    const matchesCourse = selectedCourse === 'all' || teacher.courses.some(course =>
      courses.find(c => c.id === selectedCourse)?.name === course
    );
    const matchesSearch = 
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.qualifications.some(q => q.toLowerCase().includes(searchQuery.toLowerCase()));

    // Date filtering
    const teacherDate = parseISO(teacher.joinDate);
    const matchesStartDate = !startDate || teacherDate >= parseISO(startDate);
    const matchesEndDate = !endDate || teacherDate <= parseISO(endDate);

    return matchesLocation && matchesCourse && matchesSearch && matchesStartDate && matchesEndDate;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
        <button
          onClick={() => window.location.href = '/admin/teachers/new'}
          className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          <Users className="w-4 h-4 mr-2" />
          Add Teacher
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* 加载状态 */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
      <>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search teachers..."
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

      {/* Teachers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTeachers.map(teacher => (
          <div key={teacher.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{teacher.name}</h3>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  {teacher.location}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Joined {format(parseISO(teacher.joinDate), 'MMM d, yyyy')}
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                teacher.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {teacher.status}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Courses</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {teacher.courses.map((course, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700">Qualifications</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {teacher.qualifications.map((qualification, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {qualification}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Experience</h4>
                  <p className="text-sm text-gray-600 mt-1">{teacher.experience}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Contact</h4>
                  <p className="text-sm text-gray-600 mt-1">{teacher.contact}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button 
                onClick={() => window.location.href = `/admin/teachers/${teacher.id}`}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                View Schedule
              </button>
              <button 
                onClick={() => window.location.href = `/admin/teachers/${teacher.id}/edit`}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Edit Profile
              </button>
              <button 
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this teacher? This action cannot be undone.')) {
                    if (window.confirm('Please confirm again that you want to delete this teacher. All associated data will be permanently removed.')) {
                      // 调用删除教师的API
                      fetch(`http://localhost:9999/teachers/${teacher.id}`, {
                        method: 'DELETE',
                      })
                        .then(response => {
                          if (!response.ok) {
                            throw new Error('删除教师失败');
                          }
                          return response.json();
                        })
                        .then(() => {
                          // 删除成功后，更新教师列表
                          setTeachers(teachers.filter(t => t.id !== teacher.id));
                        })
                        .catch(err => {
                          console.error('删除教师错误:', err);
                          alert('删除教师失败，请稍后再试');
                        });
                    }
                  }
                }}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      </>
      )}
    </div>
  );
};

export default TeachersPage;