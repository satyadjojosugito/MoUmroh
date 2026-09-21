import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import useSeo from '../hooks/useSeo';

const API_URL = process.env.REACT_APP_API_URL || 'https://mo-umroh-backend.vercel.app/api';

// The placeholder service is defunct, so treat any such URL as "no image"
const isDeadPlaceholder = (url) =>
  !url || /placeholder\.com/i.test(url);

function PackageImage({ src, alt }) {
  const [failed, setFailed] = useState(false);
  const showFallback = failed || isDeadPlaceholder(src);

  return (
    <div style={{
      width: '100%',
      height: '260px',
      backgroundColor: '#f0f0f0',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {showFallback ? (
        <div style={{
          textAlign: 'center',
          color: '#b0b0b0',
          fontSize: '13px',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '6px' }}>🕌</div>
          MoUmroh
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      )}
    </div>
  );
}

// Links point at real filtered URLs. The year is computed so a month that has
// already passed this year points at next year's departure instead of going stale.
const nextYearFor = (month) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  return month >= currentMonth ? now.getFullYear() : now.getFullYear() + 1;
};

const monthLink = (month, label) => ({
  label: `Umroh Bulan ${label}`,
  to: `/packages?departureMonth=${month}&departureYear=${nextYearFor(month)}`,
});

const SEO_GROUPS = [
  {
    title: 'Berdasarkan Kota Keberangkatan',
    links: [
      { label: 'Umroh dari Palembang', to: '/packages?departureCity=Palembang' },
      { label: 'Umroh dari Jakarta', to: '/packages?departureCity=Jakarta' },
    ],
  },
  {
    title: 'Berdasarkan Bulan Keberangkatan',
    links: [
      monthLink(10, 'Oktober'),
      monthLink(11, 'November'),
      monthLink(12, 'Desember'),
      monthLink(1, 'Januari'),
      // Ramadan is a Hijri month and drifts ~11 days earlier each year.
      // February is correct for 1448 AH (Feb 2027); recheck this each year.
      monthLink(2, 'Ramadhan'),
    ],
  },
];

export default function Home() {
  useSeo(
    'Marketplace Paket Umroh dari Travel Terpercaya',
    'Bandingkan paket umroh dari berbagai travel terverifikasi di Indonesia. Lihat harga, kota keberangkatan, dan jadwal dalam satu tempat.'
  );

  const navigate = useNavigate();
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

  const getAgencyLabel = (value) => {
    if (!value) return 'Agensi';
    if (agencyMap[value]) return agencyMap[value];
    return /^[a-f0-9]{24}$/i.test(value) ? 'Agensi' : value;
  };

  const formatDateMonthYear = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  useEffect(() => {
    updateArrows();
    window.addEventListener('resize', updateArrows);
    return () => window.removeEventListener('resize', updateArrows);
  }, [packages]);

  const scrollByCards = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 340, behavior: 'smooth' });
  };

  const arrowStyle = (side) => ({
    position: 'absolute',
    top: '50%',
    [side]: '-18px',
    transform: 'translateY(-50%)',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '1px solid #e0e0e0',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    cursor: 'pointer',
    fontSize: '16px',
    lineHeight: '1',
    zIndex: 2,
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <section style={{
        padding: '60px 20px',
        textAlign: 'center',
        backgroundImage: 'url("https://i.imgur.com/vLx2MA2.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
        borderBottom: '1px solid #e0e0e0',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Dark overlay for text readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 0
        }} />

        {/* Content wrapper - positioned above overlay */}
        <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            marginBottom: '16px',
            color: '#fff'
          }}>
            MoUmroh
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#fff',
            marginBottom: '40px'
          }}>
            Temukan paket umroh terbaik dari berbagai travel terkemuka
          </p>
        </div>
      </section>

      {/* Featured Packages */}
      <section style={{
        maxWidth: '1200px',
        margin: '30px auto',
        padding: '0 20px'
      }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#999' }}>Memuat paket...</p>
        ) : (
          <div style={{ position: 'relative' }}>
            {canScrollLeft && (
              <button onClick={() => scrollByCards(-1)} style={arrowStyle('left')} aria-label="Sebelumnya">
                ←
              </button>
            )}
            {canScrollRight && (
              <button onClick={() => scrollByCards(1)} style={arrowStyle('right')} aria-label="Berikutnya">
                →
              </button>
            )}
            <div
              ref={scrollRef}
              onScroll={updateArrows}
              style={{
                display: 'flex',
                gap: '20px',
                overflowX: 'auto',
                paddingBottom: '12px',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch'
              }}>
              {packages.map(pkg => (
                <div key={pkg.id} style={{
                  flex: '0 0 320px',
                  scrollSnapAlign: 'start',
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
                  <PackageImage src={pkg.image} alt={pkg.name} />
                  <div style={{ padding: '14px' }}>
                    <h3 style={{
                      fontSize: '15px',
                      fontWeight: '700',
                      marginBottom: '4px',
                      color: '#000',
                      lineHeight: '1.3'
                    }}>
                      {pkg.name}
                    </h3>

                    {pkg.agencies && (
                      <p style={{
                        fontSize: '11px',
                        color: '#666',
                        marginBottom: '4px',
                        fontWeight: '600'
                      }}>
                        🏢 {getAgencyLabel(pkg.agencies)}
                      </p>
                    )}

                    <p style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                      ✈️ Tujuan: {pkg.destination}
                    </p>

                    <p style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                      📍 Keberangkatan: {pkg.departureCity}
                    </p>

                    <p style={{ fontSize: '11px', color: '#666', marginBottom: '6px' }}>
                      📅 Berangkat: {formatDateMonthYear(pkg.departureDate)}
                    </p>

                    <div style={{
                      display: 'flex',
                      gap: '6px',
                      marginBottom: '8px',
                      fontSize: '10px',
                      color: '#999',
                      flexWrap: 'wrap'
                    }}>
                      <span>📅 {pkg.duration} Hari</span>
                    </div>

                    <p style={{ fontSize: '10px', color: '#999', margin: '0 0 2px 0' }}>
                      Mulai dari
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <p style={{ fontSize: '16px', fontWeight: '700', color: '#000', margin: 0 }}>
                        Rp{pkg.price?.toLocaleString('id-ID') || '0'}
                      </p>
                    </div>
                    <p style={{ fontSize: '10px', color: '#999', margin: '2px 0 0 0' }}>
                      per orang
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Hubungi Kami Button */}
        <div style={{ textAlign: 'center', marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center', alignItems: 'center', maxWidth: '400px', margin: '40px auto 0' }}>
        <a
            href="https://wa.me/6285357106000"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              width: '100%',
              padding: '14px 40px',
              backgroundColor: '#25d366',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'background-color 0.3s',
              boxSizing: 'border-box'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#20ba5a'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#25d366'}
          >
            💬 Hubungi Kami
          </a>
                    <Link
            to="/packages"
            style={{
              display: 'block',
              width: '100%',
              padding: '14px 40px',
              backgroundColor: '#fff',
              color: '#000',
              border: '2px solid #000',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              textDecoration: 'none',
              boxSizing: 'border-box'
            }}
          >
            Lihat Semua Paket →
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        backgroundImage: 'url("https://i.imgur.com/vLx2MA2.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: '60px 20px',
        marginTop: '60px',
        position: 'relative'
      }}>
        {/* Dark overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 0
        }} />

        {/* Content wrapper */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              marginBottom: '40px',
              textAlign: 'center',
              color: '#fff'
            }}>
              Mengapa Pilih MoUmroh?
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '24px'
            }}>
              {[
                { icon: '✓', title: 'Travel Terpercaya', desc: 'Paket umroh dari Travel yang telah terverifikasi' },
                { icon: '💰', title: 'Harga Kompetitif', desc: 'Bandingkan harga dan pilih yang terbaik' },
                { icon: '🛡️', title: 'Aman', desc: 'Proses booking yang transparan' }
              ].map((feature, idx) => (
                <div key={idx} style={{
                  textAlign: 'center',
                  padding: '20px'
                }}>
                  {idx === 0 ? (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      backgroundColor: '#0066cc',
                      color: '#fff',
                      fontSize: '28px',
                      fontWeight: 'bold',
                      marginBottom: '8px'
                    }}>
                      {feature.icon}
                    </div>
                  ) : (
                    <p style={{
                      fontSize: '40px',
                      marginBottom: '16px'
                    }}>
                      {feature.icon}
                    </p>
                  )}
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    marginBottom: '8px',
                    color: '#fff'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#e0e0e0'
                  }}>
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Browse by city / month */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 20px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '8px',
          color: '#000'
        }}>
          Jelajahi Paket Umroh
        </h2>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '28px' }}>
          Temukan paket berdasarkan kota keberangkatan atau bulan perjalanan
        </p>

        {SEO_GROUPS.map(group => (
          <div key={group.title} style={{ marginBottom: '28px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#333',
              marginBottom: '12px'
            }}>
              {group.title}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {group.links.map(link => (
                <Link
                  key={link.label}
                  to={link.to}
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '20px',
                    fontSize: '13px',
                    color: '#333',
                    textDecoration: 'none',
                    backgroundColor: '#fff'
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}