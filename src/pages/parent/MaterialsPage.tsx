import React, { useState, useEffect } from 'react';
import { Search, FileText, FileSpreadsheet, FileImage, Download } from 'lucide-react';
import { getAllMaterials, downloadFile, Material } from '../../lib/materialService';

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

const MaterialsPage = () => {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('all');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<{id: string, name: string}[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const weeks = Array.from({ length: 12 }, (_, i) => ({
    id: `week-${i + 1}`,
    name: `Week ${i + 1}`
  }));

  // 加载课程数据
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        const response = await fetch('http://localhost:9999/courses');
        
        if (!response.ok) {
          throw new Error(`获取课程数据失败: ${response.status}`);
        }
        
        const data = await response.json() as ApiCourse[];
        
        // 将API返回的数据格式转换为组件需要的格式
        const formattedCourses = data.map((course: ApiCourse) => ({
          id: course.id.toString(), // 转换为字符串以匹配Material中的courseId类型
          name: course.name
        }));
        
        setCourses(formattedCourses);
      } catch (err: any) {
        console.error('获取课程数据时出错:', err);
        // 如果API获取失败，使用默认课程数据
        setCourses([
          { id: 'phonics', name: 'Phonics Foundation' },
          { id: 'readers', name: 'Young Readers' }
        ]);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // 加载所有课程资料
  useEffect(() => {
    const loadMaterials = async () => {
      try {
        setIsLoading(true);
        const data = await getAllMaterials();
        setMaterials(data);
      } catch (error) {
        console.error('Failed to load materials:', error);
        alert('加载课程资料失败');
      } finally {
        setIsLoading(false);
      }
    };

    loadMaterials();
  }, []);

  // 获取文件图标
  const getFileIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'pdf':
        return FileText;
      case 'xlsx':
      case 'xls':
      case 'csv':
        return FileSpreadsheet;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return FileImage;
      default:
        return FileText;
    }
  };

  // 处理资料下载
  const handleDownload = async (material: Material) => {
    try {
      await downloadFile(material.filePath, `${material.title}.${material.format}`);
    } catch (error) {
      console.error('Download failed:', error);
      alert('下载失败，请重试');
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesCourse = selectedCourse === 'all' || material.courseId === selectedCourse;
    const matchesWeek = selectedWeek === 'all' || material.week === selectedWeek;
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesWeek && matchesSearch;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'homework':
        return 'bg-blue-100 text-blue-800';
      case 'notes':
        return 'bg-green-100 text-green-800';
      case 'quiz':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">课程资料</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            disabled={coursesLoading}
          >
            <option value="all">所有课程</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.name}</option>
            ))}
          </select>

          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="all">所有周次</option>
            {weeks.map(week => (
              <option key={week.id} value={week.id}>{week.name}</option>
            ))}
          </select>

          <div className="relative">
            <input
              type="text"
              placeholder="搜索资料..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        {/* Materials List */}
        {isLoading || coursesLoading ? (
          <div className="py-10 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            <p className="mt-2 text-gray-500">加载中...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map(material => {
                const FileIcon = getFileIcon(material.format);
                return (
                  <div key={material.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div className="flex items-start space-x-4">
                      <FileIcon className="w-8 h-8 text-gray-400" />
                      <div>
                        <h3 className="font-medium text-gray-900">{material.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(material.type)}`}>
                            {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {courses.find(c => c.id === material.courseId)?.name || material.courseId}
                          </span>
                          <span className="text-sm text-gray-500">
                            上传者: {material.teacher} | 日期: {material.uploadDate}
                          </span>
                          <span className="text-sm text-gray-500">
                            {material.week.replace('week-', '第') + '周'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(material)}
                      className="flex items-center text-purple-600 hover:text-purple-700"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      下载
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="py-10 text-center text-gray-500">
                没有找到符合条件的课程资料
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialsPage;