import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Video, Calendar, Clock, MapPin, User } from 'lucide-react';

const BookingsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const events = [
    {
      id: '1',
      title: 'Phonics Foundation',
      start: '2025-01-16T15:00:00',
      end: '2025-01-16T16:00:00',
      extendedProps: {
        location: 'Online',
        teacher: 'Ms. Sarah',
        zoomLink: 'https://zoom.us/j/123456789',
        courseId: 'phonics-foundation'
      }
    },
    {
      id: '2',
      title: 'Young Readers',
      start: '2025-01-17T14:00:00',
      end: '2025-01-17T15:00:00',
      extendedProps: {
        location: 'Tsz Wan Shan Centre',
        teacher: 'Mr. John',
        courseId: 'young-readers'
      }
    }
  ];

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
  };

  // 格式化日期和时间的辅助函数
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">我的课程预订</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 课程列表 */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">已预订课程</h2>
          
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <div 
                  key={event.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedEvent && selectedEvent.id === event.id 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <span className="text-sm text-purple-600 font-medium">
                      {event.extendedProps.location === 'Online' ? '线上课程' : '线下课程'}
                    </span>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(event.start)}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      {formatTime(event.start)} - {formatTime(event.end)}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <User className="w-4 h-4 mr-2" />
                      {event.extendedProps.teacher}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.extendedProps.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">您目前没有预订任何课程</p>
          )}
        </div>

        {/* 课程详情 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">课程详情</h2>
          {selectedEvent ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">{selectedEvent.title}</h3>
                <p className="text-gray-600">
                  {formatDate(selectedEvent.start)} {' '}
                  {formatTime(selectedEvent.start)} - {' '}
                  {formatTime(selectedEvent.end)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">教师: {selectedEvent.extendedProps.teacher}</p>
                <p className="text-gray-600">地点: {selectedEvent.extendedProps.location}</p>
              </div>
              {selectedEvent.extendedProps.zoomLink && (
                <a
                  href={selectedEvent.extendedProps.zoomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-purple-600 hover:text-purple-700"
                >
                  <Video className="w-4 h-4 mr-2" />
                  加入Zoom会议
                </a>
              )}
              <Link
                to={`/parent/courses#${selectedEvent.extendedProps.courseId}`}
                className="block text-purple-600 hover:text-purple-700 font-medium"
              >
                查看课程详情
              </Link>
            </div>
          ) : (
            <p className="text-gray-600">选择一个课程查看详情</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;