import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const FAQItem = ({ question, answer, index, isOpen, onClick }) => {
  const contentRef = useRef(null);
  const itemRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (itemRef.current) {
      observer.observe(itemRef.current);
    }
    
    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, []);
  
  return (
    <div 
      ref={itemRef}
      className="opacity-0 glass-card rounded-2xl overflow-hidden shadow-elegant transition-all duration-300 hover:shadow-lg"
      style={{ animationDelay: `${0.1 * index}s` }}
    >
      <button
        onClick={onClick}
        className="w-full p-6 sm:p-8 text-left flex items-center justify-between gap-4 transition-colors duration-300 hover:bg-pulse-50/50"
      >
        <h3 className="text-lg sm:text-xl font-display font-semibold pr-4">
          {question}
        </h3>
        <ChevronDown 
          className={`w-6 h-6 text-pulse-500 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      <div 
        ref={contentRef}
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px',
          opacity: isOpen ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease, opacity 0.3s ease'
        }}
      >
        <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0">
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);
  
  const faqs = [
    {
      question: "How quickly can I expect a response?",
      answer: "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly at +1 (555) 123-4567."
    },
    {
      question: "Can I schedule a demo of Atlas?",
      answer: "Absolutely! We offer both virtual and in-person demos. Fill out the contact form above and select 'Requesting a demo' to schedule a session with our team."
    },
    {
      question: "Do you offer technical support?",
      answer: "Yes, we provide comprehensive technical support for all our customers. Support is available Monday-Friday, 9am-6pm PST via phone, email, and live chat."
    },
    {
      question: "Are you open to partnership opportunities?",
      answer: "We're always interested in exploring partnerships with innovative companies. Please select 'Partnership opportunities' in the contact form to start the conversation."
    },
    {
      question: "What information should I include in my message?",
      answer: "Please provide your name, company details, and a brief description of your inquiry. The more specific you are, the better we can assist you."
    }
  ];
  
  return (
    <section className="py-12 sm:py-16 bg-gray-50" id="faq">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-16">
            <div className="pulse-chip mx-auto mb-4">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">05</span>
              <span>FAQ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Quick answers to common questions about contacting us
            </p>
          </div>
          
          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                index={index}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;