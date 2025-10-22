import React from "react";

const ImageShowcaseSection = () => {
  return (
    <section className="w-full pt-0 pb-8 sm:pb-12 bg-white" id="showcase">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 animate-on-scroll">
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-gray-900 mb-3 sm:mb-4">
            Creating Unforgettable Moments
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            From grand cultural festivals to intimate workshops, we bring the campus 
            community together through events that inspire, entertain, and empower.
          </p>
        </div>
        
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant mx-auto max-w-4xl animate-on-scroll">
          <div className="w-full">
            <img 
              src="/image1.jpg" 
              alt="Student Council events and activities" 
              className="w-full h-[30vw] object-cover"
            />
          </div>
          <div className="bg-white p-4 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-display font-semibold mb-3 sm:mb-4">Events That Matter</h3>
            <p className="text-gray-700 text-sm sm:text-base">
              Every year, we organize 50+ events including Spandan (cultural fest), 
              Transmission (tech fest), sports tournaments, workshops, and social initiatives. 
              Each event is crafted to celebrate diversity, foster talent, and build lasting memories.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageShowcaseSection;