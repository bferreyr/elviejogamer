import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, User, Shield, Bell } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/current_user')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setUser(data);
        if (data) {
          fetch('/api/friends')
            .then(r => r.json())
            .then(d => {
              if (d.pending) setPendingRequests(d.pending);
            });
        }
      })
      .catch(() => {});

    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAccept = (steam_id) => {
    fetch(`/api/friends/accept/${steam_id}`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPendingRequests(prev => prev.filter(p => p.steam_id !== steam_id));
        }
      });
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo" style={{textDecoration: 'none'}} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src="/assets/logo.png" alt="El Viejo Gamer Logo" />
          <span>EL VIEJO <strong>GAMER</strong></span>
        </Link>
        <div className="nav-links">
          <Link to="/#experiencia" onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              document.getElementById('experiencia')?.scrollIntoView({ behavior: 'smooth' });
              window.history.pushState(null, '', '/#experiencia');
            }
          }}>Experiencia</Link>
          <Link to="/#setup" onClick={(e) => {
            if (window.location.pathname === '/') {
              e.preventDefault();
              document.getElementById('setup')?.scrollIntoView({ behavior: 'smooth' });
              window.history.pushState(null, '', '/#setup');
            }
          }}>Setup</Link>
          <Link to="/jugadores">Jugadores</Link>
          <Link to="/partidas">Partidas</Link>
          <Link to="/galeria">Galería</Link>
        </div>
        <div className="nav-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <>
              {user.is_admin && (
                <Link to="/admin" className="secondary-btn" style={{ padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.9rem', textDecoration: 'none', border: '1px solid rgba(74,222,128,0.4)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>
                  <Shield size={16} /> Panel Admin
                </Link>
              )}
              
              <div style={{position: 'relative'}} ref={notifRef}>
                <button onClick={() => setShowNotifications(!showNotifications)} className="secondary-btn" style={{ padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bell size={20} />
                  {pendingRequests.length > 0 && (
                    <span style={{position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      {pendingRequests.length}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div style={{position: 'absolute', top: '120%', right: 0, background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', width: '300px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 100, overflow: 'hidden'}}>
                    <div style={{padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', fontWeight: 'bold', fontSize: '0.9rem'}}>Notificaciones</div>
                    <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                      {pendingRequests.length === 0 ? (
                        <div style={{padding: '1rem', color: '#9ca3af', fontSize: '0.9rem', textAlign: 'center'}}>No tenés solicitudes pendientes.</div>
                      ) : (
                        pendingRequests.map(req => (
                          <div key={req.steam_id} style={{padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.8rem'}}>
                            <img src={req.avatar_url} alt="avatar" style={{width: '40px', height: '40px', borderRadius: '50%'}} />
                            <div style={{flex: 1}}>
                              <div style={{fontSize: '0.9rem', fontWeight: 'bold'}}>{req.display_name}</div>
                              <div style={{fontSize: '0.8rem', color: '#9ca3af'}}>Quiere ser tu amigo</div>
                            </div>
                            <button onClick={() => handleAccept(req.steam_id)} style={{background: '#4ade80', color: '#064e3b', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.8rem'}}>
                              Aceptar
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link to="/perfil" className="secondary-btn" style={{ padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.9rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary)', color: '#000', borderColor: 'var(--primary)' }}>
                <img src={user.avatar_url} style={{ width: '20px', height: '20px', borderRadius: '50%' }} alt="Avatar" />
                Mi Perfil
              </Link>
            </>
          ) : (
            <a href="/auth/steam" className="secondary-btn" style={{ padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.9rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} /> Entrar / Registrarse
            </a>
          )}
          <a href="https://wa.me/5493425900075" className="cta-btn" target="_blank" rel="noreferrer">
            <MessageCircle size={18} /> Contactanos
          </a>
        </div>
      </div>
    </nav>
  );
}
