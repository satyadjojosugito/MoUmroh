import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Users, Calendar, CheckCircle, MapPin, Utensils } from 'lucide-react';
import { SAMPLE_PACKAGES } from '../data/packages';

export default function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pkg = SAMPLE_PACKAGES.find(p => p.id === parseInt(id));

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="heading-2 mb-4">Package Not Found</h2>
          <button
            onClick={() => navigate('/packages')}
            className="btn-primary"
          >
            Back to Packages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/packages')}
          className="text-blue-600 font-semibold mb-8 hover:text-blue-700"
        >
          ← Back to Packages
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image */}
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={pkg.image}
                alt={pkg.name}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="heading-1 mb-2">{pkg.name}</h1>
                  <p className="text-xl text-gray-600 flex items-center gap-2">
                    <MapPin size={20} />
                    {pkg.destination}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className={i < pkg.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                  ))}
                  <span className="text-gray-600">({pkg.reviews} reviews)</span>
                </div>
              </div>

              <p className="text-gray-700 text-lg mb-6">{pkg.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-blue-600" />
                  <div>
                    <p className="text-gray-600 text-sm">Duration</p>
                    <p className="font-semibold">{pkg.days} Days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-blue-600" />
                  <div>
                    <p className="text-gray-600 text-sm">Available Seats</p>
                    <p className="font-semibold">{pkg.maxParticipants}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Itinerary */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="heading-2 mb-6">Itinerary</h2>
              <div className="space-y-4">
                {pkg.itinerary.map((day, idx) => (
                  <div key={idx} className="pb-4 border-b last:border-b-0">
                    <h3 className="font-bold text-blue-600 mb-2">Day {day.day}: {day.title}</h3>
                    <p className="text-gray-700">{day.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="heading-2 mb-6">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pkg.inclusions.map((inclusion, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{inclusion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-8 sticky top-24">
              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-2">Price per person</p>
                <p className="heading-1 text-blue-600">${pkg.price}</p>
              </div>

              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Departure</p>
                <p className="font-semibold text-gray-900">{pkg.departure}</p>
              </div>

              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Agency</p>
                <p className="font-semibold text-gray-900">{pkg.agency}</p>
              </div>

              <button className="w-full btn-primary mb-4">
                Book Now
              </button>

              <button className="w-full btn-secondary">
                Contact Agency
              </button>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">✓ Verified Agency</p>
                <p className="text-xs text-gray-600 mb-2">✓ Money Back Guarantee</p>
                <p className="text-xs text-gray-600">✓ 24/7 Customer Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
