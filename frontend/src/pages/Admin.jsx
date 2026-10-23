import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  ShieldOff, 
  FolderPlus, 
  UploadCloud, 
  Trash2, 
  Trophy, 
  Users, 
  Images, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  ExternalLink, 
  Download, 
  FileText, 
  Search, 
  MessageCircle, 
  CreditCard, 
  MapPin, 
  RefreshCw, 
  X, 
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export default function Admin() {
  const [currentUser, setCurrentUser] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [users, setUsers] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRegs, setLoadingRegs] = useState(false);

  // Tab activo: 'tournament' | 'albums' | 'users'
  const [activeTab, setActiveTab] = useState('tournament');

  // Filtros de Torneo
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReg, setSelectedReg] = useState(null);
  const [receiptModalUrl, setReceiptModalUrl] = useState(null);

  // Formularios de Álbumes
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
        loadRegistrations();
        loadAlbums();
        loadUsers();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRegistrations = async () => {
    setLoadingRegs(true);
    try {
      const res = await fetch(`/api/admin/tournament/registrations?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setRegistrations(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setLoadingRegs(false);
    }
  };

  const loadAlbums = async () => {
    try {
      const res = await fetch('/api/albums');
      const data = await res.json();
      setAlbums(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await fetch(`/api/users?t=${new Date().getTime()}`, { cache: 'no-store' });
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

  // --- Handlers de Torneo ---
  const handleUpdateRegStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/admin/tournament/registrations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
        if (selectedReg && selectedReg.id === id) {
          setSelectedReg(prev => ({ ...prev, status: newStatus }));
        }
      } else {
        alert('Error al actualizar el estado de la inscripción');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  const handleDeleteReg = async (id, teamName) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar permanentemente la inscripción del equipo "${teamName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/tournament/registrations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRegistrations(prev => prev.filter(r => r.id !== id));
        if (selectedReg && selectedReg.id === id) {
          setSelectedReg(null);
        }
      } else {
        alert('Error al eliminar inscripción');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  // --- Handlers de Álbumes ---
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

  // Helper para parsear roster y suplentes de forma segura
  const safeParseArray = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try { return JSON.parse(val); } catch (e) { return []; }
    }
    return [];
  };

  const formatAssetUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) return url;
    return `/${url}`;
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

  // Filtrado de inscripciones
  const pendingCount = registrations.filter(r => (r.status || 'pendiente') === 'pendiente').length;
  const confirmedCount = registrations.filter(r => r.status === 'confirmado').length;
  const rejectedCount = registrations.filter(r => r.status === 'rechazado').length;

  const filteredRegistrations = registrations.filter(reg => {
    const regStatus = reg.status || 'pendiente';
    if (statusFilter !== 'all' && regStatus !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTeam = (reg.team_name || '').toLowerCase().includes(q);
      const matchTag = (reg.team_tag || '').toLowerCase().includes(q);
      const matchCaptain = (reg.captain_name || '').toLowerCase().includes(q);
      const matchNick = (reg.captain_nick || '').toLowerCase().includes(q);
      const matchPayer = (reg.payment_holder_name || '').toLowerCase().includes(q);
      const matchCity = (reg.origin_city || '').toLowerCase().includes(q);
      return matchTeam || matchTag || matchCaptain || matchNick || matchPayer || matchCity;
    }
    return true;
  });

  return (
    <div className="admin-container" style={{maxWidth: '1400px', margin: '90px auto 4rem', padding: '1.5rem', minHeight: '85vh'}}>
      {/* Header */}
      <header className="admin-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem'}}>
        <div>
          <h1 style={{color: 'var(--primary)', margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem'}}>
            <Shield size={28} /> Panel Administrativo
          </h1>
          <p style={{color: '#9ca3af', fontSize: '0.85rem', margin: '0.2rem 0 0'}}>
            Gestiona inscripciones de torneos, comprobantes de pago, galería y usuarios.
          </p>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <Link to="/torneo/inscripcion" target="_blank" style={{display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#60a5fa', textDecoration: 'none', fontSize: '0.85rem'}}>
            <ExternalLink size={14} /> Ver Formulario Público
          </Link>
          <Link to="/galeria" className="btn-back" style={{color: '#9ca3af', textDecoration: 'none', fontSize: '0.85rem'}}>
            &larr; Ir a Galería
          </Link>
        </div>
      </header>

      {/* Tabs Principales */}
      <div style={{display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem', flexWrap: 'wrap'}}>
        <button
          onClick={() => setActiveTab('tournament')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.85rem 1.4rem',
            background: activeTab === 'tournament' ? 'rgba(229,9,20,0.15)' : 'transparent',
            color: activeTab === 'tournament' ? 'var(--primary)' : '#9ca3af',
            border: 'none',
            borderBottom: activeTab === 'tournament' ? '3px solid var(--primary)' : '3px solid transparent',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Trophy size={18} /> Inscripciones Torneo CS2
          {pendingCount > 0 && (
            <span style={{
              background: '#f59e0b',
              color: '#000',
              padding: '0.15rem 0.5rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 800
            }}>
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('albums')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.85rem 1.4rem',
            background: activeTab === 'albums' ? 'rgba(229,9,20,0.15)' : 'transparent',
            color: activeTab === 'albums' ? 'var(--primary)' : '#9ca3af',
            border: 'none',
            borderBottom: activeTab === 'albums' ? '3px solid var(--primary)' : '3px solid transparent',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Images size={18} /> Galería y Álbumes ({albums.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.85rem 1.4rem',
            background: activeTab === 'users' ? 'rgba(229,9,20,0.15)' : 'transparent',
            color: activeTab === 'users' ? 'var(--primary)' : '#9ca3af',
            border: 'none',
            borderBottom: activeTab === 'users' ? '3px solid var(--primary)' : '3px solid transparent',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Users size={18} /> Usuarios ({users.length})
        </button>
      </div>

      {/* ========================================================
          TAB 1: INSCRIPCIONES DEL TORNEO COPA VIEJO GAMER
         ======================================================== */}
      {activeTab === 'tournament' && (
        <div>
          {/* Métricas Rápidas */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem'}}>
            <div style={{background: 'rgba(25,25,30,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '1.2rem'}}>
              <div style={{color: '#9ca3af', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Total Inscriptos</div>
              <div style={{fontSize: '2rem', fontWeight: 900, color: '#fff', marginTop: '0.3rem'}}>{registrations.length} <span style={{fontSize: '0.9rem', color: '#9ca3af', fontWeight: 'normal'}}>/ 32 cupos</span></div>
            </div>

            <div style={{background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '10px', padding: '1.2rem'}}>
              <div style={{color: '#f59e0b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.4rem'}}>
                <Clock size={14} /> Pendientes de Revisión
              </div>
              <div style={{fontSize: '2rem', fontWeight: 900, color: '#f59e0b', marginTop: '0.3rem'}}>{pendingCount}</div>
            </div>

            <div style={{background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '10px', padding: '1.2rem'}}>
              <div style={{color: '#22c55e', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.4rem'}}>
                <CheckCircle size={14} /> Cupos Confirmados
              </div>
              <div style={{fontSize: '2rem', fontWeight: 900, color: '#22c55e', marginTop: '0.3rem'}}>{confirmedCount} <span style={{fontSize: '0.9rem', color: '#86efac', fontWeight: 'normal'}}>equipos</span></div>
            </div>

            <div style={{background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '1.2rem'}}>
              <div style={{color: '#ef4444', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.4rem'}}>
                <XCircle size={14} /> Rechazados
              </div>
              <div style={{fontSize: '2rem', fontWeight: 900, color: '#ef4444', marginTop: '0.3rem'}}>{rejectedCount}</div>
            </div>
          </div>

          {/* Barra de Filtros y Búsqueda */}
          <div style={{background: 'rgba(25,25,30,0.8)', padding: '1rem 1.2rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap'}}>
            {/* Buscador */}
            <div style={{display: 'flex', alignItems: 'center', gap: '0.6rem', flex: '1 1 300px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '0.5rem 0.8rem'}}>
              <Search size={18} color="#9ca3af" />
              <input
                type="text"
                placeholder="Buscar por equipo, TAG, capitán, titular de pago, ciudad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{background: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.9rem'}}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0}}>
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filtros de estado */}
            <div style={{display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap'}}>
              <span style={{fontSize: '0.8rem', color: '#9ca3af', marginRight: '0.2rem'}}>Estado:</span>
              <button
                onClick={() => setStatusFilter('all')}
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  borderRadius: '6px',
                  border: statusFilter === 'all' ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                  background: statusFilter === 'all' ? 'rgba(229,9,20,0.2)' : 'rgba(0,0,0,0.3)',
                  color: statusFilter === 'all' ? '#fff' : '#9ca3af',
                  cursor: 'pointer'
                }}
              >
                Todos ({registrations.length})
              </button>
              <button
                onClick={() => setStatusFilter('pendiente')}
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  borderRadius: '6px',
                  border: statusFilter === 'pendiente' ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                  background: statusFilter === 'pendiente' ? 'rgba(245,158,11,0.2)' : 'rgba(0,0,0,0.3)',
                  color: statusFilter === 'pendiente' ? '#f59e0b' : '#9ca3af',
                  cursor: 'pointer'
                }}
              >
                Pendientes ({pendingCount})
              </button>
              <button
                onClick={() => setStatusFilter('confirmado')}
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  borderRadius: '6px',
                  border: statusFilter === 'confirmado' ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.1)',
                  background: statusFilter === 'confirmado' ? 'rgba(34,197,94,0.2)' : 'rgba(0,0,0,0.3)',
                  color: statusFilter === 'confirmado' ? '#22c55e' : '#9ca3af',
                  cursor: 'pointer'
                }}
              >
                Confirmados ({confirmedCount})
              </button>
              <button
                onClick={() => setStatusFilter('rechazado')}
                style={{
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.8rem',
                  borderRadius: '6px',
                  border: statusFilter === 'rechazado' ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                  background: statusFilter === 'rechazado' ? 'rgba(239,68,68,0.2)' : 'rgba(0,0,0,0.3)',
                  color: statusFilter === 'rechazado' ? '#ef4444' : '#9ca3af',
                  cursor: 'pointer'
                }}
              >
                Rechazados ({rejectedCount})
              </button>

              <button
                onClick={loadRegistrations}
                title="Recargar lista"
                style={{
                  padding: '0.4rem 0.6rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(0,0,0,0.3)',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
              >
                <RefreshCw size={15} className={loadingRegs ? 'spin' : ''} />
              </button>
            </div>
          </div>

          {/* Tabla de Inscripciones */}
          <div className="admin-card" style={{background: 'rgba(25,25,30,0.85)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <h2 style={{fontSize: '1.2rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <Trophy size={20} color="var(--primary)" /> Equipos Inscriptos ({filteredRegistrations.length})
              </h2>
              <span style={{fontSize: '0.8rem', color: '#9ca3af'}}>
                Mostrando {filteredRegistrations.length} de {registrations.length} inscripciones
              </span>
            </div>

            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px'}}>
                <thead>
                  <tr style={{borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)'}}>
                    <th style={{padding: '0.9rem'}}>Equipo / TAG</th>
                    <th style={{padding: '0.9rem'}}>Origen</th>
                    <th style={{padding: '0.9rem'}}>Capitán</th>
                    <th style={{padding: '0.9rem'}}>LAN Santa Fe</th>
                    <th style={{padding: '0.9rem'}}>Pago & Titular</th>
                    <th style={{padding: '0.9rem'}}>Comprobante</th>
                    <th style={{padding: '0.9rem'}}>Estado</th>
                    <th style={{padding: '0.9rem', textAlign: 'right'}}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.length === 0 && (
                    <tr>
                      <td colSpan="8" style={{padding: '3rem', textAlign: 'center', color: '#9ca3af'}}>
                        {registrations.length === 0 ? 'Aún no hay inscripciones registradas.' : 'No se encontraron inscripciones con los filtros seleccionados.'}
                      </td>
                    </tr>
                  )}
                  {filteredRegistrations.map((reg) => {
                    const statusClass = reg.status || 'pendiente';
                    const hasReceipt = Boolean(reg.payment_receipt_url);
                    const whatsappClean = (reg.captain_phone || '').replace(/[^0-9]/g, '');

                    return (
                      <tr key={reg.id} style={{borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s'}}>
                        {/* Equipo / Logo / TAG */}
                        <td style={{padding: '0.9rem'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                            {reg.logo_url ? (
                              <img
                                src={formatAssetUrl(reg.logo_url)}
                                alt="Logo"
                                style={{width: '38px', height: '38px', borderRadius: '6px', objectFit: 'contain', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)'}}
                              />
                            ) : (
                              <div style={{width: '38px', height: '38px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.2)'}}>
                                <Trophy size={16} color="#666" />
                              </div>
                            )}
                            <div>
                              <div style={{fontWeight: 'bold', color: '#fff', fontSize: '0.95rem'}}>{reg.team_name}</div>
                              <span style={{fontSize: '0.75rem', background: 'rgba(229,9,20,0.15)', color: 'var(--primary)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700}}>
                                [{reg.team_tag}]
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Origen */}
                        <td style={{padding: '0.9rem', color: '#d1d5db', fontSize: '0.85rem'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
                            <MapPin size={13} color="#9ca3af" />
                            {reg.origin_city || '-'}
                          </div>
                        </td>

                        {/* Capitán */}
                        <td style={{padding: '0.9rem', fontSize: '0.85rem'}}>
                          <div style={{fontWeight: 600, color: '#fff'}}>{reg.captain_nick}</div>
                          <div style={{color: '#9ca3af', fontSize: '0.78rem'}}>{reg.captain_name}</div>
                          {whatsappClean && (
                            <a
                              href={`https://wa.me/${whatsappClean}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#4ade80', fontSize: '0.75rem', textDecoration: 'none', marginTop: '0.2rem'}}
                            >
                              <MessageCircle size={12} /> WhatsApp
                            </a>
                          )}
                        </td>

                        {/* LAN Santa Fe */}
                        <td style={{padding: '0.9rem', fontSize: '0.85rem'}}>
                          {reg.can_attend_lan === 'Sí' ? (
                            <span style={{color: '#4ade80', fontWeight: 600}}>✓ Sí</span>
                          ) : (
                            <span style={{color: '#ef4444', fontWeight: 600}}>✗ No</span>
                          )}
                          {reg.travel_from && (
                            <div style={{color: '#9ca3af', fontSize: '0.75rem'}}>Desde: {reg.travel_from}</div>
                          )}
                        </td>

                        {/* Pago & Titular */}
                        <td style={{padding: '0.9rem', fontSize: '0.85rem'}}>
                          <div style={{color: '#fff', fontWeight: 600}}>{reg.payment_holder_name || 'No especificado'}</div>
                          <div style={{color: '#9ca3af', fontSize: '0.75rem'}}>AR$ 150.000 (Transferencia)</div>
                        </td>

                        {/* Comprobante */}
                        <td style={{padding: '0.9rem'}}>
                          {hasReceipt ? (
                            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                              <button
                                onClick={() => setReceiptModalUrl(formatAssetUrl(reg.payment_receipt_url))}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  padding: '0.35rem 0.7rem',
                                  background: 'rgba(59,130,246,0.15)',
                                  color: '#60a5fa',
                                  border: '1px solid rgba(59,130,246,0.3)',
                                  borderRadius: '5px',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer',
                                  fontWeight: 600
                                }}
                              >
                                <Eye size={13} /> Ver Recibo
                              </button>
                              <a
                                href={formatAssetUrl(reg.payment_receipt_url)}
                                target="_blank"
                                rel="noreferrer"
                                download
                                style={{color: '#9ca3af', display: 'inline-flex'}}
                                title="Descargar comprobante"
                              >
                                <Download size={14} />
                              </a>
                            </div>
                          ) : (
                            <span style={{color: '#ef4444', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem'}}>
                              <AlertTriangle size={13} /> Sin archivo
                            </span>
                          )}
                        </td>

                        {/* Estado */}
                        <td style={{padding: '0.9rem'}}>
                          {statusClass === 'confirmado' && (
                            <span style={{display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)'}}>
                              <CheckCircle size={13} /> Confirmado
                            </span>
                          )}
                          {statusClass === 'pendiente' && (
                            <span style={{display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)'}}>
                              <Clock size={13} /> Pendiente
                            </span>
                          )}
                          {statusClass === 'rechazado' && (
                            <span style={{display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)'}}>
                              <XCircle size={13} /> Rechazado
                            </span>
                          )}
                        </td>

                        {/* Acciones */}
                        <td style={{padding: '0.9rem', textAlign: 'right'}}>
                          <div style={{display: 'inline-flex', gap: '0.35rem', alignItems: 'center'}}>
                            <button
                              onClick={() => setSelectedReg(reg)}
                              title="Ver Ficha Completa (34 ítems)"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                padding: '0.35rem 0.65rem',
                                background: 'rgba(255,255,255,0.08)',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '5px',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                fontWeight: 600
                              }}
                            >
                              <Eye size={13} /> Detalle
                            </button>

                            {statusClass !== 'confirmado' && (
                              <button
                                onClick={() => handleUpdateRegStatus(reg.id, 'confirmado')}
                                title="Aprobar y Confirmar Cupo"
                                style={{
                                  padding: '0.35rem 0.5rem',
                                  background: 'rgba(34,197,94,0.15)',
                                  color: '#22c55e',
                                  border: '1px solid rgba(34,197,94,0.3)',
                                  borderRadius: '5px',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer'
                                }}
                              >
                                <CheckCircle size={14} />
                              </button>
                            )}

                            {statusClass !== 'rechazado' && (
                              <button
                                onClick={() => handleUpdateRegStatus(reg.id, 'rechazado')}
                                title="Rechazar Inscripción"
                                style={{
                                  padding: '0.35rem 0.5rem',
                                  background: 'rgba(239,68,68,0.15)',
                                  color: '#ef4444',
                                  border: '1px solid rgba(239,68,68,0.3)',
                                  borderRadius: '5px',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer'
                                }}
                              >
                                <XCircle size={14} />
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteReg(reg.id, reg.team_name)}
                              title="Eliminar registro"
                              style={{
                                padding: '0.35rem 0.5rem',
                                background: 'rgba(239,68,68,0.1)',
                                color: '#ef4444',
                                border: '1px solid rgba(239,68,68,0.2)',
                                borderRadius: '5px',
                                fontSize: '0.75rem',
                                cursor: 'pointer'
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: GALERIA Y ALBUMES (EXISTENTE)
         ======================================================== */}
      {activeTab === 'albums' && (
        <div>
          <div className="dashboard-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
            {/* Crear Album */}
            <div className="admin-card" style={{background: 'rgba(25,25,30,0.8)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)'}}>
              <h2 style={{borderBottom: '2px solid var(--primary)', display: 'inline-block', paddingBottom: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <FolderPlus size={24}/> Crear Nuevo Álbum
              </h2>
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
            <div className="admin-card" style={{background: 'rgba(25,25,30,0.8)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)'}}>
              <h2 style={{borderBottom: '2px solid var(--primary)', display: 'inline-block', paddingBottom: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <UploadCloud size={24}/> Subir Fotos al Álbum
              </h2>
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
          <div className="admin-card" style={{background: 'rgba(25,25,30,0.8)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)'}}>
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
        </div>
      )}

      {/* ========================================================
          TAB 3: USUARIOS (EXISTENTE)
         ======================================================== */}
      {activeTab === 'users' && (
        <div className="admin-card" style={{background: 'rgba(25,25,30,0.8)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)'}}>
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
      )}

      {/* ========================================================
          MODAL: FICHA COMPLETA DE INSCRIPCION (34 ITEMS)
         ======================================================== */}
      {selectedReg && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#121217',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '920px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.2rem 1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.02)'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                {selectedReg.logo_url && (
                  <img
                    src={formatAssetUrl(selectedReg.logo_url)}
                    alt="Logo"
                    style={{width: '45px', height: '45px', borderRadius: '8px', objectFit: 'contain', background: '#000'}}
                  />
                )}
                <div>
                  <h3 style={{margin: 0, color: '#fff', fontSize: '1.3rem'}}>
                    {selectedReg.team_name} <span style={{color: 'var(--primary)'}}>[{selectedReg.team_tag}]</span>
                  </h3>
                  <div style={{fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.2rem'}}>
                    Inscripto el: {selectedReg.created_at ? new Date(selectedReg.created_at).toLocaleString() : 'Fecha no disp.'}
                  </div>
                </div>
              </div>

              <div style={{display: 'flex', alignItems: 'center', gap: '0.8rem'}}>
                {selectedReg.status === 'confirmado' && (
                  <span style={{background: 'rgba(34,197,94,0.2)', color: '#22c55e', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold'}}>
                    ✓ Cupo Confirmado
                  </span>
                )}
                {selectedReg.status === 'pendiente' && (
                  <span style={{background: 'rgba(245,158,11,0.2)', color: '#f59e0b', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold'}}>
                    ⏳ Pendiente de Validación
                  </span>
                )}
                {selectedReg.status === 'rechazado' && (
                  <span style={{background: 'rgba(239,68,68,0.2)', color: '#ef4444', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold'}}>
                    ✗ Rechazado
                  </span>
                )}
                <button
                  onClick={() => setSelectedReg(null)}
                  style={{background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '0.3rem'}}
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Body: Scrolleable */}
            <div style={{padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              
              {/* SECCIÓN 1: EQUIPO */}
              <div style={{background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)'}}>
                <div style={{fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.8rem'}}>
                  SECCIÓN 1 – INFORMACIÓN DEL EQUIPO
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
                  <div>
                    <span style={{fontSize: '0.75rem', color: '#9ca3af', display: 'block'}}>1. Nombre del equipo</span>
                    <strong style={{color: '#fff'}}>{selectedReg.team_name}</strong>
                  </div>
                  <div>
                    <span style={{fontSize: '0.75rem', color: '#9ca3af', display: 'block'}}>2. TAG oficial</span>
                    <strong style={{color: '#fff'}}>[{selectedReg.team_tag}]</strong>
                  </div>
                  <div>
                    <span style={{fontSize: '0.75rem', color: '#9ca3af', display: 'block'}}>3. Ciudad y provincia</span>
                    <strong style={{color: '#fff'}}>{selectedReg.origin_city}</strong>
                  </div>
                  <div>
                    <span style={{fontSize: '0.75rem', color: '#9ca3af', display: 'block'}}>4. Instagram</span>
                    {selectedReg.instagram ? (
                      <a href={selectedReg.instagram.startsWith('http') ? selectedReg.instagram : `https://instagram.com/${selectedReg.instagram.replace('@','')}`} target="_blank" rel="noreferrer" style={{color: '#e1306c', textDecoration: 'none', fontWeight: 600}}>
                        {selectedReg.instagram}
                      </a>
                    ) : <span style={{color: '#666'}}>No informado</span>}
                  </div>
                </div>

                {selectedReg.logo_url && (
                  <div style={{marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <img src={formatAssetUrl(selectedReg.logo_url)} alt="Logo completo" style={{maxHeight: '60px', borderRadius: '6px', background: '#000', border: '1px solid rgba(255,255,255,0.1)'}} />
                    <div>
                      <span style={{fontSize: '0.75rem', color: '#9ca3af', display: 'block'}}>5. Logo del equipo subido</span>
                      <a href={formatAssetUrl(selectedReg.logo_url)} target="_blank" rel="noreferrer" style={{color: '#60a5fa', fontSize: '0.8rem', textDecoration: 'none'}}>
                        Abrir logo original &rarr;
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* SECCIÓN 2: DATOS DEL CAPITÁN */}
              <div style={{background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)'}}>
                <div style={{fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.8rem'}}>
                  SECCIÓN 2 – DATOS DEL CAPITÁN
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem'}}>
                  <div>
                    <span style={{fontSize: '0.75rem', color: '#9ca3af', display: 'block'}}>6. Nombre y apellido</span>
                    <strong style={{color: '#fff'}}>{selectedReg.captain_name}</strong>
                  </div>
                  <div>
                    <span style={{fontSize: '0.75rem', color: '#9ca3af', display: 'block'}}>7. Nickname en CS2</span>
                    <strong style={{color: '#f59e0b'}}>{selectedReg.captain_nick}</strong>
                  </div>
                  <div>
                    <span style={{fontSize: '0.75rem', color: '#9ca3af', display: 'block'}}>8. WhatsApp</span>
                    <strong style={{color: '#fff'}}>{selectedReg.captain_phone}</strong>
                    {selectedReg.captain_phone && (
                      <a
                        href={`https://wa.me/${selectedReg.captain_phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginLeft: '0.5rem', color: '#4ade80', fontSize: '0.75rem', textDecoration: 'none'}}
                      >
                        <MessageCircle size={12} /> Contactar
                      </a>
                    )}
                  </div>
                  <div>
                    <span style={{fontSize: '0.75rem', color: '#9ca3af', display: 'block'}}>9. Correo electrónico</span>
                    <span style={{color: '#fff'}}>{selectedReg.captain_email || 'No especificado'}</span>
                  </div>
                  <div>
                    <span style={{fontSize: '0.75rem', color: '#9ca3af', display: 'block'}}>10. Steam</span>
                    {selectedReg.captain_steam ? (
                      <a href={selectedReg.captain_steam} target="_blank" rel="noreferrer" style={{color: '#60a5fa', fontSize: '0.85rem', wordBreak: 'break-all'}}>
                        Ver Steam &rarr;
                      </a>
                    ) : '-'}
                  </div>
                  <div>
                    <span style={{fontSize: '0.75rem', color: '#9ca3af', display: 'block'}}>11. FACEIT</span>
                    {selectedReg.captain_faceit ? (
                      <a href={selectedReg.captain_faceit} target="_blank" rel="noreferrer" style={{color: '#ff5500', fontSize: '0.85rem', wordBreak: 'break-all'}}>
                        Ver FACEIT &rarr;
                      </a>
                    ) : '-'}
                  </div>
                  <div>
                    <span style={{fontSize: '0.75rem', color: '#9ca3af', display: 'block'}}>12. Discord</span>
                    <span style={{color: '#fff'}}>{selectedReg.captain_discord || 'No especificado'}</span>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 3: ROSTER / PLANTILLA DE JUGADORES */}
              <div style={{background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)'}}>
                <div style={{fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.8rem'}}>
                  SECCIÓN 3 – PLANTILLA DE JUGADORES (5 TITULARES + SUPLENTES)
                </div>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.6rem'}}>
                  {safeParseArray(selectedReg.roster).map((p, idx) => (
                    <div key={idx} style={{
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '0.6rem 0.8rem', 
                      background: idx === 0 ? 'rgba(245,158,11,0.08)' : 'rgba(0,0,0,0.3)', 
                      border: idx === 0 ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(255,255,255,0.05)', 
                      borderRadius: '6px', 
                      flexWrap: 'wrap', 
                      gap: '0.5rem'
                    }}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.6rem'}}>
                        <span style={{background: idx === 0 ? '#f59e0b' : 'rgba(255,255,255,0.1)', color: idx === 0 ? '#000' : '#fff', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800}}>
                          {idx === 0 ? 'CAPITÁN / JUGADOR 1' : `TITULAR ${idx + 1}`}
                        </span>
                        <div>
                          <span style={{fontWeight: 700, color: '#fff'}}>{p.nickname || '-'}</span>
                          <span style={{color: '#9ca3af', fontSize: '0.8rem', marginLeft: '0.5rem'}}>({p.name || '-'})</span>
                        </div>
                      </div>

                      <div style={{display: 'flex', gap: '0.8rem', fontSize: '0.8rem'}}>
                        {p.steam && (
                          <a href={p.steam} target="_blank" rel="noreferrer" style={{color: '#60a5fa', textDecoration: 'none'}}>
                            Steam Profile
                          </a>
                        )}
                        {p.faceit && (
                          <a href={p.faceit} target="_blank" rel="noreferrer" style={{color: '#ff5500', textDecoration: 'none'}}>
                            FACEIT Profile
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Suplentes */}
                <div style={{marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.5rem'}}>
                    18. ¿Inscribe suplentes?: <strong style={{color: '#fff'}}>{selectedReg.has_substitutes || 'No'}</strong>
                  </div>

                  {safeParseArray(selectedReg.substitutes).length > 0 && (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.6rem'}}>
                      {safeParseArray(selectedReg.substitutes).map((sub, sIdx) => (
                        <div key={sIdx} style={{
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          padding: '0.6rem 0.8rem', 
                          background: 'rgba(0,0,0,0.3)', 
                          border: '1px solid rgba(255,255,255,0.05)', 
                          borderRadius: '6px', 
                          flexWrap: 'wrap', 
                          gap: '0.5rem'
                        }}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '0.6rem'}}>
                            <span style={{background: 'rgba(59,130,246,0.2)', color: '#60a5fa', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800}}>
                              SUPLENTE {sIdx + 1}
                            </span>
                            <div>
                              <span style={{fontWeight: 700, color: '#fff'}}>{sub.nickname || '-'}</span>
                              <span style={{color: '#9ca3af', fontSize: '0.8rem', marginLeft: '0.5rem'}}>({sub.name || '-'})</span>
                            </div>
                          </div>

                          <div style={{display: 'flex', gap: '0.8rem', fontSize: '0.8rem'}}>
                            {sub.steam && (
                              <a href={sub.steam} target="_blank" rel="noreferrer" style={{color: '#60a5fa', textDecoration: 'none'}}>
                                Steam Profile
                              </a>
                            )}
                            {sub.faceit && (
                              <a href={sub.faceit} target="_blank" rel="noreferrer" style={{color: '#ff5500', textDecoration: 'none'}}>
                                FACEIT Profile
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SECCIÓN 4: FASE PRESENCIAL Y VIAJE */}
              <div style={{background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)'}}>
                <div style={{fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.8rem'}}>
                  SECCIÓN 4 – DISPONIBILIDAD Y FASE PRESENCIAL
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem'}}>
                  <div>
                    <span style={{fontSize: '0.75rem', color: '#9ca3af', display: 'block'}}>21. Asistencia Presencial a Santa Fe Capital</span>
                    <strong style={{color: selectedReg.can_attend_lan === 'Sí' ? '#22c55e' : '#ef4444', fontSize: '1rem'}}>
                      {selectedReg.can_attend_lan === 'Sí' ? '✓ Sí, disponen de 5 jugadores' : '✗ No dispone'}
                    </strong>
                  </div>
                  <div>
                    <span style={{fontSize: '0.75rem', color: '#9ca3af', display: 'block'}}>22. Localidad de partida para viajar</span>
                    <strong style={{color: '#fff', fontSize: '1rem'}}>{selectedReg.travel_from || '-'}</strong>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 5: PAGO Y COMPROBANTE DE TRANSFERENCIA (MUY IMPORTANTE) */}
              <div style={{background: 'rgba(245,158,11,0.06)', padding: '1.4rem', borderRadius: '10px', border: '1px solid rgba(245,158,11,0.3)'}}>
                <div style={{fontSize: '0.9rem', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <CreditCard size={18} /> SECCIÓN 5 – INSCRIPCIÓN Y PAGO (AR$ 150.000)
                </div>

                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.2rem'}}>
                  <div>
                    <span style={{fontSize: '0.75rem', color: '#9ca3af', display: 'block'}}>23. Importe oficial</span>
                    <strong style={{color: '#fff', fontSize: '1.1rem'}}>{selectedReg.payment_amount || 'AR$ 150.000'}</strong>
                  </div>
                  <div>
                    <span style={{fontSize: '0.75rem', color: '#9ca3af', display: 'block'}}>24. Medio de pago</span>
                    <strong style={{color: '#fff'}}>{selectedReg.payment_method || 'TRANSFERENCIA'}</strong>
                  </div>
                  <div>
                    <span style={{fontSize: '0.75rem', color: '#9ca3af', display: 'block'}}>25. Titular que realizó el pago</span>
                    <strong style={{color: '#f59e0b', fontSize: '1.05rem'}}>{selectedReg.payment_holder_name}</strong>
                  </div>
                </div>

                {/* Comprobante de Pago Subido */}
                <div style={{background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)'}}>
                  <div style={{fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.6rem'}}>
                    26. Archivo de Comprobante de Pago:
                  </div>

                  {selectedReg.payment_receipt_url ? (
                    <div>
                      {selectedReg.payment_receipt_url.toLowerCase().endsWith('.pdf') ? (
                        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                          <FileText size={36} color="#ef4444" />
                          <div>
                            <div style={{fontWeight: 700, color: '#fff'}}>Comprobante en formato PDF</div>
                            <div style={{display: 'flex', gap: '0.8rem', marginTop: '0.4rem'}}>
                              <a
                                href={formatAssetUrl(selectedReg.payment_receipt_url)}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  padding: '0.4rem 0.8rem',
                                  background: 'rgba(59,130,246,0.2)',
                                  color: '#60a5fa',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  textDecoration: 'none',
                                  fontWeight: 600
                                }}
                              >
                                <ExternalLink size={14} /> Abrir PDF en pestaña
                              </a>
                              <a
                                href={formatAssetUrl(selectedReg.payment_receipt_url)}
                                download
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  padding: '0.4rem 0.8rem',
                                  background: 'rgba(255,255,255,0.1)',
                                  color: '#fff',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  textDecoration: 'none'
                                }}
                              >
                                <Download size={14} /> Descargar
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div style={{marginBottom: '0.8rem', maxHeight: '350px', overflow: 'hidden', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: '#000', display: 'flex', justifyContent: 'center'}}>
                            <img
                              src={formatAssetUrl(selectedReg.payment_receipt_url)}
                              alt="Comprobante de pago"
                              style={{maxHeight: '350px', width: 'auto', objectFit: 'contain', cursor: 'pointer'}}
                              onClick={() => setReceiptModalUrl(formatAssetUrl(selectedReg.payment_receipt_url))}
                            />
                          </div>
                          <div style={{display: 'flex', gap: '0.8rem'}}>
                            <button
                              onClick={() => setReceiptModalUrl(formatAssetUrl(selectedReg.payment_receipt_url))}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                padding: '0.4rem 0.8rem',
                                background: 'rgba(59,130,246,0.2)',
                                color: '#60a5fa',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                fontWeight: 600
                              }}
                            >
                              <Eye size={14} /> Ampliar Comprobante
                            </button>
                            <a
                              href={formatAssetUrl(selectedReg.payment_receipt_url)}
                              target="_blank"
                              rel="noreferrer"
                              download
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                padding: '0.4rem 0.8rem',
                                background: 'rgba(255,255,255,0.1)',
                                color: '#fff',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                textDecoration: 'none'
                              }}
                            >
                              <Download size={14} /> Descargar Original
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.4rem'}}>
                      <AlertTriangle size={16} /> No se adjuntó comprobante de pago.
                    </div>
                  )}

                  <div style={{marginTop: '0.8rem', fontSize: '0.75rem', color: '#9ca3af'}}>
                    27. Confirmación de cupo aceptada: <span style={{color: '#22c55e'}}>✓ Sí, comprende que el cupo se otorga tras validación</span>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 6: REGLAMENTO Y CONDICIONES */}
              <div style={{background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)'}}>
                <div style={{fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.8rem'}}>
                  SECCIÓN 6 – REGLAMENTO Y CONDICIONES (DECLARACIÓN JURADA)
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.6rem', fontSize: '0.8rem'}}>
                  <div style={{color: selectedReg.accepted_rules ? '#4ade80' : '#ef4444'}}>
                    {selectedReg.accepted_rules ? '✓' : '✗'} 28. Aceptación del reglamento oficial
                  </div>
                  <div style={{color: selectedReg.accepted_identity ? '#4ade80' : '#ef4444'}}>
                    {selectedReg.accepted_identity ? '✓' : '✗'} 29. Identidad real de los jugadores
                  </div>
                  <div style={{color: selectedReg.accepted_fairplay ? '#4ade80' : '#ef4444'}}>
                    {selectedReg.accepted_fairplay ? '✓' : '✗'} 30. Normas de juego limpio y sanciones
                  </div>
                  <div style={{color: selectedReg.accepted_commitment ? '#4ade80' : '#ef4444'}}>
                    {selectedReg.accepted_commitment ? '✓' : '✗'} 31. Compromiso de asistencia presencial
                  </div>
                  <div style={{color: selectedReg.accepted_data_public ? '#4ade80' : '#ef4444'}}>
                    {selectedReg.accepted_data_public ? '✓' : '✗'} 32. Difusión de nombres, TAG y resultados
                  </div>
                </div>
              </div>

              {/* SECCIÓN 7: COMENTARIOS ADICIONALES */}
              <div style={{background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)'}}>
                <div style={{fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem'}}>
                  SECCIÓN 7 – COMENTARIOS DEL CAPITÁN
                </div>
                <div style={{fontSize: '0.85rem', color: selectedReg.comments ? '#fff' : '#9ca3af', fontStyle: selectedReg.comments ? 'normal' : 'italic'}}>
                  {selectedReg.comments ? `"${selectedReg.comments}"` : 'Sin comentarios adicionales.'}
                </div>
              </div>

            </div>

            {/* Modal Footer / Botones de Decisión */}
            <div style={{
              padding: '1.2rem 1.5rem',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              background: 'rgba(255,255,255,0.02)'
            }}>
              <div>
                <button
                  onClick={() => handleDeleteReg(selectedReg.id, selectedReg.team_name)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.6rem 1rem',
                    background: 'rgba(239,68,68,0.15)',
                    color: '#ef4444',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  <Trash2 size={16} /> Eliminar Inscripción
                </button>
              </div>

              <div style={{display: 'flex', gap: '0.6rem', flexWrap: 'wrap'}}>
                {selectedReg.status !== 'pendiente' && (
                  <button
                    onClick={() => handleUpdateRegStatus(selectedReg.id, 'pendiente')}
                    style={{
                      padding: '0.6rem 1.2rem',
                      background: 'rgba(245,158,11,0.2)',
                      color: '#f59e0b',
                      border: '1px solid rgba(245,158,11,0.4)',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Marcar Pendiente
                  </button>
                )}

                {selectedReg.status !== 'rechazado' && (
                  <button
                    onClick={() => handleUpdateRegStatus(selectedReg.id, 'rechazado')}
                    style={{
                      padding: '0.6rem 1.2rem',
                      background: 'rgba(239,68,68,0.2)',
                      color: '#ef4444',
                      border: '1px solid rgba(239,68,68,0.4)',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Rechazar
                  </button>
                )}

                {selectedReg.status !== 'confirmado' && (
                  <button
                    onClick={() => handleUpdateRegStatus(selectedReg.id, 'confirmado')}
                    style={{
                      padding: '0.6rem 1.5rem',
                      background: '#22c55e',
                      color: '#000',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      fontWeight: '900',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <CheckCircle size={16} /> Aprobar y Otorgar Cupo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: LIGHTBOX / VISOR DE COMPROBANTE DE PAGO
         ======================================================== */}
      {receiptModalUrl && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.92)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100000,
          padding: '1.5rem'
        }}>
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1.5rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <a
              href={formatAssetUrl(receiptModalUrl)}
              target="_blank"
              rel="noreferrer"
              download
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1rem',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                borderRadius: '6px',
                fontSize: '0.85rem',
                textDecoration: 'none'
              }}
            >
              <Download size={16} /> Descargar
            </a>
            <button
              onClick={() => setReceiptModalUrl(null)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={24} />
            </button>
          </div>

          <div style={{maxWidth: '90vw', maxHeight: '85vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            {receiptModalUrl.toLowerCase().endsWith('.pdf') ? (
              <iframe
                src={formatAssetUrl(receiptModalUrl)}
                title="Comprobante PDF"
                style={{width: '80vw', height: '80vh', border: 'none', borderRadius: '8px', background: '#fff'}}
              />
            ) : (
              <img
                src={formatAssetUrl(receiptModalUrl)}
                alt="Comprobante de pago"
                style={{maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 0 40px rgba(0,0,0,0.8)'}}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
