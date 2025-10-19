import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GalleryHero from '@/components/GalleryHero';
import EventFilters from '@/components/EventFilters';
import EventsList from '@/components/EventsList';
import EventGalleryModal from '@/components/EventGalleryModal';

const Gallery = () => {
  const currentYear = new Date().getFullYear();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Sample events data - Replace with your actual data
  const eventsData = [
    {
      id: 1,
      title: "Annual Tech Symposium 2025",
      category: "Technical",
      categoryIcon: "⚙️",
      description: "A groundbreaking showcase of cutting-edge technology, featuring robotics demonstrations, AI workshops, and innovation challenges.",
      date: "March 15, 2025",
      time: "9:00 AM - 6:00 PM",
      location: "Innovation Hub, Main Campus",
      participants: "500+",
      status: "active",
      year: 2025,
      image: "/lovable-uploads/c3d5522b-6886-4b75-8ffc-d020016bb9c2.png",
      gallery: [
        "/lovable-uploads/c3d5522b-6886-4b75-8ffc-d020016bb9c2.png",
        "/background-section1.png",
        "/background-section2.png",
        "/background-section3.png"
      ]
    },
    {
      id: 2,
      title: "Cultural Fest 2025",
      category: "Cultural",
      categoryIcon: "🎭",
      description: "Experience the vibrant tapestry of diverse cultures through traditional performances, art exhibitions, and culinary delights from around the world.",
      date: "April 22, 2025",
      time: "10:00 AM - 8:00 PM",
      location: "Central Auditorium",
      participants: "800+",
      status: "upcoming",
      year: 2025,
      image: "/background-section1.png",
      gallery: [
        "/background-section1.png",
        "/background-section2.png",
        "/background-section3.png",
        "/lovable-uploads/c3d5522b-6886-4b75-8ffc-d020016bb9c2.png"
      ]
    },
    {
      id: 3,
      title: "Inter-College Sports Championship",
      category: "Sports",
      categoryIcon: "⚽",
      description: "The ultimate athletic competition featuring basketball, football, athletics, and more. Watch teams compete for glory and championship titles.",
      date: "May 10-12, 2025",
      time: "8:00 AM - 7:00 PM",
      location: "Sports Complex",
      participants: "1000+",
      status: "upcoming",
      year: 2025,
      image: "/background-section2.png",
      gallery: [
        "/background-section2.png",
        "/background-section3.png",
        "/lovable-uploads/c3d5522b-6886-4b75-8ffc-d020016bb9c2.png",
        "/background-section1.png"
      ]
    },
    {
      id: 4,
      title: "Hackathon 2024",
      category: "Technical",
      categoryIcon: "⚙️",
      description: "24-hour coding marathon where brilliant minds came together to build innovative solutions for real-world problems.",
      date: "November 5-6, 2024",
      time: "24 Hours",
      location: "Tech Lab, Building A",
      participants: "300+",
      status: "completed",
      year: 2024,
      image: "/background-section3.png",
      gallery: [
        "/background-section3.png",
        "/background-section1.png",
        "/background-section2.png"
      ]
    },
    {
      id: 5,
      title: "Diwali Celebration 2024",
      category: "Cultural",
      categoryIcon: "🎭",
      description: "A magical evening of lights, music, and tradition celebrating the festival of Diwali with spectacular performances and fireworks.",
      date: "October 24, 2024",
      time: "6:00 PM - 10:00 PM",
      location: "Open Ground",
      participants: "1500+",
      status: "completed",
      year: 2024,
      image: "/background-section1.png",
      gallery: [
        "/background-section1.png",
        "/background-section3.png",
        "/background-section2.png"
      ]
    }
  ];

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

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="space-y-0">
        <GalleryHero />
        <EventFilters 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
        <EventsList 
          events={eventsData}
          selectedCategory={selectedCategory}
          selectedYear={selectedYear}
          onEventClick={handleEventClick}
        />
      </main>
      
      <Footer />

      {/* Event Gallery Modal */}
      {selectedEvent && (
        <EventGalleryModal 
          event={selectedEvent}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Gallery;