import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Users, Clock } from 'lucide-react';
import PackageCard from '../components/PackageCard';
import { SAMPLE_PACKAGES } from '../data/packages';

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const featuredPackages = SAMPLE_PACKAGES.slice(0, 6);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/packages?search=${searchQuery}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="heading-1 mb-4">Welcome to MoUmroh</h1>
            <p className="text-xl text-blue-100">
              Discover and book authentic umroh packages from trusted travel agencies
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-2 flex items-center gap-2">
              <Search className="text-gray-400 ml-2" size={20} />
              <input
                type="text"
                placeholder="Search packages, destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-gray-900 py-3 px-4"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="heading-2 text-center mb-12">Why Choose MoUmroh</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin size={32} />
              </div>
              <h3 className="heading-3 mb-2">Verified Agencies</h3>
              <p className="text-gray-600">All our partner agencies are thoroughly vetted and certified</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock size={32} />
              </div>
              <h3 className="heading-3 mb-2">Flexible Dates</h3>
              <p className="text-gray-600">Multiple departure dates throughout the year to suit your schedule</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users size={32} />
              </div>
              <h3 className="heading-3 mb-2">Best Prices</h3>
              <p className="text-gray-600">Compare packages and get the best value for your spiritual journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="heading-2 mb-4">Featured Packages</h2>
          <p className="text-gray-600 mb-12">Explore our popular umroh packages carefully curated for you</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPackages.map(pkg => (
              <PackageCard key={pkg.id} package={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-2 mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Browse all packages and find the perfect umroh experience for you
          </p>
          <button
            onClick={() => navigate('/packages')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition"
          >
            Explore All Packages
          </button>
        </div>
      </section>
    </div>
  );
}
