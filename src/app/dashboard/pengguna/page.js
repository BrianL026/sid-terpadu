'use client'

import { useState, useEffect } from 'react';

export default function KelolaPengguna() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all'); // 'all', 'admin', 'warga'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'approved', 'pending', 'rejected'
  const [currentUser, setCurrentUser] = useState(null); // Currently logged-in admin
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit'
  const [actionLoading, setActionLoading] = useState(false);

  // Temporary password display modal states
  const [tempPassword, setTempPassword] = useState('');
  const [tempPwdUserEmail, setTempPwdUserEmail] = useState('');
  const [showTempPwdModal, setShowTempPwdModal] = useState(false);

  // Form states (no password input)
  const [formNik, setFormNik] = useState('');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState('warga');
  const [formDusun, setFormDusun] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/pengguna');
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      } else {
        console.error('Failed to fetch users:', data.error);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormNik('');
    setFormName('');
    setFormEmail('');
    setFormRole('warga');
    setFormDusun('');
    setFormAddress('');
    setFormError('');
  };

  const handleOpenAddModal = () => {
    resetForm();
    setModalType('add');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    resetForm();
    setSelectedUser(user);
    setFormNik(user.nik);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormRole(user.role);
    setFormDusun(user.dusun || '');
    setFormAddress(user.address || '');
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formNik.trim() || !formName.trim() || !formEmail.trim() || !formRole) {
      setFormError('NIK, Nama, Email, dan Role wajib diisi.');
      return;
    }

    if (formNik.trim().length !== 16) {
      setFormError('NIK harus berupa 16 digit angka.');
      return;
    }

    setActionLoading(true);

    try {
      const url = modalType === 'add' ? '/api/pengguna' : `/api/pengguna/${selectedUser.id}`;
      const method = modalType === 'add' ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nik: formNik,
          name: formName,
          email: formEmail,
          role: formRole,
          dusun: formDusun,
          address: formAddress,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        await fetchUsers();
        handleCloseModal();
        
        // If creating a user, show the auto-generated password
        if (modalType === 'add' && data.tempPassword) {
          setTempPassword(data.tempPassword);
          setTempPwdUserEmail(formEmail);
          setShowTempPwdModal(true);
        }
      } else {
        setFormError(data.error || 'Terjadi kesalahan saat menyimpan data');
      }
    } catch (error) {
      setFormError('Gagal menghubungkan ke server');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async (id, email, name) => {
    if (!confirm(`Apakah Anda yakin ingin mereset password untuk "${name}"? Password baru akan dibuat secara otomatis.`)) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/pengguna/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetPassword: true }),
      });

      const data = await res.json();

      if (res.ok) {
        setTempPassword(data.tempPassword);
        setTempPwdUserEmail(email);
        setShowTempPwdModal(true);
      } else {
        alert(data.error || 'Gagal mereset password');
      }
    } catch (error) {
      alert('Terjadi kesalahan koneksi saat mereset password');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status, name) => {
    const actionText = status === 'approved' ? 'menyetujui' : 'menolak';
    if (!confirm(`Apakah Anda yakin ingin ${actionText} pendaftaran akun dari "${name}"?`)) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/pengguna/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        await fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal memperbarui status pendaftaran');
      }
    } catch (error) {
      alert('Terjadi kesalahan koneksi');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (currentUser && id === currentUser.id) {
      alert('Anda tidak dapat menghapus akun Anda sendiri.');
      return;
    }

    if (!confirm(`Apakah Anda yakin ingin menghapus akun pengguna "${name}"? Tindakan ini permanen.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/pengguna/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menghapus pengguna');
      }
    } catch (error) {
      alert('Terjadi kesalahan koneksi saat menghapus pengguna');
    }
  };

  // Stats calculations
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const wargaCount = users.filter(u => u.role === 'warga').length;
  const pendingApprovalsCount = users.filter(u => u.status === 'pending').length;

  // Filtered list
  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      user.nik.includes(query) ||
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.dusun || '').toLowerCase().includes(query) ||
      (user.address || '').toLowerCase().includes(query);

    return matchesRole && matchesStatus && matchesSearch;
  });

  return (
    <div>
      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm border-start border-success border-4 h-100">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">Total Terdaftar</p>
                  <h4 className="fw-bold text-dark mb-0">{totalUsers} orang</h4>
                </div>
                <div className="fs-3 text-success"><i className="bi bi-people-fill"></i></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm border-start border-primary border-4 h-100">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">Role Warga</p>
                  <h4 className="fw-bold text-primary mb-0">{wargaCount} orang</h4>
                </div>
                <div className="fs-3 text-primary"><i className="bi bi-person-fill"></i></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm border-start border-warning border-4 h-100">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">Role Admin</p>
                  <h4 className="fw-bold text-warning mb-0">{adminCount} orang</h4>
                </div>
                <div className="fs-3 text-warning"><i className="bi bi-shield-lock-fill"></i></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm border-start border-danger border-4 h-100">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">Butuh Persetujuan</p>
                  <h4 className="fw-bold text-danger mb-0">{pendingApprovalsCount} orang</h4>
                </div>
                <div className="fs-3 text-danger"><i className="bi bi-person-plus-fill"></i></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="card border-0 shadow-sm p-4">
        {/* Row 1: Filters */}
        <div className="row g-3 align-items-center justify-content-between mb-4">
          <div className="col-lg-7 d-flex flex-wrap gap-2">
            {/* Role filter */}
            <div className="btn-group btn-group-sm" role="group">
              <button 
                type="button" 
                className={`btn px-3 ${filterRole === 'all' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => setFilterRole('all')}
              >
                Semua Peran
              </button>
              <button 
                type="button" 
                className={`btn px-3 ${filterRole === 'warga' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => setFilterRole('warga')}
              >
                Warga
              </button>
              <button 
                type="button" 
                className={`btn px-3 ${filterRole === 'admin' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => setFilterRole('admin')}
              >
                Admin
              </button>
            </div>

            {/* Status filter */}
            <div className="btn-group btn-group-sm" role="group">
              <button 
                type="button" 
                className={`btn px-3 ${filterStatus === 'all' ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => setFilterStatus('all')}
              >
                Semua Status
              </button>
              <button 
                type="button" 
                className={`btn px-3 ${filterStatus === 'approved' ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => setFilterStatus('approved')}
              >
                Aktif
              </button>
              <button 
                type="button" 
                className={`btn px-3 ${filterStatus === 'pending' ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => setFilterStatus('pending')}
              >
                Persetujuan
              </button>
              <button 
                type="button" 
                className={`btn px-3 ${filterStatus === 'rejected' ? 'btn-dark' : 'btn-outline-dark'}`}
                onClick={() => setFilterStatus('rejected')}
              >
                Ditolak
              </button>
            </div>
          </div>
          
          {/* Row 2: Search and Add */}
          <div className="col-lg-5 d-flex gap-2">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
              <input 
                type="text" 
                className="form-control border-start-0" 
                placeholder="Cari NIK, nama, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn btn-success px-4 flex-shrink-0" onClick={handleOpenAddModal}>
              <i className="bi bi-person-plus me-2"></i>Tambah
            </button>
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Memuat data pengguna...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover-custom mb-0">
              <thead>
                <tr className="text-muted small">
                  <th className="ps-4 py-3 fw-medium">No</th>
                  <th className="py-3 fw-medium">NIK</th>
                  <th className="py-3 fw-medium">Nama Lengkap</th>
                  <th className="py-3 fw-medium">Email</th>
                  <th className="py-3 fw-medium">Role</th>
                  <th className="py-3 fw-medium">Status</th>
                  <th className="py-3 fw-medium">Dusun</th>
                  <th className="py-3 pe-4 fw-medium text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} className="align-middle">
                    <td className="ps-4">{index + 1}</td>
                    <td className="fw-mono small">{user.nik}</td>
                    <td className="fw-semibold text-dark">
                      {user.name}
                      {currentUser && user.id === currentUser.id && (
                        <span className="badge bg-secondary ms-2 small">Anda</span>
                      )}
                    </td>
                    <td>{user.email}</td>
                    <td>
                      {user.role === 'admin' ? (
                        <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
                          <i className="bi bi-shield-lock me-1"></i>Admin
                        </span>
                      ) : (
                        <span className="badge bg-light text-dark px-3 py-2 rounded-pill border">
                          <i className="bi bi-person me-1"></i>Warga
                        </span>
                      )}
                    </td>
                    <td>
                      {user.status === 'approved' && (
                        <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                          <i className="bi bi-check-circle me-1"></i>Aktif
                        </span>
                      )}
                      {user.status === 'pending' && (
                        <span className="badge bg-warning bg-opacity-10 text-warning-emphasis px-3 py-2 rounded-pill">
                          <i className="bi bi-hourglass-split me-1"></i>Persetujuan
                        </span>
                      )}
                      {user.status === 'rejected' && (
                        <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill">
                          <i className="bi bi-x-circle me-1"></i>Ditolak
                        </span>
                      )}
                    </td>
                    <td>{user.dusun || <span className="text-muted small">Tidak ada</span>}</td>
                    <td className="pe-4 text-center">
                      <div className="btn-group btn-group-sm">
                        {/* Approval buttons for pending users */}
                        {user.status === 'pending' ? (
                          <>
                            <button 
                              className="btn btn-success"
                              onClick={() => handleUpdateStatus(user.id, 'approved', user.name)}
                              title="Setujui Akun"
                              disabled={actionLoading}
                            >
                              <i className="bi bi-check-lg"></i> Setujui
                            </button>
                            <button 
                              className="btn btn-outline-danger"
                              onClick={() => handleUpdateStatus(user.id, 'rejected', user.name)}
                              title="Tolak Akun"
                              disabled={actionLoading}
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              className="btn btn-outline-primary"
                              onClick={() => handleOpenEditModal(user)}
                              title="Edit Data"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button 
                              className="btn btn-outline-warning text-dark"
                              onClick={() => handleResetPassword(user.id, user.email, user.name)}
                              title="Reset Password"
                              disabled={actionLoading}
                            >
                              <i className="bi bi-key-fill"></i>
                            </button>
                            <button 
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(user.id, user.name)}
                              disabled={currentUser && user.id === currentUser.id}
                              title="Hapus Akun"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-muted">
                      Tidak ada pengguna ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form Add/Edit (No Password Field!) */}
      {isModalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-dark text-white border-0 py-3">
                <h5 className="modal-title fw-bold">
                  {modalType === 'add' ? <><i className="bi bi-person-plus me-2"></i>Tambah Akun Pengguna</> : <><i className="bi bi-pencil me-2"></i>Edit Akun Pengguna</>}
                </h5>
                <button type="button" className="btn-close btn-close-white shadow-none" onClick={handleCloseModal} aria-label="Close"></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  {formError && (
                    <div className="alert alert-danger border-0 p-3 mb-3 small" role="alert">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>{formError}
                    </div>
                  )}

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted">Nomor Induk Kependudukan (NIK)</label>
                      <input 
                        type="text" 
                        maxLength="16"
                        pattern="\d{16}"
                        className="form-control p-2 fw-mono"
                        placeholder="Contoh: 7105001206980002"
                        value={formNik}
                        onChange={(e) => setFormNik(e.target.value.replace(/\D/g, ''))}
                        required
                      />
                      <div className="form-text small">Harus berupa 16 digit angka.</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted">Role Pengguna</label>
                      <select 
                        className="form-select p-2"
                        value={formRole}
                        onChange={(e) => setFormRole(e.target.value)}
                        disabled={currentUser && selectedUser && selectedUser.id === currentUser.id}
                      >
                        <option value="warga">Warga (Masyarakat)</option>
                        <option value="admin">Admin (Perangkat Desa)</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small text-muted">Nama Lengkap</label>
                      <input 
                        type="text" 
                        className="form-control p-2"
                        placeholder="Masukkan nama lengkap sesuai KTP..."
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small text-muted">Email Pengguna</label>
                      <input 
                        type="email" 
                        className="form-control p-2"
                        placeholder="Contoh: warga@email.com"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        required
                      />
                    </div>

                    {modalType === 'add' && (
                      <div className="col-12">
                        <div className="alert alert-info border-0 p-2 mb-0 small">
                          <i className="bi bi-info-circle-fill me-2"></i>
                          Password untuk pengguna baru akan digenerate secara otomatis oleh sistem demi keamanan.
                        </div>
                      </div>
                    )}

                    <div className="col-md-12">
                      <label className="form-label fw-semibold small text-muted">Wilayah Dusun (Opsional)</label>
                      <input 
                        type="text" 
                        className="form-control p-2"
                        placeholder="Contoh: Jaga 1, Jaga 2, Jaga 3, Jaga 4..."
                        value={formDusun}
                        onChange={(e) => setFormDusun(e.target.value)}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small text-muted">Alamat Lengkap (Opsional)</label>
                      <textarea 
                        className="form-control p-2"
                        rows="2"
                        placeholder="Masukkan alamat tinggal lengkap..."
                        value={formAddress}
                        onChange={(e) => setFormAddress(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-3 bg-light">
                  <button type="button" className="btn btn-outline-secondary px-4" onClick={handleCloseModal} disabled={actionLoading}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-success px-4" disabled={actionLoading}>
                    {actionLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Menyimpan...
                      </>
                    ) : (
                      'Simpan Pengguna'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Temporary Password Success Modal */}
      {showTempPwdModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow-lg text-center p-4">
              <div className="modal-body">
                <div className="display-4 text-success mb-3"><i className="bi bi-shield-check"></i></div>
                <h4 className="fw-bold text-dark mb-2">Password Pengguna Berhasil Dibuat</h4>
                <p className="text-muted small mb-4">
                  Silakan salin password sementara di bawah ini untuk diberikan secara pribadi kepada pengguna dengan email <strong>{tempPwdUserEmail}</strong>:
                </p>

                <div className="bg-light p-3 rounded-3 mb-4 border d-flex justify-content-between align-items-center">
                  <span className="fw-bold fs-5 text-dark font-monospace">{tempPassword}</span>
                  <button 
                    className="btn btn-sm btn-outline-success" 
                    onClick={() => {
                      navigator.clipboard.writeText(tempPassword);
                      alert('Password berhasil disalin ke clipboard!');
                    }}
                  >
                    <i className="bi bi-clipboard me-1"></i> Salin
                  </button>
                </div>

                <button 
                  type="button" 
                  className="btn btn-success px-5 rounded-pill" 
                  onClick={() => setShowTempPwdModal(false)}
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
