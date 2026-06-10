'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      setUser(null);
      window.location.href = '/login';
    }
  };

  const isActive = (path) => {
    if (path === '/' && pathname === '/') return 'active';
    if (path !== '/' && pathname.startsWith(path)) return 'active';
    return '';
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm sticky-top">
        <div className="container">
          <Link href="/" className="navbar-brand fw-bold">
            <img 
              src="/assets/images/logo_minsel.png" 
              alt="Logo Minahasa Selatan" 
              width="35" 
              className="d-inline-block align-text-center me-2" 
            />
            Desa Pondos
          </Link>

          <input type="checkbox" id="nav-toggle" className="d-none nav-checkbox" />
          <label 
            htmlFor="nav-toggle" 
            className="navbar-toggler m-0 shadow-none border-0 pe-auto" 
            style={{ cursor: "pointer" }}
          >
            <span className="navbar-toggler-icon"></span>
          </label>

          <div className="collapse navbar-collapse menu-collapse mt-3 mt-lg-0" id="navbarNav">
            <ul className="navbar-nav ms-auto fw-medium align-items-center">
              <li className="nav-item">
                <Link href="/" className={`nav-link ${isActive('/')}`}>Beranda</Link>
              </li>
              <li className="nav-item">
                <Link href="/profil" className={`nav-link ${isActive('/profil')}`}>Profil</Link>
              </li>
              <li className="nav-item">
                <Link href="/layanan" className={`nav-link ${isActive('/layanan')}`}>Layanan</Link>
              </li>
              <li className="nav-item">
                <Link href="/berita" className={`nav-link ${isActive('/berita')}`}>Berita</Link>
              </li>
              <li className="nav-item">
                <Link href="/transparansi" className={`nav-link ${isActive('/transparansi')}`}>Transparansi</Link>
              </li>
              <li className="nav-item">
                <Link href="/kontak" className={`nav-link ${isActive('/kontak')}`}>Kontak</Link>
              </li>
              
              {user ? (
                <li className="nav-item dropdown ms-lg-3 w-100 w-lg-auto text-center">
                  <a className="nav-link dropdown-toggle btn btn-success text-white px-3 py-1.5 rounded-pill shadow-none" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="bi bi-person-circle me-1"></i> {user.name}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 rounded-3 text-start">
                    <li>
                      <Link href={user.role === 'admin' ? '/dashboard' : '/warga/dashboard'} className="dropdown-item py-2">
                        <i className={user.role === 'admin' ? 'bi bi-shield-lock-fill text-success me-2' : 'bi bi-person-badge-fill text-success me-2'}></i>
                        Dashboard {user.role === 'admin' ? 'Admin' : 'Warga'}
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider opacity-50" /></li>
                    <li>
                      <button onClick={handleLogout} className="dropdown-item text-danger py-2 border-0 bg-transparent w-100 text-start shadow-none">
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <li className="nav-item ms-lg-3 w-100 w-lg-auto text-center mt-2 mt-lg-0">
                  <Link href="/login" className="btn btn-outline-light rounded-pill px-4 py-1.5 fw-medium w-100">
                    <i className="bi bi-shield-lock-fill me-1"></i> Login Portal
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
