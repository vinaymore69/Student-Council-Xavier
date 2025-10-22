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
      question: "How quickly will I receive a response?",
      answer: "We aim to respond to all inquiries within 24 hours during weekdays. For urgent matters during office hours, feel free to visit our office directly at the Student Council room or call us."
    },
    {
      question: "How can I join the Student Council?",
      answer: "Applications for Student Council membership open at the beginning of each academic year. Keep an eye on our announcements and social media for application dates. You can also express your interest through the contact form by selecting 'Membership / Join Council'."
    },
    {
      question: "Can I suggest an event or activity idea?",
      answer: "Absolutely! We love hearing creative ideas from students. Use the contact form and select 'Suggestion' as the category, or share your thoughts directly at our council meetings which are held every two weeks."
    },
    {
      question: "How do I report a campus issue or concern?",
      answer: "If you have any concerns or issues you'd like to bring to our attention, please use the contact form and select 'Complaint / Issue' as the category. All reports are handled confidentially and with priority."
    },
    {
      question: "Where can I find information about upcoming events?",
      answer: "Check out our Gallery page to see all upcoming and past events. You can also follow us on social media for real-time updates, or subscribe to our newsletter through the contact form."
    },
    {
      question: "What are the Student Council office hours?",
      answer: "Our office is open Monday to Friday from 9:00 AM to 5:00 PM, and Saturdays from 10:00 AM to 2:00 PM. We're closed on Sundays and public holidays. You're always welcome to drop by during these hours!"
    },
    {
      question: "Can I volunteer for Student Council events?",
      answer: "Yes! We always welcome student volunteers for our events. Send us a message through the contact form selecting 'Event Related' and let us know which events you're interested in helping with."
    },
    {
      question: "How do I give feedback about a recent event?",
      answer: "We value your feedback! Please use the contact form and select 'Feedback' as the category. Your input helps us improve future events and better serve the student community."
    }
  ];
  
  return (
    <section className="py-12 sm:py-16 bg-gray-50" id="faq">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-16">
            <div className="pulse-chip mx-auto mb-4">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">03</span>
              <span>FAQ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Quick answers to common questions about the Student Council
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
          
          {/* CTA Box */}
          <div className="mt-12 p-8 bg-gradient-to-br from-pulse-500 to-pulse-600 rounded-2xl text-center text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Feel free to reach out to us directly through the contact form above or visit our office during working hours.
            </p>
            <a 
              href="#contact-form" 
              className="inline-block px-8 py-3 bg-white text-pulse-600 font-semibold rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Contact Us Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;