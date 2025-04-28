import React from 'react';
import { ArrowRight, Clock, Calendar, Star } from 'lucide-react';

const programs = [
  {
    title: "Phonics Foundation",
    ageRange: "3-5 years",
    description: "Introduces children to the sounds of letters and builds the foundation for reading and writing in English.",
    features: ["Letter recognition", "Sound blending", "Basic reading skills", "Fun phonics activities"],
    image: "https://images.pexels.com/photos/296301/pexels-photo-296301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    title: "Young Readers",
    ageRange: "5-7 years",
    description: "Develops reading fluency and comprehension with structured reading practice and activities.",
    features: ["Guided reading", "Vocabulary building", "Reading comprehension", "Storytelling"],
    image: "https://images.pexels.com/photos/8471868/pexels-photo-8471868.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    title: "Grammar & Writing",
    ageRange: "7-9 years",
    description: "Focuses on grammar rules and structured writing to build confident written communication.",
    features: ["Sentence construction", "Grammar rules", "Paragraph writing", "Creative expression"],
    image: "https://images.pexels.com/photos/8923164/pexels-photo-8923164.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    title: "Advanced English",
    ageRange: "9-12 years",
    description: "Comprehensive program preparing students for academic success with advanced language skills.",
    features: ["Essay writing", "Advanced grammar", "Critical thinking", "Exam preparation"],
    image: "https://images.pexels.com/photos/8471982/pexels-photo-8471982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  }
];

const ProgramsSection: React.FC = () => {
  return (
    <section id="programs" className="py-16 md:py-24 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Programs</h2>
          <p className="text-lg text-gray-600">
            Discover our specialized English language programs designed for different age groups and skill levels.
            All programs feature small class sizes of maximum 6 students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {programs.map((program, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={program.image} 
                  alt={program.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{program.title}</h3>
                  <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {program.ageRange}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{program.description}</p>
                <ul className="mb-6 space-y-2">
                  {program.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Star className="w-4 h-4 text-amber-400 mr-2 mt-1" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">2-3 classes weekly</span>
                  </div>
                  <a 
                    href="#contact" 
                    className="text-blue-600 font-medium flex items-center hover:text-blue-800 transition-colors duration-200"
                  >
                    Inquire <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a 
            href="#contact" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md transition-colors duration-200"
          >
            Enroll in Our Programs
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;