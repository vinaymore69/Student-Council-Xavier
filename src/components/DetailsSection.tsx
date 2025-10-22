import React, { useState } from "react";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';

const DetailsSection = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    studentId: "",
    reason: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);

      // EmailJS Configuration (same as contact form)
      const serviceId = 'service_abb3y8s';
      const templateId = 'template_twg03ab';
      const publicKey = 'wdUryE-n6It7hgomx';

      // Format message
      const messageBody = `
Membership Request
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 APPLICANT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${formData.fullName}
Email: ${formData.email}
Student ID: ${formData.studentId || 'Not provided'}

💬 REASON FOR JOINING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${formData.reason || 'Not specified'}

📅 SUBMITTED AT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${new Date().toLocaleString('en-IN', {
  dateStyle: 'full',
  timeStyle: 'long',
  timeZone: 'Asia/Kolkata'
})}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Reply to this email to respond to the applicant
`;

      const templateParams = {
        to_email: 'your-admin-email@example.com', // Replace with actual admin email
        to_name: 'Student Council Admin',
        subject: `Membership Request from ${formData.fullName}`,
        message: messageBody.trim(),
        from_name: `${formData.fullName} (Membership Request)`,
        from_email: formData.email.trim(),
        reply_to: formData.email.trim()
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      toast.success("Request submitted successfully! We'll contact you soon.");

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        studentId: "",
        reason: ""
      });
    } catch (error: any) {
      console.error('Error submitting request:', error);
      toast.error("Failed to submit request. Please try again or contact us directly.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="details" className="w-full bg-white py-0">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
          {/* Left Card - What We Do */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant">
            {/* Card Header with background image */}
            <div 
              className="relative h-48 sm:h-64 p-6 sm:p-8 flex items-end" 
              style={{
                backgroundImage: "url('/background-section3.png')",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
              <h2 className="text-2xl sm:text-3xl font-display text-white font-bold relative z-10">
                What We Do
              </h2>
            </div>
            
            {/* Card Content */}
            <div 
              className="bg-white p-4 sm:p-8" 
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #ECECEC"
              }}
            >
              <h3 className="text-lg sm:text-xl font-display mb-6 sm:mb-8">
                Empowering students through action and representation
              </h3>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-pulse-500 flex items-center justify-center mt-1 flex-shrink-0">
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="p-3 rounded-lg bg-gray-50/80 backdrop-blur-sm border border-gray-100">
                      <span className="font-semibold text-base">Events:</span> 50+ annually including cultural, technical & sports
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-pulse-500 flex items-center justify-center mt-1 flex-shrink-0">
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="p-3 rounded-lg bg-gray-50/80 backdrop-blur-sm border border-gray-100">
                      <span className="font-semibold text-base">Representation:</span> Voice student concerns to administration
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-pulse-500 flex items-center justify-center mt-1 flex-shrink-0">
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="p-3 rounded-lg bg-gray-50/80 backdrop-blur-sm border border-gray-100">
                      <span className="font-semibold text-base">Support:</span> Help students navigate campus life
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-pulse-500 flex items-center justify-center mt-1 flex-shrink-0">
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="p-3 rounded-lg bg-gray-50/80 backdrop-blur-sm border border-gray-100">
                      <span className="font-semibold text-base">Community:</span> Build connections across all departments
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-pulse-500 flex items-center justify-center mt-1 flex-shrink-0">
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="p-3 rounded-lg bg-gray-50/80 backdrop-blur-sm border border-gray-100">
                      <span className="font-semibold text-base">Leadership:</span> Develop skills through hands-on experience
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card - Join Us Form */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-elegant">
            {/* Card Header with background image */}
            <div 
              className="relative h-48 sm:h-64 p-6 sm:p-8 flex flex-col items-start" 
              style={{
                backgroundImage: "url('/background-section1.png')",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
              <div className="inline-block px-4 sm:px-6 py-2 border border-white text-white rounded-full text-xs mb-4 relative z-10">
                Applications Open
              </div>
              <h2 className="text-2xl sm:text-3xl font-display text-white font-bold mt-auto relative z-10">
                Join the Council
              </h2>
            </div>
            
            {/* Card Content - Form */}
            <div 
              className="bg-white p-4 sm:p-8" 
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #ECECEC"
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <input 
                    type="text" 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleChange} 
                    placeholder="Full name *" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent" 
                    required 
                  />
                </div>
                
                <div>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="Email address *" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent" 
                    required 
                  />
                </div>
                
                <div>
                  <input 
                    type="text" 
                    name="studentId" 
                    value={formData.studentId} 
                    onChange={handleChange} 
                    placeholder="Student ID / Roll Number" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent" 
                  />
                </div>

                <div>
                  <textarea 
                    name="reason" 
                    value={formData.reason} 
                    onChange={handleChange} 
                    placeholder="Why do you want to join the Student Council?" 
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pulse-500 focus:border-transparent resize-none" 
                  />
                </div>
                
                <div>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-pulse-500 hover:bg-pulse-600 text-white font-medium rounded-full transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailsSection;