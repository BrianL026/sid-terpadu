'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [nik, setNik] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nik, name, email, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan');
      }

      setSuccess(true);
      setNik('');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper d-flex align-items-center justify-content-center p-4">
      <div className="auth-card">
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="card-body p-5">
            <div className="text-center mb-4">
              <img src="/assets/images/logo_minsel.png" alt="Logo Minahasa Selatan" width="70" className="mb-3" />
              <h3 className="fw-bold text-dark">Registrasi</h3>
              <p className="text-muted small">Sistem Informasi Desa Terpadu — Desa Pondos</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 small" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success py-2 px-3 small" role="alert">
                Registrasi berhasil! Akun Anda dalam status pending menunggu persetujuan admin. Mengalihkan ke halaman login...
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nik" className="form-label fw-medium">Nomor Induk Kependudukan (NIK)</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-card-text"></i></span>
                  <input 
                    type="text" 
                    className="form-control border-start-0" 
                    id="nik" 
                    placeholder="Masukkan 16 digit NIK"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    maxLength={16}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="nama" className="form-label fw-medium">Nama Lengkap</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-person-fill"></i></span>
                  <input 
                    type="text" 
                    className="form-control border-start-0" 
                    id="nama" 
                    placeholder="Masukkan nama lengkap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-medium">Alamat Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-envelope"></i></span>
                  <input 
                    type="email" 
                    className="form-control border-start-0" 
                    id="email" 
                    placeholder="contoh@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-medium">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-lock-fill"></i></span>
                  <input 
                    type="password" 
                    className="form-control border-start-0" 
                    id="password" 
                    placeholder="Buat password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="konfirmasi-password" className="form-label fw-medium">Konfirmasi Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-lock-fill"></i></span>
                  <input 
                    type="password" 
                    className="form-control border-start-0" 
                    id="konfirmasi-password" 
                    placeholder="Ulangi password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-success w-100 fw-medium py-2 mb-3"
                disabled={loading}
              >
                {loading ? 'Mendaftarkan...' : 'Daftar Akun'}
              </button>

              <div className="text-center">
                <span className="text-muted small">Sudah punya akun? </span>
                <Link href="/login" className="text-success fw-medium text-decoration-none small">Masuk di sini</Link>
              </div>
            </form>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-white text-decoration-none opacity-75 small">← Kembali ke Beranda</Link>
        </div>
      </div>
    </div>
  );
}
