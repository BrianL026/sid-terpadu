import Link from "next/link";

export default function Home() {
  return (
    <>
      <section id="hero" className="d-flex align-items-center justify-content-center text-center text-white">
        <div className="container hero-content">
          <h1 className="display-3 fw-bold mb-3">Selamat Datang di Desa Pondos</h1>
          <p className="lead mb-4">Mewujudkan desa digital yang transparan, inovatif, dan sejahtera untuk seluruh masyarakat Minahasa Selatan.</p>
          <a href="#informasi-desa" className="btn btn-success btn-lg px-4 fw-medium shadow">Jelajahi Desa</a>
        </div>
        <div className="hero-overlay"></div>
      </section>

      <section id="informasi-desa" className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Mengenal Desa Pondos</h2>
            <hr className="w-25 mx-auto text-success border-2 opacity-75" />
          </div>

          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <h4 className="mb-3">Sejarah & Visi Misi</h4>
              <p className="text-muted" style={{ textAlign: "justify" }}>
                Desa Pondos terletak di Kecamatan Amurang Barat, Kabupaten Minahasa Selatan, Sulawesi Utara. 
                Sebagai desa yang terus berkembang, kami mengedepankan nilai-nilai gotong royong (Mapalus) 
                yang menjadi warisan leluhur tanah Minahasa.
              </p>
              <p className="text-muted" style={{ textAlign: "justify" }}>
                Pemerintah Desa Pondos berkomitmen untuk mewujudkan tata kelola desa yang transparan, 
                inovatif, dan berbasis pelayanan digital untuk mempermudah urusan administrasi seluruh warga masyarakat.
              </p>
            </div>

            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="card card-hover-elevate border-0 shadow-sm h-100 text-center py-3">
                    <div className="card-body">
                      <h1 className="display-5 text-success fw-bold">4</h1>
                      <p className="card-text text-muted mb-0">Jaga / Dusun</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card card-hover-elevate border-0 shadow-sm h-100 text-center py-3">
                    <div className="card-body">
                      <h1 className="display-5 text-success fw-bold">1.250</h1>
                      <p className="card-text text-muted mb-0">Total Penduduk</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card card-hover-elevate border-0 shadow-sm h-100 text-center py-3">
                    <div className="card-body">
                      <h1 className="display-5 text-success fw-bold">350</h1>
                      <p className="card-text text-muted mb-0">Kepala Keluarga</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card card-hover-elevate border-0 shadow-sm h-100 text-center py-3">
                    <div className="card-body">
                      <h1 className="display-5 text-success fw-bold">95%</h1>
                      <p className="card-text text-muted mb-0">Petani / Pekebun</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="layanan-singkat" className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Layanan Administrasi</h2>
            <hr className="w-25 mx-auto text-success border-2 opacity-75" />
            <p className="text-muted">Kemudahan mengurus dokumen kependudukan secara cepat dan transparan.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <Link href="/layanan" className="text-decoration-none text-dark">
                <div className="card h-100 border-0 shadow-sm card-hover-elevate border-top border-success border-4" style={{ cursor: "pointer" }}>
                  <div className="card-body text-center p-4">
                    <div className="display-4 mb-3 text-success"><i className="bi bi-file-earmark-text"></i></div>
                    <h4 className="card-title fw-bold">Surat Pengantar</h4>
                    <p className="card-text text-muted">Pembuatan surat pengantar RT/RW untuk keperluan SKCK, domisili, dan izin usaha.</p>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-md-4">
              <Link href="/layanan" className="text-decoration-none text-dark">
                <div className="card h-100 border-0 shadow-sm card-hover-elevate border-top border-success border-4" style={{ cursor: "pointer" }}>
                  <div className="card-body text-center p-4">
                    <div className="display-4 mb-3 text-success"><i className="bi bi-people-fill"></i></div>
                    <h4 className="card-title fw-bold">Kartu Keluarga</h4>
                    <p className="card-text text-muted">Layanan pembaruan data anggota keluarga, pemecahan KK, dan pembuatan KK baru.</p>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-md-4">
              <Link href="/layanan" className="text-decoration-none text-dark">
                <div className="card h-100 border-0 shadow-sm card-hover-elevate border-top border-success border-4" style={{ cursor: "pointer" }}>
                  <div className="card-body text-center p-4">
                    <div className="display-4 mb-3 text-success"><i className="bi bi-heart-pulse-fill"></i></div>
                    <h4 className="card-title fw-bold">Akta Kelahiran</h4>
                    <p className="card-text text-muted">Pencatatan sipil untuk kelahiran anak dengan proses integrasi data ke Dinas Dukcapil.</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="text-center mt-5">
            <Link href="/layanan" className="btn btn-outline-success px-4 rounded-pill fw-medium">Lihat Semua Layanan</Link>
          </div>
        </div>
      </section>
    </>
  );
}
