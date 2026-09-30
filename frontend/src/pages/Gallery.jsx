import { useEffect, useState } from 'react';

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="gallery-container" style={{maxWidth: '1200px', margin: '100px auto 0', padding: '2rem', minHeight: '80vh'}}>
      <div className="section-header" style={{textAlign: 'center', marginBottom: '3rem'}}>
        <h2>NUESTRA <span className="text-gradient">GALERÍA</span></h2>
        <p>Momentos épicos vividos en El Viejo Gamer</p>
      </div>

      {loading ? (
        <div style={{textAlign: 'center', color: 'var(--primary)'}}>Cargando galería...</div>
      ) : (
        <div className="gallery-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem'}}>
          {items.length === 0 ? (
            <p style={{gridColumn: '1/-1', textAlign: 'center', color: '#9ca3af'}}>Aún no hay fotos en la galería.</p>
          ) : (
            items.map(item => (
              <div key={item.id} className="gallery-item" style={{position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/9', border: '1px solid rgba(255,255,255,0.05)'}}>
                {item.type === 'video' ? (
                  <video src={`/${item.url}`} autoPlay muted loop style={{width: '100%', height: '100%', objectFit: 'cover'}}></video>
                ) : (
                  <img src={`/${item.url}`} alt="Evento en el cyber" loading="lazy" style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease'}} />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
