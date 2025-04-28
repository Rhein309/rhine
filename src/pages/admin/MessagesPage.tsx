import React, { useState } from 'react';
import { Search, MessageSquare, Users, Send } from 'lucide-react';

const MessagesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showNewMessageForm, setShowNewMessageForm] = useState(false);
  const [messageData, setMessageData] = useState({
    to: '',
    subject: '',
    message: ''
  });

  const messages = [
    {
      id: 1,
      from: 'Sarah Wong',
      role: 'Parent',
      subject: 'Class Schedule Inquiry',
      message: 'Hi, I would like to know about the available class schedules for next month.',
      date: '2025-01-15',
      unread: true
    },
    {
      id: 2,
      from: 'John Smith',
      role: 'Teacher',
      subject: 'Technical Support',
      message: 'Having issues accessing the attendance system. Could you help?',
      date: '2025-01-14',
      unread: false
    },
    {
      id: 3,
      from: 'Emily Chen',
      role: 'Parent',
      subject: 'Payment Confirmation',
      message: 'Can you confirm if my payment for February has been received?',
      date: '2025-01-13',
      unread: true
    }
  ];

  const handleNewMessage = () => {
    setShowNewMessageForm(true);
  };

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to send this message?')) {
      if (window.confirm('Please confirm again to send this message.')) {
        // Handle message submission
        console.log('Message sent:', messageData);
        setShowNewMessageForm(false);
        setMessageData({ to: '', subject: '', message: '' });
      }
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesType = selectedType === 'all' || message.role.toLowerCase() === selectedType;
    const matchesSearch = 
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  if (showNewMessageForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">New Message</h1>
        </div>

        <form onSubmit={handleSubmitMessage} className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <input
                type="text"
                id="to"
                value={messageData.to}
                onChange={(e) => setMessageData({ ...messageData, to: e.target.value })}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={messageData.subject}
                onChange={(e) => setMessageData({ ...messageData, subject: e.target.value })}
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
                rows={6}
                value={messageData.message}
                onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              ></textarea>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowNewMessageForm(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <button 
          onClick={handleNewMessage}
          className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          <Send className="w-4 h-4 mr-2" />
          New Message
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="all">All Messages</option>
            <option value="parent">From Parents</option>
            <option value="teacher">From Teachers</option>
          </select>

          <div className="relative">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
        {filteredMessages.map((message) => (
          <div 
            key={message.id} 
            className={`p-6 ${message.unread ? 'bg-purple-50' : 'bg-white'} hover:bg-gray-50`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{message.subject}</h3>
                    <p className="text-sm text-gray-500">
                      From: {message.from} • {message.role}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">{message.date}</span>
                    {message.unread && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        New
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-gray-600">{message.message}</p>
                <div className="mt-4 flex justify-end">
                  <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagesPage;