import React, { useState } from 'react';
import { Send, Users, Bell } from 'lucide-react';

const SendNotificationPage = () => {
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    recipientType: 'all',
    recipients: [] as string[],
    priority: 'normal',
    scheduledDate: ''
  });

  const recipientTypes = [
    { id: 'all', name: 'All Users' },
    { id: 'teachers', name: 'All Teachers' },
    { id: 'parents', name: 'All Parents' },
    { id: 'specific', name: 'Specific Users' }
  ];

  const users = [
    { id: '1', name: 'Sarah Lee', type: 'teacher' },
    { id: '2', name: 'John Smith', type: 'teacher' },
    { id: '3', name: 'Emily Wong', type: 'parent' },
    { id: '4', name: 'David Chan', type: 'parent' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNotificationData(prev => ({ ...prev, [name]: value }));
  };

  const handleRecipientsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setNotificationData(prev => ({ ...prev, recipients: selectedOptions }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to send this notification?')) {
      // Handle notification submission
      console.log('Notification data:', notificationData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Send Notification</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={notificationData.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={notificationData.message}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Recipients */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recipients</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="recipientType" className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Type
                </label>
                <select
                  id="recipientType"
                  name="recipientType"
                  value={notificationData.recipientType}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  {recipientTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              {notificationData.recipientType === 'specific' && (
                <div>
                  <label htmlFor="recipients" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Recipients
                  </label>
                  <select
                    id="recipients"
                    name="recipients"
                    multiple
                    value={notificationData.recipients}
                    onChange={handleRecipientsChange}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  >
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.type})
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple recipients</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Options */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={notificationData.priority}
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
                <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  id="scheduledDate"
                  name="scheduledDate"
                  value={notificationData.scheduledDate}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
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
            <Send className="w-4 h-4 mr-2" />
            Send Notification
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendNotificationPage;