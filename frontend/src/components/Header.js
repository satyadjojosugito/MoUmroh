import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold">
              MoUmroh
            </div>
            <span className="hidden sm:inline text-gray-700 font-semibold">Umroh Marketplace</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex gap-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition">Home</Link>
            <Link to="/packages" className="text-gray-700 hover:text-blue-600 font-medium transition">Packages</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium transition">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition">Contact</Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            <Link to="/" className="block py-2 px-4 text-gray-700 hover:bg-blue-50 rounded">Home</Link>
            <Link to="/packages" className="block py-2 px-4 text-gray-700 hover:bg-blue-50 rounded">Packages</Link>
            <Link to="/about" className="block py-2 px-4 text-gray-700 hover:bg-blue-50 rounded">About</Link>
            <Link to="/contact" className="block py-2 px-4 text-gray-700 hover:bg-blue-50 rounded">Contact</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
