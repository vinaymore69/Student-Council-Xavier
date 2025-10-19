import React from "react";

const ContactCTA = () => {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant max-w-5xl mx-auto">
          <div 
            className="relative p-8 sm:p-12 md:p-16"
            style={{
              backgroundImage: "url('/background-section3.png')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-pulse-900/60 to-dark-900/90"></div>
            
            <div className="relative z-10">
              <div className="max-w-3xl">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4 sm:mb-6">
                  Need Immediate Assistance?
                </h2>
                <p className="text-lg sm:text-xl text-white/90 mb-8 sm:mb-10">
                  For urgent inquiries or technical support, our team is standing by to help. 
                  Call us directly or use our live chat feature for instant support.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="tel:+15551234567">
                    <button className="w-full sm:w-auto px-8 py-4 bg-white text-pulse-500 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-lg">
                      Call Now: +1 (555) 123-4567
                    </button>
                  </a>
                  <a href="#contact-form">
                    <button className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors duration-300">
                      Send a Message
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;