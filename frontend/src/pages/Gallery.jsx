import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Image as ImageIcon } from 'lucide-react';

export default function Gallery() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/albums')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAlbums(data);
        } else {
          setAlbums([]);
        }
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
        <div style={{textAlign: 'center', color: 'var(--primary)'}}>Cargando álbumes...</div>
      ) : (
        <div className="gallery-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem'}}>
          {albums.length === 0 ? (
            <p style={{gridColumn: '1/-1', textAlign: 'center', color: '#9ca3af'}}>Aún no hay álbumes publicados.</p>
          ) : (
            albums.map(album => (
              <Link to={`/galeria/${album.id}`} key={album.id} style={{textDecoration: 'none'}}>
                <div className="feature-card" style={{padding: 0, height: '100%', display: 'flex', flexDirection: 'column'}}>
                  <div style={{height: '200px', width: '100%', background: '#000', position: 'relative', overflow: 'hidden'}}>
                    {album.cover_url ? (
                      <img src={`/${album.cover_url}`} alt={album.title} style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8}} />
                    ) : (
                      <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af'}}>
                        <ImageIcon size={48} opacity={0.5} />
                      </div>
                    )}
                    <div style={{position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '2rem 1rem 1rem', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'}}>
                      <h3 style={{margin: 0, fontSize: '1.2rem', color: 'white'}}>{album.title}</h3>
                    </div>
                  </div>
                  <div style={{padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9ca3af', fontSize: '0.9rem'}}>
                      <Calendar size={16} />
                      {new Date(album.event_date).toLocaleDateString('es-AR')}
                    </div>
                    <span style={{color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem'}}>Ver Fotos &rarr;</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
