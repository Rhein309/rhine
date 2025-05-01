import React, { useState, useEffect } from 'react';
import { Search, FileText, FileSpreadsheet, FileImage, Download } from 'lucide-react';
import { getAllMaterials, downloadFile, Material } from '../../lib/materialService';

// API Course type definition
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

// Component Course type definition
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

  // Load course data
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        const response = await fetch('http://localhost:9999/courses');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch course data: ${response.status}`);
        }
        
        const data = await response.json() as ApiCourse[];
        
        // Format API data for component
        const formattedCourses = data.map((course: ApiCourse) => ({
          id: course.id.toString(),
          name: course.name
        }));
        
        setCourses(formattedCourses);
      } catch (err: any) {
        console.error('Error fetching course data:', err);
        // Use default courses if API fails
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

  // Load all materials
  useEffect(() => {
    const loadMaterials = async () => {
      try {
        setIsLoading(true);
        const data = await getAllMaterials();
        setMaterials(data);
      } catch (error) {
        console.error('Failed to load materials:', error);
        alert('Failed to load materials');
      } finally {
        setIsLoading(false);
      }
    };

    loadMaterials();
  }, []);

  // Get file icon
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

  // Handle material download
  const handleDownload = async (material: Material) => {
    try {
      await downloadFile(material.filePath, `${material.title}.${material.format}`);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed, please try again');
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Course Materials</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            disabled={coursesLoading}
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
        {isLoading || coursesLoading ? (
          <div className="py-10 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            <p className="mt-2 text-gray-500">Loading...</p>
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
                            Uploader: {material.teacher} | Date: {material.uploadDate}
                          </span>
                          <span className="text-sm text-gray-500">
                            {material.week.replace('week-', 'Week ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(material)}
                      className="flex items-center text-purple-600 hover:text-purple-700"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="py-10 text-center text-gray-500">
                No course materials found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialsPage;