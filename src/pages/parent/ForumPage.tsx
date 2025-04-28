import React, { useState } from 'react';
import { MessageSquare, Search, Users, Send } from 'lucide-react';

const ForumPage = () => {
  const [activeTab, setActiveTab] = useState<'discussions' | 'private'>('discussions');
  const [searchQuery, setSearchQuery] = useState('');

  const discussions = [
    {
      id: 1,
      title: "Phonics Learning Tips",
      author: "Ms. Sarah",
      date: "2025-01-15",
      replies: 5,
      lastReply: "2025-01-16",
      type: "group",
      course: "Phonics Foundation"
    },
    {
      id: 2,
      title: "Reading Practice Resources",
      author: "Mr. John",
      date: "2025-01-14",
      replies: 3,
      lastReply: "2025-01-15",
      type: "group",
      course: "Young Readers"
    }
  ];

  const privateMessages = [
    {
      id: 1,
      with: "Ms. Sarah",
      lastMessage: "Thank you for the update on Emily's progress",
      date: "2025-01-15",
      unread: 2
    },
    {
      id: 2,
      with: "Mr. John",
      lastMessage: "Here are the additional reading materials we discussed",
      date: "2025-01-14",
      unread: 0
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Discussion Forum</h1>

      <div className="bg-white rounded-lg shadow-sm">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('discussions')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'discussions'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Group Discussions
            </button>
            <button
              onClick={() => setActiveTab('private')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'private'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Private Messages
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search ${activeTab === 'discussions' ? 'discussions' : 'messages'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        {/* Content */}
        {activeTab === 'discussions' ? (
          <div className="divide-y divide-gray-200">
            {discussions.map(discussion => (
              <div key={discussion.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{discussion.title}</h3>
                    <div className="mt-1 space-x-2 text-sm text-gray-500">
                      <span>{discussion.course}</span>
                      <span>•</span>
                      <span>Started by {discussion.author}</span>
                      <span>•</span>
                      <span>{discussion.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{discussion.replies} replies</div>
                    <div className="text-xs text-gray-400">Last reply {discussion.lastReply}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {privateMessages.map(message => (
              <div key={message.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{message.with}</h3>
                      <p className="text-sm text-gray-500">{message.lastMessage}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{message.date}</div>
                    {message.unread > 0 && (
                      <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {message.unread} new
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Message/Discussion Button */}
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center justify-center w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors duration-200">
            <Send className="w-4 h-4 mr-2" />
            {activeTab === 'discussions' ? 'Start New Discussion' : 'New Message'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;