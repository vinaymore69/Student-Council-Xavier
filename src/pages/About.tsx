import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutHero from '@/components/AboutHero';
import MissionVision from '@/components/MissionVision';
import ValuesSection from '@/components/ValuesSection';
import StoryTimeline from '@/components/StoryTimeline';
import AboutCTA from '@/components/AboutCTA';

const About = () => {
  // Initialize intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));
    
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="space-y-0">
        <AboutHero />
        <MissionVision />
        <ValuesSection />
        <StoryTimeline />
        <AboutCTA />
      </main>
      
      <Footer />
    </div>
  );
};

export default About;