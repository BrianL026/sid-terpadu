import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto">
      <div className="container text-md-start">
        <div className="row text-md-start">
          <div className="col-md-5 col-lg-5 col-xl-5 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 fw-bold text-success">Desa Pondos</h5>
            <p className="text-light opacity-75" style={{ textAlign: "justify" }}>
              Sistem Informasi Desa Terpadu Desa Pondos, Kecamatan Amurang Barat, Kabupaten Minahasa Selatan. 
              Kami berkomitmen memberikan pelayanan administrasi yang cepat, transparan, and akuntabel untuk seluruh lapisan masyarakat.
            </p>
          </div>

          <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 fw-bold text-success">Tautan Cepat</h5>
            <p><Link href="/" className="text-white text-decoration-none footer-link">Beranda</Link></p>
            <p><Link href="/profil" className="text-white text-decoration-none footer-link">Profil Desa</Link></p>
            <p><Link href="/layanan" className="text-white text-decoration-none footer-link">Layanan Administrasi</Link></p>
            <p><Link href="/berita" className="text-white text-decoration-none footer-link">Berita & Informasi</Link></p>
            <p><Link href="/transparansi" className="text-white text-decoration-none footer-link">Transparansi Dana</Link></p>
            <p><Link href="/kontak" className="text-white text-decoration-none footer-link">Kontak</Link></p>
            <p><Link href="/login" className="text-white text-decoration-none footer-link"><i className="bi bi-shield-lock-fill"></i> Login Admin</Link></p>
          </div>

          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 fw-bold text-success">Hubungi Kami</h5>
            <p className="text-light opacity-75"><i className="bi bi-geo-alt-fill me-3"></i>Jl. Trans Sulawesi, Desa Pondos, Minahasa Selatan</p>
            <p className="text-light opacity-75"><i className="bi bi-envelope-fill me-3"></i>pemdes@pondos.desa.id</p>
            <p className="text-light opacity-75"><i className="bi bi-telephone-fill me-3"></i>+62 812 3456 7890</p>
          </div>
        </div>

        <hr className="mb-4 border-light opacity-25" />

        <div className="row align-items-center text-center text-md-start">
          <div className="col-md-7 col-lg-8">
            <p className="text-light opacity-75 mb-0"> Copyright © 2026 Hak Cipta Dilindungi oleh:
              <a href="#" style={{ textDecoration: "none" }}>
                <strong className="text-success"> Pemerintah Desa Pondos</strong>
              </a>
            </p>
          </div>
          <div className="col-md-5 col-lg-4 text-center text-md-end mt-3 mt-md-0"></div>
        </div>
      </div>
    </footer>
  );
}
