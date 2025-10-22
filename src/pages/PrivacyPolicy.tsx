import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Eye, Lock, UserCheck, Database, Bell } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="pulse-chip mb-6">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">
                <Shield className="w-3 h-3" />
              </span>
              <span>Legal</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Last Updated: October 22, 2025
            </p>
            <p className="text-base text-gray-600">
              At Student Council Xavier, we are committed to protecting your privacy and ensuring 
              the security of your personal information. This Privacy Policy explains how we collect, 
              use, and safeguard your data.
            </p>
          </div>
        </section>

        {/* Content Sections */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Information We Collect */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-pulse-100 flex items-center justify-center">
                  <Database className="w-6 h-6 text-pulse-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Name and email address (when you contact us or subscribe to our newsletter)</li>
                    <li>Student ID or Roll Number (when you apply for council membership)</li>
                    <li>Phone number (optional, for event updates)</li>
                    <li>Academic information (year, department)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Automatically Collected Information</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Browser type and version</li>
                    <li>Device information and IP address</li>
                    <li>Pages visited and time spent on our website</li>
                    <li>Referral source and navigation patterns</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
              </div>
              
              <div className="space-y-3 text-gray-700">
                <p>We use the collected information for the following purposes:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>To respond to your inquiries and provide customer support</li>
                  <li>To send event notifications and newsletter updates</li>
                  <li>To process membership applications</li>
                  <li>To improve our website and services</li>
                  <li>To analyze usage patterns and optimize user experience</li>
                  <li>To comply with legal obligations and prevent misuse</li>
                </ul>
              </div>
            </div>

            {/* Data Security */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
              </div>
              
              <div className="space-y-3 text-gray-700">
                <p>
                  We implement appropriate technical and organizational security measures to protect 
                  your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Secure SSL encryption for data transmission</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Secure database storage with Supabase</li>
                  <li>Staff training on data protection practices</li>
                </ul>
              </div>
            </div>

            {/* Your Rights */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
              </div>
              
              <div className="space-y-3 text-gray-700">
                <p>You have the following rights regarding your personal data:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Data Portability:</strong> Request your data in a portable format</li>
                </ul>
                <p className="mt-4">
                  To exercise any of these rights, please contact us at{" "}
                  <a href="mailto:studentcouncil@xavier.edu" className="text-pulse-500 hover:underline">
                    studentcouncil@xavier.edu
                  </a>
                </p>
              </div>
            </div>

            {/* Third-Party Services */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Third-Party Services</h2>
              </div>
              
              <div className="space-y-3 text-gray-700">
                <p>We use the following third-party services that may collect your information:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Supabase:</strong> Database and authentication services</li>
                  <li><strong>EmailJS:</strong> Email communication services</li>
                  <li><strong>Google Analytics:</strong> Website analytics (if applicable)</li>
                  <li><strong>Social Media Platforms:</strong> Instagram, LinkedIn, YouTube</li>
                </ul>
                <p className="mt-4">
                  These services have their own privacy policies, and we encourage you to review them.
                </p>
              </div>
            </div>

            {/* Children's Privacy */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
              <p className="text-gray-700">
                Our services are intended for college students aged 18 and above. We do not knowingly 
                collect personal information from individuals under 18. If you believe we have collected 
                such information, please contact us immediately.
              </p>
            </div>

            {/* Changes to Privacy Policy */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time to reflect changes in our practices 
                or legal requirements. We will notify you of any significant changes by posting the new 
                policy on this page with an updated "Last Updated" date. We encourage you to review this 
                policy periodically.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-pulse-500 to-pulse-600 rounded-2xl p-6 sm:p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
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

export default PrivacyPolicy;