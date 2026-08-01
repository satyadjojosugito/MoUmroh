import React, { useState, useEffect } from 'react';
import axios from 'axios';
 
const AdminPanel = () => {
  const [packages, setPackages] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    price: '',
    duration: '',
    departureCity: '',
    departureDate: '',
    imageUrl: '',
    description: '',
    agencyId: '',
  });
  const [agencyFormData, setAgencyFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(true);
  const [editingId, setEditingId] = useState(null);
 
  // Fetch packages on mount
  useEffect(() => {
    fetchPackages();
    fetchAgencies();
  }, []);
 
  const fetchPackages = async () => {
    try {
      const response = await axios.get('https://otwbcjjidiawkprxvrfo.supabase.co/functions/v1/packages');
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };
 
  const fetchAgencies = async () => {
    try {
      const response = await axios.get('https://otwbcjjidiawkprxvrfo.supabase.co/functions/v1/get-agencies');
      setAgencies(response.data);
    } catch (error) {
      console.error('Error fetching agencies:', error);
      setAgencies([]);
    }
  };
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
 
  const handleAgencyInputChange = (e) => {
    const { name, value } = e.target;
    setAgencyFormData({
      ...agencyFormData,
      [name]: value,
    });
  };
 
  const handleAddPackage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
 
    try {
      // Validate required fields
      if (
        !formData.name ||
        !formData.destination ||
        !formData.price ||
        !formData.duration ||
        !formData.departureCity ||
        !formData.departureDate ||
        !formData.agencyId
      ) {
        setMessage('❌ Please fill in all required fields (including Agency)');
        setLoading(false);
        return;
      }
 
      // Get selected agency
      const selectedAgency = agencies.find(a => a.id === parseInt(formData.agencyId));
 
      // Create new package object
      const newPackage = {
        name: formData.name,
        destination: formData.destination,
        price: parseInt(formData.price),
        duration: parseInt(formData.duration),
        departureCity: formData.departureCity,
        departureDate: formData.departureDate,
        image: formData.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image',
        description: formData.description,
        rating: 5,
        agencies: {
          id: selectedAgency.id,
          name: selectedAgency.name,
          email: selectedAgency.email,
          phone: selectedAgency.phone,
          address: selectedAgency.address,
        },
      };
 
      // Send to backend
      if (editingId) {
        // Update existing package
        await axios.put(`https://otwbcjjidiawkprxvrfo.supabase.co/functions/v1/packages/${editingId}`, newPackage);
        setPackages(packages.map(pkg => pkg.id === editingId ? { ...newPackage, id: editingId } : pkg));
        setMessage('✅ Package updated successfully!');
        setEditingId(null);
      } else {
        // Add new package
        const response = await axios.post('https://otwbcjjidiawkprxvrfo.supabase.co/functions/v1/packages', newPackage);
        setPackages([...packages, response.data]);
        setMessage('✅ Package added successfully!');
      }
 
      // Clear form
      setFormData({
        name: '',
        destination: '',
        price: '',
        duration: '',
        departureCity: '',
        departureDate: '',
        imageUrl: '',
        description: '',
        agencyId: '',
      });
 
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error saving package');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
 
  const handleEditPackage = (pkg) => {
    setEditingId(pkg.id);
    setFormData({
      name: pkg.name,
      destination: pkg.destination,
      price: pkg.price,
      duration: pkg.duration,
      departureCity: pkg.departureCity,
      departureDate: pkg.departureDate,
      imageUrl: pkg.image,
      description: pkg.description,
      agencyId: pkg.agencies?.id || '',
    });
    setShowAddForm(true);
  };
 
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      destination: '',
      price: '',
      duration: '',
      departureCity: '',
      departureDate: '',
      imageUrl: '',
      description: '',
      agencyId: '',
    });
  };
 
  const handleAddAgency = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!agencyFormData.name || !agencyFormData.email || !agencyFormData.phone) {
        setMessage('❌ Please fill in all required fields');
        setLoading(false);
        return;
      }

      const newAgency = {
        name: agencyFormData.name,
        email: agencyFormData.email,
        phone: agencyFormData.phone,
        address: agencyFormData.address,
      };

      await axios.post('https://otwbcjjidiawkprxvrfo.supabase.co/functions/v1/create-agency', newAgency);

      // Refresh agencies list
      await fetchAgencies();

      setAgencyFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
      });

      setMessage('✅ Agency added successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error adding agency');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
 
  const handleDeletePackage = async (id) => {
  if (window.confirm('Are you sure you want to delete this package?')) {
    try {
      await axios.delete(`https://otwbcjjidiawkprxvrfo.supabase.co/functions/v1/packages/${id}`);
      setPackages(packages.filter(pkg => pkg.id !== id));
      setMessage('✅ Package deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error deleting package');
      console.error('Error:', error);
    }
  }
};
 
  const handleDeleteAgency = async (id) => {
    if (window.confirm('Are you sure you want to delete this agency?')) {
      try {
        await axios.delete(`https://otwbcjjidiawkprxvrfo.supabase.co/functions/v1/delete-agency/${id}`);
        setAgencies(agencies.filter(agency => agency.id !== id));
        setMessage('✅ Agency deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('❌ Error deleting agency');
        console.error('Error:', error);
      }
    }
  };
 
  const formatDateMonthYear = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
 
  const formatCurrency = (amount) => {
    return `Rp${amount?.toLocaleString('id-ID') || '0'}`;
  };
 
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>📊 MoUmroh Admin Panel</h1>
        <div style={styles.buttons}>
          <button
            style={{...styles.tab, ...(showAddForm ? styles.tabActive : {})}}
            onClick={() => setShowAddForm(true)}
          >
            ➕ Add Packages
          </button>
          <button
            style={{...styles.tab, ...(!showAddForm ? styles.tabActive : {})}}
            onClick={() => setShowAddForm(false)}
          >
            🏢 Add Agencies
          </button>
        </div>
      </div>
 
      {/* Message */}
      {message && (
        <div style={{
          ...styles.message,
          backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          border: message.includes('✅') ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
        }}>
          {message}
        </div>
      )}
 
      {/* Main Container */}
      <div style={styles.mainContainer}>
        {/* Left Column - Add Package Form */}
        {showAddForm && (
          <div style={styles.formSection}>
            <h2 style={styles.formTitle}>{editingId ? '✏️ Edit Package' : '➕ Add New Package'}</h2>
            {editingId && (
              <button
                onClick={handleCancelEdit}
                style={{
                  ...styles.submitBtn,
                  backgroundColor: '#6c757d',
                  marginBottom: '16px'
                }}
              >
                Cancel Edit
              </button>
            )}
 
            <form onSubmit={handleAddPackage} style={styles.form}>
              {/* Agency Selection */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Select Agency *</label>
                <select
                  name="agencyId"
                  value={formData.agencyId}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                >
                  <option value="">-- Choose an Agency --</option>
                  {agencies.map(agency => (
                    <option key={agency.id} value={agency.id}>
                      {agency.name}
                    </option>
                  ))}
                </select>
              </div>
 
              {/* Package Name */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Package Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Premium 10-Day Umroh"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
 
              {/* Destination */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Destination *</label>
                <input
                  type="text"
                  name="destination"
                  placeholder="e.g., Mecca & Medina"
                  value={formData.destination}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
 
              {/* Price */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Price (IDR) *</label>
                <input
                  type="number"
                  name="price"
                  placeholder="2500000"
                  value={formData.price}
                  onChange={handleInputChange}
                  style={styles.input}
                  min="0"
                  step="1"
                  required
                />
              </div>
 
              {/* Duration */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Duration (Days) *</label>
                <input
                  type="number"
                  name="duration"
                  placeholder="10"
                  value={formData.duration}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
 
              {/* Departure City */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Departure City *</label>
                <input
                  type="text"
                  name="departureCity"
                  placeholder="e.g., Jakarta"
                  value={formData.departureCity}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
 
              {/* Departure Date */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Departure Date *</label>
                <input
                  type="date"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                />
              </div>
 
              {/* Image URL */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
 
              {/* Description */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  name="description"
                  placeholder="Package description..."
                  value={formData.description}
                  onChange={handleInputChange}
                  style={{...styles.input, minHeight: '100px', fontFamily: 'inherit'}}
                  rows="4"
                />
              </div>
 
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{...styles.submitBtn, opacity: loading ? 0.6 : 1}}
              >
                {loading ? '⏳ Saving...' : (editingId ? '💾 Update Package' : '➕ Add Package')}
              </button>
            </form>
          </div>
        )}
 
        {/* Left Column - Add Agency Form */}
        {!showAddForm && (
          <div style={styles.formSection}>
            <h2 style={styles.formTitle}>Add New Agency</h2>
 
            <form onSubmit={handleAddAgency} style={styles.form}>
              {/* Agency Name */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Agency Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., PT Umroh Indah"
                  value={agencyFormData.name}
                  onChange={handleAgencyInputChange}
                  style={styles.input}
                  required
                />
              </div>
 
              {/* Email */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="contact@agency.com"
                  value={agencyFormData.email}
                  onChange={handleAgencyInputChange}
                  style={styles.input}
                  required
                />
              </div>
 
              {/* Phone */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="08123456789"
                  value={agencyFormData.phone}
                  onChange={handleAgencyInputChange}
                  style={styles.input}
                  required
                />
              </div>
 
              {/* Address */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Address</label>
                <textarea
                  name="address"
                  placeholder="Agency address..."
                  value={agencyFormData.address}
                  onChange={handleAgencyInputChange}
                  style={{...styles.input, minHeight: '80px', fontFamily: 'inherit'}}
                  rows="3"
                />
              </div>
 
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{...styles.submitBtn, opacity: loading ? 0.6 : 1}}
              >
                {loading ? '⏳ Adding...' : '🏢 Add Agency'}
              </button>
            </form>
          </div>
        )}
 
        {/* Right Column - Current Packages */}
        {showAddForm && (
          <div style={styles.packagesSection}>
            <h2 style={styles.packagesTitle}>Current Packages ({packages.length})</h2>
 
            <div style={styles.packagesList}>
              {packages.length === 0 ? (
                <p style={styles.emptyMessage}>No packages yet. Add one to get started!</p>
              ) : (
                packages.map(pkg => (
                  <div key={pkg.id} style={styles.packageCard}>
                    <h3 style={styles.packageName}>{pkg.name}</h3>
 
                    <p style={styles.packageInfo}>
                      <strong>Destination:</strong> {pkg.destination}
                    </p>
 
                    <p style={styles.packageInfo}>
                      <strong>Price:</strong> {formatCurrency(pkg.price)} | <strong>Days:</strong> {pkg.duration}
                    </p>
 
                    <p style={styles.packageInfo}>
                      <strong>📍 Departs:</strong> {pkg.departureCity}
                    </p>
 
                    <p style={styles.packageInfo}>
                      <strong>📅 Date:</strong> {formatDateMonthYear(pkg.departureDate)}
                    </p>
 
                    <p style={styles.packageInfo}>
                      <strong>🏢 Agency:</strong> {pkg.agencies?.name || 'Belum ditentukan'}
                    </p>
 
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEditPackage(pkg)}
                        style={{
                          ...styles.deleteBtn,
                          backgroundColor: '#007bff',
                          flex: 1
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        style={{
                          ...styles.deleteBtn,
                          flex: 1
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
 
        {/* Right Column - Current Agencies */}
        {!showAddForm && (
          <div style={styles.packagesSection}>
            <h2 style={styles.packagesTitle}>Current Agencies ({agencies.length})</h2>
 
            <div style={styles.packagesList}>
              {agencies.length === 0 ? (
                <p style={styles.emptyMessage}>No agencies yet. Add one to get started!</p>
              ) : (
                agencies.map(agency => (
                  <div key={agency.id} style={styles.packageCard}>
                    <h3 style={styles.packageName}>{agency.name}</h3>
 
                    <p style={styles.packageInfo}>
                      <strong>Email:</strong> {agency.email}
                    </p>
 
                    <p style={styles.packageInfo}>
                      <strong>Phone:</strong> {agency.phone}
                    </p>
 
                    {agency.address && (
                      <p style={styles.packageInfo}>
                        <strong>Address:</strong> {agency.address}
                      </p>
                    )}
 
                    <button
                      onClick={() => handleDeleteAgency(agency.id)}
                      style={styles.deleteBtn}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
 
// Inline Styles
const styles = {
  container: {
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  header: {
    marginBottom: '30px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  },
  buttons: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '30px',
  },
  tab: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#e0e0e0',
    color: '#333',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s',
  },
  tabActive: {
    backgroundColor: '#007bff',
    color: 'white',
  },
  message: {
    padding: '12px 16px',
    marginBottom: '20px',
    borderRadius: '4px',
    textAlign: 'center',
    fontWeight: 'bold',
    border: '1px solid',
  },
  mainContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
  },
  formSection: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  formTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '24px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  submitBtn: {
    padding: '14px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.3s',
  },
  packagesSection: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  packagesTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '24px',
    color: '#333',
  },
  packagesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxHeight: '700px',
    overflowY: 'auto',
  },
  packageCard: {
    padding: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9',
  },
  packageName: {
    margin: '0 0 12px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  packageInfo: {
    margin: '6px 0',
    fontSize: '14px',
    color: '#666',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#999',
    padding: '20px',
    fontSize: '14px',
  },
  deleteBtn: {
    width: '100%',
    padding: '10px',
    marginTop: '12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.3s',
  },
};
 
export default AdminPanel;
 