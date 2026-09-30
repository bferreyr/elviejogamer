import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ShieldOff } from 'lucide-react';

export default function Admin() {
  const [currentUser, setCurrentUser] = useState(null);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadInitialData = async () => {
    try {
      const userRes = await fetch('/api/current_user');
      if (!userRes.ok) throw new Error('Not logged in');
      const userData = await userRes.json();
      setCurrentUser(userData);

      if (userData.is_admin) {
        loadGallery();
        loadUsers();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadGallery = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('media', file);

    setUploading(true);
    setStatus('Subiendo...');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
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
    if (!window.confirm("¿Estás seguro de que deseas eliminar este archivo?")) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE'
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

  const toggleAdmin = async (userId, currentStatus) => {
    if (!window.confirm(`¿Estás seguro de que deseas ${currentStatus ? 'quitar' : 'dar'} permisos de administrador a este usuario?`)) return;

    try {
      const res = await fetch(`/api/users/${userId}/admin`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_admin: !currentStatus })
      });
      if (res.ok) {
        loadUsers();
      } else {
        alert("Error al actualizar permisos");
      }
    } catch (err) {
      alert("Error de conexión");
    }
  };

  if (loading) {
    return <div style={{textAlign: 'center', marginTop: '100px', color: 'var(--primary)'}}>Verificando permisos...</div>;
  }

  if (!currentUser || !currentUser.is_admin) {
    return (
      <div className="admin-container" style={{maxWidth: '1200px', margin: '100px auto 0', padding: '2rem', minHeight: '80vh', textAlign: 'center'}}>
        <h1 style={{color: '#ef4444'}}>Acceso Denegado</h1>
        <p style={{color: '#9ca3af', marginTop: '1rem'}}>No tienes permisos de administrador para ver esta página.</p>
        <Link to="/" style={{display: 'inline-block', marginTop: '2rem', padding: '1rem 2rem', background: 'var(--primary)', color: '#000', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold'}}>Volver al Inicio</Link>
      </div>
    );
  }

  return (
    <div className="admin-container" style={{maxWidth: '1200px', margin: '100px auto 0', padding: '2rem', minHeight: '80vh'}}>
      <header className="admin-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem'}}>
        <h1 style={{color: 'var(--primary)', margin: 0}}>Panel Administrativo</h1>
        <Link to="/galeria" className="btn-back" style={{color: '#9ca3af', textDecoration: 'none'}}>&larr; Volver a la galería</Link>
      </header>

      <div className="dashboard-grid" style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '2rem'}}>
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
          <div className="gallery-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem'}}>
            {items.map(item => (
              <div key={item.id} className="gallery-item" style={{position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '16/9', background: '#000'}}>
                {item.type === 'video' ? (
                  <video src={`/${item.url}`} muted style={{width: '100%', height: '100%', objectFit: 'cover'}}></video>
                ) : (
                  <img src={`/${item.url}`} alt="Gallery item" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                )}
                <button 
                  onClick={() => handleDelete(item.id)}
                  style={{position: 'absolute', top: '5px', right: '5px', background: 'rgba(239,68,68,0.9)', color: 'white', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem'}}
                >Borrar</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-card" style={{background: 'rgba(25,25,30,0.8)', padding: '2rem', borderRadius: '12px'}}>
        <h2 style={{borderBottom: '2px solid var(--primary)', display: 'inline-block', paddingBottom: '0.5rem', marginBottom: '1.5rem'}}>Administrar Usuarios</h2>
        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
            <thead>
              <tr style={{borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                <th style={{padding: '1rem'}}>Avatar</th>
                <th style={{padding: '1rem'}}>Nombre</th>
                <th style={{padding: '1rem'}}>Steam ID</th>
                <th style={{padding: '1rem'}}>Rol</th>
                <th style={{padding: '1rem', textAlign: 'right'}}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                  <td style={{padding: '1rem'}}>
                    <img src={user.avatar_url} alt="Avatar" style={{width: '40px', height: '40px', borderRadius: '50%'}} />
                  </td>
                  <td style={{padding: '1rem', fontWeight: 'bold'}}>{user.display_name}</td>
                  <td style={{padding: '1rem', color: '#9ca3af'}}>{user.steam_id}</td>
                  <td style={{padding: '1rem'}}>
                    {user.is_admin ? (
                      <span style={{color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Shield size={16} /> Admin</span>
                    ) : (
                      <span style={{color: '#9ca3af'}}>Usuario</span>
                    )}
                  </td>
                  <td style={{padding: '1rem', textAlign: 'right'}}>
                    {user.steam_id !== currentUser.steam_id && (
                      <button 
                        onClick={() => toggleAdmin(user.id, user.is_admin)}
                        style={{
                          background: user.is_admin ? 'rgba(239,68,68,0.2)' : 'rgba(74,222,128,0.2)', 
                          color: user.is_admin ? '#ef4444' : '#4ade80', 
                          border: `1px solid ${user.is_admin ? 'rgba(239,68,68,0.4)' : 'rgba(74,222,128,0.4)'}`,
                          padding: '0.5rem 1rem', 
                          borderRadius: '6px', 
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        {user.is_admin ? <><ShieldOff size={16} /> Quitar Admin</> : <><Shield size={16} /> Hacer Admin</>}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
