import React, { useState } from 'react';
import { Search, FileText, FileSpreadsheet, FileImage, Download } from 'lucide-react';

const MaterialsPage = () => {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('all');

  const courses = [
    { id: 'phonics', name: 'Phonics Foundation' },
    { id: 'readers', name: 'Young Readers' }
  ];

  const weeks = Array.from({ length: 12 }, (_, i) => ({
    id: `week-${i + 1}`,
    name: `Week ${i + 1}`
  }));

  const materials = [
    {
      id: 1,
      courseId: 'phonics',
      week: 'week-1',
      title: 'Phonics Worksheet - Short Vowels',
      type: 'homework',
      format: 'pdf',
      teacher: 'Ms. Sarah',
      uploadDate: '2025-01-15',
      icon: FileText
    },
    {
      id: 2,
      courseId: 'readers',
      week: 'week-1',
      title: 'Vocabulary List - Animals',
      type: 'notes',
      format: 'xlsx',
      teacher: 'Mr. John',
      uploadDate: '2025-01-14',
      icon: FileSpreadsheet
    },
    {
      id: 3,
      courseId: 'phonics',
      week: 'week-2',
      title: 'Quiz Review - Consonant Blends',
      type: 'quiz',
      format: 'pdf',
      teacher: 'Ms. Sarah',
      uploadDate: '2025-01-13',
      icon: FileText
    }
  ];

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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Course Materials</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="all">All Weeks</option>
            {weeks.map(week => (
              <option key={week.id} value={week.id}>{week.name}</option>
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

        {/* Materials List */}
        <div className="space-y-4">
          {filteredMaterials.map(material => (
            <div key={material.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
              <div className="flex items-start space-x-4">
                <material.icon className="w-8 h-8 text-gray-400" />
                <div>
                  <h3 className="font-medium text-gray-900">{material.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(material.type)}`}>
                      {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {courses.find(c => c.id === material.courseId)?.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      Uploaded by {material.teacher} on {material.uploadDate}
                    </span>
                  </div>
                </div>
              </div>
              <button className="flex items-center text-purple-600 hover:text-purple-700">
                <Download className="w-4 h-4 mr-1" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaterialsPage;