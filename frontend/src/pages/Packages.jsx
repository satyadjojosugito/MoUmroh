import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://mo-umroh-backend.vercel.app/api';

// Any image URL pointing at the defunct placeholder service is treated as "no image"
const isDeadPlaceholder = (url) =>
  !url || /via\.placeholder\.com|placeholder\.com/i.test(url);

function PackageImage({ src, alt }) {
  const [failed, setFailed] = useState(false);
  const showFallback = failed || isDeadPlaceholder(src);

  return (
    <div style={{
      width: '100%',
      height: '180px',
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

export default function Packages() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    maxPrice: '',
    departureCity: '',
    departureMonth: '',
    departureYear: '',
  });
  const [departureCities, setDepartureCities] = useState([]);
  const [years, setYears] = useState([]);
  const [agencyMap, setAgencyMap] = useState({});

  // Initialize years and cities on mount
  useEffect(() => {
    // Generate years from current year to 5 years ahead
    const currentYear = new Date().getFullYear();
    const yearList = [];
    for (let i = currentYear; i <= currentYear + 5; i++) {
      yearList.push(i.toString());
    }
    setYears(yearList);

    // Fetch packages to extract unique departure cities
    fetchAllPackages();
  }, []);

  const fetchAllPackages = async () => {
    try {
      const [pkgRes, agencyRes] = await Promise.all([
        axios.get(`${API_URL}/packages`),
        axios.get(`${API_URL}/agencies`).catch(() => ({ data: [] })),
      ]);
      const map = {};
      (agencyRes.data || []).forEach(a => { map[String(a.id)] = a.name; });
      setAgencyMap(map);
      const uniqueCities = [...new Set(pkgRes.data.map(pkg => pkg.departureCity))];
      setDepartureCities(uniqueCities.filter(Boolean).sort());
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const params = {};
        if (filters.search) params.search = filters.search;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        if (filters.departureCity) params.departureCity = filters.departureCity;
        if (filters.departureMonth) params.departureMonth = filters.departureMonth;
        if (filters.departureYear) params.departureYear = filters.departureYear;

        const response = await axios.get(`${API_URL}/packages`, { params });
        setPackages(response.data);
      } catch (error) {
        console.error('Error fetching packages:', error);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  // Format functions - MUST be defined before JSX
  const formatCurrency = (amount) => {
    return `Rp${amount?.toLocaleString('id-ID') || '0'}`;
  };

  const getAgencyLabel = (value) => {
    if (!value) return '';
    if (agencyMap[value]) return agencyMap[value];
    return /^[a-f0-9]{24}$/i.test(value) ? '' : value;
  };

  const formatDateMonthYear = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const months = [
    { value: '1', label: 'Januari' },
    { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' },
    { value: '4', label: 'April' },
    { value: '5', label: 'Mei' },
    { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' },
    { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ];

  const selectStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#000'
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
          <button
            onClick={() => navigate('/')}
            style={{
              marginBottom: '16px',
              padding: '8px 12px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#666',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            ← Kembali ke Beranda
          </button>
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
        padding: '40px 20px'
      }}>
        {/* Filter Section - Centered and Above */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '48px'
        }}>
          <aside style={{
            backgroundColor: '#f8f9fa',
            padding: '24px',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '900px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '20px',
              color: '#000',
              textAlign: 'center'
            }}>
              Filter
            </h3>

            {/* Filter Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px'
            }}>
              {/* Departure City */}
              <div>
                <label style={labelStyle}>Kota Keberangkatan</label>
                <select
                  value={filters.departureCity}
                  onChange={(e) => handleFilterChange('departureCity', e.target.value)}
                  style={selectStyle}
                >
                  <option value="">Semua Kota</option>
                  {departureCities.map(city => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Departure Month */}
              <div>
                <label style={labelStyle}>Bulan Keberangkatan</label>
                <select
                  value={filters.departureMonth}
                  onChange={(e) => handleFilterChange('departureMonth', e.target.value)}
                  style={selectStyle}
                >
                  <option value="">Semua Bulan</option>
                  {months.map(month => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Departure Year */}
              <div>
                <label style={labelStyle}>Tahun Keberangkatan</label>
                <select
                  value={filters.departureYear}
                  onChange={(e) => handleFilterChange('departureYear', e.target.value)}
                  style={selectStyle}
                >
                  <option value="">Semua Tahun</option>
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Maximum */}
              <div>
                <label style={labelStyle}>Harga Maksimal (Rp)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  style={selectStyle}
                />
              </div>

              {/* Reset Button */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-end'
              }}>
                <button
                  onClick={() => setFilters({ search: '', maxPrice: '', departureCity: '', departureMonth: '', departureYear: '' })}
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
              </div>
            </div>
          </aside>
        </div>

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
                    <PackageImage src={pkg.image} alt={pkg.name} />

                    {/* Content */}
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

                      {/* Agency */}
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

                      <p style={{
                        fontSize: '13px',
                        color: '#666',
                        marginBottom: '8px'
                      }}>
                        ✈️ Tujuan: {pkg.destination}
                      </p>

                      <p style={{
                        fontSize: '13px',
                        color: '#666',
                        marginBottom: '8px'
                      }}>
                        📍 Keberangkatan: {pkg.departureCity}
                      </p>

                      <p style={{
                        fontSize: '13px',
                        color: '#666',
                        marginBottom: '10px'
                      }}>
                        📅 Berangkat: {formatDateMonthYear(pkg.departureDate)}
                      </p>

                      {/* Specs */}
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

                      {/* Price and Button */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <div>
                          <p style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#000',
                            margin: 0
                          }}>
                            {formatCurrency(pkg.price)}
                          </p>
                          <p style={{
                            fontSize: '11px',
                            color: '#999',
                            margin: '2px 0 0 0'
                          }}>
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}
