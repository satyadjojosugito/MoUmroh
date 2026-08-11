import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Clock, Calendar, Building2, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';

const API_URL = process.env.REACT_APP_API_URL || 'https://mo-umroh-backend.vercel.app/api';

export default function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pkg, setPkg] = useState(null);
  const [agencyMap, setAgencyMap] = useState({});
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pkgRes, agencyRes] = await Promise.all([
          axios.get(`${API_URL}/packages`),
          axios.get(`${API_URL}/agencies`).catch(() => ({ data: [] })),
        ]);
 
        const map = {};
        (agencyRes.data || []).forEach(a => { map[String(a.id)] = a.name; });
        setAgencyMap(map);
 
        const found = (pkgRes.data || []).find(p => String(p.id) === String(id));
        setPkg(found || null);
      } catch (error) {
        console.error('Error fetching package:', error);
        setPkg(null);
      } finally {
        setLoading(false);
      }
    };
 
    fetchData();
  }, [id]);
 
  const formatCurrency = (amount) => `Rp${amount?.toLocaleString('id-ID') || '0'}`;
 
  const formatFullDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };
 
  const getAgencyLabel = (value) => {
    if (!value) return '';
    if (agencyMap[value]) return agencyMap[value];
    return /^[a-f0-9]{24}$/i.test(value) ? '' : value;
  };
 
  // Check authentication - if not logged in, show login modal
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
        <LoginModal
          isOpen={true}
          onClose={() => navigate('/packages')}
          onLoginSuccess={(user) => {
            login(user, localStorage.getItem('authToken'));
          }}
        />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: '#999', fontSize: '16px' }}>Silakan masuk untuk melihat detail paket...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#999', fontSize: '16px' }}>Memuat paket...</p>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#000' }}>
            Paket tidak ditemukan
          </h2>
          <button
            onClick={() => navigate('/packages')}
            style={{
              padding: '12px 28px',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600'
            }}
          >
            Kembali ke Daftar Paket
          </button>
        </div>
      </div>
    );
  }
 
  const agencyName = getAgencyLabel(pkg.agencies);
  const inclusions = Array.isArray(pkg.inclusions) ? pkg.inclusions : [];
  const itinerary = Array.isArray(pkg.itinerary) ? pkg.itinerary : [];
 
  const infoRow = (Icon, label, value) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
      <Icon size={18} style={{ color: '#0066cc', flexShrink: 0, marginTop: '2px' }} />
      <div>
        <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>{label}</p>
        <p style={{ fontSize: '15px', fontWeight: '600', color: '#000', margin: '2px 0 0 0' }}>{value}</p>
      </div>
    </div>
  );
 
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px 60px' }}>
 
        <button
          onClick={() => navigate('/packages')}
          style={{
            background: 'none',
            border: 'none',
            color: '#0066cc',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            padding: 0,
            marginBottom: '24px'
          }}
        >
          ← Kembali ke Daftar Paket
        </button>
 
        {/* Image */}
        {pkg.image && (
          <div style={{
            height: '280px',
            borderRadius: '12px',
            backgroundColor: '#e0e0e0',
            backgroundImage: `url('${pkg.image}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginBottom: '28px'
          }} />
        )}
 
        {/* Title */}
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#000', marginBottom: '8px', lineHeight: '1.2' }}>
          {pkg.name}
        </h1>
 
        {agencyName && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            color: '#0066cc',
            fontWeight: '600',
            marginBottom: '24px'
          }}>
            <Building2 size={15} />
            <span>{agencyName}</span>
          </div>
        )}
 
        {/* Price */}
        <div style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          marginBottom: '28px'
        }}>
          <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>Harga per orang</p>
          <p style={{ fontSize: '30px', fontWeight: '700', color: '#000', margin: '4px 0 0 0' }}>
            {formatCurrency(pkg.price)}
          </p>
        </div>
 
        {/* Key details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '4px 24px',
          padding: '20px',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          marginBottom: '28px'
        }}>
          {infoRow(MapPin, 'Tujuan', pkg.destination || '-')}
          {infoRow(MapPin, 'Kota Keberangkatan', pkg.departureCity || '-')}
          {infoRow(Calendar, 'Tanggal Keberangkatan', formatFullDate(pkg.departureDate))}
          {infoRow(Clock, 'Durasi', `${pkg.duration || '-'} Hari`)}
        </div>
 
        {/* Description */}
        {pkg.description && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#000', marginBottom: '12px' }}>
              Deskripsi
            </h2>
            <p style={{ fontSize: '15px', color: '#444', lineHeight: '1.7', margin: 0 }}>
              {pkg.description}
            </p>
          </div>
        )}
 
        {/* Inclusions */}
        {inclusions.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#000', marginBottom: '12px' }}>
              Yang Termasuk
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
              {inclusions.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckCircle size={17} style={{ color: '#16a34a', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '14px', color: '#444' }}>
                    {typeof item === 'string' ? item : item?.name || ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
 
        {/* Itinerary */}
        {itinerary.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#000', marginBottom: '12px' }}>
              Rencana Perjalanan
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {itinerary.map((day, idx) => {
                const isObject = day && typeof day === 'object';
                const title = isObject ? (day.title || `Hari ${day.day || idx + 1}`) : `Hari ${idx + 1}`;
                const body = isObject ? day.description : day;
                return (
                  <div key={idx} style={{ paddingBottom: '14px', borderBottom: '1px solid #f0f0f0' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0066cc', margin: '0 0 4px 0' }}>
                      {title}
                    </h3>
                    {body && (
                      <p style={{ fontSize: '14px', color: '#555', margin: 0, lineHeight: '1.6' }}>{body}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
 
        {/* Contact */}
        <div style={{
          padding: '24px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '15px', color: '#444', margin: '0 0 16px 0' }}>
            Tertarik dengan paket ini? Hubungi agensi untuk informasi lebih lanjut.
          </p>
          <button
            onClick={() => navigate('/contact')}
            style={{
              padding: '13px 36px',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600'
            }}
          >
            Hubungi Kami
          </button>
        </div>
 
      </div>
    </div>
  );
}
