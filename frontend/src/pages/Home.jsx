import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'https://mo-umroh-backend.vercel.app/api';
export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agencyMap, setAgencyMap] = useState({});
  useEffect(() => {
    fetchPackages();
  }, []);
  const fetchPackages = async () => {
  try {
    const [pkgRes, agencyRes] = await Promise.all([
      axios.get(`${API_URL}/packages`),
      axios.get(`${API_URL}/agencies`).catch(() => ({ data: [] })),
    ]);
    const map = {};
    (agencyRes.data || []).forEach(a => { map[String(a.id)] = a.name; });
    setAgencyMap(map);
    setPackages(pkgRes.data.slice(0, 12));
  } catch (error) {
    console.error('Error fetching packages:', error);
  } finally {
    setLoading(false);
  }
};
const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/packages?search=${encodeURIComponent(searchQuery)}`);
    }
  };
const getAgencyLabel = (value) => {
  if (!value) return 'Agensi';
  if (agencyMap[value]) return agencyMap[value];
  return /^[a-f0-9]{24}$/i.test(value) ? 'Agensi' : value;
};


  const formatDateMonthYear = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <section style={{
        padding: '60px 20px',
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
          fontSize: '16px',
          color: '#999',
          marginBottom: '40px'
        }}>
          Temukan paket umroh terbaik dari berbagai travel terkemuka
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
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
                <div style={{
                  height: '160px',
                  backgroundColor: '#e0e0e0',
                  backgroundImage: pkg.image ? `url('${pkg.image}')` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} />

                <div style={{ padding: '16px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    marginBottom: '6px',
                    color: '#000',
                    lineHeight: '1.3'
                  }}>
                    {pkg.name}
                  </h3>

                  {pkg.agencies && (
                    <p style={{
                      fontSize: '12px',
                      color: '#666',
                      marginBottom: '8px',
                      fontWeight: '600'
                    }}>
                      🏢 {getAgencyLabel(pkg.agencies)}
                    </p>
                  )}

                  <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                    ✈️ Tujuan: {pkg.destination}
                  </p>

                  <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                    📍 Keberangkatan: {pkg.departureCity}
                  </p>

                  <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>
                    📅 Bulan: {formatDateMonthYear(pkg.departureDate)}
                  </p>

                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '12px',
                    fontSize: '12px',
                    color: '#999',
                    flexWrap: 'wrap'
                  }}>
                    <span>📅 {pkg.duration} Hari</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div>
                      <p style={{ fontSize: '18px', fontWeight: '700', color: '#000', margin: 0 }}>
                        Rp{pkg.price?.toLocaleString('id-ID') || '0'}
                      </p>
                      <p style={{ fontSize: '11px', color: '#999', margin: '2px 0 0 0' }}>
                        per orang
                      </p>
                    </div>
                    <button
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#000',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
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
          maxWidth: '600px',
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
            gridTemplateColumns: '1fr',
            gap: '24px'
          }}>
            {[
              { icon: '✓', title: 'Agensi Terpercaya', desc: 'Hanya dari agensi yang telah terverifikasi' },
              { icon: '💰', title: 'Harga Kompetitif', desc: 'Bandingkan harga dan pilih yang terbaik' },
              { icon: '🛡️', title: 'Aman & Terpercaya', desc: 'Proses booking yang transparan dan aman' }
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
