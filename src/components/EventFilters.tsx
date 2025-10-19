import React, { useState, useEffect, useRef } from "react";
import { Calendar, Sparkles, ChevronDown } from "lucide-react";

const EventFilters = ({ selectedCategory, setSelectedCategory, selectedYear, setSelectedYear }) => {
  const [years] = useState([2025, 2024, 2023, 2022, 2021]);
  const [isOpen, setIsOpen] = useState(false);
  const sectionRef = useRef(null);
  
  const categories = [
    { id: 'all', name: 'All Events', icon: '🎯', color: 'bg-gray-500' },
    { id: 'cultural', name: 'Cultural', icon: '🎭', color: 'bg-purple-500' },
    { id: 'technical', name: 'Technical', icon: '⚙️', color: 'bg-blue-500' },
    { id: 'sports', name: 'Sports', icon: '⚽', color: 'bg-green-500' }
  ];

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  return (
    <section 
      ref={sectionRef} 
      className="w-full py-4 bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200 shadow-sm" 
      id="filters"
    >
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Left: Pulse Chip & Title */}
          <div className="flex items-center gap-4">
            <div className="pulse-chip">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">02</span>
              <span>Filters</span>
            </div>
            <div className="hidden md:block h-6 w-px bg-gray-300"></div>
            <h3 className="hidden md:block text-sm font-medium text-gray-600">
              {selectedCategoryData?.name} • {selectedYear}
            </h3>
          </div>

          {/* Right: Filter Controls */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            
            {/* Category Dropdown */}
            <div className="relative flex-1 lg:flex-initial">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full lg:w-48 appearance-none px-4 py-2.5 pr-10 rounded-full border-2 border-gray-200 bg-white hover:border-pulse-300 focus:border-pulse-500 focus:outline-none transition-all duration-300 font-medium text-sm cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Year Dropdown */}
            <div className="relative flex-1 lg:flex-initial">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full lg:w-32 appearance-none px-4 py-2.5 pr-10 rounded-full border-2 border-gray-200 bg-white hover:border-pulse-300 focus:border-pulse-500 focus:outline-none transition-all duration-300 font-medium text-sm cursor-pointer"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Quick Filter Badges - Desktop Only */}
            <div className="hidden xl:flex items-center gap-2">
              {categories.slice(1).map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300
                    ${selectedCategory === category.id 
                      ? `${category.color} text-white shadow-lg scale-105` 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {category.icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventFilters;