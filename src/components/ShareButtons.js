'use client'

export default function ShareButtons() {
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan disalin!');
    }
  };

  return (
    <div className="share-buttons">
      <span className="text-muted small me-2">Bagikan:</span>
      <button className="btn btn-sm btn-light rounded-circle me-1" title="Share Facebook">
        <i className="bi bi-facebook text-primary"></i>
      </button>
      <button className="btn btn-sm btn-light rounded-circle me-1" title="Share Twitter">
        <i className="bi bi-twitter-x"></i>
      </button>
      <button 
        className="btn btn-sm btn-light rounded-circle" 
        title="Copy Link" 
        onClick={handleCopyLink}
      >
        <i className="bi bi-link-45deg"></i>
      </button>
    </div>
  );
}
