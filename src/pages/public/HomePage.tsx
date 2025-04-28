import React from 'react';
import HeroSection from '../../components/HeroSection';
import AboutSection from '../../components/AboutSection';
import ProgramsSection from '../../components/ProgramsSection';
import TestimonialsSection from '../../components/TestimonialsSection';
import GallerySection from '../../components/GallerySection';
import LocationsSection from '../../components/LocationsSection';
import ContactSection from '../../components/ContactSection';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <ProgramsSection />
      <TestimonialsSection />
      <GallerySection />
      <LocationsSection />
      <ContactSection />
    </div>
  );
};

export default HomePage;