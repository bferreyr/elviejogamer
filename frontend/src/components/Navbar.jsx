import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, User, Shield, Bell, ChevronDown, Trophy, Menu, X } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [tournamentDropdownOpen, setTournamentDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileTournamentOpen, setMobileTournamentOpen] = useState(true);

  const notifRef = useRef(null);
  const tournamentRef = useRef(null);
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
      if (tournamentRef.current && !tournamentRef.current.contains(event.target)) {
        setTournamentDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const closeMobile = () => setMobileMenuOpen(false);

  const handleScrollSection = (e, sectionId) => {
    closeMobile();
    if (window.location.pathname === '/') {
      e.preventDefault();
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `/#${sectionId}`);
    }
  };

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
        <Link 
          to="/" 
          className="logo" 
          style={{textDecoration: 'none'}} 
          onClick={() => { closeMobile(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          <img src="/assets/logo.png" alt="El Viejo Gamer Logo" />
          <span className="logo-text">EL VIEJO <strong>GAMER</strong></span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="nav-links desktop-nav">
          <Link to="/#experiencia" onClick={(e) => handleScrollSection(e, 'experiencia')}>
            Experiencia
          </Link>
          <Link to="/#setup" onClick={(e) => handleScrollSection(e, 'setup')}>
            Setup
          </Link>

          {/* Botón y Desplegable Torneo (Desktop) */}
          <div 
            className="nav-dropdown"
            ref={tournamentRef}
            onMouseEnter={() => setTournamentDropdownOpen(true)}
            onMouseLeave={() => setTournamentDropdownOpen(false)}
          >
            <button
              type="button"
              className={`nav-dropdown-btn ${tournamentDropdownOpen ? 'active' : ''}`}
              onClick={() => setTournamentDropdownOpen(prev => !prev)}
              aria-expanded={tournamentDropdownOpen}
              aria-haspopup="true"
            >
              <span>TORNEO</span>
              <ChevronDown size={14} className={`dropdown-chevron ${tournamentDropdownOpen ? 'rotated' : ''}`} />
            </button>
            {tournamentDropdownOpen && (
              <div className="nav-dropdown-menu">
                <Link 
                  to="/torneo/inscripcion" 
                  className="nav-dropdown-item"
                  onClick={() => setTournamentDropdownOpen(false)}
                >
                  <Trophy size={16} className="dropdown-item-icon" />
                  <span className="dropdown-item-title">INSCRIPCION COPA VIEJO GAMER</span>
                </Link>
              </div>
            )}
          </div>

          <Link to="/partidas">Partidas</Link>
          <Link to="/jugadores">Jugadores</Link>
          <Link to="/galeria">Galería</Link>
        </div>

        {/* Right Nav Actions */}
        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {user ? (
            <>
              {user.is_admin && (
                <Link to="/admin" className="secondary-btn admin-desktop-btn" style={{ height: '38px', padding: '0 0.85rem', borderRadius: '6px', fontSize: '0.85rem', textDecoration: 'none', border: '1px solid rgba(74,222,128,0.4)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>
                  <Shield size={15} /> <span className="btn-label-desktop">Panel Admin</span>
                </Link>
              )}
              
              <div style={{position: 'relative', display: 'flex', alignItems: 'center'}} ref={notifRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)} 
                  className="secondary-btn notif-btn" 
                  style={{ height: '38px', width: '38px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                  aria-label="Notificaciones"
                >
                  <Bell size={18} />
                  {pendingRequests.length > 0 && (
                    <span style={{position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      {pendingRequests.length}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div style={{position: 'absolute', top: '120%', right: 0, background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', width: '300px', maxWidth: 'calc(100vw - 2rem)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 1100, overflow: 'hidden'}}>
                    <div style={{padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', fontWeight: 'bold', fontSize: '0.9rem'}}>Notificaciones</div>
                    <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                      {pendingRequests.length === 0 ? (
                        <div style={{padding: '1rem', color: '#9ca3af', fontSize: '0.9rem', textAlign: 'center'}}>No tenés solicitudes pendientes.</div>
                      ) : (
                        pendingRequests.map(req => (
                          <div key={req.steam_id} style={{padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '0.8rem'}}>
                            <img src={req.avatar_url} alt="avatar" style={{width: '38px', height: '38px', borderRadius: '50%'}} />
                            <div style={{flex: 1, minWidth: 0}}>
                              <div style={{fontSize: '0.88rem', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{req.display_name}</div>
                              <div style={{fontSize: '0.78rem', color: '#9ca3af'}}>Quiere ser tu amigo</div>
                            </div>
                            <button onClick={() => handleAccept(req.steam_id)} style={{background: '#4ade80', color: '#064e3b', border: 'none', padding: '0.35rem 0.7rem', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.78rem', flexShrink: 0}}>
                              Aceptar
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link to="/perfil" className="secondary-btn profile-nav-btn" style={{ height: '38px', padding: '0 0.85rem', borderRadius: '6px', fontSize: '0.85rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)', display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'var(--primary)', color: '#000', borderColor: 'var(--primary)' }}>
                <img src={user.avatar_url} style={{ width: '20px', height: '20px', borderRadius: '50%' }} alt="Avatar" />
                <span className="profile-btn-text">Mi Perfil</span>
              </Link>
            </>
          ) : (
            <a href="/auth/steam" className="secondary-btn login-nav-btn" style={{ height: '38px', padding: '0 0.85rem', borderRadius: '6px', fontSize: '0.85rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
              <User size={16} /> <span className="login-btn-text">Entrar</span>
            </a>
          )}

          {/* WhatsApp CTA (Desktop only) */}
          <a href="https://wa.me/5493425900075" className="cta-btn desktop-cta" target="_blank" rel="noreferrer" style={{ height: '38px', padding: '0 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageCircle size={16} /> <span>Contactanos</span>
          </a>

          {/* Mobile Menu Hamburger Button */}
          <button 
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileMenuOpen}
            style={{ height: '38px', width: '38px', padding: 0 }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div className="mobile-menu-backdrop" onClick={closeMobile} />
      )}

      {/* Mobile Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <div className="mobile-drawer-logo">
            <img src="/assets/logo.png" alt="Logo" />
            <span>EL VIEJO <strong>GAMER</strong></span>
          </div>
          <button className="mobile-drawer-close" onClick={closeMobile} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        {/* User Card in Mobile Drawer */}
        <div className="mobile-drawer-user">
          {user ? (
            <div className="mobile-user-card">
              <img src={user.avatar_url} alt="Avatar" className="mobile-user-avatar" />
              <div className="mobile-user-info">
                <span className="mobile-user-name">{user.display_name}</span>
                <div className="mobile-user-actions">
                  <Link to="/perfil" onClick={closeMobile} className="mobile-user-link">
                    Ver Perfil &rarr;
                  </Link>
                  {user.is_admin && (
                    <Link to="/admin" onClick={closeMobile} className="mobile-admin-link">
                      <Shield size={12} /> Admin
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <a href="/auth/steam" className="mobile-steam-login-btn">
              <User size={18} /> Iniciar Sesión con Steam
            </a>
          )}
        </div>

        {/* Navigation Links in Mobile Drawer */}
        <div className="mobile-drawer-links">
          <Link to="/#experiencia" onClick={(e) => handleScrollSection(e, 'experiencia')}>
            Experiencia
          </Link>
          <Link to="/#setup" onClick={(e) => handleScrollSection(e, 'setup')}>
            Setup
          </Link>

          {/* Tournament Section in Mobile Drawer */}
          <div className="mobile-drawer-group">
            <div 
              className="mobile-group-header"
              onClick={() => setMobileTournamentOpen(!mobileTournamentOpen)}
            >
              <span className="group-title">
                <Trophy size={16} color="var(--primary)" /> TORNEO
              </span>
              <ChevronDown size={15} className={`group-chevron ${mobileTournamentOpen ? 'rotated' : ''}`} />
            </div>
            {mobileTournamentOpen && (
              <div className="mobile-group-items">
                <Link 
                  to="/torneo/inscripcion" 
                  className="mobile-sublink highlight"
                  onClick={closeMobile}
                >
                  <div className="sublink-badge">COPA VIEJO GAMER</div>
                  <span className="sublink-title">Inscripción Oficial &rarr;</span>
                </Link>
              </div>
            )}
          </div>

          <Link to="/partidas" onClick={closeMobile}>
            Partidas
          </Link>
          <Link to="/jugadores" onClick={closeMobile}>
            Jugadores
          </Link>
          <Link to="/galeria" onClick={closeMobile}>
            Galería
          </Link>
        </div>

        {/* Mobile WhatsApp CTA Button */}
        <div className="mobile-drawer-footer">
          <a 
            href="https://wa.me/5493425900075" 
            className="mobile-whatsapp-btn" 
            target="_blank" 
            rel="noreferrer"
          >
            <MessageCircle size={18} />
            <span>Reservar por WhatsApp</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
