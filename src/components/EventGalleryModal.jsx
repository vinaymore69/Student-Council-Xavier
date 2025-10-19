import React, { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Download, Share2, ZoomIn } from "lucide-react";

const EventGalleryModal = ({ event, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % event.gallery.length);
    setIsZoomed(false);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + event.gallery.length) % event.gallery.length);
    setIsZoomed(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/98 animate-fade-in"
      onClick={onClose}
    >
      {/* Header Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex-1">
          <h2 className="text-lg sm:text-2xl font-display font-bold text-white mb-1">
            {event.title}
          </h2>
          <div className="flex items-center gap-3 text-white/70 text-sm">
            <span>{event.category} Event</span>
            <span>•</span>
            <span>{event.date}</span>
            <span>•</span>
            <span>{event.gallery.length} Photos</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(!isZoomed);
            }}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300"
          >
            <ZoomIn className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Main Image Area */}
      <div 
        className="h-full w-full flex items-center justify-center p-4 sm:p-20 pt-24 pb-32"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
          <img 
            src={event.gallery[selectedImage]} 
            alt={`${event.title} - Image ${selectedImage + 1}`}
            className={`
              max-w-full max-h-full object-contain rounded-2xl shadow-2xl transition-transform duration-300
              ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}
            `}
            onClick={() => setIsZoomed(!isZoomed)}
          />

          {/* Navigation Arrows */}
          {event.gallery.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:text-pulse-500 transition-colors" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:text-pulse-500 transition-colors" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bottom Thumbnail Grid - Improved Bento Style */}
      <div 
        className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/80 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Counter & Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium">
            {selectedImage + 1} / {event.gallery.length}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {event.gallery.map((img, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedImage(index);
                setIsZoomed(false);
              }}
              className={`
                relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden 
                transition-all duration-300
                ${selectedImage === index 
                  ? 'ring-4 ring-pulse-500 scale-110 shadow-lg' 
                  : 'ring-2 ring-white/30 opacity-60 hover:opacity-100 hover:scale-105'
                }
              `}
            >
              <img 
                src={img} 
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {selectedImage === index && (
                <div className="absolute inset-0 bg-pulse-500/20"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default EventGalleryModal;