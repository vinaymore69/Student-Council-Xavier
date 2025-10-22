import React from "react";

const MadeByHumans = () => {
  return (
    <section id="made-by-students" className="w-full bg-white py-0">
      <div className="section-container opacity-0 animate-on-scroll pb-2">
        <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden relative mt-6 sm:mt-8">
          <div 
            className="bg-no-repeat bg-cover bg-center p-4 sm:p-5 min-h-[250px] sm:min-h-[350px] flex flex-col justify-between" 
            style={{
              backgroundImage: "url('/background-section3.png')"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
            
            <div className="flex items-center text-white relative z-10">
              <img 
                src="/xiesc.png" 
                alt="Student Council Xavier Logo" 
                className="h-15 sm:h-20 w-auto mr-3 invert" 
              />
              {/* <span className="text-white text-xl font-medium">
                Student Council Xavier
              </span> */}
            </div>
            
            <div 
              style={{
                overflow: "hidden",
                maxHeight: "80px",
                marginTop: "40px"
              }}
              className="relative z-10"
            >
              <h2 
                style={{
                  marginBottom: "-20px",
                  padding: "0px 0px 100px"
                }} 
                className="sm:text-5xl font-playfair text-white italic mt-0 mx-0 font-thin text-6xl md:text-7xl py-0 px-0 text-center lg:text-7xl"
              >
                By Students, For Students
              </h2>
            </div>
            
            {/* White box at the bottom with overflow */}
            <div className="w-[120%] bg-white h-10 rounded-t-lg absolute left-[-10%] bottom-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MadeByHumans;