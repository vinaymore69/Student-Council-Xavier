import React, { useState, useRef } from "react";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';

const ContactForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    from_name: "",
    from_email: "",
    phone: "",
    subject: "",
    message: "",
    category: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!formData.from_name || !formData.from_email || !formData.message) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.from_email)) {
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // Message length validation
    if (formData.message.length < 10) {
      toast.error("Message must be at least 10 characters long");
      setIsLoading(false);
      return;
    }

    try {
      // EmailJS Configuration
      const serviceId = 'service_abb3y8s';
      const templateId = 'template_twg03ab';
      const publicKey = 'wdUryE-n6It7hgomx';

      // Format message body to match template structure
      const messageBody = `
Contact Form Submission
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 CONTACT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${formData.from_name}
Email: ${formData.from_email}
Phone: ${formData.phone || 'Not provided'}
Category: ${formData.category || 'General Inquiry'}

📅 SUBMITTED AT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${new Date().toLocaleString('en-IN', {
  dateStyle: 'full',
  timeStyle: 'long',
  timeZone: 'Asia/Kolkata'
})}

💬 MESSAGE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Reply to this email to respond directly to ${formData.from_name}
`;

      // Prepare template parameters matching your existing template
      const templateParams = {
        to_email: 'student.council.xavier.tech.nova@gmail.com', // ← REPLACE WITH YOUR ACTUAL ADMIN EMAIL
        to_name: 'Student Council Admin',
        subject: formData.subject.trim() || `New Contact Form: ${formData.category || 'General Inquiry'}`,
        message: messageBody.trim(),
        from_name: `${formData.from_name} (via Contact Form)`,
        from_email: formData.from_email.trim(),
        reply_to: formData.from_email.trim()
      };

      console.log('Sending email with params:', templateParams);

      // Send email using EmailJS
      const response = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      console.log('EmailJS Response:', response);

      // Success
      toast.success("Message sent successfully! We'll get back to you within 24 hours.");
      
      // Reset form
      setFormData({
        from_name: "",
        from_email: "",
        phone: "",
        subject: "",
        message: "",
        category: ""
      });

      if (formRef.current) {
        formRef.current.reset();
      }

    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // More specific error messages
      if (error.status === 422) {
        if (error.text.includes('recipients address')) {
          toast.error("Email configuration error. Please contact the administrator.");
          console.error('Missing recipient email in template');
        } else {
          toast.error("Template configuration error. Please contact the administrator.");
        }
        console.error('EmailJS 422 Error:', error);
      } else if (error.status === 400) {
        toast.error("Invalid request. Please check your input.");
      } else if (error.text) {
        toast.error(`Failed to send: ${error.text}`);
      } else {
        toast.error("Failed to send message. Please try again or contact us directly.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full py-8 sm:py-12 bg-white" id="contact-form">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Header with badge and line */}
        <div className="flex items-center gap-4 mb-8 sm:mb-12">
          <div className="pulse-chip">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">02</span>
            <span>Get in Touch</span>
          </div>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant">
            {/* Card Header with background image */}
            <div 
              className="relative h-48 sm:h-64 p-6 sm:p-8 flex flex-col justify-end"
              style={{
                backgroundImage: "url('/background-section1.png')",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-pulse-900/40 to-dark-900/80"></div>
              <div className="relative z-10">
                <div className="inline-block px-4 sm:px-6 py-2 border border-white text-white rounded-full text-xs mb-4">
                  We typically respond within 24 hours
                </div>
                <h2 className="text-2xl sm:text-3xl font-display text-white font-bold">
                  Send us a message
                </h2>
              </div>
            </div>
            
            {/* Form Content */}
            <div className="bg-white p-6 sm:p-8 md:p-10" style={{ border: "1px solid #ECECEC" }}>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-pulse-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="from_name" 
                      value={formData.from_name} 
                      onChange={handleChange} 
                      placeholder="John Doe" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent transition-all"
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-pulse-500">*</span>
                    </label>
                    <input 
                      type="email" 
                      name="from_email" 
                      value={formData.from_email} 
                      onChange={handleChange} 
                      placeholder="john@example.com" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent transition-all"
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      placeholder="+91 1234567890" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input 
                      type="text" 
                      name="subject" 
                      value={formData.subject} 
                      onChange={handleChange} 
                      placeholder="What is this regarding?" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">Select a category</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Event Related">Event Related</option>
                    <option value="Membership">Membership / Join Council</option>
                    <option value="Suggestion">Suggestion</option>
                    <option value="Complaint">Complaint / Issue</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message <span className="text-pulse-500">*</span>
                  </label>
                  <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    placeholder="Tell us more about your inquiry..." 
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent transition-all resize-none"
                    required 
                    minLength={10}
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
                </div>
                
                <div>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full px-8 py-4 bg-pulse-500 hover:bg-pulse-600 text-white font-semibold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  By submitting this form, you agree to our privacy policy and terms of service.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;