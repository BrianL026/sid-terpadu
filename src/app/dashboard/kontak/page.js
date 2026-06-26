'use client'

import { useState, useEffect } from 'react';

export default function KelolaKontak() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/contact');
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages || []);
      } else {
        console.error('Failed to fetch messages:', data.error);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetailModal = (msg) => {
    setSelectedMessage(msg);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pesan pengaduan ini secara permanen?')) {
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchMessages();
        handleCloseModal();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menghapus pesan');
      }
    } catch (error) {
      alert('Terjadi kesalahan koneksi saat menghapus pesan');
    } finally {
      setActionLoading(false);
    }
  };

  // Stats calculations
  const totalCount = messages.length;
  const pengaduanCount = messages.filter(m => m.subject === 'Pengaduan').length;
  const saranCount = messages.filter(m => m.subject === 'Saran & Masukan').length;
  const pertanyaanCount = messages.filter(m => m.subject === 'Pertanyaan Layanan' || m.subject === 'Informasi Umum').length;

  // Filtered list
  const filteredMessages = messages.filter(msg => {
    const matchesSubject = filterSubject === 'all' || msg.subject === filterSubject;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      msg.name.toLowerCase().includes(query) ||
      msg.email.toLowerCase().includes(query) ||
      msg.subject.toLowerCase().includes(query) ||
      msg.message.toLowerCase().includes(query);

    return matchesSubject && matchesSearch;
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
                  <p className="text-muted small mb-1">Total Pesan Masuk</p>
                  <h4 className="fw-bold text-dark mb-0">{totalCount} pesan</h4>
                </div>
                <div className="fs-3 text-success"><i className="bi bi-chat-right-text-fill"></i></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm border-start border-danger border-4 h-100">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">Kategori Pengaduan</p>
                  <h4 className="fw-bold text-danger mb-0">{pengaduanCount} pesan</h4>
                </div>
                <div className="fs-3 text-danger"><i className="bi bi-exclamation-triangle-fill"></i></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm border-start border-primary border-4 h-100">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">Saran & Masukan</p>
                  <h4 className="fw-bold text-primary mb-0">{saranCount} pesan</h4>
                </div>
                <div className="fs-3 text-primary"><i className="bi bi-lightbulb-fill"></i></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm border-start border-info border-4 h-100">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">Tanya & Info</p>
                  <h4 className="fw-bold text-info mb-0">{pertanyaanCount} pesan</h4>
                </div>
                <div className="fs-3 text-info"><i className="bi bi-info-circle-fill"></i></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="card border-0 shadow-sm p-4">
        {/* Search & Subject filter */}
        <div className="row g-3 align-items-center justify-content-between mb-4">
          <div className="col-lg-7 d-flex flex-wrap gap-2">
            <div className="btn-group btn-group-sm" role="group">
              <button
                type="button"
                className={`btn px-3 ${filterSubject === 'all' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => setFilterSubject('all')}
              >
                Semua Pesan
              </button>
              <button
                type="button"
                className={`btn px-3 ${filterSubject === 'Pengaduan' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => setFilterSubject('Pengaduan')}
              >
                Pengaduan
              </button>
              <button
                type="button"
                className={`btn px-3 ${filterSubject === 'Saran & Masukan' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => setFilterSubject('Saran & Masukan')}
              >
                Saran
              </button>
              <button
                type="button"
                className={`btn px-3 ${filterSubject === 'Pertanyaan Layanan' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => setFilterSubject('Pertanyaan Layanan')}
              >
                Pertanyaan
              </button>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Cari pengirim, subjek, isi pesan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Memuat data pesan...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover-custom mb-0">
              <thead>
                <tr className="text-muted small">
                  <th className="ps-4 py-3 fw-medium">No</th>
                  <th className="py-3 fw-medium">Tanggal</th>
                  <th className="py-3 fw-medium">Nama Pengirim</th>
                  <th className="py-3 fw-medium">Email</th>
                  <th className="py-3 fw-medium">Subjek</th>
                  <th className="py-3 fw-medium">Isi Pesan</th>
                  <th className="py-3 pe-4 fw-medium text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((msg, index) => (
                  <tr key={msg.id} className="align-middle">
                    <td className="ps-4">{index + 1}</td>
                    <td className="small text-muted" style={{ whiteSpace: 'nowrap' }}>
                      {new Date(msg.createdAt).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="fw-semibold text-dark">{msg.name}</td>
                    <td>{msg.email}</td>
                    <td>
                      {msg.subject === 'Pengaduan' && (
                        <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill">
                          <i className="bi bi-exclamation-triangle-fill me-1"></i>Pengaduan
                        </span>
                      )}
                      {msg.subject === 'Saran & Masukan' && (
                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                          <i className="bi bi-lightbulb-fill me-1"></i>Saran
                        </span>
                      )}
                      {msg.subject === 'Pertanyaan Layanan' && (
                        <span className="badge bg-info bg-opacity-10 text-info px-3 py-2 rounded-pill">
                          <i className="bi bi-question-circle-fill me-1"></i>Pertanyaan
                        </span>
                      )}
                      {msg.subject !== 'Pengaduan' && msg.subject !== 'Saran & Masukan' && msg.subject !== 'Pertanyaan Layanan' && (
                        <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2 rounded-pill">
                          <i className="bi bi-chat-left-fill me-1"></i>{msg.subject}
                        </span>
                      )}
                    </td>
                    <td className="text-truncate text-muted" style={{ maxWidth: '200px' }}>
                      {msg.message}
                    </td>
                    <td className="pe-4 text-center">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-success"
                          onClick={() => handleOpenDetailModal(msg)}
                          title="Lihat Detail Pesan"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(msg.id)}
                          disabled={actionLoading}
                          title="Hapus Pesan"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredMessages.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      Tidak ada pesan aspirasi atau pengaduan ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Detail Pesan */}
      {isModalOpen && selectedMessage && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-dark text-white border-0 py-3">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-envelope-open me-2"></i>Detail Aspirasi / Pengaduan
                </h5>
                <button type="button" className="btn-close btn-close-white shadow-none" onClick={handleCloseModal} aria-label="Close"></button>
              </div>
              <div className="modal-body p-4">
                <div className="row mb-3 pb-3 border-bottom g-3">
                  <div className="col-md-6">
                    <p className="text-muted small mb-1 fw-bold text-uppercase">Nama Pengirim</p>
                    <h5 className="text-dark fw-semibold mb-0">{selectedMessage.name}</h5>
                  </div>
                  <div className="col-md-6">
                    <p className="text-muted small mb-1 fw-bold text-uppercase">Alamat Email</p>
                    <p className="text-dark mb-0">
                      {selectedMessage.email}
                      <a href={`mailto:${selectedMessage.email}?subject=Balasan: ${selectedMessage.subject}`} className="btn btn-sm btn-link text-success p-0 ms-2 text-decoration-none">
                        <i className="bi bi-reply-fill"></i> Balas Email
                      </a>
                    </p>
                  </div>
                </div>

                <div className="row mb-3 pb-3 border-bottom g-3">
                  <div className="col-md-6">
                    <p className="text-muted small mb-1 fw-bold text-uppercase">Subjek Kategori</p>
                    <div>
                      {selectedMessage.subject === 'Pengaduan' && (
                        <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill">
                          <i className="bi bi-exclamation-triangle-fill me-1"></i>Pengaduan
                        </span>
                      )}
                      {selectedMessage.subject === 'Saran & Masukan' && (
                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                          <i className="bi bi-lightbulb-fill me-1"></i>Saran & Masukan
                        </span>
                      )}
                      {selectedMessage.subject === 'Pertanyaan Layanan' && (
                        <span className="badge bg-info bg-opacity-10 text-info px-3 py-2 rounded-pill">
                          <i className="bi bi-question-circle-fill me-1"></i>Pertanyaan Layanan
                        </span>
                      )}
                      {selectedMessage.subject !== 'Pengaduan' && selectedMessage.subject !== 'Saran & Masukan' && selectedMessage.subject !== 'Pertanyaan Layanan' && (
                        <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2 rounded-pill">
                          <i className="bi bi-chat-left-fill me-1"></i>{selectedMessage.subject}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <p className="text-muted small mb-1 fw-bold text-uppercase">Waktu Pengiriman</p>
                    <p className="text-dark mb-0">
                      {new Date(selectedMessage.createdAt).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="mb-0">
                  <p className="text-muted small mb-2 fw-bold text-uppercase">Isi Aspirasi / Pengaduan</p>
                  <div className="bg-light p-3 rounded-3 border text-dark" style={{ whiteSpace: 'pre-wrap', minHeight: '150px' }}>
                    {selectedMessage.message}
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 p-3 bg-light justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-danger px-4"
                  onClick={() => handleDelete(selectedMessage.id)}
                  disabled={actionLoading}
                >
                  <i className="bi bi-trash me-2"></i> Hapus Pesan
                </button>
                <button type="button" className="btn btn-dark px-4" onClick={handleCloseModal}>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
