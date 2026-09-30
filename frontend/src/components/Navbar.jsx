import { Link } from 'react-router-dom';
import { Gamepad2, MessageCircle, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/current_user')
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .catch(() => {});
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo" style={{textDecoration: 'none'}}>
          <img src="/assets/logo.jpg" alt="El Viejo Gamer Logo" />
          <span>EL VIEJO <strong>GAMER</strong></span>
        </Link>
        <div className="nav-links">
          <Link to="/">Experiencia</Link>
          <Link to="/">Setup</Link>
          <Link to="/galeria">Galería</Link>
        </div>
        <div className="nav-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <Link to="/perfil" className="secondary-btn" style={{ padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.9rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary)', color: '#000', borderColor: 'var(--primary)' }}>
              <img src={user.avatar_url} style={{ width: '20px', height: '20px', borderRadius: '50%' }} alt="Avatar" />
              Mi Perfil
            </Link>
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
