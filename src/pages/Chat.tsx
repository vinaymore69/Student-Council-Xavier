import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MessageSquare, Sparkles, Calendar, Bell } from 'lucide-react';

const Chat = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        {/* Coming Soon Hero */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-block mb-6">
            <div className="pulse-chip">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground mr-2">
                <Sparkles className="w-3 h-3" />
              </span>
              <span>Coming Soon</span>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI Chat Assistant
          </h1>
          
          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Your intelligent companion for instant answers about events, council activities, 
            and campus life. Powered by advanced AI technology.
          </p>

          <div className="inline-block px-6 py-3 bg-primary/10 text-primary rounded-full font-semibold text-lg">
            <Calendar className="w-5 h-5 inline-block mr-2" />
            Launching Soon
          </div>
        </div>

        {/* Preview Card */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border">
            {/* Blurred Preview */}
            <div className="bg-card p-8 filter blur-sm">
              <div className="space-y-4">
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl px-6 py-3 max-w-[70%]">
                    <p className="text-muted-foreground">Hello! How can I help you today?</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-primary rounded-2xl px-6 py-3 max-w-[70%]">
                    <p className="text-primary-foreground">When is the next event?</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl px-6 py-3 max-w-[70%]">
                    <p className="text-muted-foreground">The next event is Spandan 2025...</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <MessageSquare className="w-12 h-12 text-primary-foreground" />
                </div>
                <h3 className="text-3xl font-bold mb-2">Under Development</h3>
                <p className="text-muted-foreground">We're building something amazing for you</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">What to Expect</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Answers</h3>
              <p className="text-muted-foreground">
                Get immediate responses to your questions about events, registrations, and council activities.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Event Information</h3>
              <p className="text-muted-foreground">
                Ask about upcoming events, schedules, venues, and registration deadlines anytime.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Notifications</h3>
              <p className="text-muted-foreground">
                Receive personalized updates and reminders based on your interests and preferences.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Document Help</h3>
              <p className="text-muted-foreground">
                Upload and analyze documents, guidelines, or forms with AI assistance.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Voice Commands</h3>
              <p className="text-muted-foreground">
                Use voice input for hands-free interaction and quick queries on the go.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Experience</h3>
              <p className="text-muted-foreground">
                AI learns your preferences to provide tailored recommendations and suggestions.
              </p>
            </div>
          </div>
        </div>

        {/* Notify Me Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-8 sm:p-12 text-center text-primary-foreground shadow-2xl">
            <Bell className="w-16 h-16 mx-auto mb-6 animate-bounce" />
            <h2 className="text-3xl font-bold mb-4">Be the First to Know</h2>
            <p className="text-lg mb-8 opacity-90">
              Get notified when our AI Chat Assistant goes live. Sign up for early access!
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you! We\'ll notify you when the AI Chat Assistant launches.');
            }}>
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-3 rounded-full text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-background text-foreground rounded-full font-semibold hover:bg-background/90 transition-colors whitespace-nowrap"
              >
                Notify Me
              </button>
            </form>

            <p className="text-sm opacity-80 mt-4">
              Join 500+ students already on the waitlist
            </p>
          </div>
        </div>

        {/* Development Timeline */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Development Roadmap</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Phase 1: Design</h3>
              <p className="text-sm text-muted-foreground">UI/UX and architecture planning</p>
              <div className="mt-2 text-xs text-primary font-semibold">Completed ✓</div>
            </div>

            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Phase 2: Development</h3>
              <p className="text-sm text-muted-foreground">AI integration and testing</p>
              <div className="mt-2 text-xs text-primary font-semibold">In Progress...</div>
            </div>

            <div className="relative opacity-50">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Phase 3: Launch</h3>
              <p className="text-sm text-muted-foreground">Public release and rollout</p>
              <div className="mt-2 text-xs text-muted-foreground font-semibold">Coming Soon</div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Chat;