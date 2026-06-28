import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = 'force-dynamic';

const getCategoryBadgeClass = (category) => {
  switch (category?.toLowerCase()) {
    case 'pemerintahan': return 'bg-success';
    case 'kesehatan': return 'bg-primary';
    case 'sosial': return 'bg-warning text-dark';
    case 'ekonomi': return 'bg-info text-dark';
    default: return 'bg-secondary';
  }
};

export default async function Berita() {
  // Query all news from SQLite
  const newsList = await prisma.news.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <>
      <section className="page-header text-white text-center shadow-sm">
        <div className="container">
          <h1 className="display-5 fw-bold mb-3">Berita & Informasi Desa</h1>
          <p className="lead mb-0">Kabar terbaru, pengumuman, dan agenda kegiatan Desa Pondos</p>
        </div>
      </section>

      <section id="berita-terbaru" className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Berita Terbaru</h2>
            <hr className="w-25 mx-auto text-success border-2 opacity-75" />
          </div>

          <div className="row g-4">
            {newsList.map((news) => (
              <div className="col-lg-6" key={news.id}>
                <div className="card border-0 shadow-sm h-100 card-hover-elevate">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <span className={`badge ${getCategoryBadgeClass(news.category)} me-2`}>
                        {news.category}
                      </span>
                      <small className="text-muted">
                        <i className="bi bi-calendar3 me-1"></i>
                        {new Date(news.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </small>
                    </div>
                    <h4 className="fw-bold">{news.title}</h4>
                    <p className="text-muted" style={{ textAlign: "justify" }}>
                      {news.content}
                    </p>
                    <Link href={`/berita/${news.slug}`} className="text-success fw-medium text-decoration-none">
                      Baca selengkapnya →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {newsList.length === 0 && (
              <div className="col-12 text-center text-muted">
                <p>Belum ada berita yang dipublikasikan.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="pengumuman" className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Pengumuman</h2>
            <hr className="w-25 mx-auto text-success border-2 opacity-75" />
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm mb-3 card-hover-elevate border-start border-success border-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="fw-bold mb-1">Pendaftaran Program Bantuan Langsung Tunai (BLT)</h5>
                      <p className="text-muted mb-0">Bagi warga yang memenuhi syarat dapat mendaftar di Kantor Desa mulai tanggal 10-20 April 2026.</p>
                    </div>
                    <span className="badge bg-danger ms-3">Baru</span>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-3 card-hover-elevate border-start border-success border-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="fw-bold mb-1">Jadwal Perekaman e-KTP Bulan April</h5>
                      <p className="text-muted mb-0">Perekaman e-KTP akan dilaksanakan tanggal 14-16 April 2026 di Balai Desa. Harap membawa KK asli.</p>
                    </div>
                    <span className="badge bg-danger ms-3">Baru</span>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm mb-3 card-hover-elevate border-start border-success border-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="fw-bold mb-1">Pemberitahuan Libur Pelayanan Hari Raya</h5>
                      <p className="text-muted mb-0">Pelayanan administrasi desa diliburkan selama periode Hari Raya Idul Fitri, 28 Maret - 7 April 2026.</p>
                    </div>
                    <span className="badge bg-secondary ms-3">Arsip</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="agenda" className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Agenda Kegiatan</h2>
            <hr className="w-25 mx-auto text-success border-2 opacity-75" />
            <p className="text-muted">Jadwal kegiatan mendatang di Desa Pondos</p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                  <table className="table table-hover-custom mb-0">
                    <thead className="bg-success text-white">
                      <tr>
                        <th className="py-3 ps-4">Tanggal</th>
                        <th className="py-3">Kegiatan</th>
                        <th className="py-3">Lokasi</th>
                        <th className="py-3 pe-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="ps-4 fw-medium">12 April 2026</td>
                        <td>Rapat Koordinasi Perangkat Desa</td>
                        <td>Kantor Desa</td>
                        <td className="pe-4"><span className="badge bg-warning text-dark">Akan Datang</span></td>
                      </tr>
                      <tr>
                        <td className="ps-4 fw-medium">14-16 April 2026</td>
                        <td>Perekaman e-KTP Massal</td>
                        <td>Balai Desa</td>
                        <td className="pe-4"><span className="badge bg-warning text-dark">Akan Datang</span></td>
                      </tr>
                      <tr>
                        <td className="ps-4 fw-medium">20 April 2026</td>
                        <td>Posyandu Rutin Bulan April</td>
                        <td>Balai Desa</td>
                        <td className="pe-4"><span className="badge bg-warning text-dark">Akan Datang</span></td>
                      </tr>
                      <tr>
                        <td className="ps-4 fw-medium">27 April 2026</td>
                        <td>Gotong Royong Lingkungan</td>
                        <td>Seluruh Jaga</td>
                        <td className="pe-4"><span className="badge bg-warning text-dark">Akan Datang</span></td>
                      </tr>
                      <tr>
                        <td className="ps-4 fw-medium">5 April 2026</td>
                        <td>Musrenbang Desa 2026</td>
                        <td>Balai Desa</td>
                        <td className="pe-4"><span className="badge bg-success">Selesai</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
