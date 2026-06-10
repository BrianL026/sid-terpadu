'use client'

import { useState, useEffect } from 'react';

export default function KelolaSurat() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null); // For detail modal

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/documents');
      const data = await res.json();
      if (res.ok) {
        setDocuments(data.documents);
      } else {
        console.error('Failed to fetch documents:', data.error);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
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
      const data = await res.json();
      if (res.ok) {
        await fetchDocuments();
        // If the updated document is currently in the modal, update its status in modal too
        if (selectedDoc && selectedDoc.id === id) {
          setSelectedDoc(prev => ({ ...prev, status }));
        }
      } else {
        alert(data.error || 'Gagal memperbarui status');
      }
    } catch (error) {
      alert('Terjadi kesalahan koneksi');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge bg-warning text-dark px-3 py-2"><i className="bi bi-clock-fill me-1"></i> Proses</span>;
      case 'approved':
        return <span className="badge bg-success px-3 py-2"><i className="bi bi-check-circle-fill me-1"></i> Selesai</span>;
      case 'rejected':
        return <span className="badge bg-danger px-3 py-2"><i className="bi bi-x-circle-fill me-1"></i> Ditolak</span>;
      default:
        return <span className="badge bg-secondary px-3 py-2">{status}</span>;
    }
  };

  // Filter documents based on status and search query
  const filteredDocs = documents.filter(doc => {
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesSearch = 
      doc.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.user.nik.includes(searchQuery) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="card border-0 shadow-sm p-4">
      {/* Filtering and Search Controls */}
      <div className="row g-3 align-items-center justify-content-between mb-4">
        {/* Left side: status tabs */}
        <div className="col-md-7 col-lg-6">
          <div className="btn-group" role="group" aria-label="Filter Status">
            <button 
              type="button" 
              className={`btn px-4 ${filterStatus === 'all' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setFilterStatus('all')}
            >
              Semua ({documents.length})
            </button>
            <button 
              type="button" 
              className={`btn px-4 ${filterStatus === 'pending' ? 'btn-warning text-dark' : 'btn-outline-warning text-dark'}`}
              onClick={() => setFilterStatus('pending')}
            >
              Proses ({documents.filter(d => d.status === 'pending').length})
            </button>
            <button 
              type="button" 
              className={`btn px-4 ${filterStatus === 'approved' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setFilterStatus('approved')}
            >
              Selesai ({documents.filter(d => d.status === 'approved').length})
            </button>
            <button 
              type="button" 
              className={`btn px-4 ${filterStatus === 'rejected' ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => setFilterStatus('rejected')}
            >
              Ditolak ({documents.filter(d => d.status === 'rejected').length})
            </button>
          </div>
        </div>

        {/* Right side: search input */}
        <div className="col-md-5 col-lg-4">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
            <input 
              type="text" 
              className="form-control border-start-0" 
              placeholder="Cari nama, NIK, atau jenis surat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Memuat data...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover-custom mb-0">
            <thead>
              <tr className="text-muted small">
                <th className="ps-4 py-3 fw-medium">No</th>
                <th className="py-3 fw-medium">Pemohon</th>
                <th className="py-3 fw-medium">NIK</th>
                <th className="py-3 fw-medium">Jenis Surat</th>
                <th className="py-3 fw-medium">Tanggal Masuk</th>
                <th className="py-3 fw-medium">Status</th>
                <th className="py-3 pe-4 fw-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc, idx) => (
                <tr key={doc.id} className="align-middle">
                  <td className="ps-4">{idx + 1}</td>
                  <td>
                    <button 
                      className="btn btn-link text-decoration-none text-dark fw-bold p-0 text-start"
                      onClick={() => setSelectedDoc(doc)}
                    >
                      {doc.user.name}
                    </button>
                  </td>
                  <td><code className="text-dark bg-light px-2 py-1 rounded">{doc.user.nik}</code></td>
                  <td><span className="fw-medium">{doc.type}</span></td>
                  <td>
                    {new Date(doc.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td>{getStatusBadge(doc.status)}</td>
                  <td className="pe-4 text-center">
                    <div className="d-inline-flex gap-2">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setSelectedDoc(doc)}
                        title="Lihat Rincian"
                      >
                        <i className="bi bi-eye"></i> Detail
                      </button>
                      {doc.status === 'pending' && (
                        <>
                          <button 
                            className="btn btn-sm btn-success" 
                            disabled={actionLoading === doc.id}
                            onClick={() => handleUpdateStatus(doc.id, 'approved')}
                            title="Setujui Pengajuan"
                          >
                            Setujui
                          </button>
                          <button 
                            className="btn btn-sm btn-danger" 
                            disabled={actionLoading === doc.id}
                            onClick={() => handleUpdateStatus(doc.id, 'rejected')}
                            title="Tolak Pengajuan"
                          >
                            Tolak
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-5">
                    <i className="bi bi-folder2-open display-4 text-secondary mb-3 d-block"></i>
                    Tidak menemukan pengajuan surat yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal Component */}
      {selectedDoc && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold"><i className="bi bi-file-earmark-text me-2"></i>Rincian Pengajuan Surat</h5>
                <button type="button" className="btn-close btn-close-white shadow-none" onClick={() => setSelectedDoc(null)} aria-label="Close"></button>
              </div>
              <div className="modal-body p-4">
                <div className="mb-4">
                  <h6 className="fw-bold text-success border-bottom pb-2 mb-3">Informasi Pemohon</h6>
                  <div className="row g-2">
                    <div className="col-4 text-muted small fw-medium">Nama Lengkap</div>
                    <div className="col-8 fw-bold text-dark">{selectedDoc.user.name}</div>
                    
                    <div className="col-4 text-muted small fw-medium">NIK</div>
                    <div className="col-8"><code>{selectedDoc.user.nik}</code></div>
                    
                    <div className="col-4 text-muted small fw-medium">Email</div>
                    <div className="col-8 text-dark">{selectedDoc.user.email}</div>
                    
                    <div className="col-4 text-muted small fw-medium">Wilayah</div>
                    <div className="col-8 text-dark">{selectedDoc.user.dusun || 'Jaga II'}</div>
                    
                    <div className="col-4 text-muted small fw-medium">Alamat Rumah</div>
                    <div className="col-8 text-muted small">{selectedDoc.user.address || 'Desa Pondos, Kec. Amurang Barat'}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <h6 className="fw-bold text-success border-bottom pb-2 mb-3">Informasi Layanan Surat</h6>
                  <div className="row g-2">
                    <div className="col-4 text-muted small fw-medium">Jenis Dokumen</div>
                    <div className="col-8 fw-bold text-dark">{selectedDoc.type}</div>
                    
                    <div className="col-4 text-muted small fw-medium">Tanggal Masuk</div>
                    <div className="col-8 text-dark">
                      {new Date(selectedDoc.createdAt).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })} WITA
                    </div>
                    
                    <div className="col-4 text-muted small fw-medium">Keperluan</div>
                    <div className="col-8 text-dark bg-light p-2.5 rounded-3 border-start border-success border-3 mb-2">{selectedDoc.notes}</div>
                    
                    <div className="col-4 text-muted small fw-medium font-weight-bold">Berkas Pendukung</div>
                    <div className="col-8">
                      {selectedDoc.attachmentUrl ? (
                        <a 
                          href={selectedDoc.attachmentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-sm btn-primary px-3 rounded-pill"
                        >
                          <i className="bi bi-box-arrow-up-right me-1"></i> Buka Berkas Pendukung
                        </a>
                      ) : (
                        <span className="text-muted small">Tidak ada berkas terlampir</span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h6 className="fw-bold text-success border-bottom pb-2 mb-3">Status Verifikasi</h6>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>{getStatusBadge(selectedDoc.status)}</div>
                    
                    {selectedDoc.status === 'pending' && (
                      <div className="btn-group">
                        <button 
                          className="btn btn-success" 
                          disabled={actionLoading === selectedDoc.id}
                          onClick={() => handleUpdateStatus(selectedDoc.id, 'approved')}
                        >
                          Setujui
                        </button>
                        <button 
                          className="btn btn-danger" 
                          disabled={actionLoading === selectedDoc.id}
                          onClick={() => handleUpdateStatus(selectedDoc.id, 'rejected')}
                        >
                          Tolak
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-light border-0">
                <button type="button" className="btn btn-secondary px-4 rounded-pill" onClick={() => setSelectedDoc(null)}>Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
