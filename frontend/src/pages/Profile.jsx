import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function Profile() {
  const { steam_id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [friendStatus, setFriendStatus] = useState('none'); // 'none', 'pending_sent', 'pending_received', 'accepted'
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const url = steam_id ? `/api/users/${steam_id}` : '/api/current_user';
    fetch(url)
      .then(res => {
        if (!res.ok) {
          if (res.status === 401 && !steam_id) throw new Error('Not logged in');
          if (res.status === 404) throw new Error('Not found');
        }
        return res.json();
      })
      .then(data => {
        setUser(data);
        if (!steam_id) setIsCurrentUser(true);
        if (data.friend_status) setFriendStatus(data.friend_status);
        setLoading(false);
      })
      .catch((err) => {
        if (err.message === 'Not logged in') window.location.href = '/';
        else {
          console.error(err);
          setLoading(false);
        }
      });
  }, [steam_id]);

  const handleAddFriend = () => {
    fetch(`/api/friends/add/${user.steam_id}`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.success) setFriendStatus('pending_sent');
      });
  };

  const handleAcceptFriend = () => {
    fetch(`/api/friends/accept/${user.steam_id}`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.success) setFriendStatus('accepted');
      });
  };

  if (loading) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{fontSize: '1.5rem', color: 'var(--primary)'}}>Cargando perfil...</div>
      </div>
    );
  }

  const recentMatches = user.recent_matches || [];
  const stats = user.cs2_stats || {};

  return (
    <div style={{background: '#09090b', minHeight: '100vh', paddingTop: '80px', fontFamily: 'Inter, sans-serif', color: '#fff'}}>
      <div style={{maxWidth: '1400px', margin: '0 auto', padding: '2rem'}} className="profile-layout">
        
        {/* Left Sidebar */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <div style={{background: '#18181b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem', textAlign: 'center'}}>
            <div style={{width: '120px', height: '120px', margin: '0 auto 1rem', borderRadius: '50%', padding: '4px', background: 'linear-gradient(135deg, #f97316, #eab308)', position: 'relative'}}>
              <img src={user.avatar_url} alt="Avatar" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid #18181b'}} />
            </div>
            <h2 style={{fontSize: '1.5rem', fontWeight: 900, margin: '0 0 0.5rem'}}>{user.display_name} <span style={{color: '#4ade80'}}>✔</span></h2>
            
            <div style={{display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem'}}>
              <a href={user.profile_url} target="_blank" rel="noreferrer" style={{fontSize: '0.8rem', color: '#9ca3af', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                VER EN STEAM
              </a>
            </div>
          </div>

          <div style={{background: '#18181b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem'}}>
            <div style={{color: '#9ca3af', fontSize: '0.85rem', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: 'bold'}}>Información</div>
            <div style={{fontSize: '0.9rem', marginBottom: '0.5rem'}}>Miembro de El Viejo Gamer</div>
            <div style={{color: '#f97316', fontSize: '0.9rem', marginBottom: '1rem'}}>{user.steam_id} 📋</div>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem'}}><span style={{fontSize: '1.2rem'}}>🇦🇷</span> Argentina</div>
          </div>
          
          <div style={{marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {isCurrentUser ? (
              <>
                <a href="/" style={{display: 'block', textAlign: 'center', padding: '0.8rem', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)'}}>Volver al Inicio</a>
                <a href="/auth/logout" style={{display: 'block', textAlign: 'center', padding: '0.8rem', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)'}}>Cerrar Sesión</a>
              </>
            ) : (
              <>
                {friendStatus === 'none' && (
                  <button onClick={handleAddFriend} style={{width: '100%', padding: '0.8rem', borderRadius: '8px', fontWeight: 'bold', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer'}}>
                    Agregar a amigos
                  </button>
                )}
                {friendStatus === 'pending_sent' && (
                  <button disabled style={{width: '100%', padding: '0.8rem', borderRadius: '8px', fontWeight: 'bold', background: 'rgba(255,255,255,0.1)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.2)', cursor: 'not-allowed'}}>
                    Solicitud enviada
                  </button>
                )}
                {friendStatus === 'pending_received' && (
                  <button onClick={handleAcceptFriend} style={{width: '100%', padding: '0.8rem', borderRadius: '8px', fontWeight: 'bold', background: '#4ade80', color: '#064e3b', border: 'none', cursor: 'pointer'}}>
                    Aceptar solicitud
                  </button>
                )}
                {friendStatus === 'accepted' && (
                  <button disabled style={{width: '100%', padding: '0.8rem', borderRadius: '8px', fontWeight: 'bold', background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)', cursor: 'default'}}>
                    Amigos ✓
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Content */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
          {/* Header Tabs */}
          <div style={{display: 'flex', gap: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', overflowX: 'auto'}}>
            <div style={{color: '#f97316', fontWeight: 'bold', borderBottom: '2px solid #f97316', paddingBottom: '0.5rem', marginBottom: '-0.5rem', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.9rem'}}>Juegos</div>
            <div style={{color: '#9ca3af', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.9rem'}}>Amigos</div>
            <div style={{color: '#9ca3af', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.9rem'}}>Equipos</div>
          </div>

          {/* Sub tabs */}
          <div style={{display: 'flex', gap: '1rem', alignItems: 'center', overflowX: 'auto'}}>
            <div style={{background: 'rgba(255,255,255,0.1)', padding: '0.3rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold'}}>CS2 ⯆</div>
            <div style={{border: '1px solid #f97316', color: '#fff', padding: '0.3rem 1rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold'}}>Resumen</div>
            <div style={{color: '#9ca3af', fontSize: '0.85rem', fontWeight: 'bold', marginLeft: '1rem', whiteSpace: 'nowrap'}}>Historial de partidas</div>
          </div>

          {/* Season / Global Stats Banner */}
          <div style={{background: '#18181b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem'}}>
              <div>
                <h3 style={{margin: '0 0 0.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <span style={{color: '#f97316'}}>⚔</span> Global Stats
                </h3>
                <div style={{color: '#9ca3af', fontSize: '0.85rem'}}>Asignación en El Viejo Gamer</div>
              </div>
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <div style={{width: '60px', height: '60px', borderRadius: '50%', background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, color: '#000', border: '3px solid #fff'}}>
                  {stats.matches_played > 0 ? Math.min(10, Math.max(1, Math.round(parseFloat(stats.kd_ratio) * 5))) : 0}
                </div>
                <div style={{fontSize: '2rem', fontWeight: 900}}>
                  {stats.matches_played > 0 ? Math.round(stats.total_kills / stats.matches_played) * 100 : 0} <span style={{fontSize: '1rem', color: '#9ca3af', fontWeight: 'normal'}}>ELO Aprox</span>
                </div>
              </div>
              <div style={{textAlign: 'right'}}>
                <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginBottom: '0.5rem'}}>
                  <div style={{background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'}}>💀 {stats.total_kills} Kills</div>
                  <div style={{background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'}}>🎯 {Math.round(stats.hs_percent || 0)}% HS</div>
                </div>
                <div style={{fontSize: '0.9rem'}}>
                  <strong>{stats.matches_played}</strong> Partidas <span style={{color: '#6b7280'}}>•</span> <strong>{parseFloat(stats.win_rate || 0).toFixed(1)}%</strong> Porcentaje ganado
                </div>
              </div>
            </div>
          </div>

          {/* Rendimiento reciente */}
          <div style={{background: '#18181b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
              <h3 style={{margin: 0, fontSize: '1.1rem'}}>Rendimiento reciente</h3>
              <div style={{color: '#9ca3af', fontSize: '0.85rem'}}>Últimas {recentMatches.length} partidas</div>
            </div>

            <div className="profile-stats-box-grid">
              <div style={{background: '#131315', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'}}>
                <div style={{fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.2rem', color: '#4ade80'}}>{parseFloat(stats.kd_ratio || 0).toFixed(2)}</div>
                <div style={{color: '#9ca3af', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold'}}>K/D Ratio Global</div>
              </div>
              <div style={{background: '#131315', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'}}>
                <div style={{fontSize: '1.2rem', fontWeight: 900, marginBottom: '0.2rem', color: '#fff'}}>{stats.total_kills} / {stats.total_deaths} / {stats.total_assists}</div>
                <div style={{color: '#9ca3af', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold'}}>K / D / A Totales</div>
              </div>
              <div style={{background: '#131315', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'}}>
                <div style={{fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.2rem', color: '#fff'}}>{Math.round(stats.hs_percent || 0)}%</div>
                <div style={{color: '#9ca3af', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold'}}>HS %</div>
              </div>
              <div style={{background: '#131315', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'}}>
                <div style={{fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.2rem', color: '#fff'}}>{parseFloat(stats.win_rate || 0).toFixed(1)}%</div>
                <div style={{color: '#9ca3af', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold'}}>Porcentaje ganado</div>
              </div>
            </div>
          </div>

          {/* Partidos recientes */}
          <div style={{background: '#18181b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
              <h3 style={{margin: 0, fontSize: '1.1rem'}}>Partidos recientes</h3>
              <Link to="/partidas" style={{color: '#9ca3af', fontSize: '0.85rem', textDecoration: 'none'}}>Full match history &rsaquo;</Link>
            </div>

            <div className="table-responsive">
              <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap'}}>
                <thead>
                  <tr style={{borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af', fontSize: '0.8rem', textTransform: 'uppercase'}}>
                    <th style={{padding: '1rem 0'}}>Fecha</th>
                    <th style={{padding: '1rem'}}>Anotar</th>
                    <th style={{padding: '1rem'}}>Clasificación</th>
                    <th style={{padding: '1rem'}}>K/D/A</th>
                    <th style={{padding: '1rem'}}>Mapa</th>
                    <th style={{padding: '1rem'}}></th>
                  </tr>
                </thead>
                <tbody>
                  {recentMatches.length === 0 ? (
                    <tr><td colSpan="6" style={{padding: '2rem 0', color: '#6b7280', textAlign: 'center'}}>No hay partidas recientes</td></tr>
                  ) : (
                    recentMatches.map(rm => (
                      <tr key={rm.id} style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                        <td style={{padding: '1rem 0'}}>
                          <div style={{fontWeight: 'bold', fontSize: '0.9rem'}}>{new Date(rm.date).toLocaleDateString('es-AR', {weekday: 'short', day: 'numeric', month: 'short'})}</div>
                          <div style={{color: '#6b7280', fontSize: '0.8rem'}}>{new Date(rm.date).toLocaleTimeString('es-AR', {hour: '2-digit', minute:'2-digit'})}</div>
                        </td>
                        <td style={{padding: '1rem'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                            <span style={{background: rm.won ? '#166534' : '#7f1d1d', color: rm.won ? '#4ade80' : '#fca5a5', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold'}}>{rm.won ? 'W' : 'L'}</span>
                            <span style={{fontWeight: 'bold', color: rm.won ? '#4ade80' : '#fca5a5'}}>{rm.player_team === 'CT' ? rm.score_ct : rm.score_t} : {rm.player_team === 'CT' ? rm.score_t : rm.score_ct}</span>
                          </div>
                        </td>
                        <td style={{padding: '1rem'}}>
                          <span style={{fontWeight: 'bold', color: parseFloat(rm.rating) >= 1.0 ? '#4ade80' : '#ef4444', borderBottom: `2px solid ${parseFloat(rm.rating) >= 1.0 ? '#4ade80' : '#ef4444'}`}}>{rm.rating}</span>
                        </td>
                        <td style={{padding: '1rem', color: '#d1d5db', fontSize: '0.9rem', fontWeight: 'bold'}}>
                          {rm.kills} / {rm.deaths} / {rm.assists}
                        </td>
                        <td style={{padding: '1rem'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                            <span style={{fontWeight: 'bold', fontSize: '0.9rem', color: '#fff'}}>{rm.map_name}</span>
                          </div>
                        </td>
                        <td style={{padding: '1rem', textAlign: 'right'}}>
                          <Link to={`/partidas/${rm.id}`} style={{color: '#9ca3af', textDecoration: 'none', fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '4px'}}>Ver &rsaquo;</Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
