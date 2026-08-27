import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();

  // Check if we're on a page where we should show minimal footer
  const isPackageDetailPage = location.pathname.startsWith('/package/');

  if (isPackageDetailPage) {
    // Minimal footer - only phone and email on package detail page
    return (
      <footer style={{
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e0e0e0',
        padding: '30px 20px',
        marginTop: '40px'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: '#000' }}>
            Contact Info
          </h3>
          <p style={{ fontSize: '14px', color: '#666', margin: '8px 0' }}>
            📞 +62 800-UMROH
          </p>
          <p style={{ fontSize: '14px', color: '#666', margin: '8px 0' }}>
            📧 info@moumroh.com
          </p>
        </div>
      </footer>
    );
  }

  // Full footer for other pages
  return (
    <footer style={{
      backgroundColor: '#000',
      color: '#fff',
      padding: '60px 20px 20px',
      marginTop: '60px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Brand Section */}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>
              MoUmroh
            </h3>
            <p style={{ fontSize: '14px', color: '#999', lineHeight: '1.6' }}>
              Your trusted marketplace for authentic umroh packages
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="/" style={{ color: '#999', textDecoration: 'none', fontSize: '14px' }}>
                  All Packages
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="/" style={{ color: '#999', textDecoration: 'none', fontSize: '14px' }}>
                  About Us
                </a>
              </li>
              <li>
                <a href="/" style={{ color: '#999', textDecoration: 'none', fontSize: '14px' }}>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>
              Contact Info
            </h4>
            <p style={{ fontSize: '14px', color: '#999', margin: '8px 0' }}>
              📞 +62 800-UMROH
            </p>
            <p style={{ fontSize: '14px', color: '#999', margin: '8px 0' }}>
              📧 info@moumroh.com
            </p>
            <p style={{ fontSize: '14px', color: '#999', margin: '8px 0' }}>
              📍 Jakarta, Indonesia
            </p>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>
              Newsletter
            </h4>
            <p style={{ fontSize: '14px', color: '#999', marginBottom: '12px' }}>
              Get special offers and updates
            </p>
            <input
              type="email"
              placeholder="Your email"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                marginBottom: '8px'
              }}
            />
            <button
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#0066cc',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          borderTop: '1px solid #333',
          paddingTop: '20px',
          textAlign: 'center',
          color: '#666',
          fontSize: '12px'
        }}>
          <p>© 2026 MoUmroh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}