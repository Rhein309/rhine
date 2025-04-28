import React, { useState } from 'react';
import { BookOpen, Save } from 'lucide-react';

const AddCoursePage = () => {
  const [courseData, setCourseData] = useState({
    name: '',
    level: '',
    ageRange: '',
    location: '',
    schedule: '',
    time: '',
    teacher: '',
    maxStudents: '',
    fee: '',
    description: ''
  });

  const locations = [
    { id: 'tsw', name: 'Tsz Wan Shan Centre' },
    { id: 'tko', name: 'Tseung Kwan O Centre' }
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const teachers = ['Sarah Lee', 'John Smith', 'Emily Chen'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Course data:', courseData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Course</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Course Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={courseData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <select
                  id="level"
                  name="level"
                  value={courseData.level}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="">Select Level</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="ageRange" className="block text-sm font-medium text-gray-700 mb-2">
                  Age Range
                </label>
                <input
                  type="text"
                  id="ageRange"
                  name="ageRange"
                  value={courseData.ageRange}
                  onChange={handleChange}
                  placeholder="e.g., 3-5 years"
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  value={courseData.location}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="">Select Location</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.name}>{location.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Schedule & Capacity */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Schedule & Capacity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule
                </label>
                <input
                  type="text"
                  id="schedule"
                  name="schedule"
                  value={courseData.schedule}
                  onChange={handleChange}
                  placeholder="e.g., Mon, Wed, Fri"
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="text"
                  id="time"
                  name="time"
                  value={courseData.time}
                  onChange={handleChange}
                  placeholder="e.g., 3:00 PM - 4:00 PM"
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="teacher" className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher
                </label>
                <select
                  id="teacher"
                  name="teacher"
                  value={courseData.teacher}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher} value={teacher}>{teacher}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="maxStudents" className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Students
                </label>
                <input
                  type="number"
                  id="maxStudents"
                  name="maxStudents"
                  value={courseData.maxStudents}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Course Details */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Details</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="fee" className="block text-sm font-medium text-gray-700 mb-2">
                  Course Fee (HKD)
                </label>
                <input
                  type="text"
                  id="fee"
                  name="fee"
                  value={courseData.fee}
                  onChange={handleChange}
                  placeholder="e.g., 3,600"
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Course Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={courseData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCoursePage;