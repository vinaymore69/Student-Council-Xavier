import React, { useEffect, useRef } from "react";
import { Calendar, MapPin, Users, Clock, Eye } from "lucide-react";

const EventCard = ({ event, index, onClick }) => {
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

  // Bento grid pattern: alternating sizes
  const isLarge = index % 5 === 0 || index % 5 === 3;
  const gridClass = isLarge 
    ? 'lg:col-span-2 lg:row-span-2' 
    : 'lg:col-span-1 lg:row-span-1';

  return (
    <div 
      ref={cardRef}
      className={`
        opacity-0 group relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-elegant 
        hover:shadow-2xl transition-all duration-500 cursor-pointer
        ${gridClass}
        h-64 sm:h-80 lg:h-full
      `}
      style={{ animationDelay: `${0.05 * index}s` }}
      onClick={() => onClick(event)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/40 to-transparent"></div>
      </div>

      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`
          inline-flex items-center px-3 py-1.5 rounded-full backdrop-blur-md font-semibold text-xs
          ${event.status === 'active' 
            ? 'bg-green-500/90 text-white' 
            : 'bg-pulse-500/90 text-white'
          }
        `}>
          <span className={`w-2 h-2 rounded-full mr-2 ${event.status === 'active' ? 'bg-white' : 'bg-white'} animate-pulse`}></span>
          {event.status === 'active' ? 'Live Now' : 'Upcoming'}
        </div>
      </div>

      {/* Category Badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className="inline-flex items-center px-3 py-1.5 rounded-full backdrop-blur-md bg-white/20 text-white font-medium text-xs">
          <span className="mr-1.5">{event.categoryIcon}</span>
          {event.category}
        </div>
      </div>

      {/* Content - Shows on Hover for small cards, always visible for large */}
      <div className={`
        absolute inset-0 p-6 flex flex-col justify-end
        ${!isLarge && 'translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'}
        transition-all duration-500
      `}>
        <h3 className={`
          font-display font-bold text-white mb-2 line-clamp-2
          ${isLarge ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}
        `}>
          {event.title}
        </h3>
        
        {isLarge && (
          <p className="text-white/90 text-sm sm:text-base mb-4 line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Event Meta */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-white/80 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>{event.date.split(',')[0]}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/80 text-xs">
            <Users className="w-3.5 h-3.5" />
            <span>{event.participants}</span>
          </div>
        </div>

        {/* View Gallery Button */}
        <button className="
          w-full py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold 
          rounded-full transition-all duration-300 flex items-center justify-center gap-2
          group-hover:bg-pulse-500 group-hover:shadow-lg
        ">
          <Eye className="w-4 h-4" />
          <span className="text-sm">View Gallery</span>
        </button>
      </div>
    </div>
  );
};

const EventsList = ({ events, selectedCategory, selectedYear, onEventClick }) => {
  const filteredEvents = events.filter(event => {
    const categoryMatch = selectedCategory === 'all' || event.category.toLowerCase() === selectedCategory;
    const yearMatch = event.year === selectedYear;
    return categoryMatch && yearMatch;
  });

  // Sort: active first, then upcoming
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (a.status === 'active' && b.status !== 'active') return -1;
    if (a.status !== 'active' && b.status === 'active') return 1;
    return 0;
  });

  return (
    <section className="w-full py-8 sm:py-12 bg-gradient-to-b from-gray-50 to-white" id="events-list">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        
        {/* Stats Bar */}
        {sortedEvents.length > 0 && (
          <div className="mb-8 p-4 bg-white rounded-2xl shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-2xl font-bold text-pulse-500">{sortedEvents.length}</p>
                <p className="text-xs text-gray-600">Total Events</p>
              </div>
              <div className="h-10 w-px bg-gray-200"></div>
              <div>
                <p className="text-2xl font-bold text-green-500">
                  {sortedEvents.filter(e => e.status === 'active').length}
                </p>
                <p className="text-xs text-gray-600">Live Now</p>
              </div>
              <div className="h-10 w-px bg-gray-200"></div>
              <div>
                <p className="text-2xl font-bold text-blue-500">
                  {sortedEvents.filter(e => e.status === 'upcoming').length}
                </p>
                <p className="text-xs text-gray-600">Upcoming</p>
              </div>
            </div>
          </div>
        )}

        {/* Bento Grid */}
        {sortedEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-[280px]">
            {sortedEvents.map((event, index) => (
              <EventCard 
                key={event.id} 
                event={event} 
                index={index}
                onClick={onEventClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-elegant">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">No Events Found</h3>
            <p className="text-gray-600">Try selecting a different category or year</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsList;