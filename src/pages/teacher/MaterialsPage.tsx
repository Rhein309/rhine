import React, { useState } from 'react';
import { Search, FileText, FileSpreadsheet, FileImage, Download, Upload, Plus, X, Save } from 'lucide-react';

const MaterialsPage = () => {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    course: '',
    type: 'worksheet',
    assignedTo: 'all',
    file: null as File | null,
    notes: ''
  });

  const courses = [
    { id: 'phonics', name: 'Phonics Foundation' },
    { id: 'readers', name: 'Young Readers' }
  ];

  const students = [
    { id: '1', name: 'Emily Wong' },
    { id: '2', name: 'Thomas Chan' },
    { id: '3', name: 'Sophie Lee' }
  ];

  const materials = [
    {
      id: 1,
      title: 'Week 1 - Phonics Worksheet',
      type: 'worksheet',
      format: 'pdf',
      course: 'Phonics Foundation',
      uploadDate: '2025-01-15',
      assignedTo: 'All Students',
      fileSize: '2.4 MB'
    },
    {
      id: 2,
      title: 'Reading Comprehension Quiz',
      type: 'quiz',
      format: 'docx',
      course: 'Young Readers',
      uploadDate: '2025-01-14',
      assignedTo: 'Emily Wong',
      fileSize: '1.8 MB'
    },
    {
      id: 3,
      title: 'Vocabulary Flashcards',
      type: 'study_material',
      format: 'pdf',
      course: 'Phonics Foundation',
      uploadDate: '2025-01-13',
      assignedTo: 'All Students',
      fileSize: '3.1 MB'
    }
  ];

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

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to upload this material?')) {
      if (window.confirm('Please confirm again to upload this material.')) {
        // Handle file upload
        console.log('Upload data:', uploadData);
        setShowUploadModal(false);
        setUploadData({
          title: '',
          course: '',
          type: 'worksheet',
          assignedTo: 'all',
          file: null,
          notes: ''
        });
      }
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesCourse = selectedCourse === 'all' || material.course === courses.find(c => c.id === selectedCourse)?.name;
    const matchesStudent = selectedStudent === 'all' || material.assignedTo === 'All Students' || material.assignedTo === students.find(s => s.id === selectedStudent)?.name;
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
          {filteredMaterials.map((material) => (
            <div key={material.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="text-gray-400">
                    {getTypeIcon(material.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{material.title}</h3>
                    <div className="mt-1 space-y-1">
                      <p className="text-sm text-gray-500">{material.course}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Uploaded: {material.uploadDate}</span>
                        <span>Size: {material.fileSize}</span>
                        <span>Assigned to: {material.assignedTo}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="text-gray-400 hover:text-gray-500">
                    <Upload className="w-5 h-5" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-500">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Upload Material</h2>
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
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                  Course
                </label>
                <select
                  id="course"
                  value={uploadData.course}
                  onChange={(e) => setUploadData({ ...uploadData, course: e.target.value })}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.name}>{course.name}</option>
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
                  <option value="all">All Students</option>
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
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Supported formats: PDF, Word, PowerPoint, Excel
                </p>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  value={uploadData.notes}
                  onChange={(e) => setUploadData({ ...uploadData, notes: e.target.value })}
                  rows={3}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Upload Material
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