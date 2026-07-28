import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">MoUmroh</h3>
            <p className="text-gray-400">Your trusted marketplace for authentic umroh packages</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/packages" className="hover:text-white">All Packages</a></li>
              <li><a href="/about" className="hover:text-white">About Us</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2"><Phone size={16} /> +62 800-UMROH</li>
              <li className="flex items-center gap-2"><Mail size={16} /> info@moumroh.com</li>
              <li className="flex items-center gap-2"><MapPin size={16} /> Jakarta, Indonesia</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">Get special offers and updates</p>
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-500 text-sm"
            />
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} MoUmroh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
