import React from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';

const LocationPage = () => {
  const locations = [
    {
      name: "Tsz Wan Shan Centre",
      address: "23 Yuk Wah St, Tsze Wan Shan Shopping Centre, Tsz Wan Shan",
      phone: "3468 2648",
      hours: {
        Monday: "2 PM – 7 PM",
        Tuesday: "10 AM – 6 PM",
        Wednesday: "10 AM – 7 PM",
        Thursday: "10 AM – 7 PM",
        Friday: "10 AM – 7 PM",
        Saturday: "10 AM – 6 PM",
        Sunday: "Closed"
      }
    },
    {
      name: "Tseung Kwan O Centre",
      address: "105A, 1/F, Tong Chun St, Monterey Place, Tseung Kwan O",
      phone: "3468 2648",
      hours: {
        Monday: "2 PM – 7 PM",
        Tuesday: "10 AM – 6 PM",
        Wednesday: "10 AM – 7 PM",
        Thursday: "10 AM – 7 PM",
        Friday: "10 AM – 7 PM",
        Saturday: "10 AM – 6 PM",
        Sunday: "Closed"
      }
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Our Locations</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {locations.map((location, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-purple-100 text-purple-900 p-6">
              <h2 className="text-2xl font-bold mb-2">{location.name}</h2>
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <p>{location.address}</p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="w-5 h-5 text-purple-600" />
                  <p className="font-medium">{location.phone}</p>
                </div>
                
                <div className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <p className="font-medium mb-2">Opening Hours:</p>
                    {Object.entries(location.hours).map(([day, hours]) => (
                      <div key={day} className="grid grid-cols-2 gap-4">
                        <span className="text-gray-600">{day}</span>
                        <span className={day === "Sunday" ? "text-red-500" : ""}>{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(location.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200"
              >
                Get Directions
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationPage;