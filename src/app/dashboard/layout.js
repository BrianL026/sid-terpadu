'use client'

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        router.push('/login');
        return;
      }
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'admin') {
        router.push('/login');
        return;
      }
      setUser(parsedUser);
      setLoading(false);
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  const isActive = (path) => {
    return pathname === path ? 'bg-success bg-opacity-25' : '';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Memuat...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      {/* Sidebar */}
      <nav className="dashboard-sidebar bg-dark d-flex flex-column p-0">
        <div className="p-4 text-center border-bottom border-secondary">
          <img src="/assets/images/logo_minsel.png" alt="Logo Minahasa Selatan" width="50" className="mb-2" />
          <h6 className="text-white fw-bold mb-0">Dashboard Admin</h6>
          <small className="text-white opacity-50">Desa Pondos</small>
        </div>

        <ul className="nav flex-column mt-3 px-2">
          <li className="nav-item mb-1">
            <Link href="/dashboard" className={`nav-link text-white sidebar-link rounded-3 px-3 py-2 ${isActive('/dashboard')}`}>
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </Link>
          </li>
          <li className="nav-item mb-1">
            <Link href="/dashboard/surat" className={`nav-link text-white sidebar-link rounded-3 px-3 py-2 ${isActive('/dashboard/surat')}`}>
              <i className="bi bi-file-earmark-text me-2"></i>Kelola Surat
            </Link>
          </li>
          <li className="nav-item mb-1">
            <Link href="/dashboard/berita" className={`nav-link text-white sidebar-link rounded-3 px-3 py-2 ${isActive('/dashboard/berita')}`}>
              <i className="bi bi-newspaper me-2"></i>Kelola Berita
            </Link>
          </li>
          <li className="nav-item mb-1">
            <Link href="/dashboard/anggaran" className={`nav-link text-white sidebar-link rounded-3 px-3 py-2 ${isActive('/dashboard/anggaran')}`}>
              <i className="bi bi-cash-stack me-2"></i>Kelola Anggaran
            </Link>
          </li>
          <li className="nav-item mb-1">
            <Link href="/dashboard/pengguna" className={`nav-link text-white sidebar-link rounded-3 px-3 py-2 ${isActive('/dashboard/pengguna')}`}>
              <i className="bi bi-people me-2"></i>Kelola Pengguna
            </Link>
          </li>
          <li className="nav-item mb-1">
            <Link href="/dashboard/kontak" className={`nav-link text-white sidebar-link rounded-3 px-3 py-2 ${isActive('/dashboard/kontak')}`}>
              <i className="bi bi-chat-right-text me-2"></i>Aspirasi & Pengaduan
            </Link>
          </li>
          <li className="nav-item mb-1">
            <Link href="/dashboard/aktivitas" className={`nav-link text-white sidebar-link rounded-3 px-3 py-2 ${isActive('/dashboard/aktivitas')}`}>
              <i className="bi bi-clock-history me-2"></i>Log Aktivitas
            </Link>
          </li>
        </ul>

        <div className="mt-auto p-3 border-top border-secondary">
          <Link href="/" className="nav-link text-white sidebar-link rounded-3 px-3 py-2 mb-1">
            <i className="bi bi-globe me-2"></i>Lihat Website
          </Link>
          <button onClick={handleLogout} className="btn btn-link nav-link text-danger text-start sidebar-link rounded-3 px-3 py-2 w-100 border-0 shadow-none">
            <i className="bi bi-box-arrow-right me-2"></i>Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Top Bar */}
        <nav className="navbar bg-white shadow-sm px-4 py-3">
          <div className="container-fluid">
            <h5 className="fw-bold text-dark mb-0">
              {pathname === '/dashboard' && <><i className="bi bi-speedometer2 me-2"></i>Dashboard</>}
              {pathname === '/dashboard/surat' && <><i className="bi bi-file-earmark-text me-2"></i>Kelola Surat Masuk</>}
              {pathname === '/dashboard/berita' && <><i className="bi bi-newspaper me-2"></i>Kelola Berita Desa</>}
              {pathname === '/dashboard/anggaran' && <><i className="bi bi-cash-stack me-2"></i>Kelola APBDes</>}
              {pathname === '/dashboard/pengguna' && <><i className="bi bi-people me-2"></i>Kelola Akun Pengguna</>}
              {pathname === '/dashboard/kontak' && <><i className="bi bi-chat-right-text me-2"></i>Aspirasi & Pengaduan</>}
              {pathname === '/dashboard/aktivitas' && <><i className="bi bi-clock-history me-2"></i>Log Aktivitas</>}
            </h5>
            <div className="d-flex align-items-center">
              <span className="text-muted me-3 small">Selamat datang,</span>
              <span className="badge bg-success bg-opacity-10 text-success fw-medium px-3 py-2 rounded-pill">
                <i className="bi bi-person-circle me-1"></i> {user?.name || 'Admin Desa'}
              </span>
            </div>
          </div>
        </nav>

        {/* Content Panel */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
