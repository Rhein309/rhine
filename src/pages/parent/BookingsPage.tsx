import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Video, Calendar, Clock, MapPin, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const BookingsPage = () => {
  const { profile } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserEnrollments = async () => {
      if (!profile || !profile.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:9999/user-enrollments?parentId=${profile.id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch enrollment data: ${response.status}`);
        }
        
        const data = await response.json();
        setEvents(data);
        
        // If there are courses, select the first one by default
        if (data.length > 0) {
          setSelectedEvent(data[0]);
        }
      } catch (err: any) {
        console.error('Error fetching enrollment data:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserEnrollments();
  }, [profile]);

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
  };

  // Helper functions to format date and time
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

      {loading && (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading course data...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
          <div>
            <p className="font-bold">Error loading course data</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Booked Courses</h2>
            
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
                        {event.extendedProps.location === 'Online' ? 'Online Course' : 'Offline Course'}
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
              <p className="text-gray-600">You have not booked any courses yet</p>
            )}
          </div>

          {/* Course Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Course Details</h2>
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
                  <p className="text-gray-600">Teacher: {selectedEvent.extendedProps.teacher}</p>
                  <p className="text-gray-600">Location: {selectedEvent.extendedProps.location}</p>
                </div>
                {selectedEvent.extendedProps.zoomLink && (
                  <a
                    href={selectedEvent.extendedProps.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-purple-600 hover:text-purple-700"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Join Zoom Meeting
                  </a>
                )}
                <Link
                  to={`/parent/courses#${selectedEvent.extendedProps.courseId}`}
                  className="block text-purple-600 hover:text-purple-700 font-medium"
                >
                  View Course Details
                </Link>
              </div>
            ) : (
              <p className="text-gray-600">Select a course to view details</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;