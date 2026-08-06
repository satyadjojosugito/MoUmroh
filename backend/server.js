const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
 
const app = express();
const PORT = process.env.PORT || 5000;
 
// MongoDB Connection optimized for Vercel serverless
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://satyadjojosugito_db_user:MoUmroh2024Secure@cluster0.ww85n6s.mongodb.net/moumroh?appName=Cluster0';
 
// CRITICAL: Serverless-optimized MongoDB options
const mongoOptions = {
  serverSelectionTimeoutMS: 30000,    // 30 seconds to find a server
  socketTimeoutMS: 120000,             // 120 seconds socket timeout
  connectTimeoutMS: 30000,             // 30 seconds connection timeout
  retryWrites: true,
  w: 'majority',
  maxPoolSize: 2,                      // Very small for serverless
  minPoolSize: 0,                      // Let it scale down to 0
  maxIdleTimeMS: 10000,                // Close idle connections quickly
  serverMonitoringMode: 'auto',
  waitQueueTimeoutMS: 30000,
};
 
// Store connection state
let isConnected = false;
 
// Connect to MongoDB with retry logic
const connectDB = async () => {
  if (isConnected) {
    console.log('✅ Using existing MongoDB connection');
    return;
  }
 
  try {
    await mongoose.connect(MONGODB_URI, mongoOptions);
    isConnected = true;
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    isConnected = false;
    throw err;
  }
};
 
// Handle connection events
mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log('✅ Mongoose connected to MongoDB');
});
 
mongoose.connection.on('error', (err) => {
  isConnected = false;
  console.error('❌ Mongoose connection error:', err);
});
 
mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('⚠️ Mongoose disconnected from MongoDB');
});
 
// Middleware
app.use(cors());
app.use(express.json());
 
// Ensure connection before each request
app.use(async (req, res, next) => {
  try {
    if (!isConnected) {
      await connectDB();
    }
    next();
  } catch (err) {
    console.error('Connection middleware error:', err);
    res.status(503).json({ error: 'Database connection failed' });
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
 
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
 
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
 
    if (days) {
      const [min, max] = days.split('-').map(d => parseInt(d));
      if (max) {
        query.duration = { $gte: min, $lte: max };
      } else {
        query.duration = min;
      }
    }
 
    if (departureCity) {
      query.departureCity = departureCity;
    }
 
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
    console.error('Error fetching packages:', error);
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
    console.log('💾 Adding new package...');
    const { name, destination, price, duration, departureCity, departureDate, rating, image, description, agencies } = req.body;
 
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
 
    const savedPackage = await newPackage.save();
    console.log('✅ Package saved:', savedPackage._id);
    res.status(201).json(transformDoc(savedPackage));
  } catch (error) {
    console.error('Error saving package:', error.message);
    res.status(500).json({ error: error.message });
  }
});
 
// Update existing package
app.put('/api/packages/:id', async (req, res) => {
  try {
    const { name, destination, price, duration, departureCity, departureDate, rating, image, description, agencies } = req.body;
 
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
 
// ===== AGENCY ENDPOINTS =====
 
// Get all agencies
app.get('/api/agencies', async (req, res) => {
  try {
    const agencies = await Agency.find();
    res.json(agencies.map(transformDoc));
  } catch (error) {
    console.error('Error fetching agencies:', error);
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
    console.log('💾 Adding new agency...');
    const { name, email, phone, address } = req.body;
 
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields: name, email, phone' });
    }
 
    const newAgency = new Agency({
      name,
      email,
      phone,
      address: address || ''
    });
 
    const savedAgency = await newAgency.save();
    console.log('✅ Agency saved:', savedAgency._id);
    res.status(201).json(transformDoc(savedAgency));
  } catch (error) {
    console.error('Error saving agency:', error.message);
    res.status(500).json({ error: error.message });
  }
});
 
// Update existing agency
app.put('/api/agencies/:id', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
 
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
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'Server is running',
    database: dbStatus,
    timestamp: new Date()
  });
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
  console.log(`💼 Agencies endpoint: http://localhost:${PORT}/api/agencies`);
  console.log(`💊 Health check: http://localhost:${PORT}/api/health`);
});
 
module.exports = app;
 