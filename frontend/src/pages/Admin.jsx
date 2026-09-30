import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Admin() {
  const [items, setItems] = useState([]);
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);

  const loadGallery = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!password) {
      alert("Por favor ingresa la contraseña maestra arriba.");
      return;
    }
    if (!file) return;

    const formData = new FormData();
    formData.append('media', file);

    setUploading(true);
    setStatus('Subiendo...');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': password },
        body: formData
      });
      const data = await response.json();

      if (response.ok) {
        setStatus('¡Archivo subido exitosamente!');
        setFile(null);
        document.getElementById('mediaInput').value = '';
        loadGallery();
        setTimeout(() => setStatus(''), 3000);
      } else {
        setStatus('Error: ' + data.error);
      }
    } catch (error) {
      setStatus('Error de conexión.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!password) {
      alert("Por favor ingresa la contraseña maestra arriba.");
      return;
    }
    if (!window.confirm("¿Estás seguro de que deseas eliminar este archivo?")) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': password }
      });
      if (res.ok) {
        loadGallery();
      } else {
        const data = await res.json();
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Error de conexión al eliminar.");
    }
  };

  return (
    <div className="admin-container" style={{maxWidth: '1200px', margin: '100px auto 0', padding: '2rem', minHeight: '80vh'}}>
      <header className="admin-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem'}}>
        <h1 style={{color: 'var(--primary)', margin: 0}}>Panel Administrativo</h1>
        <Link to="/galeria" className="btn-back" style={{color: '#9ca3af', textDecoration: 'none'}}>&larr; Volver a la galería</Link>
      </header>

      <div className="admin-card" style={{background: 'rgba(25,25,30,0.8)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem'}}>
        <div className="form-group" style={{maxWidth: '400px', margin: 0}}>
          <label style={{display: 'block', marginBottom: '0.5rem'}}>Contraseña Maestra:</label>
          <input 
            type="password" 
            placeholder="Ingresa la contraseña de admin" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '6px'}}
          />
        </div>
      </div>

      <div className="dashboard-grid" style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem'}}>
        <div className="admin-card" style={{background: 'rgba(25,25,30,0.8)', padding: '2rem', borderRadius: '12px'}}>
          <h2 style={{borderBottom: '2px solid var(--primary)', display: 'inline-block', paddingBottom: '0.5rem', marginBottom: '1.5rem'}}>Subir Evento</h2>
          <form onSubmit={handleUpload}>
            <div className="form-group" style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem'}}>Foto o Video:</label>
              <input 
                id="mediaInput"
                type="file" 
                accept="image/*,video/*" 
                required 
                onChange={(e) => setFile(e.target.files[0])}
                style={{width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '6px'}}
              />
            </div>
            <button type="submit" disabled={uploading} style={{width: '100%', padding: '1rem', background: 'var(--primary)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: uploading ? 'not-allowed' : 'pointer'}}>
              {uploading ? 'Subiendo...' : 'Subir Archivo'}
            </button>
          </form>
          <div style={{marginTop: '1rem', textAlign: 'center', color: status.includes('Error') ? '#ef4444' : '#4ade80'}}>{status}</div>
        </div>

        <div className="admin-card" style={{background: 'rgba(25,25,30,0.8)', padding: '2rem', borderRadius: '12px'}}>
          <h2 style={{borderBottom: '2px solid var(--primary)', display: 'inline-block', paddingBottom: '0.5rem', marginBottom: '1.5rem'}}>Administrar Galería</h2>
          <div className="gallery-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem'}}>
            {items.map(item => (
              <div key={item.id} className="gallery-item" style={{position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '16/9', background: '#000'}}>
                {item.type === 'video' ? (
                  <video src={`/${item.url}`} muted style={{width: '100%', height: '100%', objectFit: 'cover'}}></video>
                ) : (
                  <img src={`/${item.url}`} alt="Gallery item" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                )}
                <button 
                  onClick={() => handleDelete(item.id)}
                  style={{position: 'absolute', top: '10px', right: '10px', background: 'rgba(239,68,68,0.9)', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}
                >Eliminar</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
