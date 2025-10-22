import React, { useEffect, useRef, useState } from "react";

const TimelineItem = ({ year, title, description, index, isLast }) => {
  const itemRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    
    if (itemRef.current) {
      observer.observe(itemRef.current);
    }
    
    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, []);
  
  return (
    <div 
      ref={itemRef}
      className={`relative flex gap-6 sm:gap-8 pb-12 ${!isLast ? 'border-l-2 border-gray-200 ml-3 sm:ml-4' : ''}`}
    >
      {/* Timeline Dot */}
      <div 
        className={`absolute left-0 w-6 h-6 sm:w-8 sm:h-8 -ml-3 sm:-ml-4 rounded-full bg-pulse-500 border-4 border-white shadow-lg transition-all duration-500 ${isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
        style={{ transitionDelay: `${index * 0.1}s` }}
      >
        <div className="absolute inset-0 rounded-full bg-pulse-500 animate-ping opacity-75"></div>
      </div>
      
      {/* Content */}
      <div 
        className={`flex-1 ml-6 sm:ml-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
        style={{ transitionDelay: `${index * 0.1 + 0.2}s` }}
      >
        <div className="inline-block px-4 py-1 bg-pulse-50 text-pulse-500 rounded-full text-sm font-semibold mb-3">
          {year}
        </div>
        <h3 className="text-xl sm:text-2xl font-display font-bold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

const StoryTimeline = () => {
  const timeline = [
    {
      year: "2019",
      title: "The Foundation",
      description: "Student Council Xavier was officially established to give students a unified voice and platform to shape campus life."
    },
    {
      year: "2020",
      title: "First Virtual Fest",
      description: "Adapted to the pandemic by organizing our first-ever virtual cultural fest, connecting students during challenging times."
    },
    {
      year: "2021",
      title: "Expansion & Growth",
      description: "Launched multiple new initiatives including mentorship programs, skill development workshops, and social responsibility projects."
    },
    {
      year: "2022",
      title: "Spandan Reborn",
      description: "Successfully organized Spandan, our flagship cultural festival, bringing together 2000+ students for three days of celebration."
    },
    {
      year: "2023",
      title: "Tech Integration",
      description: "Introduced digital platforms for event management, student feedback, and real-time announcements, making council operations more efficient."
    },
    {
      year: "2024",
      title: "Record-Breaking Year",
      description: "Organized 50+ events, launched the council website, and achieved the highest student participation rate in Xavier's history."
    },
    {
      year: "2025",
      title: "Future Forward",
      description: "Continuing to innovate with new event formats, enhanced student services, and stronger community connections across all departments."
    }
  ];
  
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white" id="story">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="pulse-chip mx-auto mb-4">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">04</span>
              <span>Our Journey</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
              The Story of Student Council Xavier
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              From humble beginnings to a thriving student community
            </p>
          </div>
          
          {/* Timeline */}
          <div className="relative">
            {timeline.map((item, index) => (
              <TimelineItem
                key={index}
                year={item.year}
                title={item.title}
                description={item.description}
                index={index}
                isLast={index === timeline.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoryTimeline;