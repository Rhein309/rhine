import React from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';

const locations = [
  {
    name: "Tsz Wan Shan Centre",
    address: "Tsz Wan Shan Shopping Centre",
    details: "Unit 123, 1/F, Tsz Wan Shan Shopping Centre, 23 Yuk Wah Street, Tsz Wan Shan",
    phone: "+852 1234 5678",
    hours: "Mon-Fri: 2pm-7pm | Sat-Sun: 10am-6pm",
    mapUrl: "https://www.google.com/maps"
  },
  {
    name: "Tseung Kwan O Centre",
    address: "Monterey Place",
    details: "Shop 45, G/F, Monterey Place, 23 Tong Chun Street, Tseung Kwan O",
    phone: "+852 8765 4321",
    hours: "Mon-Fri: 2pm-7pm | Sat-Sun: 10am-6pm",
    mapUrl: "https://www.google.com/maps"
  }
];

const LocationsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Visit Our Centres</h2>
          <p className="text-lg text-gray-600">
            We have two convenient locations in Hong Kong. Stop by to learn more about our programs and meet our teachers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {locations.map((location, index) => (
            <div 
              key={index} 
              className="bg-purple-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 bg-purple-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-purple-900">
                    <MapPin className="w-10 h-10 mx-auto mb-2" />
                    <h3 className="text-xl font-bold">{location.name}</h3>
                    <p>{location.address}</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4 flex items-start">
                  <MapPin className="w-5 h-5 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">{location.details}</p>
                </div>
                <div className="mb-4 flex items-start">
                  <Phone className="w-5 h-5 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">{location.phone}</p>
                </div>
                <div className="mb-6 flex items-start">
                  <Clock className="w-5 h-5 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">{location.hours}</p>
                </div>
                <a 
                  href={location.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-purple-100 hover:bg-purple-200 text-purple-900 font-medium px-4 py-2 rounded-md transition-colors duration-200"
                >
                  Get Directions
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;