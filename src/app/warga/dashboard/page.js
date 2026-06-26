'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WargaDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary', 'new-request', 'history', 'profile'
  
  // Form state
  const [formType, setFormType] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formAttachment, setFormAttachment] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Change password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        router.push('/login');
        return;
      }
      
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'warga') {
        router.push('/login');
        return;
      }
      
      setUser(parsedUser);
      fetchDashboardData();
    }
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch documents and profile from endpoints
      const [docRes, profileRes] = await Promise.all([
        fetch('/api/warga/documents'),
        fetch('/api/warga/profile')
      ]);

      if (docRes.ok && profileRes.ok) {
        const docData = await docRes.json();
        const profileData = await profileRes.json();
        setDocuments(docData.documents);
        setUser(profileData.user);
      } else if (docRes.status === 401 || profileRes.status === 401) {
        // Session expired or invalid
        localStorage.removeItem('user');
        router.push('/login');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setFormSuccess(false);

    if (!formType || !formNotes) {
      setFormError('Semua kolom wajib wajib diisi.');
      setFormLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/warga/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formType,
          notes: formNotes,
          attachmentUrl: formAttachment
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim pengajuan.');
      }

      setFormSuccess(true);
      setFormType('');
      setFormNotes('');
      setFormAttachment('');
      
      // Refresh documents
      await fetchDashboardData();
      
      // Auto transition to history tab after 2 seconds
      setTimeout(() => {
        setFormSuccess(false);
        setActiveTab('history');
      }, 2000);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdLoading(true);
    setPwdError('');
    setPwdSuccess('');

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPwdError('Semua kolom password wajib diisi.');
      setPwdLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPwdError('Konfirmasi password baru tidak cocok.');
      setPwdLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/warga/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmNewPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengubah password.');
      }

      setPwdSuccess('Password Anda berhasil diperbarui!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setPwdError(err.message);
    } finally {
      setPwdLoading(false);
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
        return <span className="badge bg-warning text-dark px-3 py-2"><i className="bi bi-clock-fill me-1"></i> Diproses</span>;
      case 'approved':
        return <span className="badge bg-success px-3 py-2"><i className="bi bi-check-circle-fill me-1"></i> Selesai</span>;
      case 'rejected':
        return <span className="badge bg-danger px-3 py-2"><i className="bi bi-x-circle-fill me-1"></i> Ditolak</span>;
      default:
        return <span className="badge bg-secondary px-3 py-2">{status}</span>;
    }
  };

  if (loading && !user) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Memuat data...</span>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalRequests = documents.length;
  const pendingCount = documents.filter(doc => doc.status === 'pending').length;
  const approvedCount = documents.filter(doc => doc.status === 'approved').length;
  const rejectedCount = documents.filter(doc => doc.status === 'rejected').length;

  return (
    <div className="bg-light min-vh-100">
      {/* Sidebar Warga */}
      <nav className="dashboard-sidebar bg-dark d-flex flex-column p-0">
        <div className="p-4 text-center border-bottom border-secondary">
          <img src="/assets/images/logo_minsel.png" alt="Logo Minahasa Selatan" width="50" className="mb-2" />
          <h6 className="text-white fw-bold mb-0">Portal Layanan Warga</h6>
          <small className="text-white opacity-50">Desa Pondos</small>
        </div>

        <ul className="nav flex-column mt-3 px-2">
          <li className="nav-item mb-1">
            <button 
              onClick={() => setActiveTab('summary')}
              className={`nav-link text-white sidebar-link rounded-3 px-3 py-2 w-100 text-start border-0 bg-transparent ${activeTab === 'summary' ? 'bg-success bg-opacity-25' : ''}`}
            >
              <i className="bi bi-speedometer2 me-2"></i>Ringkasan
            </button>
          </li>
          <li className="nav-item mb-1">
            <button 
              onClick={() => setActiveTab('new-request')}
              className={`nav-link text-white sidebar-link rounded-3 px-3 py-2 w-100 text-start border-0 bg-transparent ${activeTab === 'new-request' ? 'bg-success bg-opacity-25' : ''}`}
            >
              <i className="bi bi-file-earmark-plus me-2"></i>Buat Pengajuan
            </button>
          </li>
          <li className="nav-item mb-1">
            <button 
              onClick={() => setActiveTab('history')}
              className={`nav-link text-white sidebar-link rounded-3 px-3 py-2 w-100 text-start border-0 bg-transparent ${activeTab === 'history' ? 'bg-success bg-opacity-25' : ''}`}
            >
              <i className="bi bi-clock-history me-2"></i>Riwayat Pengajuan
            </button>
          </li>
          <li className="nav-item mb-1">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`nav-link text-white sidebar-link rounded-3 px-3 py-2 w-100 text-start border-0 bg-transparent ${activeTab === 'profile' ? 'bg-success bg-opacity-25' : ''}`}
            >
              <i className="bi bi-person-bounding-box me-2"></i>Profil Saya
            </button>
          </li>
        </ul>

        <div className="mt-auto p-3 border-top border-secondary">
          <Link href="/" className="nav-link text-white sidebar-link rounded-3 px-3 py-2 mb-1">
            <i className="bi bi-house-door me-2"></i>Lihat Website
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
              {activeTab === 'summary' && <><i className="bi bi-speedometer2 text-success me-2"></i>Ringkasan Layanan</>}
              {activeTab === 'new-request' && <><i className="bi bi-file-earmark-plus text-success me-2"></i>Formulir Pengajuan Baru</>}
              {activeTab === 'history' && <><i className="bi bi-clock-history text-success me-2"></i>Riwayat Pengajuan Surat</>}
              {activeTab === 'profile' && <><i className="bi bi-person-bounding-box text-success me-2"></i>Data Profil Warga</>}
            </h5>
            <div className="d-flex align-items-center">
              <span className="text-muted me-3 small d-none d-sm-inline">Selamat datang,</span>
              <span className="badge bg-success bg-opacity-10 text-success fw-medium px-3 py-2 rounded-pill">
                <i className="bi bi-person-circle me-1"></i> {user?.name}
              </span>
            </div>
          </div>
        </nav>

        {/* Dynamic Panels */}
        <div className="p-4">
          
          {/* TAB 1: SUMMARY */}
          {activeTab === 'summary' && (
            <div>
              {/* Welcome Alert */}
              <div className="alert alert-success border-0 shadow-sm rounded-4 p-4 mb-4 d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="fw-bold alert-heading mb-1">Halo, {user?.name}!</h4>
                  <p className="mb-0 text-success opacity-85">Melalui portal warga ini, Anda dapat mengurus dokumen kependudukan secara digital tanpa harus menunggu lama di kantor desa.</p>
                </div>
                <button onClick={() => setActiveTab('new-request')} className="btn btn-success rounded-pill px-4 py-2 fw-bold d-none d-md-block shadow-sm">
                  <i className="bi bi-plus-lg me-1"></i> Buat Surat Baru
                </button>
              </div>

              {/* Stats Cards */}
              <div className="row g-4 mb-4">
                <div className="col-md-6 col-lg-3">
                  <div className="card border-0 shadow-sm h-100 border-start border-primary border-4 card-hover-elevate">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className="text-muted small mb-1">Total Pengajuan</p>
                          <h3 className="fw-bold text-dark mb-0">{totalRequests}</h3>
                        </div>
                        <div className="display-6 text-primary"><i className="bi bi-file-earmark-text"></i></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="card border-0 shadow-sm h-100 border-start border-warning border-4 card-hover-elevate">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className="text-muted small mb-1">Sedang Diproses</p>
                          <h3 className="fw-bold text-dark mb-0">{pendingCount}</h3>
                        </div>
                        <div className="display-6 text-warning"><i className="bi bi-clock-history"></i></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="card border-0 shadow-sm h-100 border-start border-success border-4 card-hover-elevate">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className="text-muted small mb-1">Selesai Disetujui</p>
                          <h3 className="fw-bold text-dark mb-0">{approvedCount}</h3>
                        </div>
                        <div className="display-6 text-success"><i className="bi bi-check-circle-fill"></i></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <div className="card border-0 shadow-sm h-100 border-start border-danger border-4 card-hover-elevate">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className="text-muted small mb-1">Ditolak</p>
                          <h3 className="fw-bold text-dark mb-0">{rejectedCount}</h3>
                        </div>
                        <div className="display-6 text-danger"><i className="bi bi-x-circle-fill"></i></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Requests Summary Table */}
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0"><i className="bi bi-clipboard-data me-2 text-success"></i>Pengajuan Terkini</h5>
                  <button onClick={() => setActiveTab('history')} className="btn btn-sm btn-link text-success fw-bold text-decoration-none">
                    Lihat Semua <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
                <div className="card-body p-0 pt-3">
                  <div className="table-responsive">
                    <table className="table table-hover-custom mb-0">
                      <thead>
                        <tr className="text-muted small">
                          <th className="ps-4 py-3 fw-medium">No</th>
                          <th className="py-3 fw-medium">Jenis Surat</th>
                          <th className="py-3 fw-medium">Tanggal Pengajuan</th>
                          <th className="py-3 fw-medium">Keterangan</th>
                          <th className="py-3 pe-4 fw-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {documents.slice(0, 3).map((doc, index) => (
                          <tr key={doc.id} className="align-middle">
                            <td className="ps-4">{index + 1}</td>
                            <td className="fw-medium text-dark">{doc.type}</td>
                            <td>
                              {new Date(doc.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </td>
                            <td>{doc.notes.length > 50 ? `${doc.notes.slice(0, 50)}...` : doc.notes}</td>
                            <td className="pe-4">{getStatusBadge(doc.status)}</td>
                          </tr>
                        ))}
                        {documents.length === 0 && (
                          <tr>
                            <td colSpan="5" className="text-center py-4 text-muted">Belum ada pengajuan surat.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NEW REQUEST FORM */}
          {activeTab === 'new-request' && (
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-4 p-md-5">
                    <h5 className="fw-bold mb-4"><i className="bi bi-file-earmark-plus text-success me-2"></i>Pengajuan Dokumen Baru</h5>
                    
                    {formSuccess && (
                      <div className="alert alert-success border-0 shadow-sm py-3 px-4 mb-4" role="alert">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        <strong>Pengajuan berhasil terkirim!</strong> Halaman akan dialihkan ke riwayat pengajuan...
                      </div>
                    )}

                    {formError && (
                      <div className="alert alert-danger py-2 px-3 small mb-4" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i> {formError}
                      </div>
                    )}

                    <form onSubmit={handleSubmitRequest}>
                      <div className="mb-3">
                        <label htmlFor="requestType" className="form-label fw-bold text-muted small">Jenis Layanan Dokumen</label>
                        <select 
                          className="form-select border-2 py-2.5" 
                          id="requestType"
                          value={formType}
                          onChange={(e) => setFormType(e.target.value)}
                          required
                        >
                          <option value="" disabled>-- Pilih Dokumen --</option>
                          <option value="Surat Pengantar RT/RW">Surat Pengantar RT/RW</option>
                          <option value="Kartu Keluarga">Kartu Keluarga (KK)</option>
                          <option value="Akta Kelahiran">Akta Kelahiran</option>
                          <option value="KTP Elektronik">KTP Elektronik (e-KTP)</option>
                          <option value="Surat Pengantar Nikah">Surat Pengantar Nikah (N1/N2/N4)</option>
                          <option value="Surat Keterangan Usaha">Surat Keterangan Usaha (SKU)</option>
                          <option value="Surat Keterangan Tidak Mampu">Surat Keterangan Tidak Mampu (SKTM)</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="notes" className="form-label fw-bold text-muted small">Alasan / Keperluan Pengajuan</label>
                        <textarea 
                          className="form-control border-2" 
                          id="notes" 
                          rows={4} 
                          placeholder="Jelaskan alasan atau keperluan pengajuan surat ini secara rinci (misal: Keperluan melamar pekerjaan, pemecahan KK baru setelah menikah, dll)"
                          value={formNotes}
                          onChange={(e) => setFormNotes(e.target.value)}
                          required
                        ></textarea>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="attachment" className="form-label fw-bold text-muted small">Tautan Berkas Pendukung (Opsional)</label>
                        <input 
                          type="url" 
                          className="form-control border-2 py-2.5" 
                          id="attachment" 
                          placeholder="https://drive.google.com/drive/folders/... (Tautan Google Drive berkas persyaratan seperti KTP/KK lama)"
                          value={formAttachment}
                          onChange={(e) => setFormAttachment(e.target.value)}
                        />
                        <div className="form-text small text-muted">
                          Jika berkas persyaratan lebih dari satu, silakan satukan di folder Cloud Storage (Google Drive/OneDrive) dan tempel tautannya di atas. Pastikan tautan disetel ke public ("Siapa saja yang memiliki link").
                        </div>
                      </div>

                      <div className="d-flex justify-content-end gap-3 mt-4">
                        <button 
                          type="button" 
                          onClick={() => setActiveTab('summary')}
                          className="btn btn-outline-secondary px-4 py-2 fw-medium rounded-pill"
                          disabled={formLoading}
                        >
                          Batal
                        </button>
                        <button 
                          type="submit" 
                          className="btn btn-success px-4 py-2 fw-medium rounded-pill"
                          disabled={formLoading}
                        >
                          {formLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Mengirim...
                            </>
                          ) : 'Kirim Pengajuan'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HISTORY */}
          {activeTab === 'history' && (
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
                <h5 className="fw-bold mb-0"><i className="bi bi-list-task text-success me-2"></i>Daftar Riwayat Pengajuan</h5>
              </div>
              <div className="card-body p-0 pt-3">
                <div className="table-responsive">
                  <table className="table table-hover-custom mb-0">
                    <thead>
                      <tr className="text-muted small">
                        <th className="ps-4 py-3 fw-medium">No</th>
                        <th className="py-3 fw-medium">Jenis Surat</th>
                        <th className="py-3 fw-medium">Tanggal Diajukan</th>
                        <th className="py-3 fw-medium">Alasan / Keperluan</th>
                        <th className="py-3 fw-medium">Berkas</th>
                        <th className="py-3 pe-4 fw-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc, index) => (
                        <tr key={doc.id} className="align-middle">
                          <td className="ps-4">{index + 1}</td>
                          <td className="fw-medium text-dark">{doc.type}</td>
                          <td>
                            {new Date(doc.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })} WITA
                          </td>
                          <td>{doc.notes}</td>
                          <td>
                            {doc.attachmentUrl ? (
                              <a href={doc.attachmentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary py-1 px-2 rounded-pill">
                                <i className="bi bi-box-arrow-up-right me-1"></i> Buka Link
                              </a>
                            ) : (
                              <span className="text-muted small">-</span>
                            )}
                          </td>
                          <td className="pe-4">{getStatusBadge(doc.status)}</td>
                        </tr>
                      ))}
                      {documents.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center py-5 text-muted">
                            <i className="bi bi-inbox display-4 mb-3 d-block text-black-50"></i>
                            Belum ada riwayat pengajuan surat.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-4 p-md-5">
                    <h5 className="fw-bold mb-4"><i className="bi bi-person-circle text-success me-2"></i>Informasi Akun Kependudukan</h5>
                    
                    <div className="alert alert-info border-0 shadow-sm mb-4 d-flex align-items-start">
                      <i className="bi bi-info-circle-fill me-3 fs-5 mt-0.5"></i>
                      <div>
                        <h6 className="fw-bold mb-1">Perubahan Data Kependudukan</h6>
                        <p className="mb-0 small opacity-85">Data kependudukan (NIK, Nama, Alamat, dan Dusun) bersumber dari database dinas dukcapil. Jika terdapat kekeliruan data, silakan hubungi Kantor Desa Pondos dengan membawa berkas asli (KK/KTP) untuk verifikasi ulang.</p>
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold mb-1">Nomor Induk Kependudukan (NIK)</label>
                        <div className="p-3 bg-light rounded-3 fw-bold text-dark border-start border-success border-3 shadow-none">
                          {user?.nik}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold mb-1">Nama Lengkap</label>
                        <div className="p-3 bg-light rounded-3 fw-medium text-dark shadow-none">
                          {user?.name}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold mb-1">Alamat Email</label>
                        <div className="p-3 bg-light rounded-3 fw-medium text-dark shadow-none">
                          {user?.email}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold mb-1">Dusun / Jaga</label>
                        <div className="p-3 bg-light rounded-3 fw-medium text-dark shadow-none">
                          {user?.dusun || 'Jaga II'}
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="form-label text-muted small fw-bold mb-1">Alamat Lengkap Rumah</label>
                        <div className="p-3 bg-light rounded-3 fw-medium text-dark shadow-none">
                          {user?.address || 'Desa Pondos, Jaga II, Kecamatan Amurang Barat, Kabupaten Minahasa Selatan'}
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="form-label text-muted small fw-bold mb-1">Tanggal Terdaftar Akun</label>
                        <div className="p-3 bg-light rounded-3 text-muted small shadow-none">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          }) : '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TAB 4: CHANGE PASSWORD CARD */}
                <div className="card border-0 shadow-sm rounded-4 mt-4">
                  <div className="card-body p-4 p-md-5">
                    <h5 className="fw-bold mb-4"><i className="bi bi-shield-lock text-success me-2"></i>Ubah Password Akun</h5>
                    
                    {pwdSuccess && (
                      <div className="alert alert-success border-0 shadow-sm py-2 px-3 small mb-4" role="alert">
                        <i className="bi bi-check-circle-fill me-2"></i> {pwdSuccess}
                      </div>
                    )}
                    
                    {pwdError && (
                      <div className="alert alert-danger border-0 shadow-sm py-2 px-3 small mb-4" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i> {pwdError}
                      </div>
                    )}
                    
                    <form onSubmit={handleChangePassword}>
                      <div className="mb-3">
                        <label htmlFor="currentPwd" className="form-label text-muted small fw-bold mb-1">Password Saat Ini</label>
                        <input 
                          type="password" 
                          className="form-control border-2 py-2" 
                          id="currentPwd" 
                          placeholder="Masukkan password saat ini..."
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="row g-3 mb-4">
                        <div className="col-md-6">
                          <label htmlFor="newPwd" className="form-label text-muted small fw-bold mb-1">Password Baru</label>
                          <input 
                            type="password" 
                            className="form-control border-2 py-2" 
                            id="newPwd" 
                            placeholder="Masukkan password baru..."
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="confirmNewPwd" className="form-label text-muted small fw-bold mb-1">Konfirmasi Password Baru</label>
                          <input 
                            type="password" 
                            className="form-control border-2 py-2" 
                            id="confirmNewPwd" 
                            placeholder="Ulangi password baru..."
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <button 
                        type="submit" 
                        className="btn btn-success px-4 py-2 fw-medium rounded-pill"
                        disabled={pwdLoading}
                      >
                        {pwdLoading ? 'Menyimpan...' : 'Perbarui Password'}
                      </button>
                    </form>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
