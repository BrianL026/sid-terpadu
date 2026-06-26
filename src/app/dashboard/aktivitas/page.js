'use client'

import { useState, useEffect } from 'react';

export default function LogAktivitas() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all'); // 'all', 'Surat', 'Berita', 'Anggaran', 'Pengguna'

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/aktivitas');
      const data = await res.json();
      if (res.ok) {
        setActivities(data.activities || []);
      } else {
        console.error('Failed to fetch activities:', data.error);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter(act => {
    const matchesCategory = filterCategory === 'all' || act.category === filterCategory;
    const matchesSearch = act.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Surat': return 'bg-success bg-opacity-10 text-success';
      case 'Berita': return 'bg-primary bg-opacity-10 text-primary';
      case 'Anggaran': return 'bg-info bg-opacity-10 text-info-emphasis';
      case 'Pengguna': return 'bg-secondary bg-opacity-10 text-secondary';
      default: return 'bg-dark bg-opacity-10 text-dark';
    }
  };

  return (
    <div className="card border-0 shadow-sm p-4">
      {/* Search and Filter */}
      <div className="row g-3 align-items-center justify-content-between mb-4">
        {/* Category filter tabs */}
        <div className="col-md-7 col-lg-6">
          <div className="btn-group flex-wrap" role="group">
            <button 
              type="button" 
              className={`btn px-3 py-2 btn-sm ${filterCategory === 'all' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setFilterCategory('all')}
            >
              Semua ({activities.length})
            </button>
            <button 
              type="button" 
              className={`btn px-3 py-2 btn-sm ${filterCategory === 'Surat' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setFilterCategory('Surat')}
            >
              Surat ({activities.filter(a => a.category === 'Surat').length})
            </button>
            <button 
              type="button" 
              className={`btn px-3 py-2 btn-sm ${filterCategory === 'Berita' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setFilterCategory('Berita')}
            >
              Berita ({activities.filter(a => a.category === 'Berita').length})
            </button>
            <button 
              type="button" 
              className={`btn px-3 py-2 btn-sm ${filterCategory === 'Anggaran' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setFilterCategory('Anggaran')}
            >
              Anggaran ({activities.filter(a => a.category === 'Anggaran').length})
            </button>
            <button 
              type="button" 
              className={`btn px-3 py-2 btn-sm ${filterCategory === 'Pengguna' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setFilterCategory('Pengguna')}
            >
              Pengguna ({activities.filter(a => a.category === 'Pengguna').length})
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="col-md-5 col-lg-4">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
            <input 
              type="text" 
              className="form-control border-start-0" 
              placeholder="Cari aktivitas..."
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
            <span className="visually-hidden">Memuat log aktivitas...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover-custom mb-0">
            <thead>
              <tr className="text-muted small">
                <th className="ps-4 py-3 fw-medium">No</th>
                <th className="py-3 fw-medium">Kategori</th>
                <th className="py-3 fw-medium">Aktivitas</th>
                <th className="py-3 pe-4 fw-medium text-end">Waktu Kejadian</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map((act, index) => (
                <tr key={act.id} className="align-middle">
                  <td className="ps-4">{index + 1}</td>
                  <td>
                    <span className={`badge ${getCategoryBadgeClass(act.category)} px-3 py-2 rounded-pill`}>
                      {act.category}
                    </span>
                  </td>
                  <td className="text-dark fw-medium">
                    <span className={`text-${act.type} me-2`}><i className={`bi bi-${act.icon}`}></i></span>
                    {act.title}
                  </td>
                  <td className="pe-4 text-end text-muted small">
                    {new Date(act.time).toLocaleString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </td>
                </tr>
              ))}
              {filteredActivities.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    Tidak ada aktivitas ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
