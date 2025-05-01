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
        setError('Failed to load course materials');
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
      alert('Please select a file to upload');
      return;
    }

    if (!uploadData.title || !uploadData.courseId) {
      alert('Please fill in all required fields');
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
      
      alert('Material uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed, please try again');
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
      alert('Download failed, please try again');
    }
  };

  // 处理资料删除
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this material? This action cannot be undone.')) {
      try {
        await deleteMaterial(id);
        setMaterials(prev => prev.filter(material => material.id !== id));
        alert('Material deleted successfully');
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Delete failed, please try again');
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
                          <span className="whitespace-nowrap">Upload Date: {material.uploadDate}</span>
                          <span className="whitespace-nowrap">File Size: {material.fileSize}</span>
                          <span className="whitespace-nowrap">Assigned To: {material.assignedTo}</span>
                          <span className="whitespace-nowrap">Week: {material.week.replace('week-', 'Week ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 flex-shrink-0 ml-4">
                    <button
                      onClick={() => handleDownload(material)}
                      className="text-blue-500 hover:text-blue-600"
                      title="Download Material"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(material.id)}
                      className="text-red-500 hover:text-red-600"
                      title="Delete Material"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No course materials found
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
              <h2 className="text-xl font-semibold text-gray-900">Upload Course Material</h2>
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
                  Material Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="e.g. Week 1 Phonics Practice"
                />
              </div>

              <div>
                <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-2">
                  Course
                </label>
                <select
                  id="courseId"
                  value={uploadData.courseId}
                  onChange={(e) => setUploadData({ ...uploadData, courseId: e.target.value })}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="">Select Course</option>
                  {courses.length > 0 ? (
                    courses.map(course => (
                      <option key={course.id} value={course.id}>{course.name}</option>
                    ))
                  ) : (
                    <option value="" disabled>Loading courses...</option>
                  )}
                </select>
              </div>

              <div>
                <label htmlFor="week" className="block text-sm font-medium text-gray-700 mb-2">
                  Week
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
                  Material Type
                </label>
                <select
                  id="type"
                  value={uploadData.type}
                  onChange={(e) => setUploadData({ ...uploadData, type: e.target.value })}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="worksheet">Worksheet</option>
                  <option value="quiz">Quiz</option>
                  <option value="study_material">Study Material</option>
                  <option value="homework">Homework</option>
                  <option value="notes">Class Notes</option>
                </select>
              </div>

              <div>
                <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-2">
                  Assign To
                </label>
                <select
                  id="assignedTo"
                  value={uploadData.assignedTo}
                  onChange={(e) => setUploadData({ ...uploadData, assignedTo: e.target.value })}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="All Students">All Students</option>
                  {students.map(student => (
                    <option key={student.id} value={student.name}>{student.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                  File
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
                  Supported formats: PDF, Word, PowerPoint, Excel, Images
                </p>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  value={uploadData.notes}
                  onChange={(e) => setUploadData({ ...uploadData, notes: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Add any additional information about this material"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Upload Material
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