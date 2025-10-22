import React from "react";
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className=" w-full mt-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        
        {/* Logo and Social Media */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <img 
              src="/xiesc.png" 
              alt="Student Council Xavier" 
              className="h-20 w-auto invert" 
            />
            {/* <span className="text-2xl font-bold">Student Council Xavier</span> */}
          </div>
          
          <p className="text-gray-300 text-sm mb-6 max-w-2xl mx-auto">
            Empowering students, organizing events, and building a vibrant community at <br/>Xavier Institute of Engineering.
          </p>
          
          {/* Social Media Links */}
          <div className="flex gap-4 justify-center flex-wrap">
            <a 
              href="https://www.instagram.com/xie.studentcouncil/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
              aria-label="Student Council Instagram"
              title="XiE Student Council"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="https://www.instagram.com/xie.transmission/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
              aria-label="Transmission Instagram"
              title="XiE Transmission"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="https://www.instagram.com/xie.sparx/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
              aria-label="SPARX Instagram"
              title="XiE SPARX"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="https://www.linkedin.com/company/xie-student-council/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-blue-700 flex items-center justify-center transition-all duration-300 hover:scale-110"
              aria-label="LinkedIn"
              title="XiE Student Council LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="https://youtube.com/@xie_student_council?si=rQ6ulLE3PJFGAM2N" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
              aria-label="YouTube"
              title="XiE Student Council YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>

            <a 
              href="https://youtube.com/@xie_student_council?si=rQ6ulLE3PJFGAM2N" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
              aria-label="YouTube"
              title="XiE Student Council YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>

          {/* Social Media Labels */}
          <div className="mt-4 text-xs text-gray-400">
            <p>Follow us: @xie.studentcouncil • @xie.transmission • @xie.sparx</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400 text-center md:text-left">
            © {new Date().getFullYear()} Student Council Xavier. All rights reserved.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="/privacy" className="text-gray-400 hover:text-pulse-500 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-pulse-500 transition-colors">
              Terms of Service
            </a>
            <a href="/cookies" className="text-gray-400 hover:text-pulse-500 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>

        {/* Credits */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-center text-gray-500 text-xs">
            Developed and maintained by{" "}
            <span className="text-pulse-400 font-semibold">Team Tech Nova</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;