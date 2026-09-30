import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/current_user')
      .then(res => {
        if (!res.ok) throw new Error('Not logged in');
        return res.json();
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        window.location.href = '/';
      });
  }, []);

  if (loading) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontSize: '1.5rem', color: 'var(--primary)'}}>Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 2rem 2rem'}}>
      <div className="profile-container" style={{background: 'rgba(25,25,30,0.8)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '3rem', maxWidth: '600px', width: '100%', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.6)', backdropFilter: 'blur(15px)'}}>
        <div style={{position: 'relative', width: '150px', height: '150px', margin: '0 auto 2rem', borderRadius: '50%', padding: '5px', background: 'linear-gradient(135deg, var(--primary), #3b82f6)'}}>
          <img src={user.avatar_url} alt="Avatar" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--bg-main)'}} />
        </div>
        
        <h1 style={{fontSize: '2.5rem', fontWeight: 900, margin: '0 0 0.5rem', background: 'linear-gradient(to right, #fff, #a0a0a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{user.display_name}</h1>
        <p style={{color: '#9ca3af', fontSize: '1rem', marginBottom: '2rem', fontFamily: 'monospace'}}>SteamID: {user.steam_id}</p>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '2.5rem'}}>
          <div style={{background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px'}}>
            <div style={{fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '0.5rem'}}>{parseFloat(user.kd_ratio).toFixed(2)}</div>
            <div style={{color: '#9ca3af', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px'}}>K/D Ratio CS2</div>
          </div>
          <div style={{background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px'}}>
            <div style={{fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '0.5rem', marginTop: '0.5rem'}}>Próximamente</div>
            <div style={{color: '#9ca3af', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px'}}>Rango Local</div>
          </div>
        </div>

        <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
          <Link to="/" style={{padding: '0.8rem 2rem', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)'}}>Volver al Inicio</Link>
          <a href={user.profile_url} target="_blank" rel="noreferrer" style={{padding: '0.8rem 2rem', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', background: 'var(--primary)', color: '#000'}}>Ver en Steam</a>
          <a href="/auth/logout" style={{padding: '0.8rem 2rem', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)'}}>Cerrar Sesión</a>
        </div>
      </div>
    </div>
  );
}
