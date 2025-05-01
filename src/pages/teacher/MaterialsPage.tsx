import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, FileText, FileSpreadsheet, FileImage, Download, Upload, Plus, X, Save, Trash2 } from 'lucide-react';
import { getAllMaterials, uploadMaterial, uploadFile, downloadFile, deleteMaterial, Material } from '../../lib/materialService';

const MaterialsPage = () => {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [courses, setCourses] = useState<{id: string | number, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadData, setUploadData] = useState({
    title: '',
    courseId: '',
    week: 'week-1',
    type: 'worksheet',
    assignedTo: 'All Students',
    file: null as File | null,
    notes: ''
  });

  const students = [
    { id: '1', name: 'Emily Wong' },
    { id: '2', name: 'Thomas Chan' },
    { id: '3', name: 'Sophie Lee' }
  ];

  const weeks = Array.from({ length: 12 }, (_, i) => ({
    id: `week-${i + 1}`,
    name: `Week ${i + 1}`
  }));

  // 加载所有课程和课程资料
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 加载课程资料
        const materialsData = await getAllMaterials();
        setMaterials(materialsData);
        
        // 加载课程数据
        try {
          const response = await axios.get('http://localhost:9999/courses');
          // 转换课程数据格式
          const formattedCourses = response.data.map((course: any) => ({
            id: course.id,
            name: course.name
          }));
          setCourses(formattedCourses);
        } catch (err) {
          console.error('获取课程数据失败:', err);
          // 如果API调用失败，使用默认数据
          setCourses([
            { id: 'phonics', name: 'Phonics Foundation' },
            { id: 'readers', name: 'Young Readers' }
          ]);
        }
        
        setError(null);
      } catch (error) {
        console.error('Failed to load materials:', error);
        setError('加载课程资料失败');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'worksheet':
        return <FileText className="w-6 h-6" />;
      case 'quiz':
        return <FileSpreadsheet className="w-6 h-6" />;
      case 'study_material':
        return <FileImage className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadData(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadData.file) {
      alert('请选择要上传的文件');
      return;
    }

    if (!uploadData.title || !uploadData.courseId) {
      alert('请填写所有必填字段');
      return;
    }

    try {
      setIsUploading(true);
      
      // 上传文件并获取文件路径
      const filePath = await uploadFile(uploadData.file);
      
      // 获取文件格式
      const fileExtension = uploadData.file.name.split('.').pop() || '';
      
      // 创建新的课程资料
      const newMaterial = await uploadMaterial({
        title: uploadData.title,
        courseId: uploadData.courseId,
        week: uploadData.week,
        type: uploadData.type,
        format: fileExtension,
        teacher: 'Current Teacher', // 实际应用中应该从用户配置文件中获取
        filePath: filePath,
        notes: uploadData.notes,
        assignedTo: uploadData.assignedTo
      });
      
      // 更新材料列表
      setMaterials(prev => [...prev, newMaterial]);
      
      // 重置表单
      setShowUploadModal(false);
      setUploadData({
        title: '',
        courseId: '',
        week: 'week-1',
        type: 'worksheet',
        assignedTo: 'All Students',
        file: null,
        notes: ''
      });
      
      alert('课程资料上传成功！');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('上传失败，请重试');
    } finally {
      setIsUploading(false);
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

  // 处理资料删除
  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除这个资料吗？此操作不可撤销。')) {
      try {
        await deleteMaterial(id);
        setMaterials(prev => prev.filter(material => material.id !== id));
        alert('资料已成功删除');
      } catch (error) {
        console.error('Delete failed:', error);
        alert('删除失败，请重试');
      }
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesCourse = selectedCourse === 'all' || material.courseId === selectedCourse;
    const matchesStudent = selectedStudent === 'all' || material.assignedTo === 'All Students' ||
                          material.assignedTo === students.find(s => s.id === selectedStudent)?.name;
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesStudent && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Course Materials</h1>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Upload Material
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      ) : (
        <>
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

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Materials List */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredMaterials.length > 0 ? (
                filteredMaterials.map((material) => (
              <div key={material.id} className="p-6 hover:bg-gray-50 w-full overflow-hidden">
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-start space-x-4 min-w-0 flex-1">
                    <div className="text-gray-400 flex-shrink-0">
                      {getTypeIcon(material.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-900 truncate">{material.title}</h3>
                      <div className="mt-1 space-y-1">
                        <p className="text-sm text-gray-500 truncate">
                          {courses.find(c => c.id === material.courseId)?.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="whitespace-nowrap">上传日期: {material.uploadDate}</span>
                          <span className="whitespace-nowrap">文件大小: {material.fileSize}</span>
                          <span className="whitespace-nowrap">分配给: {material.assignedTo}</span>
                          <span className="whitespace-nowrap">周次: {material.week.replace('week-', '周')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 flex-shrink-0 ml-4">
                    <button
                      onClick={() => handleDownload(material)}
                      className="text-blue-500 hover:text-blue-600"
                      title="下载资料"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(material.id)}
                      className="text-red-500 hover:text-red-600"
                      title="删除资料"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              没有找到符合条件的课程资料
            </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">上传课程资料</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  资料标题
                </label>
                <input
                  type="text"
                  id="title"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="例如：第一周拼音练习"
                />
              </div>

              <div>
                <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-2">
                  课程
                </label>
                <select
                  id="courseId"
                  value={uploadData.courseId}
                  onChange={(e) => setUploadData({ ...uploadData, courseId: e.target.value })}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="">选择课程</option>
                  {courses.length > 0 ? (
                    courses.map(course => (
                      <option key={course.id} value={course.id}>{course.name}</option>
                    ))
                  ) : (
                    <option value="" disabled>加载课程中...</option>
                  )}
                </select>
              </div>

              <div>
                <label htmlFor="week" className="block text-sm font-medium text-gray-700 mb-2">
                  课程周次
                </label>
                <select
                  id="week"
                  value={uploadData.week}
                  onChange={(e) => setUploadData({ ...uploadData, week: e.target.value })}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  {weeks.map(week => (
                    <option key={week.id} value={week.id}>{week.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  资料类型
                </label>
                <select
                  id="type"
                  value={uploadData.type}
                  onChange={(e) => setUploadData({ ...uploadData, type: e.target.value })}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="worksheet">练习题</option>
                  <option value="quiz">测验</option>
                  <option value="study_material">学习资料</option>
                  <option value="homework">家庭作业</option>
                  <option value="notes">课堂笔记</option>
                </select>
              </div>

              <div>
                <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-2">
                  分配给
                </label>
                <select
                  id="assignedTo"
                  value={uploadData.assignedTo}
                  onChange={(e) => setUploadData({ ...uploadData, assignedTo: e.target.value })}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="All Students">所有学生</option>
                  {students.map(student => (
                    <option key={student.id} value={student.name}>{student.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                  文件
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  required
                  className="w-full"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png"
                />
                <p className="mt-1 text-sm text-gray-500">
                  支持的格式：PDF, Word, PowerPoint, Excel, 图片
                </p>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  备注（可选）
                </label>
                <textarea
                  id="notes"
                  value={uploadData.notes}
                  onChange={(e) => setUploadData({ ...uploadData, notes: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="添加关于此资料的任何附加信息"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                  disabled={isUploading}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      上传中...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      上传资料
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialsPage;