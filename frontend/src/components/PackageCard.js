import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, Calendar } from 'lucide-react';

export default function PackageCard({ package: pkg }) {
  return (
    <Link to={`/packages/${pkg.id}`}>
      <div className="card overflow-hidden h-full hover:shadow-xl transition-all">
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img
            src={pkg.image}
            alt={pkg.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {pkg.days} Days
          </div>
        </div>
        <div className="p-6">
          <h3 className="heading-3 text-lg mb-2 line-clamp-2">{pkg.name}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.description}</p>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={i < pkg.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
              ))}
            </div>
            <span className="text-sm text-gray-600">({pkg.reviews})</span>
          </div>

          <div className="space-y-2 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{pkg.departure}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>{pkg.maxParticipants} Seats Available</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <p className="text-gray-600 text-sm">Starting from</p>
              <p className="text-2xl font-bold text-blue-600">
                ${pkg.price}
              </p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
