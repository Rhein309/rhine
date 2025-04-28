import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, GraduationCap, BookOpen, Clock, Save, X } from 'lucide-react';

const TeacherProfilePage = () => {
  const { profile } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    firstName: profile?.first_name || 'Teacher',
    lastName: profile?.last_name || 'User',
    email: 'skkaur2003@gmail.com',
    phone: '+852 1234 5678',
    expertise: ['Phonics', 'Reading Comprehension', 'Grammar'],
    qualifications: [
      'Bachelor of Education - English Language Teaching',
      'TEFL Certification',
      'Cambridge YL Examiner'
    ],
    experience: '5 years',
    languages: ['English', 'Cantonese', 'Mandarin']
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: 'expertise' | 'qualifications' | 'languages') => {
    const values = e.target.value.split('\n').filter(item => item.trim() !== '');
    setEditData(prev => ({ ...prev, [field]: values }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to save these changes?')) {
      if (window.confirm('Please confirm again to save your profile changes.')) {
        try {
          const response = await fetch('http://localhost:9999/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(editData),
          });

          if (response.ok) {
            console.log('Profile updated successfully');
            window.alert('Profile updated successfully!');
          } else {
            console.error('Failed to update profile');
            window.alert('Failed to update profile. Please try again.');
          }
        } catch (error) {
          console.error('An error occurred:', error);
          window.alert('An error occurred while updating the profile.');
        }
        console.log('Saving profile changes:', editData);
        setShowEditModal(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
          <button 
            onClick={() => setShowEditModal(true)}
            className="text-purple-600 hover:text-purple-700 font-medium text-sm"
          >
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-gray-900">{`${editData.firstName} ${editData.lastName}`}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-900">{editData.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-gray-900">{editData.phone}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Teaching Experience</p>
              <p className="text-gray-900">{editData.experience}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Professional Information</h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Subject Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {editData.expertise.map((subject, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Qualifications</h3>
            <ul className="space-y-2">
              {editData.qualifications.map((qualification, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <GraduationCap className="w-5 h-5 text-purple-600 mt-0.5" />
                  <span className="text-gray-700">{qualification}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {editData.languages.map((language, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={editData.firstName}
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
                    value={editData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={editData.phone}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                    Teaching Experience
                  </label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    value={editData.experience}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Expertise (one per line)
                </label>
                <textarea
                  id="expertise"
                  value={editData.expertise.join('\n')}
                  onChange={(e) => handleArrayChange(e, 'expertise')}
                  rows={3}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 mb-2">
                  Qualifications (one per line)
                </label>
                <textarea
                  id="qualifications"
                  value={editData.qualifications.join('\n')}
                  onChange={(e) => handleArrayChange(e, 'qualifications')}
                  rows={3}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="languages" className="block text-sm font-medium text-gray-700 mb-2">
                  Languages (one per line)
                </label>
                <textarea
                  id="languages"
                  value={editData.languages.join('\n')}
                  onChange={(e) => handleArrayChange(e, 'languages')}
                  rows={3}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherProfilePage;