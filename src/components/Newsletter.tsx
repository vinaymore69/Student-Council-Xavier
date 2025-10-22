import React, { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import emailjs from '@emailjs/browser';

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // EmailJS Configuration
      const serviceId = 'service_abb3y8s';
      const templateId = 'template_twg03ab';
      const publicKey = 'wdUryE-n6It7hgomx';

      const messageBody = `
Newsletter Subscription
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

New subscriber wants to receive updates!

📧 EMAIL:
${email}

📅 SUBSCRIBED AT:
${new Date().toLocaleString('en-IN', {
  dateStyle: 'full',
  timeStyle: 'long',
  timeZone: 'Asia/Kolkata'
})}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Add this email to the newsletter list.
`;

      const templateParams = {
        to_email: 'your-admin-email@example.com',
        to_name: 'Student Council Admin',
        subject: `Newsletter Subscription from ${email}`,
        message: messageBody.trim(),
        from_name: 'Newsletter Subscription',
        from_email: email.trim(),
        reply_to: email.trim()
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      toast({
        title: "Thank you for subscribing!",
        description: "You'll receive updates about upcoming events and announcements."
      });
      
      setEmail("");
    } catch (error: any) {
      console.error('Error subscribing:', error);
      toast({
        title: "Subscription failed",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="newsletter" className="bg-white py-0">
      <div className="section-container opacity-0 animate-on-scroll">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="pulse-chip">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">05</span>
              <span>Stay Updated</span>
            </div>
          </div>
          
          <h2 className="text-5xl font-display font-bold mb-4 text-left">Subscribe to Our Newsletter</h2>
          <p className="text-xl text-gray-700 mb-10 text-left">
            Be the first to know about upcoming events, announcements, and opportunities
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-grow">
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your email address" 
                className="w-full px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pulse-500 text-gray-700" 
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="bg-pulse-500 hover:bg-pulse-600 text-white font-medium py-4 px-10 rounded-full transition-all duration-300 md:ml-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;