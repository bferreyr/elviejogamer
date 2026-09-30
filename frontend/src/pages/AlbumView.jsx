import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';

export default function AlbumView() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if admin to show delete buttons
    fetch('/api/current_user')
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .catch(() => {});

    loadGallery();
  }, [id]);

  const loadGallery = () => {
    fetch(`/api/gallery/${id}`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este archivo?")) return;
    try {
      const res = await fetch(`/api/gallery/item/${itemId}`, { method: 'DELETE' });
      if (res.ok) {
        loadGallery();
      } else {
        alert("Error al eliminar");
      }
    } catch (err) {
      alert("Error de conexión");
    }
  };

  return (
    <div className="gallery-container" style={{maxWidth: '1200px', margin: '100px auto 0', padding: '2rem', minHeight: '80vh'}}>
      <div style={{marginBottom: '2rem'}}>
        <Link to="/galeria" style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#9ca3af', textDecoration: 'none', fontWeight: 'bold'}}>
          <ArrowLeft size={20} /> Volver a Álbumes
        </Link>
      </div>

      <div className="section-header" style={{textAlign: 'center', marginBottom: '3rem'}}>
        <h2>FOTOS DEL <span className="text-gradient">EVENTO</span></h2>
      </div>

      {loading ? (
        <div style={{textAlign: 'center', color: 'var(--primary)'}}>Cargando fotos...</div>
      ) : (
        <div className="gallery-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem'}}>
          {items.length === 0 ? (
            <p style={{gridColumn: '1/-1', textAlign: 'center', color: '#9ca3af'}}>Aún no hay fotos en este álbum.</p>
          ) : (
            items.map(item => (
              <div key={item.id} className="gallery-item" style={{position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/9', border: '1px solid rgba(255,255,255,0.05)'}}>
                {item.type === 'video' ? (
                  <video src={`/${item.url}`} autoPlay muted loop controls style={{width: '100%', height: '100%', objectFit: 'cover'}}></video>
                ) : (
                  <img src={`/${item.url}`} alt="Evento" loading="lazy" style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease'}} />
                )}
                {user && user.is_admin && (
                  <button 
                    onClick={() => handleDelete(item.id)}
                    style={{position: 'absolute', top: '10px', right: '10px', background: 'rgba(239,68,68,0.9)', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer', zIndex: 10}}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
