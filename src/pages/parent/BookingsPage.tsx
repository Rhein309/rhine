import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import interactionPlugin from '@fullcalendar/interaction';
import { Link } from 'react-router-dom';
import { Video } from 'lucide-react';

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

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, googleCalendarPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={events}
            eventClick={handleEventClick}
            height="auto"
            googleCalendarApiKey="YOUR_GOOGLE_CALENDAR_API_KEY"
            eventSources={[
              {
                googleCalendarId: 'en.hong_kong#holiday@group.v.calendar.google.com',
                className: 'holiday-events',
                color: '#e5e7eb',
                textColor: '#374151'
              }
            ]}
          />
        </div>

        {/* Event Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Class Details</h2>
          {selectedEvent ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">{selectedEvent.title}</h3>
                <p className="text-gray-600">
                  {new Date(selectedEvent.start).toLocaleDateString()} {' '}
                  {new Date(selectedEvent.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {' '}
                  {new Date(selectedEvent.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
            <p className="text-gray-600">Select a class to view details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;