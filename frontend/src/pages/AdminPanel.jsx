import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('packages');
  const [agencies, setAgencies] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Package form state
  const [packageForm, setPackageForm] = useState({
    agency_id: '',
    name: '',
    destination: '',
    description: '',
    price: '',
    days: '',
    rating: 5,
    image: '',
    max_participants: 20,
    itinerary: [],
    inclusions: []
  });

  // Agency form state
  const [agencyForm, setAgencyForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Indonesia',
    website: '',
    description: ''
  });

  useEffect(() => {
    fetchAgencies();
    fetchPackages();
  }, []);

  const fetchAgencies = async () => {
    try {
      const response = await axios.get(`${API_URL}/agencies`);
      setAgencies(response.data);
    } catch (error) {
      console.error('Error fetching agencies:', error);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await axios.get(`${API_URL}/packages`);
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const handleAddPackage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post(`${API_URL}/admin/packages`, {
        ...packageForm,
        price: parseFloat(packageForm.price),
        days: parseInt(packageForm.days)
      });

      setMessage('✅ Package added successfully!');
      setPackageForm({
        agency_id: '',
        name: '',
        destination: '',
        description: '',
        price: '',
        days: '',
        rating: 5,
        image: '',
        max_participants: 20,
        itinerary: [],
        inclusions: []
      });
      fetchPackages();
    } catch (error) {
      setMessage('❌ Error adding package: ' + error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAgency = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post(`${API_URL}/admin/agencies`, agencyForm);
      setMessage('✅ Agency added successfully!');
      setAgencyForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: 'Indonesia',
        website: '',
        description: ''
      });
      fetchAgencies();
    } catch (error) {
      setMessage('❌ Error adding agency: ' + error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePackage = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await axios.delete(`${API_URL}/admin/packages/${id}`);
        setMessage('✅ Package deleted!');
        fetchPackages();
      } catch (error) {
        setMessage('❌ Error deleting package');
      }
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>🎛️ MoUmroh Admin Panel</h1>

      {message && (
        <div style={{
          padding: '10px 15px',
          margin: '10px 0',
          borderRadius: '4px',
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24'
        }}>
          {message}
        </div>
      )}

      <div style={{ borderBottom: '2px solid #ddd', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('packages')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: activeTab === 'packages' ? '#007bff' : '#e9ecef',
            color: activeTab === 'packages' ? 'white' : 'black',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px 4px 0 0'
          }}
        >
          📦 Add Packages
        </button>
        <button
          onClick={() => setActiveTab('agencies')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'agencies' ? '#007bff' : '#e9ecef',
            color: activeTab === 'agencies' ? 'white' : 'black',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px 4px 0 0'
          }}
        >
          🏢 Add Agencies
        </button>
      </div>

      {/* Add Package Tab */}
      {activeTab === 'packages' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div>
            <h2>Add New Package</h2>
            <form onSubmit={handleAddPackage}>
              <div style={{ marginBottom: '15px' }}>
                <label>Agency *</label>
                <select
                  required
                  value={packageForm.agency_id}
                  onChange={(e) => setPackageForm({ ...packageForm, agency_id: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                >
                  <option value="">Select Agency</option>
                  {agencies.map(agency => (
                    <option key={agency.id} value={agency.id}>
                      {agency.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Package Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g., Premium 10-Day Umroh"
                  value={packageForm.name}
                  onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Destination *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g., Mecca & Medina"
                  value={packageForm.destination}
                  onChange={(e) => setPackageForm({ ...packageForm, destination: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Price (USD) *</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  placeholder="2500"
                  value={packageForm.price}
                  onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Duration (Days) *</label>
                <input
                  required
                  type="number"
                  placeholder="10"
                  value={packageForm.days}
                  onChange={(e) => setPackageForm({ ...packageForm, days: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Rating (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={packageForm.rating}
                  onChange={(e) => setPackageForm({ ...packageForm, rating: parseFloat(e.target.value) })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Image URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={packageForm.image}
                  onChange={(e) => setPackageForm({ ...packageForm, image: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Description</label>
                <textarea
                  placeholder="Package description..."
                  rows="4"
                  value={packageForm.description}
                  onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                {loading ? 'Adding...' : '➕ Add Package'}
              </button>
            </form>
          </div>

          <div>
            <h2>Current Packages ({packages.length})</h2>
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {packages.map(pkg => (
                <div key={pkg.id} style={{
                  padding: '15px',
                  marginBottom: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#f9f9f9'
                }}>
                  <h4 style={{ margin: '0 0 5px 0' }}>{pkg.name}</h4>
                  <p style={{ margin: '3px 0', fontSize: '14px' }}>
                    <strong>Destination:</strong> {pkg.destination}
                  </p>
                  <p style={{ margin: '3px 0', fontSize: '14px' }}>
                    <strong>Price:</strong> ${pkg.price} | <strong>Days:</strong> {pkg.days}
                  </p>
                  <p style={{ margin: '3px 0', fontSize: '14px' }}>
                    <strong>Rating:</strong> ⭐ {pkg.rating}
                  </p>
                  <button
                    onClick={() => handleDeletePackage(pkg.id)}
                    style={{
                      marginTop: '10px',
                      padding: '5px 10px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Agency Tab */}
      {activeTab === 'agencies' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div>
            <h2>Add New Agency</h2>
            <form onSubmit={handleAddAgency}>
              <div style={{ marginBottom: '15px' }}>
                <label>Agency Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g., Premium Umroh Tours"
                  value={agencyForm.name}
                  onChange={(e) => setAgencyForm({ ...agencyForm, name: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="info@agency.com"
                  value={agencyForm.email}
                  onChange={(e) => setAgencyForm({ ...agencyForm, email: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Phone</label>
                <input
                  type="tel"
                  placeholder="+62-812-3456789"
                  value={agencyForm.phone}
                  onChange={(e) => setAgencyForm({ ...agencyForm, phone: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>City</label>
                <input
                  type="text"
                  placeholder="Jakarta"
                  value={agencyForm.city}
                  onChange={(e) => setAgencyForm({ ...agencyForm, city: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Website</label>
                <input
                  type="text"
                  placeholder="www.agency.com"
                  value={agencyForm.website}
                  onChange={(e) => setAgencyForm({ ...agencyForm, website: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label>Description</label>
                <textarea
                  placeholder="Agency description..."
                  rows="4"
                  value={agencyForm.description}
                  onChange={(e) => setAgencyForm({ ...agencyForm, description: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                {loading ? 'Adding...' : '➕ Add Agency'}
              </button>
            </form>
          </div>

          <div>
            <h2>Current Agencies ({agencies.length})</h2>
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {agencies.map(agency => (
                <div key={agency.id} style={{
                  padding: '15px',
                  marginBottom: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: '#f9f9f9'
                }}>
                  <h4 style={{ margin: '0 0 5px 0' }}>{agency.name}</h4>
                  {agency.email && <p style={{ margin: '3px 0', fontSize: '14px' }}>{agency.email}</p>}
                  {agency.phone && <p style={{ margin: '3px 0', fontSize: '14px' }}>{agency.phone}</p>}
                  {agency.city && <p style={{ margin: '3px 0', fontSize: '14px' }}>📍 {agency.city}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}