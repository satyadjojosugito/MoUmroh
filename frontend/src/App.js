import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PackageDetail from './pages/PackageDetail';
import AdminPanel from './pages/AdminPanel';
import { AuthProvider } from './context/AuthContext';

function AppContent() {
  const location = useLocation();

  // Hide header and footer on Home and PackageDetail pages
  const hideHeaderFooter = location.pathname === '/' || location.pathname.startsWith('/package/');

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/package/:id" element={<PackageDetail />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
