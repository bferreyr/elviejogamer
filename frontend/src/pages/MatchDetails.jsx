import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Target, Skull, Crosshair } from 'lucide-react';

export default function MatchDetails() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/matches/${id}`)
      .then(res => res.json())
      .then(data => {
        setMatch(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div style={{textAlign: 'center', marginTop: '150px', color: 'var(--primary)'}}>Cargando estadísticas...</div>;
  }

  if (!match || match.error) {
    return <div style={{textAlign: 'center', marginTop: '150px', color: '#ef4444'}}>Partida no encontrada.</div>;
  }

  // Parse stats JSON from DB
  let stats = [];
  try {
    if (typeof match.stats === 'string') {
      stats = JSON.parse(match.stats);
    } else {
      stats = match.stats || [];
    }
  } catch (e) {
    stats = [];
  }

  // Separate teams
  const ctPlayers = stats.filter(p => p.team === 'CT').sort((a, b) => b.kills - a.kills);
  const tPlayers = stats.filter(p => p.team === 'T').sort((a, b) => b.kills - a.kills);

  const renderTeamTable = (players, teamName, teamColor, score) => (
    <div style={{marginBottom: '2rem'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: `linear-gradient(90deg, ${teamColor}33, transparent)`, borderLeft: `4px solid ${teamColor}`, borderTopLeftRadius: '8px', borderTopRightRadius: '8px'}}>
        <h3 style={{margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
          {teamName === 'CT' ? 'Counter-Terrorists' : 'Terrorists'}
        </h3>
        <span style={{fontSize: '1.5rem', fontWeight: '900', color: teamColor}}>{score}</span>
      </div>
      <div style={{overflowX: 'auto'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'center', background: 'rgba(0,0,0,0.3)'}}>
          <thead>
            <tr style={{borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af', fontSize: '0.9rem'}}>
              <th style={{padding: '1rem', textAlign: 'left'}}>Jugador</th>
              <th style={{padding: '1rem'}} title="Asesinatos"><Target size={16} style={{display: 'inline', verticalAlign: 'middle'}}/> K</th>
              <th style={{padding: '1rem'}} title="Asistencias">A</th>
              <th style={{padding: '1rem'}} title="Muertes"><Skull size={16} style={{display: 'inline', verticalAlign: 'middle'}}/> D</th>
              <th style={{padding: '1rem'}} title="Headshots"><Crosshair size={16} style={{display: 'inline', verticalAlign: 'middle'}}/> HS%</th>
              <th style={{padding: '1rem'}} title="MVP"><Trophy size={16} style={{display: 'inline', verticalAlign: 'middle'}}/> MVP</th>
            </tr>
          </thead>
          <tbody>
            {players.length === 0 && (
              <tr><td colSpan="6" style={{padding: '1rem', color: '#6b7280'}}>No hay estadísticas detalladas de jugadores.</td></tr>
            )}
            {players.map((p, idx) => (
              <tr key={idx} style={{borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s ease'}} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{padding: '1rem', textAlign: 'left', fontWeight: 'bold'}}>{p.name}</td>
                <td style={{padding: '1rem', color: '#4ade80'}}>{p.kills}</td>
                <td style={{padding: '1rem'}}>{p.assists}</td>
                <td style={{padding: '1rem', color: '#ef4444'}}>{p.deaths}</td>
                <td style={{padding: '1rem'}}>{p.kills > 0 ? Math.round((p.headshots / p.kills) * 100) : 0}%</td>
                <td style={{padding: '1rem', color: '#fbbf24'}}>{p.mvps}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="match-details-container" style={{maxWidth: '1000px', margin: '100px auto 0', padding: '2rem', minHeight: '80vh'}}>
      <div style={{marginBottom: '2rem'}}>
        <Link to="/partidas" style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#9ca3af', textDecoration: 'none', fontWeight: 'bold'}}>
          <ArrowLeft size={20} /> Volver a Partidas
        </Link>
      </div>

      <div style={{background: 'rgba(25,25,30,0.8)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '2rem', marginBottom: '2rem'}}>
        <div style={{textAlign: 'center', marginBottom: '3rem'}}>
          <h1 style={{fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: 'var(--text-main)', textTransform: 'uppercase'}}>{match.map_name}</h1>
          <p style={{color: '#9ca3af', margin: 0}}>{new Date(match.match_date).toLocaleString('es-AR')} • Duración: {match.duration}</p>
        </div>

        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3rem', marginBottom: '4rem'}}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '1.2rem', color: '#60a5fa', fontWeight: 'bold', marginBottom: '0.5rem'}}>CT</div>
            <div style={{fontSize: '4rem', fontWeight: '900', color: match.team_ct_score > match.team_t_score ? '#fff' : '#6b7280', lineHeight: 1}}>{match.team_ct_score}</div>
          </div>
          <div style={{fontSize: '2rem', color: '#4b5563', fontWeight: 'bold'}}>VS</div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '1.2rem', color: '#fca5a5', fontWeight: 'bold', marginBottom: '0.5rem'}}>TR</div>
            <div style={{fontSize: '4rem', fontWeight: '900', color: match.team_t_score > match.team_ct_score ? '#fff' : '#6b7280', lineHeight: 1}}>{match.team_t_score}</div>
          </div>
        </div>

        {stats.length > 0 ? (
          <div style={{display: 'grid', gap: '2rem'}}>
            {renderTeamTable(ctPlayers, 'CT', '#60a5fa', match.team_ct_score)}
            {renderTeamTable(tPlayers, 'T', '#fca5a5', match.team_t_score)}
          </div>
        ) : (
          <div style={{textAlign: 'center', padding: '2rem', color: '#6b7280', borderTop: '1px solid rgba(255,255,255,0.05)'}}>
            Las estadísticas detalladas de los jugadores no están disponibles para esta partida.
          </div>
        )}
      </div>
    </div>
  );
}
