import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Packages() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    minPrice: '',
    maxPrice: '',
    days: ''
  });

  useEffect(() => {
    fetchPackages();
  }, [filters]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.days) params.append('days', filters.days);

      const response = await axios.get(`${API_URL}/packages?${params}`);
      setPackages(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching packages:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Header */}
      <section style={{
        padding: '60px 20px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '40px',
            fontWeight: '700',
            marginBottom: '16px',
            color: '#000'
          }}>
            Semua Paket Umroh
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#666'
          }}>
            Temukan paket umroh yang sesuai dengan budget dan kebutuhan Anda
          </p>
        </div>
      </section>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '40px'
      }}>
        {/* Sidebar Filters */}
        <aside style={{
          backgroundColor: '#f8f9fa',
          padding: '24px',
          borderRadius: '12px',
          height: 'fit-content'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            marginBottom: '20px',
            color: '#000'
          }}>
            Filter
          </h3>

          {/* Search */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#000'
            }}>
              Cari Paket
            </label>
            <input
              type="text"
              placeholder="Nama paket..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Price Range */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#000'
            }}>
              Harga Minimum (Rp)
            </label>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#000'
            }}>
              Harga Maksimal (Rp)
            </label>
            <input
              type="number"
              placeholder="0"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Days */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#000'
            }}>
              Durasi (Hari)
            </label>
            <select
              value={filters.days}
              onChange={(e) => handleFilterChange('days', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              <option value="">Semua Durasi</option>
              <option value="7">7 Hari</option>
              <option value="9">9 Hari</option>
              <option value="10">10 Hari</option>
              <option value="12">12 Hari</option>
            </select>
          </div>

          <button
            onClick={() => setFilters({ search: '', minPrice: '', maxPrice: '', days: '' })}
            style={{
              width: '100%',
              padding: '10px 12px',
              backgroundColor: '#e0e0e0',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: '#000'
            }}
          >
            Reset Filter
          </button>
        </aside>

        {/* Main Content */}
        <main>
          {loading ? (
            <p style={{ textAlign: 'center', color: '#999' }}>Memuat paket...</p>
          ) : packages.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', fontSize: '16px' }}>
              Tidak ada paket yang sesuai dengan filter Anda
            </p>
          ) : (
            <>
              <p style={{
                marginBottom: '24px',
                fontSize: '14px',
                color: '#666'
              }}>
                Menampilkan {packages.length} paket
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '24px'
              }}>
                {packages.map(pkg => (
                  <div key={pkg.id} style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    backgroundColor: '#fff'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                  onClick={() => navigate(`/package/${pkg.id}`)}
                  >
                    {/* Image */}
                    <div style={{
                      height: '220px',
                      backgroundColor: '#e0e0e0',
                      backgroundImage: pkg.image ? `url('${pkg.image}')` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }} />

                    {/* Content */}
                    <div style={{ padding: '20px' }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        marginBottom: '8px',
                        color: '#000'
                      }}>
                        {pkg.name}
                      </h3>

                      <p style={{
                        fontSize: '14px',
                        color: '#666',
                        marginBottom: '12px'
                      }}>
                        📍 {pkg.destination}
                      </p>

                      {/* Agency */}
                      {pkg.agencies && (
                        <p style={{
                          fontSize: '13px',
                          color: '#999',
                          marginBottom: '12px'
                        }}>
                          🏢 {pkg.agencies.name}
                        </p>
                      )}

                      {/* Specs */}
                      <div style={{
                        display: 'flex',
                        gap: '12px',
                        marginBottom: '16px',
                        fontSize: '13px',
                        color: '#999',
                        flexWrap: 'wrap'
                      }}>
                        <span>📅 {pkg.days} Hari</span>
                        <span>⭐ {pkg.rating}/5</span>
                      </div>

                      {/* Price and Button */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <p style={{
                            fontSize: '22px',
                            fontWeight: '700',
                            color: '#000',
                            margin: 0
                          }}>
                            Rp{pkg.price?.toLocaleString('id-ID') || '0'}
                          </p>
                          <p style={{
                            fontSize: '12px',
                            color: '#999',
                            margin: '4px 0 0 0'
                          }}>
                            per orang
                          </p>
                        </div>
                        <button
                          style={{
                            padding: '10px 20px',
                            backgroundColor: '#000',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/package/${pkg.id}`);
                          }}
                        >
                          Lihat
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}