import React, { useEffect, useRef } from "react";
import { Zap, Users, Target, Award, Heart, Shield } from "lucide-react";

const ValueCard = ({ icon: Icon, title, description, index }) => {
  const cardRef = useRef(null);
  
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
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);
  
  return (
    <div 
      ref={cardRef}
      className="glass-card opacity-0 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-elegant lg:hover:bg-gradient-to-br lg:hover:from-white lg:hover:to-pulse-50 transition-all duration-300"
      style={{ animationDelay: `${0.1 * index}s` }}
    >
      <div className="rounded-full bg-pulse-50 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-pulse-500 mb-5">
        <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
      <h3 className="text-xl sm:text-2xl font-display font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{description}</p>
    </div>
  );
};

const ValuesSection = () => {
  const sectionRef = useRef(null);
  
  const values = [
    {
      icon: Zap,
      title: "Innovation & Creativity",
      description: "We constantly explore new ideas and push boundaries to create events and initiatives that inspire and excite the entire campus community."
    },
    {
      icon: Users,
      title: "Inclusivity & Diversity",
      description: "Every student deserves to be heard and represented. We celebrate diverse perspectives and ensure everyone has a seat at the table."
    },
    {
      icon: Target,
      title: "Student-Centric Approach",
      description: "Students come first in every decision we make. We listen, understand, and act on what matters most to the campus community."
    },
    {
      icon: Award,
      title: "Excellence in Execution",
      description: "From grand festivals to small workshops, we maintain the highest standards in planning and delivering exceptional experiences."
    },
    {
      icon: Heart,
      title: "Passion & Dedication",
      description: "We're driven by genuine care for student welfare and a commitment to making Xavier the best place to learn and grow."
    },
    {
      icon: Shield,
      title: "Transparency & Accountability",
      description: "We operate with honesty and integrity, keeping students informed and taking responsibility for our actions and decisions."
    }
  ];
  
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50" id="values" ref={sectionRef}>
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <div className="pulse-chip mx-auto mb-4 opacity-0 animate-fade-in">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">03</span>
            <span>Our Values</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            What Drives Us Forward
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Our core principles guide every event we organize and every decision we make for the student community.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {values.map((value, index) => (
            <ValueCard
              key={index}
              icon={value.icon}
              title={value.title}
              description={value.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;