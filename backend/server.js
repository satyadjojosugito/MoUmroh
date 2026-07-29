const express = require('express');
const cors = require('cors');
require('dotenv').config();
 
const app = express();
const PORT = process.env.PORT || 5000;
 
// Middleware
app.use(cors());
app.use(express.json());
 
// Import packages data
const packages = require('./data/packages');
 
// Routes
 
// Get all packages
app.get('/api/packages', (req, res) => {
  try {
    // Optional: Add search/filter functionality
    const { search, minPrice, maxPrice, days, departureCity, departureMonth, departureYear } = req.query;
 
    let filtered = [...packages];
 
    // Search by name
    if (search) {
      filtered = filtered.filter(pkg =>
        pkg.name.toLowerCase().includes(search.toLowerCase()) ||
        pkg.description.toLowerCase().includes(search.toLowerCase())
      );
    }
 
    // Filter by price range
    if (minPrice) {
      filtered = filtered.filter(pkg => pkg.price >= parseInt(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(pkg => pkg.price <= parseInt(maxPrice));
    }
 
    // Filter by duration
    if (days) {
      const [min, max] = days.split('-').map(d => parseInt(d));
      filtered = filtered.filter(pkg => {
        if (max) return pkg.duration >= min && pkg.duration <= max;
        return pkg.duration === min;
      });
    }
 
    // Filter by departure city
    if (departureCity) {
      filtered = filtered.filter(pkg => pkg.departureCity === departureCity);
    }
 
    // Filter by departure month and year
    if (departureMonth || departureYear) {
      filtered = filtered.filter(pkg => {
        if (!pkg.departureDate) return false;
        const date = new Date(pkg.departureDate);
        const month = (date.getMonth() + 1).toString();
        const year = date.getFullYear().toString();
 
        if (departureMonth && departureYear) {
          return month === departureMonth && year === departureYear;
        } else if (departureMonth) {
          return month === departureMonth;
        } else if (departureYear) {
          return year === departureYear;
        }
        return true;
      });
    }
 
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 
// Get single package by ID
app.get('/api/packages/:id', (req, res) => {
  try {
    const package_ = packages.find(p => p.id === parseInt(req.params.id));
 
    if (!package_) {
      return res.status(404).json({ error: 'Package not found' });
    }
 
    res.json(package_);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 
// Add new package
app.post('/api/packages', (req, res) => {
  try {
    const { name, destination, price, duration, departureCity, departureDate, rating, image, description, agencies } = req.body;
 
    // Validate required fields
    if (!name || !destination || !price || !duration || !departureCity || !departureDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
 
    // Create new package
    const newPackage = {
      id: Math.max(...packages.map(p => p.id), 0) + 1,
      name,
      destination,
      price: parseInt(price),
      duration: parseInt(duration),
      departureCity,
      departureDate,
      rating: parseInt(rating) || 5,
      image: image || 'https://via.placeholder.com/400x300?text=No+Image',
      description: description || '',
      agencies: agencies || null,
      inclusions: [],
      itinerary: [],
    };
 
    packages.push(newPackage);
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 
// Update existing package
app.put('/api/packages/:id', (req, res) => {
  try {
    const { name, destination, price, duration, departureCity, departureDate, rating, image, description, agencies } = req.body;
    const packageIndex = packages.findIndex(p => p.id === parseInt(req.params.id));
 
    if (packageIndex === -1) {
      return res.status(404).json({ error: 'Package not found' });
    }
 
    // Validate required fields
    if (!name || !destination || !price || !duration || !departureCity || !departureDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
 
    // Update package
    const updatedPackage = {
      ...packages[packageIndex],
      name,
      destination,
      price: parseInt(price),
      duration: parseInt(duration),
      departureCity,
      departureDate,
      rating: parseInt(rating) || 5,
      image: image || 'https://via.placeholder.com/400x300?text=No+Image',
      description: description || '',
      agencies: agencies || null,
    };
 
    packages[packageIndex] = updatedPackage;
    res.json(updatedPackage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 
// Search endpoint
app.post('/api/packages/search', (req, res) => {
  try {
    const { name, minPrice, maxPrice, duration } = req.body;
 
    let filtered = [...packages];
 
    if (name) {
      filtered = filtered.filter(pkg =>
        pkg.name.toLowerCase().includes(name.toLowerCase())
      );
    }
 
    if (minPrice) {
      filtered = filtered.filter(pkg => pkg.price >= minPrice);
    }
 
    if (maxPrice) {
      filtered = filtered.filter(pkg => pkg.price <= maxPrice);
    }
 
    if (duration) {
      filtered = filtered.filter(pkg => pkg.duration === duration);
    }
 
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 
app.delete('/api/packages/:id', (req, res) => {
  try {
    const index = packages.findIndex(p => p.id === parseInt(req.params.id));
 
    if (index === -1) {
      return res.status(404).json({ error: 'Package not found' });
    }
 
    const deletedPackage = packages.splice(index, 1);
    res.json({ message: 'Package deleted', package: deletedPackage[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});
 
// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});
 
// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});
 
// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📦 Packages endpoint: http://localhost:${PORT}/api/packages`);
  console.log(`💊 Health check: http://localhost:${PORT}/api/health`);
});
 
module.exports = app;