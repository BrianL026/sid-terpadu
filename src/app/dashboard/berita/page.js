'use client'

import { useState, useEffect } from 'react';

export default function KelolaBerita() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNews, setSelectedNews] = useState(null); // For edit/view modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit'
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Pemerintahan');
  const [formContent, setFormContent] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/berita');
      const data = await res.json();
      if (res.ok) {
        setNewsList(data.news || []);
      } else {
        console.error('Failed to fetch news:', data.error);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormTitle('');
    setFormCategory('Pemerintahan');
    setFormContent('');
    setFormImageUrl('');
    setFormError('');
  };

  const handleOpenAddModal = () => {
    resetForm();
    setModalType('add');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (news) => {
    resetForm();
    setSelectedNews(news);
    setFormTitle(news.title);
    setFormCategory(news.category);
    setFormContent(news.content);
    setFormImageUrl(news.imageUrl || '');
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formTitle.trim() || !formContent.trim() || !formCategory) {
      setFormError('Judul, Kategori, dan Konten berita wajib diisi.');
      return;
    }

    setActionLoading(true);

    try {
      const url = modalType === 'add' ? '/api/berita' : `/api/berita/${selectedNews.id}`;
      const method = modalType === 'add' ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formTitle,
          category: formCategory,
          content: formContent,
          imageUrl: formImageUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        await fetchNews();
        handleCloseModal();
      } else {
        setFormError(data.error || 'Terjadi kesalahan saat menyimpan data');
      }
    } catch (error) {
      setFormError('Gagal menghubungkan ke server');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus berita "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/berita/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchNews();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menghapus berita');
      }
    } catch (error) {
      alert('Terjadi kesalahan koneksi saat menghapus berita');
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'pemerintahan': return 'bg-success bg-opacity-10 text-success';
      case 'kesehatan': return 'bg-primary bg-opacity-10 text-primary';
      case 'sosial': return 'bg-warning bg-opacity-10 text-warning-emphasis';
      case 'ekonomi': return 'bg-info bg-opacity-10 text-info-emphasis';
      default: return 'bg-secondary bg-opacity-10 text-secondary';
    }
  };

  const filteredNews = newsList.filter(news => {
    const query = searchQuery.toLowerCase();
    return (
      news.title.toLowerCase().includes(query) ||
      news.category.toLowerCase().includes(query) ||
      news.content.toLowerCase().includes(query) ||
      (news.author?.name || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="card border-0 shadow-sm p-4">
      {/* Search and Action Controls */}
      <div className="row g-3 align-items-center justify-content-between mb-4">
        <div className="col-md-6 col-lg-5">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
            <input 
              type="text" 
              className="form-control border-start-0" 
              placeholder="Cari berita berdasarkan judul, kategori, isi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4 text-md-end">
          <button className="btn btn-success px-4" onClick={handleOpenAddModal}>
            <i className="bi bi-plus-lg me-2"></i>Tambah Berita
          </button>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Memuat berita...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover-custom mb-0">
            <thead>
              <tr className="text-muted small">
                <th className="ps-4 py-3 fw-medium">No</th>
                <th className="py-3 fw-medium">Judul Berita</th>
                <th className="py-3 fw-medium">Kategori</th>
                <th className="py-3 fw-medium">Penulis</th>
                <th className="py-3 fw-medium">Tanggal Rilis</th>
                <th className="py-3 pe-4 fw-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.map((news, index) => (
                <tr key={news.id} className="align-middle">
                  <td className="ps-4">{index + 1}</td>
                  <td>
                    <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: '300px' }}>
                      {news.title}
                    </div>
                    {news.imageUrl && (
                      <small className="text-muted text-truncate d-block" style={{ maxWidth: '300px' }}>
                        <i className="bi bi-image me-1"></i>{news.imageUrl}
                      </small>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${getCategoryBadgeClass(news.category)} px-3 py-2 rounded-pill`}>
                      {news.category}
                    </span>
                  </td>
                  <td>
                    <span className="text-dark fw-medium">{news.author?.name || 'Admin'}</span>
                  </td>
                  <td>
                    {new Date(news.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="pe-4 text-center">
                    <div className="btn-group btn-group-sm">
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => handleOpenEditModal(news)}
                        title="Edit Berita"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button 
                        className="btn btn-outline-danger"
                        onClick={() => handleDelete(news.id, news.title)}
                        title="Hapus Berita"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredNews.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    Tidak ada berita ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Bootstrap Modal Form */}
      {isModalOpen && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
              <div className="modal-content border-0 shadow-lg">
                <div className="modal-header bg-dark text-white border-0 py-3">
                  <h5 className="modal-title fw-bold">
                    {modalType === 'add' ? <><i className="bi bi-plus-lg me-2"></i>Tambah Berita Desa</> : <><i className="bi bi-pencil me-2"></i>Edit Berita Desa</>}
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
                      <div className="col-md-8">
                        <label className="form-label fw-semibold small text-muted">Judul Berita</label>
                        <input 
                          type="text" 
                          className="form-control p-2"
                          placeholder="Masukkan judul berita yang menarik..."
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold small text-muted">Kategori</label>
                        <select 
                          className="form-select p-2"
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                        >
                          <option value="Pemerintahan">Pemerintahan</option>
                          <option value="Kesehatan">Kesehatan</option>
                          <option value="Sosial">Sosial</option>
                          <option value="Ekonomi">Ekonomi</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold small text-muted">URL Gambar Sampul (Opsional)</label>
                        <input 
                          type="url" 
                          className="form-control p-2"
                          placeholder="https://example.com/gambar-berita.jpg"
                          value={formImageUrl}
                          onChange={(e) => setFormImageUrl(e.target.value)}
                        />
                        <div className="form-text small">Masukkan link gambar eksternal (misal dari Google Drive atau Cloud) jika ingin menampilkan gambar.</div>
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold small text-muted">Isi Konten Berita</label>
                        <textarea 
                          className="form-control p-3"
                          rows="8"
                          placeholder="Tuliskan berita lengkap di sini..."
                          value={formContent}
                          onChange={(e) => setFormContent(e.target.value)}
                          required
                          style={{ resize: 'vertical' }}
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
                        'Simpan Berita'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
