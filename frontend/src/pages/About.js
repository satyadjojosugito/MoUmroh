import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="heading-2 text-center mb-4">About MoUmroh</h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Your trusted partner in planning a meaningful umroh journey
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="heading-3 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              MoUmroh is dedicated to making umroh accessible and affordable for everyone. We believe that spiritual journeys should be stress-free, allowing pilgrims to focus on their devotion rather than logistics.
            </p>
            <p className="text-gray-700">
              Our mission is to connect pilgrims with trusted, verified travel agencies that offer transparent, quality umroh experiences at competitive prices.
            </p>
          </div>
          <div>
            <h2 className="heading-3 mb-4">Why Choose Us</h2>
            <ul className="space-y-3">
              {[
                'Verified and certified travel agencies',
                'Transparent pricing with no hidden fees',
                'Diverse package options for all budgets',
                'Expert customer support 24/7',
                'Money-back satisfaction guarantee',
                'Years of experience in umroh industry'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h2 className="heading-2 mb-8 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl">
                💼
              </div>
              <h3 className="heading-3 mb-2">Professionalism</h3>
              <p className="text-gray-600">We maintain the highest standards of service and integrity</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl">
                🤝
              </div>
              <h3 className="heading-3 mb-2">Transparency</h3>
              <p className="text-gray-600">Clear communication and honest pricing in all dealings</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl">
                ❤️
              </div>
              <h3 className="heading-3 mb-2">Care</h3>
              <p className="text-gray-600">We genuinely care about your spiritual journey</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 text-center">
          <h2 className="heading-2 mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-blue-100 mb-6">
            Join thousands of pilgrims who have trusted MoUmroh for their umroh experience
          </p>
          <a href="/packages" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition">
            Browse Packages
          </a>
        </div>
      </div>
    </div>
  );
}
