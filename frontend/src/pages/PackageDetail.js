import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Calendar, Clock, Check } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'https://mo-umroh-backend.vercel.app/api';

export default function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPackageDetails = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/packages/${id}`);
      setPkg(response.data);
    } catch (err) {
      setError('Failed to load package details');
      console.error('Error fetching package:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPackageDetails();
  }, [fetchPackageDetails]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <p style={{ fontSize: '18px', color: '#666' }}>Memuat detail paket...</p>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        padding: '20px'
      }}>
        <p style={{ fontSize: '18px', color: '#d32f2f', marginBottom: '20px' }}>
          {error || 'Paket tidak ditemukan'}
        </p>
        <button
          onClick={() => navigate('/packages')}
          style={{
            padding: '12px 32px',
            backgroundColor: '#0066cc',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          Kembali ke Paket
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '40px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/packages')}
          style={{
            marginBottom: '30px',
            padding: '10px 16px',
            backgroundColor: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            color: '#0066cc',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f0f0f0';
            e.currentTarget.style.borderColor = '#0066cc';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#fff';
            e.currentTarget.style.borderColor = '#e0e0e0';
          }}
        >
          ← Kembali
        </button>

        {/* Main Content Card */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* Header Section */}
          <div style={{ padding: '40px 30px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '700',
              marginBottom: '12px',
              color: '#000'
            }}>
              {pkg.name}
            </h1>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
              Paket perjalanan umroh terpilih untuk pengalaman spiritual yang tak terlupakan
            </p>

            {/* Info Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              {/* Price */}
              <div style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '8px',
                border: '2px solid #0066cc'
              }}>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px', fontWeight: '600' }}>
                  HARGA PER ORANG
                </p>
                <p style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#0066cc',
                  margin: '0'
                }}>
                  Rp{pkg.price?.toLocaleString('id-ID') || '0'}
                </p>
              </div>

              {/* Duration */}
              <div style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Clock size={24} style={{ color: '#0066cc', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '12px', color: '#666', margin: 0, fontWeight: '600' }}>DURASI</p>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: '#000', margin: 0 }}>
                    {pkg.duration} Hari
                  </p>
                </div>
              </div>

              {/* Destination */}
              <div style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <MapPin size={24} style={{ color: '#0066cc', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '12px', color: '#666', margin: 0, fontWeight: '600' }}>TUJUAN</p>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: '#000', margin: 0 }}>
                    {pkg.destination}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div style={{ padding: '40px 30px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '24px',
              color: '#000'
            }}>
              Detail Paket
            </h2>

            {/* Departure Info */}
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '24px',
              borderRadius: '8px',
              marginBottom: '30px',
              border: '1px solid #e0e0e0'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#000' }}>
                Informasi Keberangkatan
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Calendar size={20} style={{ color: '#0066cc', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '12px', color: '#666', margin: 0, fontWeight: '600' }}>Tanggal Berangkat</p>
                    <p style={{ fontSize: '16px', fontWeight: '700', color: '#000', margin: '4px 0 0 0' }}>
                      {formatDate(pkg.departureDate)}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MapPin size={20} style={{ color: '#0066cc', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '12px', color: '#666', margin: 0, fontWeight: '600' }}>Kota Keberangkatan</p>
                    <p style={{ fontSize: '16px', fontWeight: '700', color: '#000', margin: '4px 0 0 0' }}>
                      {pkg.departureCity}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {pkg.description && (
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: '#000' }}>
                  Deskripsi Paket
                </h3>
                <p style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#666',
                  whiteSpace: 'pre-wrap'
                }}>
                  {pkg.description}
                </p>
              </div>
            )}

            {/* Included Features */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#000' }}>
                Yang Sudah Termasuk
              </h3>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '12px'
              }}>
                {[
                  'Tiket pesawat (pulang pergi)',
                  'Hotel bintang 3-4',
                  'Makan 3x sehari',
                  'Tour guide profesional',
                  'Asuransi perjalanan',
                  'Visa dan dokumen'
                ].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Check size={20} style={{ color: '#0066cc', flexShrink: 0 }} />
                    <span style={{ fontSize: '14px', color: '#333' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA Section */}
          <div style={{
            padding: '40px 30px',
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #e0e0e0',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
              Tertarik dengan paket ini? Hubungi kami sekarang untuk info lebih lanjut dan booking
            </p>
            <a
              href="https://wa.me/6285357106000"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '14px 48px',
                backgroundColor: '#25d366',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#20ba5a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#25d366'}
            >
              💬 Hubungi Kami via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
