import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swords, Clock, Calendar, Trophy } from 'lucide-react';

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/matches')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMatches(data);
        } else {
          setMatches([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="matches-container" style={{maxWidth: '1200px', margin: '100px auto 0', padding: '2rem', minHeight: '80vh'}}>
      <div className="section-header" style={{textAlign: 'center', marginBottom: '3rem'}}>
        <h2>ÚLTIMAS <span className="text-gradient">PARTIDAS</span></h2>
        <p>Resultados oficiales de los servidores de El Viejo Gamer</p>
      </div>

      {loading ? (
        <div style={{textAlign: 'center', color: 'var(--primary)'}}>Cargando partidas...</div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {matches.length === 0 ? (
            <div style={{textAlign: 'center', padding: '3rem', background: 'rgba(25,25,30,0.8)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'}}>
              <Swords size={48} color="#9ca3af" style={{marginBottom: '1rem', opacity: 0.5}} />
              <p style={{color: '#9ca3af', fontSize: '1.2rem'}}>Aún no hay partidas registradas.</p>
              <p style={{color: '#6b7280', fontSize: '0.9rem', marginTop: '0.5rem'}}>Los resultados aparecerán automáticamente cuando finalice un partido en los servidores.</p>
            </div>
          ) : (
            matches.map(match => {
              const ctWon = match.team_ct_score > match.team_t_score;
              const isTie = match.team_ct_score === match.team_t_score;
              
              return (
                <Link to={`/partidas/${match.id}`} key={match.id} style={{textDecoration: 'none'}}>
                  <div style={{
                    background: 'rgba(25,25,30,0.8)', 
                    border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: '12px', 
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
                  >
                    <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
                      <div style={{width: '100px', textAlign: 'center'}}>
                        <div style={{fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem'}}>Mapa</div>
                        <div style={{fontWeight: 'bold', fontSize: '1.2rem'}}>{match.map_name}</div>
                      </div>
                      
                      <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
                        <div style={{textAlign: 'right'}}>
                          <div style={{fontSize: '0.8rem', color: '#60a5fa', fontWeight: 'bold'}}>CT</div>
                          <div style={{fontSize: '2rem', fontWeight: '900', color: ctWon || isTie ? '#fff' : '#6b7280'}}>{match.team_ct_score}</div>
                        </div>
                        <div style={{fontSize: '1.5rem', color: '#4b5563', fontWeight: 'bold'}}>-</div>
                        <div style={{textAlign: 'left'}}>
                          <div style={{fontSize: '0.8rem', color: '#fca5a5', fontWeight: 'bold'}}>TR</div>
                          <div style={{fontSize: '2rem', fontWeight: '900', color: !ctWon || isTie ? '#fff' : '#6b7280'}}>{match.team_t_score}</div>
                        </div>
                      </div>
                    </div>

                    <div style={{display: 'flex', gap: '2rem', color: '#9ca3af', fontSize: '0.9rem'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <Clock size={16} /> {match.duration}
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <Calendar size={16} /> {new Date(match.match_date).toLocaleString('es-AR')}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
