import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function NewsDetail({ params }) {
  const { slug } = await params;

  // Fetch the specific news article with author details
  const news = await prisma.news.findUnique({
    where: { slug },
    include: {
      author: true,
    },
  });

  if (!news) {
    notFound();
  }

  const getCategoryBadgeClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'pemerintahan': return 'bg-success';
      case 'kesehatan': return 'bg-primary';
      case 'sosial': return 'bg-warning text-dark';
      case 'ekonomi': return 'bg-info text-dark';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '800px' }}>
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/" className="text-success text-decoration-none">Beranda</Link></li>
          <li className="breadcrumb-item"><Link href="/berita" className="text-success text-decoration-none">Berita</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{news.title}</li>
        </ol>
      </nav>

      <article className="bg-white p-4 p-md-5 rounded-4 shadow-sm border-0">
        <div className="d-flex align-items-center mb-4">
          <span className={`badge ${getCategoryBadgeClass(news.category)} me-3 px-3 py-2 fs-6`}>
            {news.category}
          </span>
          <span className="text-muted small">
            <i className="bi bi-calendar3 me-2"></i>
            {new Date(news.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
        </div>

        <h1 className="display-5 fw-bold text-dark mb-4">{news.title}</h1>

        <div className="d-flex align-items-center mb-4 p-3 bg-light rounded-3">
          <div className="me-3 fs-3 text-success">
            <i className="bi bi-person-circle"></i>
          </div>
          <div>
            <div className="fw-bold text-dark">{news.author.name}</div>
            <div className="text-muted small">Pemerintah Desa Pondos</div>
          </div>
        </div>

        {news.imageUrl && (
          <div className="mb-4 overflow-hidden rounded-3 shadow-sm">
            <img src={news.imageUrl} alt={news.title} className="img-fluid w-100" />
          </div>
        )}

        <div className="text-dark lh-lg" style={{ textAlign: 'justify', whiteSpace: 'pre-line', fontSize: '1.1rem' }}>
          {news.content}
        </div>

        <hr className="my-5 opacity-25" />

        <div className="d-flex justify-content-between align-items-center">
          <Link href="/berita" className="btn btn-outline-success px-4 rounded-pill fw-medium">
            ← Kembali ke Berita
          </Link>
          <div className="share-buttons">
            <span className="text-muted small me-2">Bagikan:</span>
            <button className="btn btn-sm btn-light rounded-circle me-1" title="Share Facebook"><i className="bi bi-facebook text-primary"></i></button>
            <button className="btn btn-sm btn-light rounded-circle me-1" title="Share Twitter"><i className="bi bi-twitter-x"></i></button>
            <button className="btn btn-sm btn-light rounded-circle" title="Copy Link" onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Tautan disalin!'); }}><i className="bi bi-link-45deg"></i></button>
          </div>
        </div>
      </article>
    </div>
  );
}
