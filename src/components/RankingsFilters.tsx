import React from "react";
import { ChevronDown } from "lucide-react";

interface RankingsFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  availableYears: number[];
}

const RankingsFilters: React.FC<RankingsFiltersProps> = ({ 
  selectedCategory, 
  setSelectedCategory, 
  selectedYear, 
  setSelectedYear,
  availableYears 
}) => {
  const categories = [
    { id: 'all', name: 'All Categories', icon: '🏆', color: 'bg-gray-500' },
    { id: 'Cultural', name: 'Cultural', icon: '🎭', color: 'bg-purple-500' },
    { id: 'Technical', name: 'Technical', icon: '⚙️', color: 'bg-blue-500' },
    { id: 'Sports', name: 'Sports', icon: '⚽', color: 'bg-green-500' }
  ];

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);
  const years = availableYears.length > 0 ? availableYears : [new Date().getFullYear()];

  return (
    <section className="w-full py-4 bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200 shadow-sm" id="filters">
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
              {selectedCategoryData?.name} • {selectedYear === 'all' ? 'All Years' : selectedYear}
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
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full lg:w-32 appearance-none px-4 py-2.5 pr-10 rounded-full border-2 border-gray-200 bg-white hover:border-pulse-300 focus:border-pulse-500 focus:outline-none transition-all duration-300 font-medium text-sm cursor-pointer"
              >
                <option value="all">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year.toString()}>
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

export default RankingsFilters;