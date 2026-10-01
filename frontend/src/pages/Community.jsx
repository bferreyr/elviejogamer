import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users } from 'lucide-react';

export default function Community() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = (q = '') => {
    setLoading(true);
    fetch(`/api/users/search?q=${encodeURIComponent(q)}`)
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(query);
  };

  return (
    <div style={{background: '#09090b', minHeight: '100vh', paddingTop: '100px', fontFamily: 'Inter, sans-serif', color: '#fff'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '2rem'}}>
        
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '2rem'}}>
          <div>
            <h1 style={{fontSize: '3rem', fontWeight: 900, margin: '0 0 0.5rem', background: 'linear-gradient(to right, #f97316, #eab308)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <Users size={40} color="#f97316" /> COMUNIDAD
            </h1>
            <p style={{color: '#9ca3af', fontSize: '1.1rem'}}>Encontrá a tus amigos y mira sus estadísticas</p>
          </div>

          <form onSubmit={handleSearch} style={{display: 'flex', gap: '1rem', width: '100%', maxWidth: '400px'}}>
            <div style={{position: 'relative', flex: 1}}>
              <input 
                type="text" 
                placeholder="Buscar jugador..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#18181b', color: '#fff', outline: 'none', fontSize: '1rem'}}
              />
              <Search style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af'}} size={20} />
            </div>
            <button type="submit" style={{padding: '0 1.5rem', background: '#f97316', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s'}}>
              Buscar
            </button>
          </form>
        </div>

        {loading ? (
          <div style={{textAlign: 'center', color: '#f97316', padding: '4rem'}}>Cargando jugadores...</div>
        ) : (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem'}}>
            {users.length === 0 ? (
              <div style={{gridColumn: '1 / -1', textAlign: 'center', color: '#6b7280', padding: '4rem'}}>No se encontraron jugadores.</div>
            ) : (
              users.map(u => (
                <Link to={`/perfil/${u.steam_id}`} key={u.id} style={{textDecoration: 'none'}}>
                  <div style={{background: '#18181b', borderRadius: '12px', padding: '2rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s', cursor: 'pointer'}}
                    onMouseOver={e => {e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = '#f97316';}}
                    onMouseOut={e => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';}}
                  >
                    <div style={{width: '100px', height: '100px', margin: '0 auto 1rem', borderRadius: '50%', padding: '3px', background: 'linear-gradient(135deg, #f97316, #eab308)'}}>
                      <img src={u.avatar_url} alt={u.display_name} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid #18181b'}} />
                    </div>
                    <h3 style={{color: '#fff', fontSize: '1.2rem', margin: '0 0 0.5rem'}}>{u.display_name}</h3>
                    <div style={{color: '#9ca3af', fontSize: '0.85rem'}}>{u.steam_id}</div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
