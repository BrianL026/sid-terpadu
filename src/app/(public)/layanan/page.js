export default function Layanan() {
  return (
    <>
      <section className="page-header text-white text-center shadow-sm">
        <div className="container">
          <h1 className="display-5 fw-bold mb-3">Layanan Administrasi Desa</h1>
          <p className="lead mb-0">Kemudahan mengurus dokumen kependudukan secara cepat dan transparan</p>
        </div>
      </section>

      <section id="daftar-layanan" className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Daftar Layanan</h2>
            <hr className="w-25 mx-auto text-success border-2 opacity-75" />
            <p className="text-muted">Berbagai layanan administrasi yang tersedia di Kantor Desa Pondos</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm card-hover-elevate border-top border-success border-4">
                <div className="card-body text-center p-4">
                  <div className="display-4 mb-3 text-success"><i className="bi bi-file-earmark-text"></i></div>
                  <h4 className="card-title fw-bold">Surat Pengantar</h4>
                  <p className="card-text text-muted">Pembuatan surat pengantar untuk keperluan SKCK, domisili, dan izin usaha.</p>
                  <div className="mt-3">
                    <span className="badge bg-success bg-opacity-10 text-success me-1 mb-1">KTP</span>
                    <span className="badge bg-success bg-opacity-10 text-success me-1 mb-1">KK</span>
                    <span className="badge bg-success bg-opacity-10 text-success me-1 mb-1">Pengantar RT</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm card-hover-elevate border-top border-success border-4">
                <div className="card-body text-center p-4">
                  <div className="display-4 mb-3 text-success"><i className="bi bi-people-fill"></i></div>
                  <h4 className="card-title fw-bold">Kartu Keluarga</h4>
                  <p className="card-text text-muted">Layanan pembuatan KK baru, pemecahan KK, dan pembaruan data anggota keluarga.</p>
                  <div className="mt-3">
                    <span className="badge bg-success bg-opacity-10 text-success me-1 mb-1">KTP Asli</span>
                    <span className="badge bg-success bg-opacity-10 text-success me-1 mb-1">Akta Nikah</span>
                    <span className="badge bg-success bg-opacity-10 text-success me-1 mb-1">Surat Pindah</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm card-hover-elevate border-top border-success border-4">
                <div className="card-body text-center p-4">
                  <div className="display-4 mb-3 text-success"><i className="bi bi-heart-pulse-fill"></i></div>
                  <h4 className="card-title fw-bold">Akta Kelahiran</h4>
                  <p className="card-text text-muted">Pencatatan sipil untuk kelahiran anak dengan integrasi data ke Dinas Dukcapil.</p>
                  <div className="mt-3">
                    <span className="badge bg-success bg-opacity-10 text-success me-1 mb-1">KK Orang Tua</span>
                    <span className="badge bg-success bg-opacity-10 text-success me-1 mb-1">Surat Lahir RS</span>
                    <span className="badge bg-success bg-opacity-10 text-success me-1 mb-1">2 Saksi</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm card-hover-elevate border-top border-success border-4">
                <div className="card-body text-center p-4">
                  <div className="display-4 mb-3 text-success"><i className="bi bi-person-vcard-fill"></i></div>
                  <h4 className="card-title fw-bold">KTP Elektronik</h4>
                  <p className="card-text text-muted">Pengurusan pembuatan e-KTP baru, perpanjangan, atau penggantian KTP yang rusak/hilang.</p>
                  <div className="mt-3">
                    <span className="badge bg-success bg-opacity-10 text-success me-1 mb-1">KK</span>
                    <span className="badge bg-success bg-opacity-10 text-success me-1 mb-1">Akta Lahir</span>
                    <span className="badge bg-success bg-opacity-10 text-success me-1 mb-1">Pas Foto</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm card-hover-elevate border-top border-success border-4">
                <div className="card-body text-center p-4">
                  <div className="display-4 mb-3 text-success"><i className="bi bi-heart-fill"></i></div>
                  <h4 className="card-title fw-bold">Surat Pengantar Nikah</h4>
                  <p className="card-text text-muted">Penerbitan surat pengantar nikah (N1, N2, N4) untuk pendaftaran di KUA atau Catatan Sipil.</p>
                  <div className="mt-3">
                    <span className="badge bg-success bg-opacity-10 text-success me-1 mb-1">KTP</span>
                    <span className="badge bg-success bg-opacity-10 text-success me-1 mb-1">KK</span>
                    <span className="badge bg-success bg-opacity-10 text-success me-1 mb-1">Akta Lahir</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm card-hover-elevate border-top border-success border-4">
                <div className="card-body text-center p-4">
                  <div className="display-4 mb-3 text-success"><i className="bi bi-clipboard2-check-fill"></i></div>
                  <h4 className="card-title fw-bold">Surat Keterangan Lainnya</h4>
                  <p className="card-text text-muted">SK Tidak Mampu, SK Usaha, SK Tanah, dan berbagai surat keterangan lainnya.</p>
                  <div className="mt-3">
                    <span className="badge bg-success bg-opacity-10 text-success me-1 mb-1">KTP</span>
                    <span className="badge bg-success bg-opacity-10 text-success me-1 mb-1">KK</span>
                    <span className="badge bg-success bg-opacity-10 text-success me-1 mb-1">Dokumen Pendukung</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="alur-pelayanan" className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Alur Pelayanan</h2>
            <hr className="w-25 mx-auto text-success border-2 opacity-75" />
            <p className="text-muted">Langkah-langkah mengurus administrasi di Kantor Desa Pondos</p>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-3">
              <div className="d-flex flex-column align-items-center">
                <div className="step-circle bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow mb-3">1</div>
                <h5 className="fw-bold">Datang ke Kantor</h5>
                <p className="text-muted small">Kunjungi Kantor Desa Pondos pada jam pelayanan dengan membawa dokumen persyaratan.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="d-flex flex-column align-items-center">
                <div className="step-circle bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow mb-3">2</div>
                <h5 className="fw-bold">Ambil Nomor Antrian</h5>
                <p className="text-muted small">Ambil nomor antrian dan tunggu giliran dipanggil oleh petugas pelayanan.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="d-flex flex-column align-items-center">
                <div className="step-circle bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow mb-3">3</div>
                <h5 className="fw-bold">Proses Verifikasi</h5>
                <p className="text-muted small">Petugas akan memverifikasi dan memproses dokumen yang diajukan.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="d-flex flex-column align-items-center">
                <div className="step-circle bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow mb-3">4</div>
                <h5 className="fw-bold">Dokumen Selesai</h5>
                <p className="text-muted small">Dokumen siap diambil. Waktu penyelesaian tergantung jenis layanan.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="jam-pelayanan" className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Jam Pelayanan</h2>
            <hr className="w-25 mx-auto text-success border-2 opacity-75" />
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                  <table className="table table-hover-custom mb-0">
                    <thead className="bg-success text-white">
                      <tr>
                        <th className="py-3 ps-4">Hari</th>
                        <th className="py-3">Jam Buka</th>
                        <th className="py-3">Jam Tutup</th>
                        <th className="py-3 pe-4">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="ps-4 fw-medium">Senin</td>
                        <td>08:00</td>
                        <td>15:00</td>
                        <td className="pe-4"><span className="badge bg-success">Buka</span></td>
                      </tr>
                      <tr>
                        <td className="ps-4 fw-medium">Selasa</td>
                        <td>08:00</td>
                        <td>15:00</td>
                        <td className="pe-4"><span className="badge bg-success">Buka</span></td>
                      </tr>
                      <tr>
                        <td className="ps-4 fw-medium">Rabu</td>
                        <td>08:00</td>
                        <td>15:00</td>
                        <td className="pe-4"><span className="badge bg-success">Buka</span></td>
                      </tr>
                      <tr>
                        <td className="ps-4 fw-medium">Kamis</td>
                        <td>08:00</td>
                        <td>15:00</td>
                        <td className="pe-4"><span className="badge bg-success">Buka</span></td>
                      </tr>
                      <tr>
                        <td className="ps-4 fw-medium">Jumat</td>
                        <td>08:00</td>
                        <td>12:00</td>
                        <td className="pe-4"><span className="badge bg-warning text-dark">Setengah Hari</span></td>
                      </tr>
                      <tr>
                        <td className="ps-4 fw-medium">Sabtu - Minggu</td>
                        <td>-</td>
                        <td>-</td>
                        <td className="pe-4"><span className="badge bg-danger">Tutup</span></td>
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
