import React, { useState } from 'react';
import { MessageSquare, Search, Users, Send, X, Save, Reply } from 'lucide-react';

const ForumPage = () => {
  const [activeTab, setActiveTab] = useState<'discussions' | 'private'>('discussions');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewDiscussionForm, setShowNewDiscussionForm] = useState(false);
  const [showNewMessageForm, setShowNewMessageForm] = useState(false);
  const [showThreadView, setShowThreadView] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [discussionData, setDiscussionData] = useState({
    title: '',
    course: '',
    message: ''
  });
  const [messageData, setMessageData] = useState({
    recipient: '',
    subject: '',
    message: ''
  });
  const [replyData, setReplyData] = useState({
    message: ''
  });

  const discussions = [
    {
      id: 1,
      title: "Teaching Strategies for Phonics",
      author: "Ms. Sarah",
      date: "2025-01-15",
      replies: 5,
      lastReply: "2025-01-16",
      type: "teaching",
      course: "Phonics Foundation",
      messages: [
        {
          id: 1,
          author: "Ms. Sarah",
          message: "What strategies do you use to teach phonics effectively?",
          date: "2025-01-15"
        },
        {
          id: 2,
          author: "Mr. John",
          message: "I find using visual aids and songs very helpful.",
          date: "2025-01-15"
        },
        {
          id: 3,
          author: "Ms. Emily",
          message: "Interactive games work well with younger students.",
          date: "2025-01-16"
        }
      ]
    },
    {
      id: 2,
      title: "Student Progress Discussion",
      author: "Mr. John",
      date: "2025-01-14",
      replies: 3,
      lastReply: "2025-01-15",
      type: "student",
      course: "Young Readers",
      messages: [
        {
          id: 1,
          author: "Mr. John",
          message: "How do you track student progress effectively?",
          date: "2025-01-14"
        },
        {
          id: 2,
          author: "Ms. Sarah",
          message: "I use weekly assessments and keep detailed notes.",
          date: "2025-01-15"
        }
      ]
    }
  ];

  const privateMessages = [
    {
      id: 1,
      with: "Sarah Wong (Parent)",
      lastMessage: "Thank you for the update on Emily's progress",
      date: "2025-01-15",
      unread: 2,
      messages: [
        {
          id: 1,
          from: "Sarah Wong",
          message: "How is Emily doing in class?",
          date: "2025-01-15"
        },
        {
          id: 2,
          from: "You",
          message: "Emily is making great progress. Her phonics skills have improved significantly.",
          date: "2025-01-15"
        },
        {
          id: 3,
          from: "Sarah Wong",
          message: "Thank you for the update on Emily's progress",
          date: "2025-01-15"
        }
      ]
    },
    {
      id: 2,
      with: "David Chan (Parent)",
      lastMessage: "Can we schedule a meeting to discuss Thomas's performance?",
      date: "2025-01-14",
      unread: 0,
      messages: [
        {
          id: 1,
          from: "David Chan",
          message: "Can we schedule a meeting to discuss Thomas's performance?",
          date: "2025-01-14"
        }
      ]
    }
  ];

  const courses = [
    { id: 'phonics', name: 'Phonics Foundation' },
    { id: 'readers', name: 'Young Readers' }
  ];

  const recipients = [
    { id: '1', name: 'Sarah Wong', role: 'Parent' },
    { id: '2', name: 'David Chan', role: 'Parent' },
    { id: '3', name: 'John Smith', role: 'Teacher' }
  ];

  const handleNewDiscussion = () => {
    setShowNewDiscussionForm(true);
    setShowThreadView(false);
    setShowReplyForm(false);
  };

  const handleNewMessage = () => {
    setShowNewMessageForm(true);
    setShowThreadView(false);
    setShowReplyForm(false);
  };

  const handleViewThread = (thread: any) => {
    setSelectedThread(thread);
    setShowThreadView(true);
    setShowNewDiscussionForm(false);
    setShowNewMessageForm(false);
    setShowReplyForm(false);
  };

  const handleViewMessage = (message: any) => {
    setSelectedMessage(message);
    setShowThreadView(true);
    setShowNewDiscussionForm(false);
    setShowNewMessageForm(false);
    setShowReplyForm(false);
  };

  const handleReply = () => {
    setShowReplyForm(true);
  };

  const handleDiscussionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to post this discussion?')) {
      if (window.confirm('Please confirm again to post this discussion.')) {
        // Handle discussion submission
        console.log('Discussion data:', discussionData);
        setShowNewDiscussionForm(false);
        setDiscussionData({ title: '', course: '', message: '' });
      }
    }
  };

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to send this message?')) {
      if (window.confirm('Please confirm again to send this message.')) {
        // Handle message submission
        console.log('Message data:', messageData);
        setShowNewMessageForm(false);
        setMessageData({ recipient: '', subject: '', message: '' });
      }
    }
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to send this reply?')) {
      if (window.confirm('Please confirm again to send this reply.')) {
        // Handle reply submission
        console.log('Reply data:', replyData);
        setShowReplyForm(false);
        setReplyData({ message: '' });
      }
    }
  };

  if (showThreadView) {
    const thread = activeTab === 'discussions' ? selectedThread : selectedMessage;
    const messages = activeTab === 'discussions' ? thread.messages : thread.messages;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {activeTab === 'discussions' ? thread.title : `Conversation with ${thread.with}`}
          </h1>
          <button
            onClick={() => {
              setShowThreadView(false);
              setSelectedThread(null);
              setSelectedMessage(null);
            }}
            className="text-gray-600 hover:text-gray-800"
          >
            Back to {activeTab === 'discussions' ? 'Discussions' : 'Messages'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            {messages.map((msg: any) => (
              <div key={msg.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-medium text-gray-900">{msg.author || msg.from}</span>
                  </div>
                  <span className="text-sm text-gray-500">{msg.date}</span>
                </div>
                <p className="text-gray-700">{msg.message}</p>
              </div>
            ))}
          </div>

          {showReplyForm ? (
            <form onSubmit={handleReplySubmit} className="mt-6">
              <div className="space-y-4">
                <textarea
                  value={replyData.message}
                  onChange={(e) => setReplyData({ message: e.target.value })}
                  placeholder="Write your reply..."
                  rows={4}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                ></textarea>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowReplyForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Reply
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="mt-6">
              <button
                onClick={handleReply}
                className="flex items-center text-purple-600 hover:text-purple-700"
              >
                <Reply className="w-4 h-4 mr-2" />
                Reply
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (showNewDiscussionForm || showNewMessageForm) {
    const isDiscussion = showNewDiscussionForm;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isDiscussion ? 'New Discussion' : 'New Message'}
          </h1>
          <button
            onClick={() => {
              if (isDiscussion) {
                setShowNewDiscussionForm(false);
              } else {
                setShowNewMessageForm(false);
              }
            }}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>

        <form 
          onSubmit={isDiscussion ? handleDiscussionSubmit : handleMessageSubmit} 
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="space-y-6">
            {isDiscussion ? (
              <>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={discussionData.title}
                    onChange={(e) => setDiscussionData({ ...discussionData, title: e.target.value })}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                    Course
                  </label>
                  <select
                    id="course"
                    value={discussionData.course}
                    onChange={(e) => setDiscussionData({ ...discussionData, course: e.target.value })}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.name}>{course.name}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <select
                    id="recipient"
                    value={messageData.recipient}
                    onChange={(e) => setMessageData({ ...messageData, recipient: e.target.value })}
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  >
                    <option value="">Select Recipient</option>
                    {recipients.map(recipient => (
                      <option key={recipient.id} value={recipient.name}>
                        {recipient.name} ({recipient.role})
                      </option>
                    ))}
                  </select>
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
              </>
            )}

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                value={isDiscussion ? discussionData.message : messageData.message}
                onChange={(e) => {
                  if (isDiscussion) {
                    setDiscussionData({ ...discussionData, message: e.target.value });
                  } else {
                    setMessageData({ ...messageData, message: e.target.value });
                  }
                }}
                rows={6}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              ></textarea>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                if (isDiscussion) {
                  setShowNewDiscussionForm(false);
                } else {
                  setShowNewMessageForm(false);
                }
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
            >
              <Save className="w-4 h-4 mr-2" />
              {isDiscussion ? 'Post Discussion' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Discussion Forum</h1>

      <div className="bg-white rounded-lg shadow-sm">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => {
                setActiveTab('discussions');
                setShowNewDiscussionForm(false);
                setShowNewMessageForm(false);
                setShowThreadView(false);
                setSelectedThread(null);
                setSelectedMessage(null);
              }}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'discussions'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Group Discussions
            </button>
            <button
              onClick={() => {
                setActiveTab('private');
                setShowNewDiscussionForm(false);
                setShowNewMessageForm(false);
                setShowThreadView(false);
                setSelectedThread(null);
                setSelectedMessage(null);
              }}
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
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={() => handleViewThread(discussion)}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    View Thread
                  </button>
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
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={() => handleViewMessage(message)}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    View Thread
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Message/Discussion Button */}
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={activeTab === 'discussions' ? handleNewDiscussion : handleNewMessage}
            className="flex items-center justify-center w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors duration-200"
          >
            <Send className="w-4 h-4 mr-2" />
            {activeTab === 'discussions' ? 'Start New Discussion' : 'New Message'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;