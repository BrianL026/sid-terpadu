export default function Profil() {
  return (
    <>
      <section className="page-header text-white text-center shadow-sm">
        <div className="container">
          <h1 className="display-5 fw-bold mb-3">Profil Desa Pondos</h1>
          <p className="lead mb-0">Sejarah, Visi Misi, dan Struktur Pemerintahan</p>
        </div>
      </section>

      <section id="timeline-sejarah" className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Jejak Sejarah Desa Pondos</h2>
            <hr className="w-25 mx-auto text-success border-2 opacity-75" />
          </div>
          <div>
            <div className="d-flex">
              <div className="d-flex flex-column align-items-center me-3 me-md-4">
                <div className="bg-success rounded-circle shadow-sm border border-2 border-white p-2 mt-2"></div>
                <div className="h-100 border-start border-3 border-success mt-1"></div>
              </div>
              <div className="flex-grow-1 pb-4">
                <div className="card p-4 shadow-sm border-0 bg-white card-hover-elevate">
                  <h3 className="text-success fw-bold">1950</h3>
                  <h5 className="fw-bold text-dark">Pembentukan Desa</h5>
                  <p className="text-muted mb-0">Awal mula Desa Pondos ditetapkan sebagai wilayah definitif di Kecamatan Amurang Barat.</p>
                </div>
              </div>
            </div>

            <div className="d-flex">
              <div className="d-flex flex-column align-items-center me-3 me-md-4">
                <div className="bg-success rounded-circle shadow-sm border border-2 border-white p-2 mt-2"></div>
                <div className="h-100 border-start border-3 border-success mt-1"></div>
              </div>
              <div className="flex-grow-1 pb-4">
                <div className="card p-4 shadow-sm border-0 bg-white card-hover-elevate">
                  <h3 className="text-success fw-bold">1985</h3>
                  <h5 className="fw-bold text-dark">Pembangunan Infrastruktur Utama</h5>
                  <p className="text-muted mb-0">Pembangunan balai desa pertama dan pengerasan jalan untuk mempermudah akses ke kecamatan.</p>
                </div>
              </div>
            </div>

            <div className="d-flex">
              <div className="d-flex flex-column align-items-center me-3 me-md-4">
                <div className="bg-success rounded-circle shadow-sm border border-2 border-white p-2 mt-2"></div>
                <div className="h-100 border-start border-3 border-success mt-1"></div>
              </div>
              <div className="flex-grow-1 pb-4">
                <div className="card p-4 shadow-sm border-0 bg-white card-hover-elevate">
                  <h3 className="text-success fw-bold">2012</h3>
                  <h5 className="fw-bold text-dark">Pemberdayaan Ekonomi Warga</h5>
                  <p className="text-muted mb-0">Peluncuran program swadaya guna peningkatan produktivitas hasil perkebunan cengkeh dan kelapa.</p>
                </div>
              </div>
            </div>

            <div className="d-flex">
              <div className="d-flex flex-column align-items-center me-3 me-md-4">
                <div className="bg-success rounded-circle shadow-sm border border-2 border-white p-2 mt-2"></div>
                <div className="h-100 border-start border-3 border-success mt-1 opacity-0"></div>
              </div>
              <div className="flex-grow-1 pb-4">
                <div className="card p-4 shadow-sm border-0 bg-white card-hover-elevate">
                  <h3 className="text-success fw-bold">2023 - Sekarang</h3>
                  <h5 className="fw-bold text-dark">Era Desa Digital</h5>
                  <p className="text-muted mb-0">Peralihan menuju digitalisasi sistem tata kelola administrasi yang transparan, inovatif, dan terintegrasi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="visi-misi" className="py-5 bg-dark text-white">
        <div className="container">
          <div className="row g-4 justify-content-center">
            <div className="col-md-5">
              <div className="card h-100 border-0 shadow-sm border-top border-success border-4 text-dark">
                <div className="card-body p-4 text-center d-flex flex-column justify-content-center">
                  <h3 className="fw-bold text-success mb-4">Visi</h3>
                  <blockquote className="blockquote fst-italic text-muted">
                    "Mewujudkan Desa Pondos yang Mandiri, Sejahtera, Religius, dan Berbudaya melalui Tata Kelola Pemerintahan yang Bersih dan Inovatif."
                  </blockquote>
                </div>
              </div>
            </div>

            <div className="col-md-7">
              <div className="card h-100 border-0 shadow-sm border-top border-success border-4 text-dark">
                <div className="card-body p-4">
                  <h3 className="fw-bold text-success mb-4 text-center">Misi</h3>
                  <ol className="text-muted" style={{ textAlign: "justify", lineHeight: "1.8" }}>
                    <li className="mb-2">Meningkatkan kualitas sumber daya manusia melalui pendidikan dan kesehatan.</li>
                    <li className="mb-2">Membangun infrastruktur desa yang merata dan berwawasan lingkungan.</li>
                    <li className="mb-2">Mendorong pertumbuhan ekonomi kerakyatan berbasis potensi lokal (pertanian dan perkebunan).</li>
                    <li className="mb-2">Melestarikan nilai-nilai budaya dan gotong royong (Mapalus) di tengah masyarakat.</li>
                    <li>Meningkatkan kualitas pelayanan publik berbasis digital yang transparan dan akuntabel.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="struktur-pemerintahan" className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Struktur Organisasi Pemerintahan</h2>
            <hr className="w-25 mx-auto text-success border-2 opacity-75" />
          </div>

          <div className="text-center mt-4">
            <div className="row justify-content-center mb-4">
              <div className="col-md-5">
                <div className="card border border-2 border-success rounded-4 p-3 shadow-sm bg-white card-hover-elevate">
                  <div className="fw-bold text-success fs-5">Ventje</div>
                  <div className="text-muted small">Kepala Desa / Hukum Tua</div>
                </div>
              </div>
            </div>

            <div className="row justify-content-center mb-4 g-4">
              <div className="col-md-5">
                <div className="card border border-2 border-success rounded-4 p-3 shadow-sm bg-white card-hover-elevate">
                  <div className="fw-bold text-dark fs-5">Mintje</div>
                  <div className="text-muted small">Sekretaris Desa</div>
                </div>
              </div>
              <div className="col-md-5">
                <div className="card border border-2 border-secondary rounded-4 p-3 shadow-sm bg-white card-hover-elevate">
                  <div className="fw-bold text-dark fs-5">Alo</div>
                  <div className="text-muted small">Ketua BPD</div>
                </div>
              </div>
            </div>

            <div className="row justify-content-center g-4">
              <div className="col-md-4">
                <div className="card border border-2 border-success rounded-4 p-3 shadow-sm bg-white card-hover-elevate">
                  <div className="fw-bold text-dark fs-6">Jemmy</div>
                  <div className="text-muted small">Kaur / Kasi</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border border-2 border-success rounded-4 p-3 shadow-sm bg-white card-hover-elevate">
                  <div className="fw-bold text-dark fs-6">Holland</div>
                  <div className="text-muted small">Kepala Jaga 1</div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border border-2 border-success rounded-4 p-3 shadow-sm bg-white card-hover-elevate">
                  <div className="fw-bold text-dark fs-6">Rocky</div>
                  <div className="text-muted small">Kepala Jaga 2</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
