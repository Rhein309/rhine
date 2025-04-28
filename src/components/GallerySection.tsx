import React, { useState } from 'react';
import { X } from 'lucide-react';

const galleryImages = [
  {
    src: "https://images.pexels.com/photos/8471971/pexels-photo-8471971.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    alt: "Children reading in classroom"
  },
  {
    src: "https://images.pexels.com/photos/8471976/pexels-photo-8471976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    alt: "Teacher helping student with writing"
  },
  {
    src: "https://images.pexels.com/photos/296302/pexels-photo-296302.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    alt: "Phonics learning materials"
  },
  {
    src: "https://images.pexels.com/photos/256468/pexels-photo-256468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    alt: "Children working together on project"
  },
  {
    src: "https://images.pexels.com/photos/8471962/pexels-photo-8471962.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    alt: "Student writing in workbook"
  },
  {
    src: "https://images.pexels.com/photos/8471748/pexels-photo-8471748.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    alt: "Learning center classroom"
  }
];

const GallerySection: React.FC = () => {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  return (
    <section id="gallery" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Learning Environment</h2>
          <p className="text-lg text-gray-600">
            Take a peek inside our centers and see the engaging learning environment we've created for our students.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className="overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer h-64"
              onClick={() => setLightboxImage(image.src)}
            >
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {lightboxImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh]">
              <button
                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors duration-200"
                onClick={() => setLightboxImage(null)}
              >
                <X className="w-6 h-6" />
              </button>
              <img 
                src={lightboxImage}
                alt="Gallery enlarged view" 
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;