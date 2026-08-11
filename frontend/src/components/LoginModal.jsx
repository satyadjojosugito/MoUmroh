import React, { useState } from 'react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'https://mo-umroh-backend.vercel.app/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'An error occurred');
        setLoading(false);
        return;
      }

      // Store token in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Call success callback
      onLoginSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '24px',
          color: '#000',
          textAlign: 'center',
        }}>
          {isLogin ? 'Masuk Akun' : 'Daftar Akun'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#000',
            }}>
              Nomor Telepon
            </label>
            <input
              type="tel"
              placeholder="08xx xxxx xxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#000',
            }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
              required
              minLength="6"
            />
          </div>

          {error && (
            <div style={{
              padding: '10px',
              marginBottom: '16px',
              backgroundColor: '#fee',
              color: '#c00',
              borderRadius: '6px',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px 12px',
              backgroundColor: loading ? '#ccc' : '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '12px',
            }}
          >
            {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          fontSize: '14px',
          color: '#666',
          marginBottom: '12px',
        }}>
          {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
          {' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setPhone('');
              setPassword('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#000',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
          </button>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '10px 12px',
            backgroundColor: '#f0f0f0',
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
