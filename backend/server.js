const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
 
const app = express();
const PORT = process.env.PORT || 5000;
 
// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://satyadjojosugito_db_user:oJqYx0E6C58iI8ve@cluster0.ww85n6s.mongodb.net/moumroh?appName=Cluster0';
 
console.log('📡 MongoDB URI configured:', MONGODB_URI.substring(0, 50) + '...');
 
// Track connection status
let mongoConnected = false;
 
// Connect to MongoDB with retry logic
const connectToMongoDB = async () => {
  if (mongoConnected) {
    console.log('♻️  Reusing existing MongoDB connection');
    return;
  }
 
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
      minPoolSize: 2,
    });
    mongoConnected = true;
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    mongoConnected = false;
    throw err;
  }
};
 
// Initial connection attempt (don't block server startup)
connectToMongoDB().catch(err => {
  console.error('⚠️  Initial MongoDB connection failed, will retry on requests:', err.message);
});
 
// Middleware
app.use(cors());
app.use(express.json());
 
// Middleware to ensure MongoDB connection before processing requests
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    // Already connected
    return next();
  }
 
  try {
    console.log('🔌 Attempting to connect to MongoDB for incoming request...');
    await connectToMongoDB();
    next();
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    res.status(503).json({
      error: 'Database connection failed',
      message: 'Please try again in a moment'
    });
  }
});
 
// Helper function to transform MongoDB _id to id
const transformDoc = (doc) => {
  if (!doc) return doc;
  if (Array.isArray(doc)) return doc.map(transformDoc);
  
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  if (obj._id) {
    obj.id = obj._id.toString();
    delete obj._id;
  }
  return obj;
};
 
// ===== SCHEMAS =====
 
// Package Schema
const packageSchema = new mongoose.Schema({
  name: String,
  destination: String,
  price: Number,
  duration: Number,
  departureCity: String,
  departureDate: String,
  rating: { type: Number, default: 5 },
  image: String,
  description: String,
  agencies: String,
  inclusions: [String],
  itinerary: [String],
}, { timestamps: true });
 
// Agency Schema
const agencySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
}, { timestamps: true });
 
// Models
const Package = mongoose.model('Package', packageSchema);
const Agency = mongoose.model('Agency', agencySchema);
 
// ===== PACKAGE ENDPOINTS =====
 
// Get all packages
app.get('/api/packages', async (req, res) => {
  try {
    const { search, minPrice, maxPrice, days, departureCity, departureMonth, departureYear } = req.query;
 
    let query = {};
 
    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
 
    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
 
    // Filter by duration
    if (days) {
      const [min, max] = days.split('-').map(d => parseInt(d));
      if (max) {
        query.duration = { $gte: min, $lte: max };
      } else {
        query.duration = min;
      }
    }
 
    // Filter by departure city
    if (departureCity) {
      query.departureCity = departureCity;
    }
 
    // Filter by departure month and year
    if (departureMonth || departureYear) {
      const dateRegex = [];
      if (departureYear && departureMonth) {
        dateRegex.push(new RegExp(`^${departureYear}-${String(departureMonth).padStart(2, '0')}`));
      } else if (departureYear) {
        dateRegex.push(new RegExp(`^${departureYear}`));
      } else if (departureMonth) {
        dateRegex.push(new RegExp(`-${String(departureMonth).padStart(2, '0')}-`));
      }
      if (dateRegex.length > 0) {
        query.departureDate = { $regex: dateRegex[0] };
      }
    }
 
    const packages = await Package.find(query);
    res.json(packages.map(transformDoc));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 
// Get single package by ID
app.get('/api/packages/:id', async (req, res) => {
  try {
    const package_ = await Package.findById(req.params.id);
 
    if (!package_) {
      return res.status(404).json({ error: 'Package not found' });
    }
 
    res.json(transformDoc(package_));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 
// Add new package
app.post('/api/packages', async (req, res) => {
  try {
    const { name, destination, price, duration, departureCity, departureDate, rating, image, description, agencies } = req.body;
 
    // Validate required fields
    if (!name || !destination || !price || !duration || !departureCity || !departureDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
 
    const newPackage = new Package({
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
    });
 
    console.log('💾 Saving package:', name);
    const savedPackage = await newPackage.save();
    console.log('✅ Package saved successfully:', savedPackage._id);
    res.status(201).json(transformDoc(savedPackage));
  } catch (error) {
    console.error('❌ Error saving package:', error.message, error.code);
    res.status(500).json({
      error: error.message,
      code: error.code
    });
  }
});
 
// Update existing package
app.put('/api/packages/:id', async (req, res) => {
  try {
    const { name, destination, price, duration, departureCity, departureDate, rating, image, description, agencies } = req.body;
 
    // Validate required fields
    if (!name || !destination || !price || !duration || !departureCity || !departureDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
 
    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      {
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
      },
      { new: true }
    );
 
    if (!updatedPackage) {
      return res.status(404).json({ error: 'Package not found' });
    }
 
    res.json(transformDoc(updatedPackage));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 
// Delete package
app.delete('/api/packages/:id', async (req, res) => {
  try {
    const deletedPackage = await Package.findByIdAndDelete(req.params.id);
 
    if (!deletedPackage) {
      return res.status(404).json({ error: 'Package not found' });
    }
 
    res.json({ message: 'Package deleted', package: transformDoc(deletedPackage) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 
// Search endpoint
app.post('/api/packages/search', async (req, res) => {
  try {
    const { name, minPrice, maxPrice, duration } = req.body;
 
    let query = {};
 
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
 
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }
 
    if (duration) {
      query.duration = duration;
    }
 
    const packages = await Package.find(query);
    res.json(packages.map(transformDoc));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 
// ===== AGENCY ENDPOINTS =====
 
// Get all agencies
app.get('/api/agencies', async (req, res) => {
  try {
    const agencies = await Agency.find();
    res.json(agencies.map(transformDoc));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 
// Get single agency by ID
app.get('/api/agencies/:id', async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id);
 
    if (!agency) {
      return res.status(404).json({ error: 'Agency not found' });
    }
 
    res.json(transformDoc(agency));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 
// Add new agency
app.post('/api/agencies', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
 
    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields: name, email, phone' });
    }
 
    const newAgency = new Agency({
      name,
      email,
      phone,
      address: address || ''
    });
 
    console.log('💾 Saving agency:', name);
    const savedAgency = await newAgency.save();
    console.log('✅ Agency saved successfully:', savedAgency._id);
    res.status(201).json(transformDoc(savedAgency));
  } catch (error) {
    console.error('❌ Error saving agency:', error.message, error.code);
    res.status(500).json({
      error: error.message,
      code: error.code
    });
  }
});
 
// Update existing agency
app.put('/api/agencies/:id', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
 
    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields: name, email, phone' });
    }
 
    const updatedAgency = await Agency.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        address: address || ''
      },
      { new: true }
    );
 
    if (!updatedAgency) {
      return res.status(404).json({ error: 'Agency not found' });
    }
 
    res.json(transformDoc(updatedAgency));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 
// Delete agency
app.delete('/api/agencies/:id', async (req, res) => {
  try {
    const deletedAgency = await Agency.findByIdAndDelete(req.params.id);
 
    if (!deletedAgency) {
      return res.status(404).json({ error: 'Agency not found' });
    }
 
    res.json({ message: 'Agency deleted', agency: transformDoc(deletedAgency) });
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