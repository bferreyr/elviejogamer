import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ShieldOff, FolderPlus, UploadCloud, Trash2 } from 'lucide-react';

export default function Admin() {
  const [currentUser, setCurrentUser] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Formularios
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumDate, setNewAlbumDate] = useState('');
  
  const [selectedAlbumId, setSelectedAlbumId] = useState('');
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);

  const loadInitialData = async () => {
    try {
      const userRes = await fetch('/api/current_user');
      if (!userRes.ok) throw new Error('Not logged in');
      const userData = await userRes.json();
      setCurrentUser(userData);

      if (userData.is_admin) {
        loadAlbums();
        loadUsers();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAlbums = async () => {
    try {
      const res = await fetch('/api/albums');
      const data = await res.json();
      setAlbums(data);
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

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!newAlbumTitle || !newAlbumDate) return;

    try {
      const res = await fetch('/api/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newAlbumTitle, event_date: newAlbumDate })
      });
      if (res.ok) {
        setNewAlbumTitle('');
        setNewAlbumDate('');
        loadAlbums();
      } else {
        alert("Error al crear álbum");
      }
    } catch (err) {
      alert("Error de conexión");
    }
  };

  const handleDeleteAlbum = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este álbum y TODAS sus fotos?")) return;

    try {
      const res = await fetch(`/api/albums/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadAlbums();
      } else {
        alert("Error al eliminar");
      }
    } catch (err) {
      alert("Error de conexión");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedAlbumId) {
      alert("Debes seleccionar un álbum.");
      return;
    }
    if (!files || files.length === 0) {
      alert("Debes seleccionar al menos una foto o video.");
      return;
    }

    const formData = new FormData();
    formData.append('album_id', selectedAlbumId);
    for (let i = 0; i < files.length; i++) {
      formData.append('media', files[i]);
    }

    setUploading(true);
    setStatus(`Subiendo ${files.length} archivo(s)...`);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (response.ok) {
        setStatus('¡Archivos subidos exitosamente!');
        setFiles([]);
        document.getElementById('mediaInput').value = '';
        loadAlbums();
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

  if (loading) return <div style={{textAlign: 'center', marginTop: '100px', color: 'var(--primary)'}}>Verificando permisos...</div>;

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

      <div className="dashboard-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem'}}>
        {/* Crear Album */}
        <div className="admin-card" style={{background: 'rgba(25,25,30,0.8)', padding: '2rem', borderRadius: '12px'}}>
          <h2 style={{borderBottom: '2px solid var(--primary)', display: 'inline-block', paddingBottom: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><FolderPlus size={24}/> Crear Nuevo Álbum</h2>
          <form onSubmit={handleCreateAlbum}>
            <div className="form-group" style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem'}}>Título del Álbum:</label>
              <input 
                type="text" 
                required 
                placeholder="Ej: Torneo Counter-Strike"
                value={newAlbumTitle}
                onChange={(e) => setNewAlbumTitle(e.target.value)}
                style={{width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '6px'}}
              />
            </div>
            <div className="form-group" style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem'}}>Fecha del Evento:</label>
              <input 
                type="date" 
                required 
                value={newAlbumDate}
                onChange={(e) => setNewAlbumDate(e.target.value)}
                style={{width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '6px'}}
              />
            </div>
            <button type="submit" style={{width: '100%', padding: '1rem', background: 'rgba(74,222,128,0.2)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.4)', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer'}}>
              Crear Álbum
            </button>
          </form>
        </div>

        {/* Subir Fotos */}
        <div className="admin-card" style={{background: 'rgba(25,25,30,0.8)', padding: '2rem', borderRadius: '12px'}}>
          <h2 style={{borderBottom: '2px solid var(--primary)', display: 'inline-block', paddingBottom: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><UploadCloud size={24}/> Subir Fotos al Álbum</h2>
          <form onSubmit={handleUpload}>
            <div className="form-group" style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem'}}>Seleccionar Álbum:</label>
              <select 
                required 
                value={selectedAlbumId}
                onChange={(e) => setSelectedAlbumId(e.target.value)}
                style={{width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '6px'}}
              >
                <option value="">-- Elegir un álbum --</option>
                {albums.map(a => (
                  <option key={a.id} value={a.id}>{a.title} ({new Date(a.event_date).toLocaleDateString()})</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem'}}>Fotos o Videos (Múltiples):</label>
              <input 
                id="mediaInput"
                type="file" 
                accept="image/*,video/*" 
                multiple
                required 
                onChange={(e) => setFiles(e.target.files)}
                style={{width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '6px'}}
              />
            </div>
            <button type="submit" disabled={uploading || !selectedAlbumId} style={{width: '100%', padding: '1rem', background: 'var(--primary)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: uploading ? 'not-allowed' : 'pointer'}}>
              {uploading ? status : 'Subir Archivos'}
            </button>
          </form>
          {status && !uploading && <div style={{marginTop: '1rem', textAlign: 'center', color: status.includes('Error') ? '#ef4444' : '#4ade80'}}>{status}</div>}
        </div>
      </div>

      {/* Lista de Álbumes */}
      <div className="admin-card" style={{background: 'rgba(25,25,30,0.8)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem'}}>
        <h2 style={{borderBottom: '2px solid var(--primary)', display: 'inline-block', paddingBottom: '0.5rem', marginBottom: '1.5rem'}}>Álbumes Existentes</h2>
        <div style={{overflowX: 'auto'}}>
          <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
            <thead>
              <tr style={{borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                <th style={{padding: '1rem'}}>ID</th>
                <th style={{padding: '1rem'}}>Título</th>
                <th style={{padding: '1rem'}}>Fecha del Evento</th>
                <th style={{padding: '1rem', textAlign: 'right'}}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {albums.length === 0 && <tr><td colSpan="4" style={{padding: '1rem', textAlign: 'center', color: '#9ca3af'}}>No hay álbumes creados.</td></tr>}
              {albums.map(album => (
                <tr key={album.id} style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                  <td style={{padding: '1rem', color: '#9ca3af'}}>#{album.id}</td>
                  <td style={{padding: '1rem', fontWeight: 'bold'}}>{album.title}</td>
                  <td style={{padding: '1rem'}}>{new Date(album.event_date).toLocaleDateString()}</td>
                  <td style={{padding: '1rem', textAlign: 'right'}}>
                    <Link to={`/galeria/${album.id}`} style={{marginRight: '1rem', color: 'var(--primary)', textDecoration: 'none'}}>Ver Fotos</Link>
                    <button 
                      onClick={() => handleDeleteAlbum(album.id)}
                      style={{background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.4)', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem'}}
                    >
                      <Trash2 size={16} /> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lista de Usuarios */}
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
