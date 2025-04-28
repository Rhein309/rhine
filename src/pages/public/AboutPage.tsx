import React from 'react';
import { Users, BookOpen, Award, GraduationCap } from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: <Users className="w-10 h-10 text-purple-600" />,
      title: "Small Classes",
      description: "Maximum 6 students per class for personalized attention"
    },
    {
      icon: <BookOpen className="w-10 h-10 text-purple-600" />,
      title: "Systematic Curriculum",
      description: "Structured approach to phonics, oral, grammar, and writing"
    },
    {
      icon: <Award className="w-10 h-10 text-purple-600" />,
      title: "Certified Programs",
      description: "Cambridge YL and Trinity classes for global recognition"
    },
    {
      icon: <GraduationCap className="w-10 h-10 text-purple-600" />,
      title: "Experienced Teachers",
      description: "Dedicated educators passionate about children's development"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About Little Hands Learning Centre</h1>
        <p className="text-lg text-gray-600">
          Since 2010, we've been dedicated to providing quality English education to children aged 3-12.
          Our mission is to create a joyful and effective learning environment where every child can thrive.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="rounded-lg overflow-hidden shadow-md">
          <img 
            src="https://images.pexels.com/photos/8471835/pexels-photo-8471835.jpeg" 
            alt="Learning environment" 
            className="w-full h-64 object-cover"
          />
          <div className="p-6 bg-white">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Mission</h3>
            <p className="text-gray-600">
              We believe that "Learning is fun" and strive to create an engaging, supportive 
              environment where every child can develop strong English language skills through 
              our proven methodology.
            </p>
          </div>
        </div>
        
        <div className="rounded-lg overflow-hidden shadow-md">
          <img 
            src="https://images.pexels.com/photos/8466573/pexels-photo-8466573.jpeg" 
            alt="Classroom activity" 
            className="w-full h-64 object-cover"
          />
          <div className="p-6 bg-white">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Approach</h3>
            <p className="text-gray-600">
              Our holistic approach combines systematic phonics, oral practice, grammar fundamentals,
              and writing skills. We encourage students to participate in Cambridge YL and Trinity 
              classes for worldwide recognition.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-300"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;