import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://mo-umroh-backend.vercel.app/api';
const ADMIN_SECRET = process.env.REACT_APP_ADMIN_SECRET || '';

export default function AdminPanel() {
  // Packages
  const [packages, setPackages] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [formMode, setFormMode] = useState('packages'); // 'packages' or 'agencies'

  // Package form state
  const [packageForm, setPackageForm] = useState({
    name: '',
    destination: '',
    price: '',
    duration: '',
    departureCity: '',
    departureDate: '',
    rating: '5',
    image: '',
    description: '',
    agencies: '',
    airlines: '',
    hotel: '',
    fridayCount: '',
    inclusions: [],
    exclusions: [],
  });
  const [editingPackageId, setEditingPackageId] = useState(null);

  // Agency form state
  const [agencyForm, setAgencyForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [editingAgencyId, setEditingAgencyId] = useState(null);

  // Inclusions/Exclusions input
  const [inclusionInput, setInclusionInput] = useState('');
  const [exclusionInput, setExclusionInput] = useState('');

  // Fetch data
  useEffect(() => {
    fetchPackages();
    fetchAgencies();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await axios.get(`${API_URL}/packages`);
      setPackages(res.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const fetchAgencies = async () => {
    try {
      const res = await axios.get(`${API_URL}/agencies`);
      setAgencies(res.data);
    } catch (error) {
      console.error('Error fetching agencies:', error);
    }
  };

  // Helper to get agency name by ID
  const getAgencyName = (agencyId) => {
    if (!agencyId) return 'Belum ditentukan';
    const agency = agencies.find(a => a.id === agencyId || a.id === String(agencyId));
    return agency?.name || 'Belum ditentukan';
  };

  // Package handlers
  const handlePackageChange = (e) => {
    const { name, value } = e.target;
    setPackageForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddInclusion = () => {
    if (inclusionInput.trim()) {
      setPackageForm(prev => ({
        ...prev,
        inclusions: [...prev.inclusions, inclusionInput.trim()]
      }));
      setInclusionInput('');
    }
  };

  const handleRemoveInclusion = (idx) => {
    setPackageForm(prev => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, i) => i !== idx)
    }));
  };

  const handleAddExclusion = () => {
    if (exclusionInput.trim()) {
      setPackageForm(prev => ({
        ...prev,
        exclusions: [...prev.exclusions, exclusionInput.trim()]
      }));
      setExclusionInput('');
    }
  };

  const handleRemoveExclusion = (idx) => {
    setPackageForm(prev => ({
      ...prev,
      exclusions: prev.exclusions.filter((_, i) => i !== idx)
    }));
  };

  const handleSavePackage = async () => {
    const requiredFields = ['name', 'destination', 'price', 'duration', 'departureCity', 'departureDate'];
    const missing = requiredFields.filter(f => !packageForm[f]);
    if (missing.length > 0) {
      alert('Required fields missing: ' + missing.join(', '));
      return;
    }

    try {
      const payload = {
        name: packageForm.name,
        destination: packageForm.destination,
        price: parseInt(packageForm.price),
        duration: parseInt(packageForm.duration),
        departureCity: packageForm.departureCity,
        departureDate: packageForm.departureDate,
        rating: parseInt(packageForm.rating) || 5,
        image: packageForm.image || 'https://via.placeholder.com/400x300?text=No+Image',
        description: packageForm.description,
        agencies: packageForm.agencies || null,
        airlines: packageForm.airlines || '',
        hotel: packageForm.hotel || '',
        fridayCount: packageForm.fridayCount ? parseInt(packageForm.fridayCount) : null,
        inclusions: packageForm.inclusions,
        exclusions: packageForm.exclusions,
      };

      if (editingPackageId) {
        // Update
        await axios.put(`${API_URL}/packages/${editingPackageId}`, payload, {
          headers: { 'x-admin-key': ADMIN_SECRET }
        });
        alert('Package updated successfully!');
      } else {
        // Create
        await axios.post(`${API_URL}/packages`, payload, {
          headers: { 'x-admin-key': ADMIN_SECRET }
        });
        alert('Package created successfully!');
      }

      resetPackageForm();
      fetchPackages();
    } catch (error) {
      console.error('Error saving package:', error);
      alert('Error: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEditPackage = (pkg) => {
    setPackageForm({
      name: pkg.name,
      destination: pkg.destination,
      price: pkg.price,
      duration: pkg.duration,
      departureCity: pkg.departureCity,
      departureDate: pkg.departureDate,
      rating: pkg.rating || 5,
      image: pkg.image,
      description: pkg.description,
      agencies: pkg.agencies || '',
      airlines: pkg.airlines || '',
      hotel: pkg.hotel || '',
      fridayCount: pkg.fridayCount || '',
      inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions : [],
      exclusions: Array.isArray(pkg.exclusions) ? pkg.exclusions : [],
    });
    setEditingPackageId(pkg.id);
    window.scrollTo(0, 0);
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API_URL}/packages/${id}`, {
        headers: { 'x-admin-key': ADMIN_SECRET }
      });
      alert('Package deleted!');
      fetchPackages();
    } catch (error) {
      alert('Error deleting package: ' + error.message);
    }
  };

  const resetPackageForm = () => {
    setPackageForm({
      name: '',
      destination: '',
      price: '',
      duration: '',
      departureCity: '',
      departureDate: '',
      rating: '5',
      image: '',
      description: '',
      agencies: '',
      airlines: '',
      hotel: '',
      fridayCount: '',
      inclusions: [],
      exclusions: [],
    });
    setEditingPackageId(null);
    setInclusionInput('');
    setExclusionInput('');
  };

  // Agency handlers
  const handleAgencyChange = (e) => {
    const { name, value } = e.target;
    setAgencyForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveAgency = async () => {
    const requiredFields = ['name', 'email', 'phone'];
    const missing = requiredFields.filter(f => !agencyForm[f]);
    if (missing.length > 0) {
      alert('Required fields missing: ' + missing.join(', '));
      return;
    }

    try {
      if (editingAgencyId) {
        await axios.put(`${API_URL}/agencies/${editingAgencyId}`, agencyForm, {
          headers: { 'x-admin-key': ADMIN_SECRET }
        });
        alert('Agency updated!');
      } else {
        await axios.post(`${API_URL}/agencies`, agencyForm, {
          headers: { 'x-admin-key': ADMIN_SECRET }
        });
        alert('Agency created!');
      }
      resetAgencyForm();
      fetchAgencies();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleEditAgency = (agency) => {
    setAgencyForm({
      name: agency.name,
      email: agency.email,
      phone: agency.phone,
      address: agency.address || '',
    });
    setEditingAgencyId(agency.id);
  };

  const handleDeleteAgency = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API_URL}/agencies/${id}`, {
        headers: { 'x-admin-key': ADMIN_SECRET }
      });
      alert('Agency deleted!');
      fetchAgencies();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const resetAgencyForm = () => {
    setAgencyForm({ name: '', email: '', phone: '', address: '' });
    setEditingAgencyId(null);
  };

  // Styles
  const containerStyle = { maxWidth: '1000px', margin: '0 auto', padding: '20px' };
  const sectionStyle = { marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' };
  const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
  const buttonStyle = { padding: '10px 20px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' };
  const tabStyle = { padding: '10px 20px', marginRight: '10px', backgroundColor: '#f0f0f0', border: 'none', cursor: 'pointer', borderRadius: '4px' };
  const activeTabStyle = { ...tabStyle, backgroundColor: '#000', color: '#fff' };

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '30px' }}>📊 Admin Panel</h1>

      {/* Tabs */}
      <div style={{ marginBottom: '20px' }}>
        <button
          style={formMode === 'packages' ? activeTabStyle : tabStyle}
          onClick={() => { setFormMode('packages'); resetPackageForm(); }}
        >
          📦 Packages
        </button>
        <button
          style={formMode === 'agencies' ? activeTabStyle : tabStyle}
          onClick={() => { setFormMode('agencies'); resetAgencyForm(); }}
        >
          🏢 Agencies
        </button>
      </div>

      {/* PACKAGES SECTION */}
      {formMode === 'packages' && (
        <div>
          {/* Package Form */}
          <div style={sectionStyle}>
            <h2>{editingPackageId ? 'Edit Package' : 'Add New Package'}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input type="text" name="name" placeholder="Package Name" value={packageForm.name} onChange={handlePackageChange} style={inputStyle} />
              <input type="text" name="destination" placeholder="Destination" value={packageForm.destination} onChange={handlePackageChange} style={inputStyle} />
              <input type="number" name="price" placeholder="Price (Rp)" value={packageForm.price} onChange={handlePackageChange} style={inputStyle} />
              <input type="number" name="duration" placeholder="Duration (Days)" value={packageForm.duration} onChange={handlePackageChange} style={inputStyle} />
              <input type="text" name="departureCity" placeholder="Departure City" value={packageForm.departureCity} onChange={handlePackageChange} style={inputStyle} />
              <input type="date" name="departureDate" value={packageForm.departureDate} onChange={handlePackageChange} style={inputStyle} />
              <input type="number" name="rating" placeholder="Rating (1-5)" value={packageForm.rating} onChange={handlePackageChange} style={inputStyle} />
              <select name="agencies" value={packageForm.agencies} onChange={handlePackageChange} style={inputStyle}>
                <option value="">-- Select Agency --</option>
                {agencies.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            <textarea name="description" placeholder="Description" value={packageForm.description} onChange={handlePackageChange} style={{ ...inputStyle, minHeight: '100px' }} />
            <input type="text" name="image" placeholder="Image URL" value={packageForm.image} onChange={handlePackageChange} style={inputStyle} />

            {/* New Fields */}
            <h3 style={{ marginTop: '20px', color: '#0066cc' }}>Additional Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input type="text" name="airlines" placeholder="Airlines (e.g., Garuda Indonesia)" value={packageForm.airlines} onChange={handlePackageChange} style={inputStyle} />
              <input type="text" name="hotel" placeholder="Hotel Name" value={packageForm.hotel} onChange={handlePackageChange} style={inputStyle} />
              <input type="number" name="fridayCount" placeholder="Friday Count (e.g., 5)" value={packageForm.fridayCount} onChange={handlePackageChange} style={inputStyle} />
            </div>

            {/* Inclusions */}
            <h3 style={{ marginTop: '20px' }}>What's Included (Yang Termasuk)</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Add inclusion item"
                value={inclusionInput}
                onChange={(e) => setInclusionInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddInclusion()}
                style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
              />
              <button onClick={handleAddInclusion} style={buttonStyle}>Add</button>
            </div>
            <div style={{ marginBottom: '20px' }}>
              {packageForm.inclusions.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#f9f9f9', marginBottom: '5px', borderRadius: '4px' }}>
                  <span>✓ {item}</span>
                  <button onClick={() => handleRemoveInclusion(idx)} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}>Remove</button>
                </div>
              ))}
            </div>

            {/* Exclusions */}
            <h3 style={{ marginTop: '20px' }}>What's Not Included (Tidak Termasuk)</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Add exclusion item"
                value={exclusionInput}
                onChange={(e) => setExclusionInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddExclusion()}
                style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
              />
              <button onClick={handleAddExclusion} style={buttonStyle}>Add</button>
            </div>
            <div style={{ marginBottom: '20px' }}>
              {packageForm.exclusions.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#fef2f2', marginBottom: '5px', borderRadius: '4px' }}>
                  <span>✕ {item}</span>
                  <button onClick={() => handleRemoveExclusion(idx)} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}>Remove</button>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div>
              <button onClick={handleSavePackage} style={buttonStyle}>
                {editingPackageId ? 'Update Package' : 'Create Package'}
              </button>
              {editingPackageId && (
                <button onClick={resetPackageForm} style={{ ...buttonStyle, backgroundColor: '#666' }}>Cancel</button>
              )}
            </div>
          </div>

          {/* Packages List */}
          <div style={sectionStyle}>
            <h2>Packages ({packages.length})</h2>
            {packages.length === 0 ? (
              <p>No packages yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                      <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Name</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Destination</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Price</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Duration</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Agency</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Airline</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Hotel</th>
                      <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map(pkg => (
                      <tr key={pkg.id} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{pkg.name}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{pkg.destination}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>Rp{pkg.price?.toLocaleString('id-ID')}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{pkg.duration} days</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{getAgencyName(pkg.agencies)}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{pkg.airlines || '-'}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{pkg.hotel || '-'}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                          <button onClick={() => handleEditPackage(pkg)} style={{ ...buttonStyle, marginRight: '5px', padding: '5px 10px', fontSize: '12px' }}>Edit</button>
                          <button onClick={() => handleDeletePackage(pkg.id)} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AGENCIES SECTION */}
      {formMode === 'agencies' && (
        <div>
          {/* Agency Form */}
          <div style={sectionStyle}>
            <h2>{editingAgencyId ? 'Edit Agency' : 'Add New Agency'}</h2>

            <input type="text" name="name" placeholder="Agency Name" value={agencyForm.name} onChange={handleAgencyChange} style={inputStyle} />
            <input type="email" name="email" placeholder="Email" value={agencyForm.email} onChange={handleAgencyChange} style={inputStyle} />
            <input type="text" name="phone" placeholder="Phone Number" value={agencyForm.phone} onChange={handleAgencyChange} style={inputStyle} />
            <input type="text" name="address" placeholder="Address" value={agencyForm.address} onChange={handleAgencyChange} style={inputStyle} />

            <button onClick={handleSaveAgency} style={buttonStyle}>
              {editingAgencyId ? 'Update Agency' : 'Create Agency'}
            </button>
            {editingAgencyId && (
              <button onClick={resetAgencyForm} style={{ ...buttonStyle, backgroundColor: '#666' }}>Cancel</button>
            )}
          </div>

          {/* Agencies List */}
          <div style={sectionStyle}>
            <h2>Agencies ({agencies.length})</h2>
            {agencies.length === 0 ? (
              <p>No agencies yet.</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f0f0' }}>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Name</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Email</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Phone</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Address</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {agencies.map(agency => (
                    <tr key={agency.id} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{agency.name}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{agency.email}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{agency.phone}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>{agency.address || '-'}</td>
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                        <button onClick={() => handleEditAgency(agency)} style={{ ...buttonStyle, marginRight: '5px', padding: '5px 10px', fontSize: '12px' }}>Edit</button>
                        <button onClick={() => handleDeleteAgency(agency.id)} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
