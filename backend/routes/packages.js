const express = require('express');
const router = express.Router();
const { packages } = require('../data/packages');

// Get all packages with filters
router.get('/', (req, res) => {
  try {
    const { search, minPrice, maxPrice, days, rating } = req.query;

    let filtered = packages;

    // Search filter
    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(pkg =>
        pkg.name.toLowerCase().includes(query) ||
        pkg.destination.toLowerCase().includes(query) ||
        pkg.description.toLowerCase().includes(query)
      );
    }

    // Price filter
    if (minPrice) {
      filtered = filtered.filter(pkg => pkg.price >= parseInt(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(pkg => pkg.price <= parseInt(maxPrice));
    }

    // Duration filter
    if (days) {
      if (days === '7-10') {
        filtered = filtered.filter(pkg => pkg.days >= 7 && pkg.days <= 10);
      } else if (days === '10-14') {
        filtered = filtered.filter(pkg => pkg.days >= 10 && pkg.days <= 14);
      } else if (days === '14+') {
        filtered = filtered.filter(pkg => pkg.days >= 14);
      }
    }

    // Rating filter
    if (rating) {
      filtered = filtered.filter(pkg => pkg.rating >= parseInt(rating));
    }

    res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single package by ID
router.get('/:id', (req, res) => {
  try {
    const pkg = packages.find(p => p.id === parseInt(req.params.id));

    if (!pkg) {
      return res.status(404).json({ success: false, error: 'Package not found' });
    }

    res.json({ success: true, data: pkg });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Search packages
router.post('/search', (req, res) => {
  try {
    const { query, filters } = req.body;

    let filtered = packages;

    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(pkg =>
        pkg.name.toLowerCase().includes(q) ||
        pkg.destination.toLowerCase().includes(q)
      );
    }

    if (filters) {
      if (filters.minPrice) {
        filtered = filtered.filter(pkg => pkg.price >= filters.minPrice);
      }
      if (filters.maxPrice) {
        filtered = filtered.filter(pkg => pkg.price <= filters.maxPrice);
      }
      if (filters.rating) {
        filtered = filtered.filter(pkg => pkg.rating >= filters.rating);
      }
    }

    res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
