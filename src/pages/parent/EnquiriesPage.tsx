import React, { useState } from 'react';
import { Mail, Send, CheckCircle, X, Save } from 'lucide-react';

const EnquiriesPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    priority: 'normal',
    message: '',
    attachments: [] as File[]
  });

  const categories = [
    'Course Inquiry',
    'Schedule Change',
    'Technical Support',
    'Billing',
    'Other'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        attachments: [...Array.from(e.target.files || [])]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to submit this enquiry?')) {
      if (window.confirm('Please confirm again to submit your enquiry.')) {
        // Handle form submission
        console.log('Form data:', formData);
        setSubmitted(true);
      }
    }
  };

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your enquiry has been submitted successfully. We'll get back to you within 24-48 hours.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setShowForm(false);
              setFormData({
                subject: '',
                category: '',
                priority: 'normal',
                message: '',
                attachments: []
              });
            }}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Submit Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">New Enquiry</h1>
          <button
            onClick={() => setShowForm(false)}
            className="text-gray-600 hover:text-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              ></textarea>
            </div>

            <div>
              <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 mb-2">
                Attachments (Optional)
              </label>
              <input
                type="file"
                id="attachments"
                name="attachments"
                onChange={handleFileChange}
                multiple
                className="w-full"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <p className="mt-1 text-sm text-gray-500">
                Supported formats: PDF, Word, Images (max 5MB each)
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
            >
              <Save className="w-4 h-4 mr-2" />
              Submit Enquiry
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Enquiries</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          <Send className="w-4 h-4 mr-2" />
          New Enquiry
        </button>
      </div>

      {/* Previous Enquiries List */}
      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
        {[
          {
            id: 1,
            subject: 'Course Schedule Change Request',
            category: 'Schedule Change',
            status: 'pending',
            date: '2025-01-15',
            lastUpdate: '2025-01-15'
          },
          {
            id: 2,
            subject: 'Payment Confirmation',
            category: 'Billing',
            status: 'resolved',
            date: '2025-01-10',
            lastUpdate: '2025-01-12'
          }
        ].map((enquiry) => (
          <div key={enquiry.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{enquiry.subject}</h3>
                <div className="mt-1 space-x-2 text-sm text-gray-500">
                  <span>{enquiry.category}</span>
                  <span>•</span>
                  <span>Submitted on {enquiry.date}</span>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                enquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
              }`}>
                {enquiry.status}
              </span>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnquiriesPage;