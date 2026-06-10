import { prisma } from "@/lib/prisma";

export default async function Transparansi() {
  // Query all budget records from SQLite
  const budgets = await prisma.budget.findMany();

  const pendapatan = budgets.filter((b) => b.type === "pendapatan");
  const belanja = budgets.filter((b) => b.type === "belanja");

  const totalPendapatan = pendapatan.reduce((sum, b) => sum + b.amount, 0);
  const totalBelanja = belanja.reduce((sum, b) => sum + b.amount, 0);
  const surplus = totalPendapatan - totalBelanja;

  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Static realization data as placeholder for demo
  const belanjaRealisasiMap = {
    "Penyelenggaraan Pemerintahan": 315000000,
    "Pembangunan Desa": 400000000,
    "Pembinaan Kemasyarakatan": 162000000,
    "Pemberdayaan Masyarakat": 175000000,
    "Penanggulangan Bencana": 55000000,
  };

  const getRealisasi = (category, targetAmount) => {
    // Fallback if not mapped
    return belanjaRealisasiMap[category] || Math.round(targetAmount * 0.8);
  };

  const totalRealisasi = belanja.reduce((sum, b) => sum + getRealisasi(b.category, b.amount), 0);
  const totalProgress = totalBelanja > 0 ? Math.round((totalRealisasi / totalBelanja) * 100) : 0;

  const getProgressBarClass = (percentage) => {
    if (percentage >= 80) return "bg-success";
    if (percentage >= 60) return "bg-primary";
    if (percentage >= 40) return "bg-warning";
    return "bg-danger";
  };

  return (
    <>
      <section className="page-header text-white text-center shadow-sm">
        <div className="container">
          <h1 className="display-5 fw-bold mb-3">Transparansi Anggaran Desa</h1>
          <p className="lead mb-0">Informasi APBDes Desa Pondos Tahun Anggaran 2026</p>
        </div>
      </section>

      <section id="ringkasan-apbdes" className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Ringkasan APBDes 2026</h2>
            <hr className="w-25 mx-auto text-success border-2 opacity-75" />
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 text-center card-hover-elevate border-top border-success border-4">
                <div className="card-body p-4">
                  <div className="display-4 mb-3 text-success"><i className="bi bi-cash-stack"></i></div>
                  <h5 className="text-muted mb-2">Total Pendapatan</h5>
                  <h3 className="fw-bold text-success">{formatRupiah(totalPendapatan)}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 text-center card-hover-elevate border-top border-primary border-4">
                <div className="card-body p-4">
                  <div className="display-4 mb-3 text-primary"><i className="bi bi-bar-chart-line-fill"></i></div>
                  <h5 className="text-muted mb-2">Total Belanja</h5>
                  <h3 className="fw-bold text-primary">{formatRupiah(totalBelanja)}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 text-center card-hover-elevate border-top border-warning border-4">
                <div className="card-body p-4">
                  <div className="display-4 mb-3 text-warning"><i className="bi bi-bank2"></i></div>
                  <h5 className="text-muted mb-2">Sisa / Surplus</h5>
                  <h3 className="fw-bold text-warning">{formatRupiah(surplus)}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="rincian-pendapatan" className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Rincian Pendapatan</h2>
            <hr className="w-25 mx-auto text-success border-2 opacity-75" />
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                  <table className="table table-hover-custom mb-0">
                    <thead className="bg-success text-white">
                      <tr>
                        <th className="py-3 ps-4">No</th>
                        <th className="py-3">Sumber Pendapatan</th>
                        <th className="py-3 pe-4 text-end">Jumlah</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendapatan.map((item, idx) => (
                        <tr key={item.id}>
                          <td className="ps-4">{idx + 1}</td>
                          <td>{item.category}</td>
                          <td className="pe-4 text-end fw-medium">{formatRupiah(item.amount)}</td>
                        </tr>
                      ))}
                      {pendapatan.length === 0 && (
                        <tr>
                          <td colSpan="3" className="text-center text-muted py-3">Tidak ada data pendapatan</td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="bg-light">
                      <tr>
                        <td colSpan="2" className="ps-4 fw-bold text-success">Total Pendapatan</td>
                        <td className="pe-4 text-end fw-bold text-success">{formatRupiah(totalPendapatan)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="rincian-belanja" className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Rincian Belanja per Bidang</h2>
            <hr className="w-25 mx-auto text-success border-2 opacity-75" />
            <p className="text-muted">Realisasi belanja anggaran Desa Pondos tahun 2026</p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                  <table className="table table-hover-custom mb-0">
                    <thead className="bg-success text-white">
                      <tr>
                        <th className="py-3 ps-4">Bidang</th>
                        <th className="py-3 text-end">Anggaran</th>
                        <th className="py-3 text-end">Realisasi</th>
                        <th className="py-3 pe-4" style={{ minWidth: "200px" }}>Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {belanja.map((item) => {
                        const realisasi = getRealisasi(item.category, item.amount);
                        const progress = item.amount > 0 ? Math.round((realisasi / item.amount) * 100) : 0;
                        return (
                          <tr key={item.id}>
                            <td className="ps-4 fw-medium">{item.category}</td>
                            <td className="text-end">{formatRupiah(item.amount)}</td>
                            <td className="text-end">{formatRupiah(realisasi)}</td>
                            <td className="pe-4">
                              <div className="progress" style={{ height: "20px" }}>
                                <div 
                                  className={`progress-bar ${getProgressBarClass(progress)}`} 
                                  style={{ width: `${progress}%` }}
                                >
                                  {progress}%
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {belanja.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center text-muted py-3">Tidak ada data belanja</td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="bg-light">
                      <tr>
                        <td className="ps-4 fw-bold text-success">Total</td>
                        <td className="text-end fw-bold text-success">{formatRupiah(totalBelanja)}</td>
                        <td className="text-end fw-bold text-success">{formatRupiah(totalRealisasi)}</td>
                        <td className="pe-4">
                          <div className="progress" style={{ height: "20px" }}>
                            <div 
                              className={`progress-bar ${getProgressBarClass(totalProgress)}`} 
                              style={{ width: `${totalProgress}%` }}
                            >
                              {totalProgress}%
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="catatan-transparansi" className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm border-start border-success border-4">
                <div className="card-body p-4">
                  <h4 className="fw-bold text-success mb-3"><i className="bi bi-pin-angle-fill"></i> Catatan Transparansi</h4>
                  <ul className="text-muted mb-0">
                    <li className="mb-2">Data anggaran bersumber dari dokumen APBDes Desa Pondos Tahun Anggaran 2026 yang telah disahkan oleh BPD.</li>
                    <li className="mb-2">Realisasi anggaran diperbarui secara berkala setiap triwulan (per 3 bulan).</li>
                    <li className="mb-2">Laporan pertanggungjawaban lengkap tersedia di Kantor Desa dan dapat diakses oleh seluruh masyarakat.</li>
                    <li>Jika terdapat pertanyaan seputar anggaran, silakan menghubungi Sekretaris Desa atau Kaur Keuangan.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
