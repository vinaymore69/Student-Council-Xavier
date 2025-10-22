import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FileText, CheckCircle, AlertTriangle, Scale, Users, Ban } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="pulse-chip mb-6">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">
                <FileText className="w-3 h-3" />
              </span>
              <span>Legal</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Last Updated: October 22, 2025
            </p>
            <p className="text-base text-gray-600">
              Please read these Terms of Service carefully before using the Student Council Xavier website 
              and services. By accessing or using our services, you agree to be bound by these terms.
            </p>
          </div>
        </section>

        {/* Content Sections */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Acceptance of Terms */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-pulse-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-pulse-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
              </div>
              
              <div className="space-y-3 text-gray-700">
                <p>
                  By accessing and using this website, you accept and agree to be bound by the terms and 
                  provisions of this agreement. If you do not agree to these terms, please do not use our website.
                </p>
                <p>
                  These terms apply to all visitors, users, and others who access or use the Student Council 
                  Xavier website and services.
                </p>
              </div>
            </div>

            {/* Use of Services */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Use of Services</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Permitted Use</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Access event information and schedules</li>
                    <li>Register for events and activities</li>
                    <li>Subscribe to newsletters and updates</li>
                    <li>Contact the Student Council</li>
                    <li>Apply for council membership</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">User Responsibilities</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide accurate and truthful information</li>
                    <li>Maintain the confidentiality of your account credentials</li>
                    <li>Use the website in compliance with all applicable laws</li>
                    <li>Respect the rights and privacy of other users</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Prohibited Activities */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Ban className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Prohibited Activities</h2>
              </div>
              
              <div className="space-y-3 text-gray-700">
                <p>You agree NOT to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Use the website for any illegal or unauthorized purpose</li>
                  <li>Transmit any viruses, malware, or harmful code</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Impersonate any person or entity</li>
                  <li>Collect or store personal data of other users</li>
                  <li>Interfere with the proper functioning of the website</li>
                  <li>Use automated systems to access the website without permission</li>
                </ul>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Scale className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Intellectual Property</h2>
              </div>
              
              <div className="space-y-3 text-gray-700">
                <p>
                  All content on this website, including but not limited to text, graphics, logos, images, 
                  videos, and software, is the property of Student Council Xavier or its content suppliers 
                  and is protected by copyright, trademark, and other intellectual property laws.
                </p>
                <p>
                  You may not reproduce, distribute, modify, or create derivative works from any content 
                  on this website without our express written permission.
                </p>
                <p>
                  "Student Council Xavier," "Xavier Institute of Engineering," and related logos are 
                  trademarks of Xavier Institute of Engineering.
                </p>
              </div>
            </div>

            {/* User Content */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">User-Generated Content</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  By submitting content (such as feedback, suggestions, or applications), you grant us a 
                  non-exclusive, royalty-free, perpetual license to use, reproduce, and display such content 
                  for the purpose of operating and improving our services.
                </p>
                <p>
                  You represent and warrant that you own or have the necessary rights to the content you submit.
                </p>
              </div>
            </div>

            {/* Events and Registrations */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Events and Registrations</h2>
              <div className="space-y-3 text-gray-700">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Event details and schedules are subject to change</li>
                  <li>Registration does not guarantee participation; confirmations will be sent separately</li>
                  <li>The Student Council reserves the right to cancel or modify events</li>
                  <li>Participants must follow event rules and code of conduct</li>
                  <li>The Student Council is not liable for personal injuries or losses during events</li>
                </ul>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Disclaimer</h2>
              </div>
              
              <div className="space-y-3 text-gray-700">
                <p>
                  This website and services are provided "as is" without any warranties, express or implied. 
                  Student Council Xavier does not warrant that:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>The website will be uninterrupted or error-free</li>
                  <li>Defects will be corrected</li>
                  <li>The website is free of viruses or harmful components</li>
                  <li>Information on the website is accurate or complete</li>
                </ul>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  To the maximum extent permitted by law, Student Council Xavier shall not be liable for any 
                  indirect, incidental, special, consequential, or punitive damages resulting from:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Your use or inability to use the website</li>
                  <li>Unauthorized access to your data</li>
                  <li>Errors or omissions in the content</li>
                  <li>Any other matter relating to the services</li>
                </ul>
              </div>
            </div>

            {/* Modifications */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Modifications to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify or replace these Terms of Service at any time. Material changes 
                will be notified by posting the new terms on this page with an updated date. Your continued use 
                of the website after changes constitutes acceptance of the new terms.
              </p>
            </div>

            {/* Termination */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
              <p className="text-gray-700">
                We may terminate or suspend your access to the website immediately, without prior notice or 
                liability, for any reason, including breach of these Terms. Upon termination, your right to 
                use the website will cease immediately.
              </p>
            </div>

            {/* Governing Law */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
              <p className="text-gray-700">
                These Terms shall be governed by and construed in accordance with the laws of India, without 
                regard to its conflict of law provisions. Any disputes shall be subject to the exclusive 
                jurisdiction of the courts in Mumbai, Maharashtra.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-pulse-500 to-pulse-600 rounded-2xl p-6 sm:p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> studentcouncil@xavier.edu</p>
                <p><strong>Phone:</strong> +91 123 456 7890</p>
                <p><strong>Address:</strong> Room 101, Building A, Xavier Institute of Engineering, Mahim, Mumbai - 400016</p>
              </div>
            </div>

          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;