import React from "react";

const LocationMap = () => {
  return (
    <section className="py-12 sm:py-16 bg-white" id="location">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="pulse-chip mx-auto mb-4">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">04</span>
              <span>Our Location</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
              Come Visit Our Office
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Schedule a tour and see Atlas in action
            </p>
          </div>
          
          {/* Map Container */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant">
            <div className="relative w-full h-[400px] sm:h-[500px] bg-gray-100">
              {/* Placeholder for map - you can integrate Google Maps or Mapbox here */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="w-16 h-16 text-pulse-500 mx-auto mb-4" />
                  <h3 className="text-xl font-display font-semibold mb-2">Atlas Robotics HQ</h3>
                  <p className="text-gray-600 mb-4">
                    123 Innovation Drive<br />
                    Tech Valley, CA 94000<br />
                    United States
                  </p>
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-pulse-500 hover:bg-pulse-600 text-white font-semibold rounded-full transition-colors duration-300"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
              
              {/* You can replace the above with an actual map embed like: */}
              {/* <iframe 
                src="https://www.google.com/maps/embed?pb=..."
                width="100%" 
                height="100%" 
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MapPin = ({ className }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

export default LocationMap;