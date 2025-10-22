import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GalleryHero from '@/components/GalleryHero';
import EventFilters from '@/components/EventFilters';
import EventsList from '@/components/EventsList';
import EventGalleryModal from '@/components/EventGalleryModal';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

interface EventData {
  id: string;
  event_name: string;
  event_type: string;
  event_category_name: string;
  description: string;
  banner_image_url: string;
  date_time: string;
  duration: string;
  venue: string;
  year: number;
  status: string;
  socials: any;
  contact_details: any;
  participants?: string;
}

interface GalleryImage {
  id: string;
  image_url: string;
  sub_event_name: string;
  caption: string;
}

interface ProcessedEvent {
  id: string;
  title: string;
  category: string;
  categoryIcon: string;
  description: string;
  date: string;
  time: string;
  location: string;
  participants: string;
  status: 'active' | 'upcoming' | 'completed';
  year: number;
  image: string;
  gallery: string[];
  socials: any;
  contact_details: any;
}

const Gallery = () => {
  const currentYear = new Date().getFullYear();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedEvent, setSelectedEvent] = useState<ProcessedEvent | null>(null);
  const [events, setEvents] = useState<ProcessedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events and their gallery images
  useEffect(() => {
    fetchEventsWithGallery();
  }, []);

  const fetchEventsWithGallery = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('date_time', { ascending: false });

      if (eventsError) throw eventsError;

      if (!eventsData || eventsData.length === 0) {
        setEvents([]);
        setLoading(false);
        return;
      }

      // Fetch gallery images for all events
      const processedEvents = await Promise.all(
        eventsData.map(async (event: EventData) => {
          // Fetch gallery images for this event
          const { data: galleryData } = await supabase
            .from('event_gallery')
            .select('image_url, sub_event_name, caption')
            .eq('event_id', event.id)
            .order('uploaded_at', { ascending: false });

          // Fetch winners count for participants
          const { count: winnersCount } = await supabase
            .from('event_winners')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', event.id);

          const gallery = galleryData ? galleryData.map((img: GalleryImage) => img.image_url) : [];
          
          // Add banner as first image if gallery is empty
          if (gallery.length === 0 && event.banner_image_url) {
            gallery.push(event.banner_image_url);
          }

          return processEvent(event, gallery, winnersCount || 0);
        })
      );

      setEvents(processedEvents);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const processEvent = (event: EventData, gallery: string[], winnersCount: number): ProcessedEvent => {
    const categoryIcons: { [key: string]: string } = {
      'Cultural': '🎭',
      'Technical': '⚙️',
      'Sports': '⚽',
      'default': '🎯'
    };

    const formatDate = (dateString: string) => {
      if (!dateString) return 'Date TBA';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const formatTime = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const determineStatus = (status: string, dateTime: string): 'active' | 'upcoming' | 'completed' => {
      if (status === 'ongoing') return 'active';
      if (status === 'upcoming') return 'upcoming';
      if (status === 'completed') return 'completed';
      
      // Fallback: check date if status is not clear
      if (dateTime) {
        const eventDate = new Date(dateTime);
        const now = new Date();
        if (eventDate > now) return 'upcoming';
        return 'completed';
      }
      
      return 'upcoming';
    };

    return {
      id: event.id,
      title: event.event_name,
      category: event.event_type,
      categoryIcon: categoryIcons[event.event_type] || categoryIcons.default,
      description: event.description || 'Join us for an amazing event!',
      date: formatDate(event.date_time),
      time: formatTime(event.date_time),
      location: event.venue || 'Venue TBA',
      participants: winnersCount > 0 ? `${winnersCount}+ Winners` : '100+ Participants',
      status: determineStatus(event.status, event.date_time),
      year: event.year,
      image: event.banner_image_url || '/placeholder-event.jpg',
      gallery: gallery.length > 0 ? gallery : [event.banner_image_url || '/placeholder-event.jpg'],
      socials: event.socials,
      contact_details: event.contact_details
    };
  };

  // Initialize intersection observer for scroll animations
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
    
    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));
    
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [events]);

  const handleEventClick = (event: ProcessedEvent) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading events gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Events</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchEventsWithGallery}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="space-y-0">
        <GalleryHero />
        <EventFilters 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          availableYears={Array.from(new Set(events.map(e => e.year))).sort((a, b) => b - a)}
        />
        <EventsList 
          events={events}
          selectedCategory={selectedCategory}
          selectedYear={selectedYear}
          onEventClick={handleEventClick}
        />
      </main>
      
      <Footer />

      {/* Event Gallery Modal */}
      {selectedEvent && (
        <EventGalleryModal 
          event={selectedEvent}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Gallery;