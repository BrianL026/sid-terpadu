'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

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
            <ul className="navbar-nav ms-auto fw-medium">
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
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
