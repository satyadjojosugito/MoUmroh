const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Middleware
app.use(cors());
app.use(express.json());

// ==================== PUBLIC API ENDPOINTS ====================

// Get all packages with agency details
app.get('/api/packages', async (req, res) => {
  try {
    const { search, minPrice, maxPrice, days } = req.query;

    let query = supabase
      .from('packages')
      .select(`
        *,
        agencies(id, name, email, phone, website)
      `);

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,destination.ilike.%${search}%`);
    }
    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice));
    }
    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }
    if (days) {
      query = query.eq('days', parseInt(days));
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

// Get single package by ID
app.get('/api/packages/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('packages')
      .select(`
        *,
        agencies(id, name, email, phone, website, description)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({ error: 'Package not found' });
  }
});

// Search packages (POST)
app.post('/api/packages/search', async (req, res) => {
  try {
    const { search, minPrice, maxPrice, days, minRating } = req.body;

    let query = supabase.from('packages').select(`
      *,
      agencies(id, name)
    `);

    if (search) {
      query = query.or(`name.ilike.%${search}%,destination.ilike.%${search}%`);
    }
    if (minPrice) query = query.gte('price', minPrice);
    if (maxPrice) query = query.lte('price', maxPrice);
    if (days) query = query.eq('days', days);
    if (minRating) query = query.gte('rating', minRating);

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error searching packages:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get all agencies
app.get('/api/agencies', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .order('name');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching agencies:', error);
    res.status(500).json({ error: 'Failed to fetch agencies' });
  }
});

// ==================== ADMIN API ENDPOINTS ====================

// Add new package (Admin)
app.post('/api/admin/packages', async (req, res) => {
  try {
    const {
      agency_id,
      name,
      destination,
      description,
      price,
      days,
      rating,
      reviews,
      image,
      max_participants,
      departure,
      itinerary,
      inclusions
    } = req.body;

    // Validation
    if (!agency_id || !name || !destination || !price || !days) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('packages')
      .insert([{
        agency_id,
        name,
        destination,
        description,
        price: parseFloat(price),
        days: parseInt(days),
        rating: rating || 5,
        reviews: reviews || 0,
        image,
        max_participants: max_participants || 20,
        departure,
        itinerary: itinerary || [],
        inclusions: inclusions || []
      }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({ error: 'Failed to create package' });
  }
});

// Update package (Admin)
app.put('/api/admin/packages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('packages')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ error: 'Failed to update package' });
  }
});

// Delete package (Admin)
app.delete('/api/admin/packages/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('packages')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({ error: 'Failed to delete package' });
  }
});

// Add new agency (Admin)
app.post('/api/admin/agencies', async (req, res) => {
  try {
    const { name, email, phone, address, city, country, website, description, logo_url } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Agency name is required' });
    }

    const { data, error } = await supabase
      .from('agencies')
      .insert([{
        name,
        email,
        phone,
        address,
        city,
        country,
        website,
        description,
        logo_url
      }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating agency:', error);
    res.status(500).json({ error: 'Failed to create agency' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running with Supabase integration' });
});

// Start server
app.listen(PORT, () => {
  console.log(`MoUmroh API running on port ${PORT}`);
  console.log(`Connected to Supabase: ${process.env.SUPABASE_URL}`);
});