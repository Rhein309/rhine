import React, { useState } from 'react';
import { GraduationCap, Save } from 'lucide-react';

const AddStudentPage = () => {
  const [studentData, setStudentData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    idNumber: '',
    idType: '',
    grade: '',
    location: '',
    courses: [] as string[],
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    parentIdNumber: '',
    parentIdType: '',
    address: '',
    emergencyContact: '',
    medicalInfo: '',
    notes: ''
  });

  const locations = [
    { id: 'tsw', name: 'Tsz Wan Shan Centre' },
    { id: 'tko', name: 'Tseung Kwan O Centre' }
  ];

  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];

  const availableCourses = [
    'Phonics Foundation',
    'Young Readers',
    'Grammar & Writing',
    'Advanced English'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStudentData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoursesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setStudentData(prev => ({ ...prev, courses: selectedOptions }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Student data:', studentData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Student</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          {/* Student Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Student Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="idType" className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID Type
                </label>
                <select
                  id="idType"
                  name="idType"
                  value={studentData.idType}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="">Select ID Type</option>
                  <option value="hkid">Hong Kong ID</option>
                  <option value="birth_cert">Birth Certificate</option>
                  <option value="passport">Passport</option>
                </select>
              </div>

              <div>
                <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID Number
                </label>
                <input
                  type="text"
                  id="idNumber"
                  name="idNumber"
                  value={studentData.idNumber}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={studentData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={studentData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={studentData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                  Grade
                </label>
                <select
                  id="grade"
                  name="grade"
                  value={studentData.grade}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="">Select Grade</option>
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Course Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  value={studentData.location}
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

              <div>
                <label htmlFor="courses" className="block text-sm font-medium text-gray-700 mb-2">
                  Courses
                </label>
                <select
                  id="courses"
                  name="courses"
                  multiple
                  value={studentData.courses}
                  onChange={handleCoursesChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  {availableCourses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple courses</p>
              </div>
            </div>
          </div>

          {/* Parent/Guardian Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Parent/Guardian Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="parentIdType" className="block text-sm font-medium text-gray-700 mb-2">
                  Parent/Guardian ID Type
                </label>
                <select
                  id="parentIdType"
                  name="parentIdType"
                  value={studentData.parentIdType}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="">Select ID Type</option>
                  <option value="hkid">Hong Kong ID</option>
                  <option value="passport">Passport</option>
                </select>
              </div>

              <div>
                <label htmlFor="parentIdNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Parent/Guardian ID Number
                </label>
                <input
                  type="text"
                  id="parentIdNumber"
                  name="parentIdNumber"
                  value={studentData.parentIdNumber}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-2">
                  Parent/Guardian Name
                </label>
                <input
                  type="text"
                  id="parentName"
                  name="parentName"
                  value={studentData.parentName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Parent/Guardian Email
                </label>
                <input
                  type="email"
                  id="parentEmail"
                  name="parentEmail"
                  value={studentData.parentEmail}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Parent/Guardian Phone
                </label>
                <input
                  type="tel"
                  id="parentPhone"
                  name="parentPhone"
                  value={studentData.parentPhone}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact
                </label>
                <input
                  type="tel"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={studentData.emergencyContact}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={studentData.address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                ></textarea>
              </div>

              <div>
                <label htmlFor="medicalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Information
                </label>
                <textarea
                  id="medicalInfo"
                  name="medicalInfo"
                  value={studentData.medicalInfo}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Any allergies or medical conditions"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                ></textarea>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={studentData.notes}
                  onChange={handleChange}
                  rows={3}
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
            Save Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudentPage;