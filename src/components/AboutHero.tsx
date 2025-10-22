import React from "react";

const AboutHero = () => {
  return (
    <section className="w-full relative overflow-hidden bg-white pt-24 sm:pt-32 pb-12 sm:pb-16">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Pulse Chip */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="pulse-chip">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">01</span>
            <span>About</span>
          </div>
        </div>
        
        {/* Hero Content */}
        <div className="max-w-4xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 sm:mb-8 leading-tight">
            Empowering Students Through
            <span className="block text-pulse-500">Leadership & Unity</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl">
            We're on a mission to amplify every student's voice and create unforgettable 
            experiences. Through innovative events and dedicated representation, we're building 
            a campus where every student thrives and every idea matters.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;