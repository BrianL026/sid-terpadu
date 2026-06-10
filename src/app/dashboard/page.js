'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

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
      fetchDashboardData();
    }
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      if (res.ok) {
        setStats(data.stats);
        setRecentDocs(data.recentDocuments);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await fetchDashboardData();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal memperbarui status');
      }
    } catch (error) {
      alert('Terjadi kesalahan koneksi');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (err) {
      console.error('Gagal memanggil API logout:', err);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge bg-warning text-dark">Proses</span>;
      case 'approved':
        return <span className="badge bg-success">Selesai</span>;
      case 'rejected':
        return <span className="badge bg-danger">Ditolak</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Memuat data...</span>
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
            <Link href="/dashboard" className="nav-link text-white sidebar-link rounded-3 px-3 py-2 bg-success bg-opacity-25">
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </Link>
          </li>
          <li className="nav-item mb-1">
            <a href="#" className="nav-link text-white sidebar-link rounded-3 px-3 py-2" onClick={(e) => { e.preventDefault(); alert('Fitur ini akan segera diaktifkan'); }}>
              <i className="bi bi-file-earmark-text me-2"></i>Kelola Surat
            </a>
          </li>
          <li className="nav-item mb-1">
            <a href="#" className="nav-link text-white sidebar-link rounded-3 px-3 py-2" onClick={(e) => { e.preventDefault(); alert('Fitur ini akan segera diaktifkan'); }}>
              <i className="bi bi-newspaper me-2"></i>Kelola Berita
            </a>
          </li>
          <li className="nav-item mb-1">
            <a href="#" className="nav-link text-white sidebar-link rounded-3 px-3 py-2" onClick={(e) => { e.preventDefault(); alert('Fitur ini akan segera diaktifkan'); }}>
              <i className="bi bi-building me-2"></i>Kelola Layanan
            </a>
          </li>
          <li className="nav-item mb-1">
            <a href="#" className="nav-link text-white sidebar-link rounded-3 px-3 py-2" onClick={(e) => { e.preventDefault(); alert('Fitur ini akan segera diaktifkan'); }}>
              <i className="bi bi-cash-stack me-2"></i>Kelola Anggaran
            </a>
          </li>
          <li className="nav-item mb-1">
            <a href="#" className="nav-link text-white sidebar-link rounded-3 px-3 py-2" onClick={(e) => { e.preventDefault(); alert('Fitur ini akan segera diaktifkan'); }}>
              <i className="bi bi-people me-2"></i>Kelola Pengguna
            </a>
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
            <h5 className="fw-bold text-dark mb-0"><i className="bi bi-speedometer2 me-2"></i>Dashboard</h5>
            <div className="d-flex align-items-center">
              <span className="text-muted me-3 small">Selamat datang,</span>
              <span className="badge bg-success bg-opacity-10 text-success fw-medium px-3 py-2 rounded-pill">
                <i className="bi bi-person-circle me-1"></i> {user?.name || 'Admin Desa'}
              </span>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="p-4">
          {/* Stat Cards */}
          <div className="row g-4 mb-4">
            <div className="col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100 card-hover-elevate border-start border-success border-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted small mb-1">Total Penduduk</p>
                      <h3 className="fw-bold text-dark mb-0">{stats?.totalPenduduk}</h3>
                    </div>
                    <div className="display-6 text-success"><i className="bi bi-people-fill"></i></div>
                  </div>
                  <small className="text-success">↑ 12 orang bulan ini</small>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100 card-hover-elevate border-start border-primary border-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted small mb-1">Surat Diproses</p>
                      <h3 className="fw-bold text-dark mb-0">{stats?.pendingDocumentsCount}</h3>
                    </div>
                    <div className="display-6 text-primary"><i className="bi bi-file-earmark-text"></i></div>
                  </div>
                  <small className="text-primary">Menunggu verifikasi admin</small>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100 card-hover-elevate border-start border-info border-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted small mb-1">Berita Dipublikasi</p>
                      <h3 className="fw-bold text-dark mb-0">{stats?.totalNews}</h3>
                    </div>
                    <div className="display-6 text-info"><i className="bi bi-newspaper"></i></div>
                  </div>
                  <small className="text-info">2 berita baru minggu ini</small>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100 card-hover-elevate border-start border-warning border-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted small mb-1">Layanan Aktif</p>
                      <h3 className="fw-bold text-dark mb-0">{stats?.layananAktif}</h3>
                    </div>
                    <div className="display-6 text-warning"><i className="bi bi-building"></i></div>
                  </div>
                  <small className="text-warning">Semua berjalan normal</small>
                </div>
              </div>
            </div>
          </div>

          {/* Table & Activity */}
          <div className="row g-4">
            {/* Recent Documents Table */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
                  <h5 className="fw-bold mb-0"><i className="bi bi-clipboard2-data me-2"></i>Surat Masuk Terbaru</h5>
                </div>
                <div className="card-body p-0 pt-3">
                  <div className="table-responsive">
                    <table className="table table-hover-custom mb-0">
                      <thead>
                        <tr className="text-muted small">
                          <th className="ps-4 py-3 fw-medium">No</th>
                          <th className="py-3 fw-medium">Nama Pemohon</th>
                          <th className="py-3 fw-medium">Jenis Surat</th>
                          <th className="py-3 fw-medium">Tanggal</th>
                          <th className="py-3 fw-medium">Status</th>
                          <th className="py-3 pe-4 fw-medium text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentDocs.map((doc, index) => (
                          <tr key={doc.id} className="align-middle">
                            <td className="ps-4">{index + 1}</td>
                            <td className="fw-medium">{doc.namaPemohon}</td>
                            <td>{doc.jenisSurat}</td>
                            <td>
                              {new Date(doc.tanggal).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                            <td>{getStatusBadge(doc.status)}</td>
                            <td className="pe-4 text-center">
                              {doc.status === 'pending' ? (
                                <div className="btn-group btn-group-sm">
                                  <button 
                                    className="btn btn-success" 
                                    disabled={actionLoading === doc.id}
                                    onClick={() => handleUpdateStatus(doc.id, 'approved')}
                                  >
                                    Setujui
                                  </button>
                                  <button 
                                    className="btn btn-outline-danger" 
                                    disabled={actionLoading === doc.id}
                                    onClick={() => handleUpdateStatus(doc.id, 'rejected')}
                                  >
                                    Tolak
                                  </button>
                                </div>
                              ) : (
                                <span className="text-muted small">Tidak ada aksi</span>
                              )}
                            </td>
                          </tr>
                        ))}
                        {recentDocs.length === 0 && (
                          <tr>
                            <td colSpan="6" className="text-center py-4 text-muted">Belum ada pengajuan surat masuk.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
                  <h5 className="fw-bold mb-0"><i className="bi bi-clock-history me-2"></i>Aktivitas Terakhir</h5>
                </div>
                <div className="card-body px-4 pt-3">
                  <div className="d-flex align-items-start mb-3 pb-3 border-bottom">
                    <span className="badge bg-success bg-opacity-10 text-success me-3 mt-1 p-2 rounded-circle"><i className="bi bi-check-circle-fill"></i></span>
                    <div>
                      <p className="mb-0 small fw-medium">Surat KK Denny Lontoh telah disetujui</p>
                      <small className="text-muted">2 jam yang lalu</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-start mb-3 pb-3 border-bottom">
                    <span className="badge bg-primary bg-opacity-10 text-primary me-3 mt-1 p-2 rounded-circle"><i className="bi bi-pencil-square"></i></span>
                    <div>
                      <p className="mb-0 small fw-medium">Berita Musrenbang 2026 dipublikasikan</p>
                      <small className="text-muted">5 jam yang lalu</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-start mb-3 pb-3 border-bottom">
                    <span className="badge bg-warning bg-opacity-10 text-warning me-3 mt-1 p-2 rounded-circle"><i className="bi bi-clipboard2-check"></i></span>
                    <div>
                      <p className="mb-0 small fw-medium">Permohonan surat baru dari Maria Wowor</p>
                      <small className="text-muted">Kemarin, 14:30</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-start mb-3 pb-3 border-bottom">
                    <span className="badge bg-info bg-opacity-10 text-info me-3 mt-1 p-2 rounded-circle"><i className="bi bi-cash-stack"></i></span>
                    <div>
                      <p className="mb-0 small fw-medium">Data anggaran Q1 2026 diperbarui</p>
                      <small className="text-muted">Kemarin, 09:15</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-start">
                    <span className="badge bg-danger bg-opacity-10 text-danger me-3 mt-1 p-2 rounded-circle"><i className="bi bi-person-plus-fill"></i></span>
                    <div>
                      <p className="mb-0 small fw-medium">Admin baru terdaftar: Operator Desa</p>
                      <small className="text-muted">2 hari yang lalu</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
