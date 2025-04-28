import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import interactionPlugin from '@fullcalendar/interaction';
import { Video, Users, MapPin } from 'lucide-react';

const CalendarPage = () => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const events = [
    {
      id: '1',
      title: 'Phonics Foundation',
      start: '2025-01-16T10:00:00',
      end: '2025-01-16T11:00:00',
      extendedProps: {
        type: 'class',
        location: 'Room 101',
        students: 6,
        description: 'Regular class session'
      }
    },
    {
      id: '2',
      title: 'Young Readers',
      start: '2025-01-16T11:30:00',
      end: '2025-01-16T12:30:00',
      extendedProps: {
        type: 'class',
        location: 'Online',
        students: 5,
        description: 'Online reading session',
        zoomLink: 'https://zoom.us/j/123456789'
      }
    },
    {
      id: '3',
      title: 'Staff Meeting',
      start: '2025-01-17T15:00:00',
      end: '2025-01-17T16:00:00',
      extendedProps: {
        type: 'meeting',
        location: 'Conference Room',
        description: 'Monthly staff meeting'
      }
    }
  ];

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Calendar</h1>

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
          <h2 className="text-xl font-semibold mb-6">Event Details</h2>
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

              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {selectedEvent.extendedProps.location}
                </div>

                {selectedEvent.extendedProps.type === 'class' && (
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {selectedEvent.extendedProps.students} students
                  </div>
                )}
              </div>

              <p className="text-gray-600">{selectedEvent.extendedProps.description}</p>

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
            </div>
          ) : (
            <p className="text-gray-600">Select an event to view details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;