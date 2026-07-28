const packages = [
  {
    id: 1,
    name: "Premium 10-Day Umroh",
    destination: "Mecca & Medina",
    description: "Experience a comprehensive umroh journey with 5-star accommodations and expert guidance",
    price: 2499,
    days: 10,
    rating: 5,
    reviews: 248,
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&h=300&fit=crop",
    maxParticipants: 8,
    departure: "March 15, 2026",
    agency: "Divine Travels",
    itinerary: [
      {
        day: 1,
        title: "Departure & Arrival",
        description: "Depart from Jakarta, arrive in Jeddah. Transfer to Mecca hotel. Evening Umroh."
      },
      {
        day: 2,
        title: "Mecca Exploration",
        description: "Visit holy sites around Mecca. Pray at Kaaba and Masjidil Haram."
      },
      {
        day: 3,
        title: "Mecca Sightseeing",
        description: "Full day in Mecca for worship and spiritual reflection."
      },
      {
        day: "4-5",
        title: "Medina Travel",
        description: "Travel to Medina. Visit Masjidil Nabawi and surrounding holy sites."
      },
      {
        day: "6-8",
        title: "Medina Exploration",
        description: "Multi-day exploration of Medina's spiritual landmarks."
      },
      {
        day: 9,
        title: "Return to Mecca",
        description: "Travel back to Mecca for final prayers and shopping."
      },
      {
        day: 10,
        title: "Departure",
        description: "Return flight to Jakarta."
      }
    ],
    inclusions: [
      "Round-trip flights from Jakarta",
      "5-star hotel accommodations",
      "All meals (breakfast, lunch, dinner)",
      "Professional guide throughout journey",
      "Transportation and transfers",
      "Umroh visa assistance",
      "Travel insurance"
    ]
  },
  {
    id: 2,
    name: "Budget-Friendly 8-Day Umroh",
    destination: "Mecca & Medina",
    description: "Affordable umroh package without compromising on spiritual experience",
    price: 1299,
    days: 8,
    rating: 4,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1577804521666-cd51b37f3220?w=500&h=300&fit=crop",
    maxParticipants: 20,
    departure: "April 5, 2026",
    agency: "Pilgrims Way",
    itinerary: [
      {
        day: 1,
        title: "Journey Begins",
        description: "Depart Jakarta, arrive Jeddah. Evening check-in in Mecca."
      },
      {
        day: "2-3",
        title: "Mecca Days",
        description: "Full Umroh rituals and Tawaf around the Kaaba."
      },
      {
        day: "4-5",
        title: "Medina Visit",
        description: "Travel to Medina, visit Prophet's Mosque."
      },
      {
        day: "6-7",
        title: "Return to Mecca",
        description: "Back to Mecca for additional prayers and personal reflection."
      },
      {
        day: 8,
        title: "Homebound",
        description: "Final day in Mecca, return to Jakarta."
      }
    ],
    inclusions: [
      "Round-trip flights",
      "3-4 star hotel accommodations",
      "Daily breakfast and dinner",
      "Guide services",
      "Ground transportation",
      "Visa processing help"
    ]
  },
  {
    id: 3,
    name: "Luxury 14-Day Journey",
    destination: "Mecca, Medina & Cairo",
    description: "Extended umroh with luxury accommodations and Cairo sightseeing",
    price: 3999,
    days: 14,
    rating: 5,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1504681869696-d977211a6ce1?w=500&h=300&fit=crop",
    maxParticipants: 6,
    departure: "May 10, 2026",
    agency: "Premium Pilgrimage",
    itinerary: [
      {
        day: "1-2",
        title: "Cairo Introduction",
        description: "Arrive Cairo, explore pyramids and Egyptian museums."
      },
      {
        day: 3,
        title: "Cairo to Jeddah",
        description: "Fly to Jeddah, proceed to Mecca."
      },
      {
        day: "4-6",
        title: "Mecca Rituals",
        description: "Complete Umroh rituals with ample time for personal worship."
      },
      {
        day: "7-10",
        title: "Medina Spirituality",
        description: "Extended stay in Medina, visit all significant Islamic sites."
      },
      {
        day: "11-13",
        title: "Mecca Finale",
        description: "Return to Mecca for additional prayers and Tawaf."
      },
      {
        day: 14,
        title: "Departure",
        description: "Return flight to Jakarta via Cairo."
      }
    ],
    inclusions: [
      "Round-trip flights including Cairo",
      "5-star hotel accommodations throughout",
      "All meals with premium options",
      "Expert English-speaking guide",
      "Private transportation",
      "Cairo tour included",
      "Travel insurance and visa"
    ]
  },
  {
    id: 4,
    name: "Family-Friendly 12-Day Package",
    destination: "Mecca & Medina",
    description: "Perfect for families with children, includes special activities and accommodations",
    price: 2899,
    days: 12,
    rating: 5,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1488747807830-63789f68bb65?w=500&h=300&fit=crop",
    maxParticipants: 12,
    departure: "June 20, 2026",
    agency: "Family Umroh Tours",
    itinerary: [
      {
        day: 1,
        title: "Arrival",
        description: "Land in Jeddah, settle into family-friendly accommodation."
      },
      {
        day: "2-4",
        title: "Mecca Adventures",
        description: "Family-paced Umroh with kid-friendly activities and rest periods."
      },
      {
        day: "5-8",
        title: "Medina Discovery",
        description: "Explore Medina with special children's programs and shopping time."
      },
      {
        day: "9-11",
        title: "Mecca Return",
        description: "Additional Umroh opportunities and family bonding time."
      },
      {
        day: 12,
        title: "Homeward",
        description: "Return to Jakarta with lasting spiritual memories."
      }
    ],
    inclusions: [
      "Family suite accommodations",
      "Round-trip flights",
      "Child-friendly meal plans",
      "Family guide with children experience",
      "Kids' entertainment activities",
      "Shopping mall access",
      "Family-focused itinerary"
    ]
  },
  {
    id: 5,
    name: "Senior Citizens Special 7-Day",
    destination: "Mecca & Medina",
    description: "Designed for comfort and ease, ideal for older pilgrims",
    price: 1599,
    days: 7,
    rating: 5,
    reviews: 214,
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&h=300&fit=crop",
    maxParticipants: 10,
    departure: "July 8, 2026",
    agency: "Golden Years Pilgrimage",
    itinerary: [
      {
        day: 1,
        title: "Easy Arrival",
        description: "Arrive in Jeddah, comfortable transfer to Mecca near Haram."
      },
      {
        day: "2-3",
        title: "Mecca at Leisure",
        description: "Umroh rituals with rest periods, private areas for comfort."
      },
      {
        day: "4-5",
        title: "Medina Pilgrimage",
        description: "Short journey to Medina with wheelchair-accessible areas."
      },
      {
        day: 6,
        title: "Relaxation",
        description: "Free time for personal prayers and reflection."
      },
      {
        day: 7,
        title: "Safe Return",
        description: "Return flight to Jakarta."
      }
    ],
    inclusions: [
      "Close proximity hotel to Haram",
      "Round-trip flights",
      "Senior-friendly meals",
      "Personal health attendant",
      "Wheelchair access",
      "Frequent rest periods",
      "Doctor on call"
    ]
  },
  {
    id: 6,
    name: "Group Discount 11-Day Umroh",
    destination: "Mecca & Medina",
    description: "Special group rates available for 10+ people",
    price: 1899,
    days: 11,
    rating: 4,
    reviews: 127,
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=300&fit=crop",
    maxParticipants: 30,
    departure: "August 22, 2026",
    agency: "Community Travels",
    itinerary: [
      {
        day: 1,
        title: "Group Departure",
        description: "Entire group departs together from Jakarta."
      },
      {
        day: "2-4",
        title: "Mecca Group Experience",
        description: "Umroh with group prayers and community bonding."
      },
      {
        day: "5-8",
        title: "Medina Group Tour",
        description: "Extended Medina visit with group activities and dinners."
      },
      {
        day: "9-10",
        title: "Mecca Closure",
        description: "Final prayers and group shopping in Mecca."
      },
      {
        day: 11,
        title: "Group Return",
        description: "Fly back together to Jakarta."
      }
    ],
    inclusions: [
      "Group flight arrangements",
      "Hotel accommodations",
      "All meals",
      "Tour guide for group",
      "Group activities and events",
      "Discounted rates",
      "Transportation"
    ]
  },
  {
    id: 7,
    name: "Express Umroh 5-Day Quick Trip",
    destination: "Mecca & Medina",
    description: "Perfect for busy professionals, condensed yet complete umroh",
    price: 999,
    days: 5,
    rating: 4,
    reviews: 95,
    image: "https://images.unsplash.com/photo-1532274040911-5f82f1b88646?w=500&h=300&fit=crop",
    maxParticipants: 15,
    departure: "September 12, 2026",
    agency: "Quick Pilgrims",
    itinerary: [
      {
        day: 1,
        title: "Arrive Mecca",
        description: "Fast-track to hotel, immediate Umroh rituals."
      },
      {
        day: 2,
        title: "Mecca Focus",
        description: "Full day devoted to Kaaba and Masjidil Haram."
      },
      {
        day: 3,
        title: "Medina Flash",
        description: "Quick day trip to Medina's Prophet's Mosque."
      },
      {
        day: 4,
        title: "Mecca Return",
        description: "Back to Mecca for final Tawaf."
      },
      {
        day: 5,
        title: "Depart",
        description: "Return flight to Jakarta."
      }
    ],
    inclusions: [
      "Economy flights",
      "3-star hotel",
      "Breakfast and dinner",
      "Quick-service guide",
      "Ground transport",
      "Visa assistance"
    ]
  }
];

module.exports = { packages };
