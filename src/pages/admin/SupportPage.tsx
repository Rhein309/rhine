import React, { useState } from 'react';
import { Search, HelpCircle, AlertCircle, CheckCircle, Clock, Save } from 'lucide-react';

const SupportPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [ticketData, setTicketData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium'
  });

  const tickets = [
    {
      id: 1,
      title: 'System Login Issues',
      description: 'Multiple teachers reporting difficulties logging into the system',
      status: 'open',
      priority: 'high',
      submittedBy: 'John Smith',
      date: '2025-01-15',
      category: 'Technical'
    },
    {
      id: 2,
      title: 'Payment Gateway Error',
      description: 'Parents unable to process payments through the portal',
      status: 'in-progress',
      priority: 'high',
      submittedBy: 'Sarah Wong',
      date: '2025-01-14',
      category: 'Financial'
    },
    {
      id: 3,
      title: 'Calendar Sync Problem',
      description: 'Class schedules not syncing with Google Calendar',
      status: 'resolved',
      priority: 'medium',
      submittedBy: 'Emily Chen',
      date: '2025-01-13',
      category: 'Technical'
    }
  ];

  const categories = [
    'Technical',
    'Financial',
    'Academic',
    'Administrative',
    'Other'
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-5 h-5" />;
      case 'in-progress':
        return <Clock className="w-5 h-5" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <HelpCircle className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleNewTicket = () => {
    setShowNewTicketForm(true);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to submit this ticket?')) {
      if (window.confirm('Please confirm again to submit this ticket.')) {
        // Handle ticket submission
        console.log('Ticket data:', ticketData);
        setShowNewTicketForm(false);
        setTicketData({
          title: '',
          description: '',
          category: '',
          priority: 'medium'
        });
      }
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority;
    const matchesSearch = 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  if (showNewTicketForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">New Support Ticket</h1>
        </div>

        <form onSubmit={handleTicketSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={ticketData.title}
                onChange={(e) => setTicketData({ ...ticketData, title: e.target.value })}
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
                value={ticketData.category}
                onChange={(e) => setTicketData({ ...ticketData, category: e.target.value })}
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
                value={ticketData.priority}
                onChange={(e) => setTicketData({ ...ticketData, priority: e.target.value })}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={ticketData.description}
                onChange={(e) => setTicketData({ ...ticketData, description: e.target.value })}
                rows={6}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              ></textarea>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowNewTicketForm(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
            >
              <Save className="w-4 h-4 mr-2" />
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
        <button 
          onClick={handleNewTicket}
          className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          New Ticket
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <div className="relative">
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
        {filteredTickets.map((ticket) => (
          <div key={ticket.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-medium text-gray-900">{ticket.title}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {getStatusIcon(ticket.status)}
                    <span className="ml-1">{ticket.status}</span>
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  #{ticket.id} opened by {ticket.submittedBy} • {ticket.date}
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {ticket.category}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{ticket.description}</p>
            <div className="flex justify-end space-x-4">
              <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                View Details
              </button>
              {ticket.status !== 'resolved' && (
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  Update Status
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportPage;