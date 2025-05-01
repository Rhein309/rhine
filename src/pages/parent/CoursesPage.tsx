import React, { useState, useEffect } from 'react';
import { Search, Clock, Users, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Define API course data type
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

// Define component course data type
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

const ParentCoursesPage = () => {
  const { profile } = useAuth();
  const [filters, setFilters] = useState({
    age: '',
    type: 'all',
    days: '',
    search: ''
  });
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    courseId: number | null;
    courseName: string;
  }>({
    show: false,
    courseId: null,
    courseName: ''
  });
  const [enrollmentStatus, setEnrollmentStatus] = useState<{
    courseId: number | null;
    status: 'success' | 'error' | null;
    message: string;
  }>({
    courseId: null,
    status: null,
    message: ''
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:9999/courses');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch course data: ${response.status}`);
        }
        
        const data = await response.json() as ApiCourse[];
        
        // Convert API data to component format
        const formattedCourses = data.map((course: ApiCourse): Course => ({
          id: course.id,
          name: course.name,
          // Determine course type by location (online/offline)
          type: course.location.toLowerCase().includes('online') ? 'online' : 'offline',
          ageRange: course.ageRange,
          description: course.description || `${course.name} - ${course.level} level course for ages ${course.ageRange}`,
          schedule: course.schedule,
          time: course.time,
          maxStudents: course.maxStudents,
          duration: "12 weeks", // Assume all courses are 12 weeks
          fee: course.fee
        }));
        
        setCourses(formattedCourses);
      } catch (err: any) {
        console.error('Error fetching course data:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch enrolled courses for user
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!profile || !profile.id) {
        return;
      }

      try {
        const response = await fetch(`http://localhost:9999/user-enrollments?parentId=${profile.id}`);
        
        if (!response.ok) {
          console.error(`Failed to fetch enrollment data: ${response.status}`);
          return;
        }
        
        const data = await response.json();
        // Extract enrolled course IDs
        const enrolledIds = data.map((enrollment: any) => Number(enrollment.extendedProps.courseId));
        setEnrolledCourseIds(enrolledIds);
      } catch (err: any) {
        console.error('Error fetching enrollment data:', err);
      }
    };

    fetchEnrolledCourses();
  }, [profile]);

  // Show confirm dialog
  const showEnrollConfirm = (courseId: number, courseName: string) => {
    setConfirmDialog({
      show: true,
      courseId,
      courseName
    });
  };

  // Close confirm dialog
  const closeConfirmDialog = () => {
    setConfirmDialog({
      show: false,
      courseId: null,
      courseName: ''
    });
  };

  // Handle course enrollment
  const handleEnroll = async () => {
    if (!confirmDialog.courseId) return;
    
    const courseId = confirmDialog.courseId;
    
    if (!profile || !profile.id) {
      setEnrollmentStatus({
        courseId,
        status: 'error',
        message: 'Please log in first'
      });
      closeConfirmDialog();
      return;
    }

    try {
      setEnrolling(true);
      setEnrollmentStatus({
        courseId,
        status: null,
        message: ''
      });

      // Send enrollment request
      const response = await fetch('http://localhost:9999/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          parentId: profile.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Enrollment failed');
      }

      // Enrollment success
      setEnrollmentStatus({
        courseId,
        status: 'success',
        message: 'Enrollment successful!'
      });
      
      // Update enrolled course list
      setEnrolledCourseIds(prev => [...prev, courseId]);
    } catch (err: any) {
      console.error('Error enrolling course:', err);
      setEnrollmentStatus({
        courseId,
        status: 'error',
        message: err.message || 'Enrollment failed, please try again later'
      });
    } finally {
      setEnrolling(false);
      closeConfirmDialog();
    }
  };

  const filteredCourses = courses.filter(course => {
    if (filters.age && !course.ageRange.includes(filters.age)) return false;
    if (filters.type !== 'all' && course.type !== filters.type) return false;
    if (filters.search && !course.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Course List</h1>

      {loading && (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading courses...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>Error loading courses: {error}</p>
          <p>Please try again later or contact the administrator.</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Type</label>
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
                        {course.type === 'online' ? 'Online' : 'Offline'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span>Up to {course.maxStudents} students</span>
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
                      <div>
                        {enrollmentStatus.courseId === course.id && enrollmentStatus.status && (
                          <p className={`text-sm mb-2 ${enrollmentStatus.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {enrollmentStatus.message}
                          </p>
                        )}
                        {enrolledCourseIds.includes(course.id) ? (
                          <button
                            className="bg-green-600 text-white px-4 py-2 rounded-md cursor-default"
                            disabled
                          >
                            Enrolled
                          </button>
                        ) : (
                          <button
                            className={`bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200 ${enrolling && enrollmentStatus.courseId === course.id ? 'opacity-75 cursor-not-allowed' : ''}`}
                            onClick={() => showEnrollConfirm(course.id, course.name)}
                            disabled={enrolling && enrollmentStatus.courseId === course.id}
                          >
                            {enrolling && enrollmentStatus.courseId === course.id ? 'Enrolling...' : 'Enroll Now'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600">No courses found.</p>
            </div>
          )}
        </>
      )}
      {/* Confirm Dialog */}
      {confirmDialog.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Enrollment</h3>
            <p className="mb-6">Are you sure you want to enroll your child in the "{confirmDialog.courseName}" course?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={closeConfirmDialog}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                onClick={handleEnroll}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentCoursesPage;