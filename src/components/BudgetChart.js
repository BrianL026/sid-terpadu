'use client'

export default function BudgetChart({ totalPendapatan, totalBelanja }) {
  const max = Math.max(totalPendapatan, totalBelanja);
  const pctPendapatan = max > 0 ? (totalPendapatan / max) * 100 : 0;
  const pctBelanja = max > 0 ? (totalBelanja / max) * 100 : 0;

  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatShort = (num) => {
    if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + ' M';
    }
    if (num >= 1e6) {
      return (num / 1e6).toFixed(0) + ' Jt';
    }
    return num.toString();
  };

  return (
    <div className="card border-0 shadow-sm p-4 mb-5">
      <h5 className="fw-bold mb-4 text-dark">
        <i className="bi bi-graph-up-arrow text-success me-2"></i>Visualisasi Realisasi APBDes 2026
      </h5>
      <div className="row align-items-center">
        {/* Left Side: SVG Chart */}
        <div className="col-md-6 mb-4 mb-md-0 d-flex justify-content-center">
          <svg viewBox="0 0 400 300" className="w-100" style={{ maxHeight: '250px', maxWidth: '350px' }}>
            {/* Grid lines */}
            <line x1="60" y1="50" x2="360" y2="50" stroke="#f0f0f0" strokeWidth="1" />
            <line x1="60" y1="140" x2="360" y2="140" stroke="#f0f0f0" strokeWidth="1" />
            <line x1="60" y1="230" x2="360" y2="230" stroke="#cccccc" strokeWidth="1.5" />

            {/* Y Axis Labels */}
            <text x="50" y="54" fontSize="11" fill="#888888" textAnchor="end">{formatShort(max)}</text>
            <text x="50" y="144" fontSize="11" fill="#888888" textAnchor="end">{formatShort(max / 2)}</text>
            <text x="50" y="234" fontSize="11" fill="#888888" textAnchor="end">0</text>

            {/* Bars */}
            {/* Pendapatan Bar */}
            <rect 
              x="120" 
              y={230 - (pctPendapatan * 1.8)} 
              width="50" 
              height={pctPendapatan * 1.8} 
              rx="6" 
              fill="#198754" 
              className="chart-bar"
              style={{ transition: 'all 0.6s ease' }}
            />
            
            {/* Belanja Bar */}
            <rect 
              x="230" 
              y={230 - (pctBelanja * 1.8)} 
              width="50" 
              height={pctBelanja * 1.8} 
              rx="6" 
              fill="#0d6efd" 
              className="chart-bar"
              style={{ transition: 'all 0.6s ease' }}
            />

            {/* X Axis Labels */}
            <text x="145" y="255" fontSize="12" fontWeight="bold" fill="#555555" textAnchor="middle">Pendapatan</text>
            <text x="255" y="255" fontSize="12" fontWeight="bold" fill="#555555" textAnchor="middle">Belanja</text>

            {/* Value tooltips inside chart */}
            <text x="145" y={230 - (pctPendapatan * 1.8) - 10} fontSize="11" fontWeight="bold" fill="#198754" textAnchor="middle">{formatShort(totalPendapatan)}</text>
            <text x="255" y={230 - (pctBelanja * 1.8) - 10} fontSize="11" fontWeight="bold" fill="#0d6efd" textAnchor="middle">{formatShort(totalBelanja)}</text>
          </svg>
        </div>

        {/* Right Side: Legend & Breakdown */}
        <div className="col-md-6">
          <div className="p-3 bg-light rounded-4">
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small fw-bold text-muted">Total Pendapatan</span>
                <span className="text-success fw-bold">{formatRupiah(totalPendapatan)}</span>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div className="progress-bar bg-success" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            <div className="mb-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small fw-bold text-muted">Total Belanja</span>
                <span className="text-primary fw-bold">{formatRupiah(totalBelanja)}</span>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div className="progress-bar bg-primary" style={{ width: `${(totalBelanja / totalPendapatan) * 100}%` }}></div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-top border-secondary border-opacity-10 text-center text-md-start">
              <small className="text-muted">
                Alokasi Belanja Desa adalah <strong className="text-dark">{(totalBelanja / totalPendapatan * 100).toFixed(1)}%</strong> dari total pendapatan daerah.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
