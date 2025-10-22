import React, { useRef } from "react";

interface TestimonialProps {
  content: string;
  author: string;
  role: string;
  gradient: string;
  backgroundImage?: string;
}

const testimonials: TestimonialProps[] = [
  {
    content: "Joining the Student Council was the best decision of my college life. I've grown as a leader, made lifelong friends, and contributed to making our campus better for everyone.",
    author: "Priya Sharma",
    role: "Final Year, Computer Engineering",
    gradient: "from-blue-700 via-indigo-800 to-purple-900",
    backgroundImage: "/background-section1.png"
  },
  {
    content: "The council gave me a platform to organize Spandan 2024. Seeing 2000+ students enjoy the fest we created from scratch was incredibly rewarding. It taught me project management skills no classroom could.",
    author: "Rahul Mehta",
    role: "Third Year, Electronics Engineering",
    gradient: "from-indigo-900 via-purple-800 to-orange-500",
    backgroundImage: "/background-section2.png"
  },
  {
    content: "As a first-year student, I felt lost. The Student Council welcomed me, listened to my ideas, and helped me organize a mental health awareness workshop. They truly care about every student's voice.",
    author: "Ananya Desai",
    role: "Second Year, Information Technology",
    gradient: "from-purple-800 via-pink-700 to-red-500",
    backgroundImage: "/background-section3.png"
  },
  {
    content: "The council doesn't just organize events—they create experiences. From Transmission tech fest to sports tournaments, every event is professionally managed and inclusive. Proud to be part of Xavier!",
    author: "Arjun Patel",
    role: "Third Year, Mechanical Engineering",
    gradient: "from-orange-600 via-red-500 to-purple-600",
    backgroundImage: "/background-section1.png"
  }
];

const TestimonialCard = ({
  content,
  author,
  role,
  backgroundImage = "/background-section1.png"
}: TestimonialProps) => {
  return (
    <div 
      className="bg-cover bg-center rounded-lg p-8 h-full flex flex-col justify-between text-white transform transition-transform duration-300 hover:-translate-y-2 relative overflow-hidden" 
      style={{
        backgroundImage: `url('${backgroundImage}')`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"></div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 backdrop-blur-sm z-10"></div>
      
      <div className="relative z-20">
        <p className="text-xl mb-8 font-medium leading-relaxed pr-20">{`"${content}"`}</p>
        <div>
          <h4 className="font-semibold text-xl">{author}</h4>
          <p className="text-white/90">{role}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-12 bg-white relative" id="testimonials" ref={sectionRef}>
      <div className="section-container opacity-0 animate-on-scroll">
        <div className="flex items-center gap-4 mb-6">
          <div className="pulse-chip">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">04</span>
            <span>Student Voices</span>
          </div>
        </div>
        
        <h2 className="text-5xl font-display font-bold mb-12 text-left">What Students Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index} 
              content={testimonial.content} 
              author={testimonial.author} 
              role={testimonial.role} 
              gradient={testimonial.gradient} 
              backgroundImage={testimonial.backgroundImage} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;