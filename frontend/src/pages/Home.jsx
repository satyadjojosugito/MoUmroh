import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Clock, Building2 } from 'lucide-react';
const API_URL = process.env.REACT_APP_API_URL || 'https://mo-umroh-backend.vercel.app/api';
export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchPackages();
  }, []);
  const fetchPackages = async () => {
    try {
      const response = await axios.get(`${API_URL}/packages`);
      setPackages(response.data.slice(0, 12)); // Show top 12
      setLoading(false);
    } catch (error) {
      console.error('Error fetching packages:', error);
      setLoading(false);
    }
  };
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/packages?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <section style={{
        padding: '80px 20px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '700',
          marginBottom: '16px',
          color: '#000'
        }}>
          🕌 MoUmroh
        </h1>
        <p style={{
          fontSize: '20px',
          color: '#666',
          marginBottom: '8px'
        }}>
          Platform Marketplace Paket Umroh Terpercaya
        </p>
        <p style={{
          fontSize: '16px',
          color: '#999',
          marginBottom: '40px'
        }}>
          Temukan paket umroh terbaik dari berbagai agensi terkemuka
        </p>
        {/* Search Bar */}
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          display: 'flex',
          gap: '8px'
        }}>
          <input
            type="text"
            placeholder="Cari paket umroh, destinasi, atau agensi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            style={{
              flex: 1,
              padding: '14px 16px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none'
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: '14px 32px',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Cari
          </button>
        </div>
      </section>
      {/* Featured Packages */}
      <section style={{
        maxWidth: '1200px',
        margin: '60px auto',
        padding: '0 20px'
      }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '8px',
          color: '#000'
        }}>
          Paket Unggulan
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#666',
          marginBottom: '40px'
        }}>
          Koleksi paket umroh pilihan dengan harga terjangkau
        </p>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#999' }}>Memuat paket...</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {packages.map(pkg => (
              <div key={pkg.id} style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                backgroundColor: '#fff'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.06)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
              onClick={() => navigate(`/package/${pkg.id}`)}
              >
                {/* Image */}
                <div style={{
                  height: '120px',
                  backgroundColor: '#e0e0e0',
                  backgroundImage: pkg.image ? `url('${pkg.image}')` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} />
                {/* Content */}
                <div style={{ padding: '12px' }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    marginBottom: '6px',
                    color: '#000',
                    lineHeight: '1.3',
                    minHeight: '2.6em'
                  }}>
                    {pkg.name}
                  </h3>

                  {/* Agency */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    color: '#0066cc',
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}>
                    <Building2 size={12} />
                    <span>{pkg.agencies || 'Agensi'}</span>
                  </div>

                  {/* Info Grid */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    marginBottom: '10px',
                    fontSize: '11px',
                    color: '#666'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} style={{ color: '#0066cc', flexShrink: 0 }} />
                      <span>{pkg.departureCity || 'Keberangkatan'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} style={{ color: '#0066cc', flexShrink: 0 }} />
                      <span>{pkg.destination}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} style={{ color: '#0066cc', flexShrink: 0 }} />
                      <span>{pkg.duration} Hari</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{
                    paddingTop: '8px',
                    borderTop: '1px solid #f0f0f0'
                  }}>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#000',
                      margin: 0
                    }}>
                      Rp{pkg.price?.toLocaleString('id-ID') || '0'}
                    </p>
                    <p style={{
                      fontSize: '10px',
                      color: '#999',
                      margin: '2px 0 0 0'
                    }}>
                      per orang
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* View All Button */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            onClick={() => navigate('/packages')}
            style={{
              padding: '14px 40px',
              backgroundColor: '#fff',
              color: '#000',
              border: '2px solid #000',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Lihat Semua Paket →
          </button>
        </div>
      </section>
      {/* Features Section */}
      <section style={{
        backgroundColor: '#f8f9fa',
        padding: '60px 20px',
        marginTop: '60px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '40px',
            textAlign: 'center',
            color: '#000'
          }}>
            Mengapa Pilih MoUmroh?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            {[
              { icon: '✓', title: 'Agensi Terpercaya', desc: 'Hanya dari agensi yang telah terverifikasi' },
              { icon: '💰', title: 'Harga Kompetitif', desc: 'Bandingkan harga dan pilih yang terbaik' },
              { icon: '🛡️', title: 'Aman & Terpercaya', desc: 'Proses booking yang transparan dan aman' },
              { icon: '⭐', title: 'Rating & Review', desc: 'Lihat ulasan dari ribuan jamaah' }
            ].map((feature, idx) => (
              <div key={idx} style={{
                textAlign: 'center',
                padding: '20px'
              }}>
                <p style={{
                  fontSize: '40px',
                  marginBottom: '16px'
                }}>
                  {feature.icon}
                </p>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  marginBottom: '8px',
                  color: '#000'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#666'
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
