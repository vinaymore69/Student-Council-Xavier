import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Cookie, Settings, Info, Trash2, CheckSquare, XSquare } from 'lucide-react';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="pulse-chip mb-6">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">
                <Cookie className="w-3 h-3" />
              </span>
              <span>Legal</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Cookie Policy
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Last Updated: October 22, 2025
            </p>
            <p className="text-base text-gray-700">
              This Cookie Policy explains how Student Council Xavier uses cookies and similar technologies 
              on our website. By using our website, you consent to the use of cookies as described in this policy.
            </p>
          </div>
        </section>

        {/* Content Sections */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* What Are Cookies */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-pulse-100 flex items-center justify-center">
                  <Info className="w-6 h-6 text-pulse-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">What Are Cookies?</h2>
              </div>
              
              <div className="space-y-3 text-gray-700">
                <p>
                  Cookies are small text files that are placed on your device when you visit a website. 
                  They are widely used to make websites work more efficiently and provide information to 
                  website owners.
                </p>
                <p>
                  Cookies help us understand how you use our website, remember your preferences, and improve 
                  your overall experience.
                </p>
              </div>
            </div>

            {/* Types of Cookies */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                {/* Essential Cookies */}
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckSquare className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Essential Cookies</h3>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Required</span>
                  </div>
                  <p className="text-gray-700 mb-2">
                    These cookies are necessary for the website to function properly. They enable basic features 
                    like page navigation and access to secure areas.
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Examples:</strong> Session management, authentication, security
                  </p>
                </div>

                {/* Performance Cookies */}
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Performance Cookies</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Optional</span>
                  </div>
                  <p className="text-gray-700 mb-2">
                    These cookies collect information about how visitors use our website, such as which pages 
                    are visited most often and if users encounter errors.
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Examples:</strong> Google Analytics, page load times, error tracking
                  </p>
                </div>

                {/* Functional Cookies */}
                <div className="border-l-4 border-purple-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckSquare className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Functional Cookies</h3>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Optional</span>
                  </div>
                  <p className="text-gray-700 mb-2">
                    These cookies allow the website to remember choices you make and provide enhanced features.
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Examples:</strong> Language preferences, theme settings, newsletter subscriptions
                  </p>
                </div>

                {/* Targeting Cookies */}
                <div className="border-l-4 border-orange-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <XSquare className="w-5 h-5 text-orange-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Targeting/Advertising Cookies</h3>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">Not Used</span>
                  </div>
                  <p className="text-gray-700">
                    We do not currently use advertising or targeting cookies on our website.
                  </p>
                </div>
              </div>
            </div>

            {/* How We Use Cookies */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Cookies</h2>
              <div className="space-y-3 text-gray-700">
                <p>We use cookies for the following purposes:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Authentication:</strong> To remember your login status and keep you signed in</li>
                  <li><strong>Preferences:</strong> To remember your settings and preferences</li>
                  <li><strong>Analytics:</strong> To understand how visitors use our website and improve it</li>
                  <li><strong>Security:</strong> To protect against fraudulent activity and enhance security</li>
                  <li><strong>Performance:</strong> To monitor website performance and identify issues</li>
                </ul>
              </div>
            </div>

            {/* Third-Party Cookies */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Some cookies on our website are set by third-party services that appear on our pages:
                </p>
                <div className="space-y-4 mt-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold mb-1">Supabase</h3>
                    <p className="text-sm">Used for authentication and database services</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold mb-1">EmailJS</h3>
                    <p className="text-sm">Used for sending emails from contact forms</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold mb-1">Social Media Platforms</h3>
                    <p className="text-sm">May set cookies when you interact with embedded content</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Managing Cookies */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Settings className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Managing Cookies</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  You have the right to decide whether to accept or reject cookies. You can exercise your 
                  cookie preferences by:
                </p>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-2">Browser Settings</h3>
                  <p className="text-sm mb-2">Most web browsers allow you to control cookies through their settings:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
                    <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
                    <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                    <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-2">Cookie Consent Tool</h3>
                  <p className="text-sm">
                    When you first visit our website, you'll see a cookie consent banner where you can 
                    accept or reject optional cookies.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Blocking or deleting cookies may impact your experience on our 
                    website. Some features may not work properly without cookies enabled.
                  </p>
                </div>
              </div>
            </div>

            {/* Deleting Cookies */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Deleting Cookies</h2>
              </div>
              
              <div className="space-y-3 text-gray-700">
                <p>
                  You can delete cookies that are already stored on your device. The method varies depending 
                  on your browser:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Open your browser's settings or preferences</li>
                  <li>Look for the privacy or history section</li>
                  <li>Find the option to clear browsing data or cookies</li>
                  <li>Select the time range and types of data to delete</li>
                  <li>Confirm the deletion</li>
                </ul>
                <p className="mt-4">
                  For more detailed instructions, please refer to your browser's help documentation.
                </p>
              </div>
            </div>

            {/* Session Duration */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookie Duration</h2>
              <div className="space-y-3 text-gray-700">
                <p>Cookies may be:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Session cookies:</strong> Temporary cookies that are deleted when you close your browser
                  </li>
                  <li>
                    <strong>Persistent cookies:</strong> Cookies that remain on your device for a set period or 
                    until you delete them
                  </li>
                </ul>
                <p className="mt-4">
                  Most of our cookies are session cookies, but some functional and performance cookies may 
                  persist for up to 12 months.
                </p>
              </div>
            </div>

            {/* Changes to Cookie Policy */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this Cookie Policy from time to time to reflect changes in technology, legislation, 
                or our practices. We will notify you of any significant changes by posting the new policy on this 
                page with an updated date.
              </p>
            </div>

            {/* More Information */}
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">More Information</h2>
              <div className="space-y-3 text-gray-700">
                <p>For more information about cookies and online privacy, you can visit:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-pulse-500 hover:underline">AllAboutCookies.org</a></li>
                  <li><a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="text-pulse-500 hover:underline">YourOnlineChoices.com</a></li>
                  <li><a href="https://www.networkadvertising.org" target="_blank" rel="noopener noreferrer" className="text-pulse-500 hover:underline">Network Advertising Initiative</a></li>
                </ul>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-br from-pulse-500 to-pulse-600 rounded-2xl p-6 sm:p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have any questions about our use of cookies, please contact us:
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

export default CookiePolicy;