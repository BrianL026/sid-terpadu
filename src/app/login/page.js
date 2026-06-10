'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan');
      }

      // Login success
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      // Redirect depending on role
      if (data.user.role === 'admin') {
        router.push('/dashboard');
      } else {
        router.push('/warga/dashboard');
      }
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
              <h3 className="fw-bold text-dark">Login Administrator</h3>
              <p className="text-muted small">Sistem Informasi Desa Terpadu — Desa Pondos</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 small" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-medium">Alamat Email</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-envelope"></i></span>
                  <input 
                    type="email" 
                    className="form-control border-start-0" 
                    id="email" 
                    placeholder="admin@pondos.desa.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="form-label fw-medium">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><i className="bi bi-lock-fill"></i></span>
                  <input 
                    type="password" 
                    className="form-control border-start-0" 
                    id="password" 
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="remember" />
                  <label className="form-check-label small" htmlFor="remember">Ingat Saya</label>
                </div>
                <a href="#" className="small text-success text-decoration-none">Lupa Password?</a>
              </div>

              <button 
                type="submit" 
                className="btn btn-success w-100 fw-medium py-2 mb-3"
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </button>

              <div className="text-center">
                <span className="text-muted small">Belum punya akun? </span>
                <Link href="/register" className="text-success fw-medium text-decoration-none small">Daftar di sini</Link>
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
