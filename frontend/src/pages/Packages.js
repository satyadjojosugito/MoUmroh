import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter } from 'lucide-react';
import PackageCard from '../components/PackageCard';
import { SAMPLE_PACKAGES } from '../data/packages';

export default function Packages() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 10000,
    days: 'all',
    rating: 0,
  });

  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const filteredPackages = useMemo(() => {
    return SAMPLE_PACKAGES.filter(pkg => {
      const matchesSearch = !searchQuery ||
        pkg.name.toLowerCase().includes(searchQuery) ||
        pkg.destination.toLowerCase().includes(searchQuery) ||
        pkg.description.toLowerCase().includes(searchQuery);

      const matchesPrice = pkg.price >= filters.minPrice && pkg.price <= filters.maxPrice;

      const matchesDays = filters.days === 'all' ||
        (filters.days === '7-10' && pkg.days >= 7 && pkg.days <= 10) ||
        (filters.days === '10-14' && pkg.days >= 10 && pkg.days <= 14) ||
        (filters.days === '14+' && pkg.days >= 14);

      const matchesRating = pkg.rating >= filters.rating;

      return matchesSearch && matchesPrice && matchesDays && matchesRating;
    });
  }, [searchQuery, filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="heading-2 mb-2">Umroh Packages</h1>
        <p className="text-gray-600 mb-8">
          {filteredPackages.length} packages found
          {searchQuery && ` for "${searchQuery}"`}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter size={20} />
                <h3 className="font-bold text-lg">Filters</h3>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <label className="font-semibold text-gray-900 block mb-3">Price Range</label>
                <div className="space-y-2">
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value)})}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>${filters.minPrice}</span>
                      <span>${filters.maxPrice}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Duration Filter */}
              <div className="mb-6">
                <label className="font-semibold text-gray-900 block mb-3">Duration</label>
                <select
                  value={filters.days}
                  onChange={(e) => setFilters({...filters, days: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                >
                  <option value="all">All Durations</option>
                  <option value="7-10">7-10 Days</option>
                  <option value="10-14">10-14 Days</option>
                  <option value="14+">14+ Days</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="font-semibold text-gray-900 block mb-3">Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters({...filters, rating: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                >
                  <option value="0">All Ratings</option>
                  <option value="4">4+ Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>

              <button
                onClick={() => setFilters({minPrice: 0, maxPrice: 10000, days: 'all', rating: 0})}
                className="w-full bg-gray-200 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Packages Grid */}
          <div className="lg:col-span-3">
            {filteredPackages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPackages.map(pkg => (
                  <PackageCard key={pkg.id} package={pkg} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg mb-4">No packages found matching your criteria.</p>
                <p className="text-gray-500">Try adjusting your filters or search query.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
