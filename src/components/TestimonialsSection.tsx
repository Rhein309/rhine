import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "My daughter has improved tremendously in her English skills since joining BrightMinds. The small class size ensures she gets personalized attention.",
    author: "Sarah Wong",
    role: "Parent of Emily, 7",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    quote: "The teachers are passionate and make learning fun. My son now looks forward to his English classes every week!",
    author: "David Chan",
    role: "Parent of Jason, 5",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    quote: "The systematic approach to phonics has helped my child become a confident reader in just a few months.",
    author: "Michelle Lee",
    role: "Parent of Sophia, 4",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What Parents Say</h2>
          <p className="text-lg text-gray-600">
            Don't just take our word for it. Here's what parents have to say about their children's experience at our centre.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <Quote className="w-10 h-10 text-blue-200 mb-4" />
              <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="text-gray-800 font-medium">{testimonial.author}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;