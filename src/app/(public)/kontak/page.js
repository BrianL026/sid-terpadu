'use client'

import { useState } from 'react';

export default function Kontak() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    subjek: '',
    pesan: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.email || !formData.subjek || !formData.pesan) {
      alert("Harap isi semua kolom formulir.");
      return;
    }
    // Simulate API call
    console.log("Pesan terkirim:", formData);
    setIsSubmitted(true);
    setFormData({ nama: '', email: '', subjek: '', pesan: '' });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <>
      <section className="page-header text-white text-center shadow-sm">
        <div className="container">
          <h1 className="display-5 fw-bold mb-3">Hubungi Kami</h1>
          <p className="lead mb-0">Sampaikan pertanyaan, saran, atau keluhan Anda kepada Pemerintah Desa Pondos</p>
        </div>
      </section>

      <section id="info-kontak" className="py-5 bg-light">
        <div className="container">
          <div className="row g-4 justify-content-center">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 text-center card-hover-elevate">
                <div className="card-body p-4">
                  <div className="display-4 mb-3 text-success"><i className="bi bi-geo-alt-fill"></i></div>
                  <h5 className="fw-bold">Alamat</h5>
                  <p className="text-muted mb-0">Jl. Trans Sulawesi, Desa Pondos, Kec. Amurang Barat, Kab. Minahasa Selatan, Sulawesi Utara</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 text-center card-hover-elevate">
                <div className="card-body p-4">
                  <div className="display-4 mb-3 text-success"><i className="bi bi-envelope-fill"></i></div>
                  <h5 className="fw-bold">Email</h5>
                  <p className="text-muted mb-2">pemdes@pondos.desa.id</p>
                  <p className="text-muted mb-0 small">Balasan dalam 1-2 hari kerja</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 text-center card-hover-elevate">
                <div className="card-body p-4">
                  <div className="display-4 mb-3 text-success"><i className="bi bi-telephone-fill"></i></div>
                  <h5 className="fw-bold">Telepon</h5>
                  <p className="text-muted mb-2">+62 812 3456 7890</p>
                  <p className="text-muted mb-0 small">Senin - Jumat, 08:00 - 15:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="form-kontak" className="py-5">
        <div className="container">
          <div className="row g-5 align-items-start">
            <div className="col-lg-6">
              <h2 className="fw-bold mb-2">Kirim Pesan</h2>
              <hr className="w-25 text-success border-2 opacity-75" />
              <p className="text-muted mb-4">Silakan isi formulir di bawah ini untuk menyampaikan pesan kepada Pemerintah Desa Pondos.</p>
              
              {isSubmitted && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <strong>Pesan terkirim!</strong> Terima kasih, saran atau pengaduan Anda akan kami proses segera.
                  <button type="button" className="btn-close" onClick={() => setIsSubmitted(false)} aria-label="Close"></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nama" className="form-label fw-medium">Nama Lengkap</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="nama" 
                    placeholder="Masukkan nama lengkap Anda" 
                    value={formData.nama}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-medium">Alamat Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email" 
                    placeholder="contoh@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="subjek" className="form-label fw-medium">Subjek</label>
                  <select 
                    className="form-select" 
                    id="subjek"
                    value={formData.subjek}
                    onChange={handleChange}
                  >
                    <option value="" disabled>-- Pilih Subjek --</option>
                    <option value="Pertanyaan Layanan">Pertanyaan Layanan</option>
                    <option value="Saran & Masukan">Saran & Masukan</option>
                    <option value="Pengaduan">Pengaduan</option>
                    <option value="Informasi Umum">Informasi Umum</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="pesan" className="form-label fw-medium">Pesan</label>
                  <textarea 
                    className="form-control" 
                    id="pesan" 
                    rows={5} 
                    placeholder="Tulis pesan Anda di sini..."
                    value={formData.pesan}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-success px-4 fw-medium">Kirim Pesan</button>
              </form>
            </div>

            <div className="col-lg-6">
              <h2 className="fw-bold mb-2">Lokasi Desa</h2>
              <hr className="w-25 text-success border-2 opacity-75" />
              <p className="text-muted mb-4">Kantor Desa Pondos, Kecamatan Amurang Barat, Minahasa Selatan.</p>
              
              <div className="card border-0 shadow-sm overflow-hidden rounded-3">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15956.18395037953!2d124.49445926150031!3d1.1273799354240048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x327df7ff10c62e67%3A0x97421ef5bdf4fc08!2sPondos%2C%20Amurang%20Barat%2C%20South%20Minahasa%20Regency%2C%20North%20Sulawesi%2C%20Indonesia!5e0!3m2!1sen!2sus!4v1775824916356!5m2!1sen!2sus"
                  className="w-100"
                  height={450}
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
