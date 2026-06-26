'use client'

import { useState, useEffect } from 'react';

export default function KelolaAnggaran() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'pendapatan', 'belanja'
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add', 'edit'
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [formType, setFormType] = useState('pendapatan');
  const [formCategory, setFormCategory] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formYear, setFormYear] = useState(new Date().getFullYear().toString());
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/anggaran');
      const data = await res.json();
      if (res.ok) {
        setBudgets(data.budgets || []);
      } else {
        console.error('Failed to fetch budgets:', data.error);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormType('pendapatan');
    setFormCategory('');
    setFormAmount('');
    setFormDescription('');
    setFormYear(new Date().getFullYear().toString());
    setFormError('');
  };

  const handleOpenAddModal = () => {
    resetForm();
    setModalType('add');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (budget) => {
    resetForm();
    setSelectedBudget(budget);
    setFormType(budget.type);
    setFormCategory(budget.category);
    setFormAmount(budget.amount.toString());
    setFormDescription(budget.description);
    setFormYear(budget.year.toString());
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBudget(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const parsedAmount = parseFloat(formAmount);
    const parsedYear = parseInt(formYear);

    if (!formType || !formCategory.trim() || isNaN(parsedAmount) || parsedAmount <= 0 || !formDescription.trim() || isNaN(parsedYear)) {
      setFormError('Semua kolom wajib diisi dengan format yang benar.');
      return;
    }

    setActionLoading(true);

    try {
      const url = modalType === 'add' ? '/api/anggaran' : `/api/anggaran/${selectedBudget.id}`;
      const method = modalType === 'add' ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formType,
          category: formCategory,
          amount: parsedAmount,
          description: formDescription,
          year: parsedYear,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        await fetchBudgets();
        handleCloseModal();
      } else {
        setFormError(data.error || 'Terjadi kesalahan saat menyimpan anggaran');
      }
    } catch (error) {
      setFormError('Gagal menghubungkan ke server');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id, category) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus pos anggaran "${category}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/anggaran/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchBudgets();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal menghapus pos anggaran');
      }
    } catch (error) {
      alert('Terjadi kesalahan koneksi saat menghapus anggaran');
    }
  };

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Calculate summaries
  const totalIncome = budgets
    .filter(b => b.type === 'pendapatan')
    .reduce((sum, b) => sum + b.amount, 0);

  const totalExpense = budgets
    .filter(b => b.type === 'belanja')
    .reduce((sum, b) => sum + b.amount, 0);

  const surplus = totalIncome - totalExpense;

  // Filter budgets
  const filteredBudgets = budgets.filter(budget => {
    const matchesType = filterType === 'all' || budget.type === filterType;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      budget.category.toLowerCase().includes(query) ||
      budget.description.toLowerCase().includes(query) ||
      budget.year.toString().includes(query);
    return matchesType && matchesSearch;
  });

  return (
    <div>
      {/* Summary Boxes */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm border-start border-success border-4 h-100">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">Total Pendapatan</p>
                  <h4 className="fw-bold text-success mb-0">{formatRupiah(totalIncome)}</h4>
                </div>
                <div className="fs-3 text-success"><i className="bi bi-arrow-down-left-square-fill"></i></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm border-start border-primary border-4 h-100">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">Total Belanja</p>
                  <h4 className="fw-bold text-primary mb-0">{formatRupiah(totalExpense)}</h4>
                </div>
                <div className="fs-3 text-primary"><i className="bi bi-arrow-up-right-square-fill"></i></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm border-start border-warning border-4 h-100">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">Sisa / Surplus</p>
                  <h4 className={`fw-bold mb-0 ${surplus >= 0 ? 'text-success' : 'text-danger'}`}>
                    {formatRupiah(surplus)}
                  </h4>
                </div>
                <div className="fs-3 text-warning"><i className="bi bi-bank2"></i></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="card border-0 shadow-sm p-4">
        <div className="row g-3 align-items-center justify-content-between mb-4">
          {/* Tabs Filter */}
          <div className="col-md-6 col-lg-5">
            <div className="btn-group" role="group">
              <button 
                type="button" 
                className={`btn px-3 ${filterType === 'all' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => setFilterType('all')}
              >
                Semua
              </button>
              <button 
                type="button" 
                className={`btn px-3 ${filterType === 'pendapatan' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => setFilterType('pendapatan')}
              >
                Pendapatan
              </button>
              <button 
                type="button" 
                className={`btn px-3 ${filterType === 'belanja' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => setFilterType('belanja')}
              >
                Belanja
              </button>
            </div>
          </div>
          
          {/* Search and Add */}
          <div className="col-md-6 col-lg-6 d-flex gap-2">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
              <input 
                type="text" 
                className="form-control border-start-0" 
                placeholder="Cari kategori, deskripsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn btn-success px-4 flex-shrink-0" onClick={handleOpenAddModal}>
              <i className="bi bi-plus-lg me-2"></i>Tambah Pos
            </button>
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Memuat data anggaran...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover-custom mb-0">
              <thead>
                <tr className="text-muted small">
                  <th className="ps-4 py-3 fw-medium">No</th>
                  <th className="py-3 fw-medium">Tipe</th>
                  <th className="py-3 fw-medium">Kategori</th>
                  <th className="py-3 fw-medium">Jumlah</th>
                  <th className="py-3 fw-medium">Tahun</th>
                  <th className="py-3 fw-medium">Keterangan</th>
                  <th className="py-3 pe-4 fw-medium text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredBudgets.map((budget, index) => (
                  <tr key={budget.id} className="align-middle">
                    <td className="ps-4">{index + 1}</td>
                    <td>
                      {budget.type === 'pendapatan' ? (
                        <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                          <i className="bi bi-arrow-down-left me-1"></i>Pendapatan
                        </span>
                      ) : (
                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                          <i className="bi bi-arrow-up-right me-1"></i>Belanja
                        </span>
                      )}
                    </td>
                    <td className="fw-semibold text-dark">{budget.category}</td>
                    <td className="fw-bold text-dark">{formatRupiah(budget.amount)}</td>
                    <td>{budget.year}</td>
                    <td className="text-muted text-truncate" style={{ maxWidth: '250px' }} title={budget.description}>
                      {budget.description}
                    </td>
                    <td className="pe-4 text-center">
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-primary"
                          onClick={() => handleOpenEditModal(budget)}
                          title="Edit Pos"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button 
                          className="btn btn-outline-danger"
                          onClick={() => handleDelete(budget.id, budget.category)}
                          title="Hapus Pos"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredBudgets.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      Tidak ada pos anggaran ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-dark text-white border-0 py-3">
                <h5 className="modal-title fw-bold">
                  {modalType === 'add' ? <><i className="bi bi-plus-lg me-2"></i>Tambah Pos Anggaran</> : <><i className="bi bi-pencil me-2"></i>Edit Pos Anggaran</>}
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
                      <label className="form-label fw-semibold small text-muted">Tipe Anggaran</label>
                      <select 
                        className="form-select p-2"
                        value={formType}
                        onChange={(e) => setFormType(e.target.value)}
                      >
                        <option value="pendapatan">Pendapatan</option>
                        <option value="belanja">Belanja</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small text-muted">Tahun Anggaran</label>
                      <input 
                        type="number" 
                        min="1900"
                        max="2100"
                        className="form-control p-2"
                        placeholder="Contoh: 2026"
                        value={formYear}
                        onChange={(e) => setFormYear(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small text-muted">Kategori Anggaran</label>
                      <input 
                        type="text" 
                        className="form-control p-2"
                        placeholder="Contoh: Dana Desa (APBN), Kesehatan, Pendidikan..."
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small text-muted">Jumlah Uang (Rupiah)</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light text-muted fw-bold">Rp</span>
                        <input 
                          type="number" 
                          min="1"
                          step="any"
                          className="form-control p-2"
                          placeholder="Contoh: 150000000"
                          value={formAmount}
                          onChange={(e) => setFormAmount(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small text-muted">Deskripsi / Keterangan</label>
                      <textarea 
                        className="form-control p-2"
                        rows="3"
                        placeholder="Masukkan keterangan detail tentang pos anggaran ini..."
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        required
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
                      'Simpan Anggaran'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
