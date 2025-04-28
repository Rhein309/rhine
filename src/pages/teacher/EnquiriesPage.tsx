import React, { useState } from 'react';
import { MessageSquare, Search, Clock, CheckCircle, XCircle } from 'lucide-react';

const EnquiriesPage = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const enquiries = [
    {
      id: 1,
      from: "Sarah Wong",
      student: "Emily Wong",
      subject: "Question about homework",
      message: "Hi, I was wondering if you could clarify the homework assignment from yesterday's class?",
      date: "2025-01-15",
      status: "pending",
      course: "Phonics Foundation"
    },
    {
      id: 2,
      from: "David Chan",
      student: "Thomas Chan",
      subject: "Absence notification",
      message: "Thomas will be absent next week due to a family trip.",
      date: "2025-01-14",
      status: "resolved",
      course: "Young Readers"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <XCircle className="w-4 h-4" />;
    }
  };

  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesFilter = filter === 'all' || enquiry.status === filter;
    const matchesSearch = 
      enquiry.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enquiry.student.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Enquiries</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex space-x-2">
            {['all', 'pending', 'resolved'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  filter === status
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search enquiries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Enquiries List */}
      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
        {filteredEnquiries.map((enquiry) => (
          <div key={enquiry.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900">{enquiry.subject}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(enquiry.status)}`}>
                    {getStatusIcon(enquiry.status)}
                    <span className="ml-1">{enquiry.status}</span>
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  From: {enquiry.from} • Student: {enquiry.student} • Course: {enquiry.course}
                </p>
              </div>
              <span className="text-sm text-gray-500">{enquiry.date}</span>
            </div>
            <p className="text-gray-600 mb-4">{enquiry.message}</p>
            <div className="flex justify-end space-x-4">
              {enquiry.status === 'pending' && (
                <>
                  <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                    Mark as Resolved
                  </button>
                  <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    Reply
                  </button>
                </>
              )}
              {enquiry.status === 'resolved' && (
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  View Thread
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnquiriesPage;