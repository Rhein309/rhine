import React from 'react';
import { Sparkles } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section id="home" className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-4">
              Making English Learning
              <span className="text-blue-600 block"> Fun & Effective</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Our award-winning center provides systematic phonics, oral, grammar, and writing 
              programs for children aged 3-12 in small, engaging classes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#programs" 
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-md transition-colors duration-200 text-center"
              >
                Explore Programs
              </a>
            </div>
            <div className="mt-8 flex items-center gap-2 p-4 bg-white rounded-lg shadow-sm border border-purple-100 max-w-md mx-auto">
              <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                <span className="font-medium">Limited spots available!</span> Small classes of maximum 6 students per group.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;