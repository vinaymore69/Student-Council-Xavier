import React from "react";

const ContactHero = () => {
  return (
    <section className="w-full relative overflow-hidden bg-white pt-24 sm:pt-32 pb-12 sm:pb-16">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Pulse Chip */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="pulse-chip">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">01</span>
            <span>Contact</span>
          </div>
        </div>
        
        {/* Hero Content */}
        <div className="max-w-4xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 sm:mb-8 leading-tight">
            We're Here to
            <span className="block text-pulse-500">Listen & Help</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl">
            Have a question, suggestion, or concern? The Student Council is here for you. 
            Whether you want to join us, share an idea, or report an issue—we're just a 
            message away. Let's make our campus better, together.
          </p>
        </div>

        {/* Quick Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 max-w-3xl animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-pulse-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-pulse-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Email Us</p>
              <p className="text-sm font-semibold text-gray-900">24h Response</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-pulse-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-pulse-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Visit Office</p>
              <p className="text-sm font-semibold text-gray-900">Xavier Institue of Engineering</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-pulse-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-pulse-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Contact Hours</p>
              <p className="text-sm font-semibold text-gray-900">Mon-Fri, 9AM-5PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pulse-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
    </section>
  );
};

export default ContactHero;