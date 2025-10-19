import React from "react";
import { Link } from "react-router-dom";

const AboutCTA = () => {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant max-w-5xl mx-auto">
          <div 
            className="relative p-8 sm:p-12 md:p-16 text-center"
            style={{
              backgroundImage: "url('/background-section3.png')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-pulse-900/60 to-dark-900/90"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4 sm:mb-6">
                Ready to Experience the Future?
              </h2>
              <p className="text-lg sm:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto">
                Join thousands of innovators already transforming their operations with Atlas.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/signup">
                  <button className="w-full sm:w-auto px-8 py-4 bg-white text-pulse-500 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-lg">
                    Get Started Today
                  </button>
                </Link>
                <Link to="/contact">
                  <button className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors duration-300">
                    Contact Sales
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCTA;