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
              Drop by the Student Council office anytime during our working hours
            </p>
          </div>
          
          {/* Map Container */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant">
            <div className="relative w-full h-[400px] sm:h-[500px] bg-gray-100">
              {/* Google Maps Embed - Xavier Institute of Engineering */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.487486788524!2d72.83764757501856!3d19.04393198211856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c947a8e96aed%3A0x6e501109139ce432!2sXavier%20Institute%20of%20Engineering!5e0!3m2!1sen!2sin!4v1729605200000!5m2!1sen!2sin"
                width="100%" 
                height="100%" 
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Xavier Institute of Engineering Location"
              ></iframe>
              
              {/* Overlay Info Card */}
              <div className="absolute bottom-4 left-4 right-4 sm:left-8 sm:right-auto sm:max-w-sm bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-pulse-500 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-display font-semibold mb-1">Student Council Office</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Xavier Institute of Engineering<br />
                      Room 101, Building A, First Floor<br />
                      Mahim Causeway, Mahim (W)<br />
                      Mumbai - 400016, Maharashtra
                    </p>
                    <a 
                      href="https://www.google.com/maps/dir//Xavier+Institute+of+Engineering,+Mahim+Causeway,+Mahim,+Mumbai,+Maharashtra+400016/@19.0439319,72.8376475,17z"
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-pulse-500 hover:bg-pulse-600 text-white text-sm font-semibold rounded-full transition-colors duration-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Location Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            {/* Nearby Landmarks */}
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Nearby Landmark</h4>
              <p className="text-sm text-gray-600">S.L. Raheja Hospital</p>
            </div>

            {/* Transportation */}
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Transportation</h4>
              <p className="text-sm text-gray-600">Mahim Railway Station (5 min walk)</p>
            </div>

            {/* Parking */}
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Parking Available</h4>
              <p className="text-sm text-gray-600">Campus parking for visitors</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MapPin = ({ className }: { className?: string }) => (
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