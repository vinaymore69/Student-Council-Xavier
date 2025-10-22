import React from "react";

const MissionVision = () => {
  return (
    <section className="w-full py-8 sm:py-12 bg-white" id="mission-vision">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Header with badge and line */}
        <div className="flex items-center gap-4 mb-8 sm:mb-12">
          <div className="pulse-chip">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">02</span>
            <span>Our Purpose</span>
          </div>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
          {/* Mission Card */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant animate-on-scroll">
            <div 
              className="relative h-48 sm:h-64 p-6 sm:p-8 flex items-end"
              style={{
                backgroundImage: "url('/background-section1.png')",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-pulse-900/40 to-dark-900/80"></div>
              <h2 className="relative z-10 text-2xl sm:text-3xl font-display text-white font-bold">
                Our Mission
              </h2>
            </div>
            
            <div className="bg-white p-6 sm:p-8" style={{ border: "1px solid #ECECEC" }}>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                To represent every student's voice, organize memorable events, and foster a 
                vibrant campus community where everyone feels valued and heard.
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                We believe that student life isn't just about academics—it's about creating 
                connections, discovering passions, and developing leadership skills that last a lifetime.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant animate-on-scroll">
            <div 
              className="relative h-48 sm:h-64 p-6 sm:p-8 flex items-end"
              style={{
                backgroundImage: "url('/background-section2.png')",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-pulse-900/40 to-dark-900/80"></div>
              <h2 className="relative z-10 text-2xl sm:text-3xl font-display text-white font-bold">
                Our Vision
              </h2>
            </div>
            
            <div className="bg-white p-6 sm:p-8" style={{ border: "1px solid #ECECEC" }}>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                A campus where students are empowered leaders, active participants, and 
                proud ambassadors of Xavier Institute of Engineering.
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                We envision a future where every student has the opportunity to lead, create, 
                and contribute to making our campus the best place to learn and grow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;