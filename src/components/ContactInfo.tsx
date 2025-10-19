import React, { useEffect, useRef } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const InfoCard = ({ icon: Icon, title, content, details, index }) => {
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
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-pulse-50 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-pulse-500 flex-shrink-0">
          <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl sm:text-2xl font-display font-semibold mb-2">{title}</h3>
          <p className="text-gray-900 font-medium mb-1">{content}</p>
          <p className="text-gray-600 text-sm sm:text-base">{details}</p>
        </div>
      </div>
    </div>
  );
};

const ContactInfo = () => {
  const contactDetails = [
    {
      icon: Mail,
      title: "Email Us",
      content: "support@atlasrobotics.com",
      details: "We'll respond within 24 hours"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      details: "Mon-Fri from 9am to 6pm PST"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "123 Innovation Drive, Tech Valley, CA 94000",
      details: "United States"
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Monday - Friday: 9:00 AM - 6:00 PM",
      details: "Saturday - Sunday: Closed"
    }
  ];
  
  return (
    <section className="py-12 sm:py-16 bg-gray-50" id="contact-info">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <div className="pulse-chip mx-auto mb-4 opacity-0 animate-fade-in">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">03</span>
            <span>Contact Information</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Other Ways to Reach Us
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Choose the method that works best for you
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {contactDetails.map((detail, index) => (
            <InfoCard
              key={index}
              icon={detail.icon}
              title={detail.title}
              content={detail.content}
              details={detail.details}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;