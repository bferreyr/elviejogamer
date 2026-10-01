import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, PlaySquare } from 'lucide-react';
import MapLogo from '../components/MapLogo';

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
    return <div style={{textAlign: 'center', marginTop: '150px', color: '#f97316'}}>Cargando estadísticas de la partida...</div>;
  }

  if (!match || match.error) {
    return <div style={{textAlign: 'center', marginTop: '150px', color: '#ef4444'}}>Partida no encontrada.</div>;
  }

  // Parse stats JSON from DB
  let rawStats = [];
  try {
    if (typeof match.stats === 'string') {
      rawStats = JSON.parse(match.stats);
    } else {
      rawStats = match.stats || [];
    }
  } catch (e) {
    rawStats = [];
  }

  const totalRounds = match.team_ct_score + match.team_t_score;
  const ctWon = match.team_ct_score > match.team_t_score;
  const tWon = match.team_t_score > match.team_ct_score;

  // Enhance stats with calculated fields if missing
  const stats = rawStats.map(p => {
    const kills = p.kills || 0;
    const deaths = p.deaths || 0;
    const assists = p.assists || 0;
    const headshots = p.headshots || 0;
    
    const kr = totalRounds > 0 ? (kills / totalRounds) : 0;
    const kd = deaths > 0 ? (kills / deaths) : kills;
    const dpr = totalRounds > 0 ? ((p.damage || (kills * 100)) / totalRounds) : 0; // Mock damage if missing
    
    // Calculate a pseudo-rating if the plugin doesn't provide one
    let rating = p.rating;
    if (!rating) {
      rating = (kd * 0.7 + kr * 0.3).toFixed(2);
    }

    const hsPercent = kills > 0 ? Math.round((headshots / kills) * 100) : 0;

    return {
      ...p,
      kills, deaths, assists, headshots,
      kr: kr.toFixed(2),
      kd: kd.toFixed(2),
      dpr: dpr.toFixed(1),
      rating: parseFloat(rating).toFixed(2),
      hsPercent,
      damage: p.damage || (kills * 115),
      first_kills: p.first_kills || 0,
      "5k": p["5k"] || 0,
      "4k": p["4k"] || 0,
      "3k": p["3k"] || 0,
      "2k": p["2k"] || 0,
      mvps: p.mvps || 0
    };
  });

  const ctPlayers = stats.filter(p => p.team === 'CT').sort((a, b) => b.rating - a.rating);
  const tPlayers = stats.filter(p => p.team === 'T').sort((a, b) => b.rating - a.rating);

  const allPlayers = [...stats].sort((a, b) => b.rating - a.rating);
  const matchMvp = allPlayers[0];
  const topKills = [...allPlayers].sort((a, b) => b.kills - a.kills)[0];
  const topDamage = [...allPlayers].sort((a, b) => b.damage - a.damage)[0];
  const topHs = [...allPlayers].sort((a, b) => b.hsPercent - a.hsPercent)[0];
  const topFk = [...allPlayers].sort((a, b) => b.first_kills - a.first_kills)[0];

  const getRatingStyle = (rating) => {
    const val = parseFloat(rating);
    if (val >= 1.5) return { bg: '#166534', color: '#4ade80', border: '1px solid #14532d' };
    if (val >= 1.1) return { bg: '#3f6212', color: '#a3e635', border: '1px solid #365314' };
    if (val >= 0.9) return { bg: '#713f12', color: '#facc15', border: '1px solid #422006' };
    if (val >= 0.7) return { bg: '#7f1d1d', color: '#fca5a5', border: '1px solid #450a0a' };
    return { bg: '#450a0a', color: '#ef4444', border: '1px solid #450a0a' };
  };

  const renderPlayerRow = (p, teamColor) => {
    const ratingStyle = getRatingStyle(p.rating);
    return (
      <tr key={p.name} style={{borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s', fontSize: '0.85rem'}} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
        <td style={{padding: '0.8rem 1rem', textAlign: 'left', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.8rem'}}>
          <div style={{width: '32px', height: '32px', borderRadius: '50%', background: teamColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: '900', fontSize: '1rem'}}>
            {p.name.charAt(0).toUpperCase()}
          </div>
          <span style={{color: '#fff', fontSize: '1rem'}}>{p.name}</span>
        </td>
        <td style={{padding: '0.8rem 1rem'}}>
          <div style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#1f1f23', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)'}}>
            <span style={{color: '#f97316', fontWeight: 'bold', marginRight: '4px'}}>Lvl</span> -
          </div>
        </td>
        <td style={{padding: '0.8rem 1rem'}}>
          <div style={{background: ratingStyle.bg, color: ratingStyle.color, border: ratingStyle.border, padding: '0.3rem 0.6rem', borderRadius: '4px', fontWeight: 'bold', display: 'inline-block'}}>
            {p.rating}
          </div>
        </td>
        <td style={{padding: '0.8rem 1rem', color: '#4ade80', fontWeight: 'bold'}}>{p.kills}</td>
        <td style={{padding: '0.8rem 1rem', color: '#9ca3af'}}>{p.deaths}</td>
        <td style={{padding: '0.8rem 1rem', color: '#9ca3af'}}>{p.assists}</td>
        <td style={{padding: '0.8rem 1rem', color: '#d1d5db'}}>{p.dpr}</td>
        <td style={{padding: '0.8rem 1rem', color: '#d1d5db'}}>{p.kd}</td>
        <td style={{padding: '0.8rem 1rem', color: '#d1d5db'}}>{p.kr}</td>
        <td style={{padding: '0.8rem 1rem', color: '#9ca3af'}}>{p.headshots}</td>
        <td style={{padding: '0.8rem 1rem', color: '#d1d5db'}}>{p.hsPercent}%</td>
        <td style={{padding: '0.8rem 1rem', color: '#6b7280'}}>{p['5k']}</td>
        <td style={{padding: '0.8rem 1rem', color: '#6b7280'}}>{p['4k']}</td>
        <td style={{padding: '0.8rem 1rem', color: '#6b7280'}}>{p['3k']}</td>
        <td style={{padding: '0.8rem 1rem', color: '#6b7280'}}>{p['2k']}</td>
        <td style={{padding: '0.8rem 1rem', color: '#facc15', fontWeight: 'bold'}}>{p.mvps}</td>
      </tr>
    );
  };

  const renderTeamTable = (players, score, isWinner, teamName) => {
    const teamColor = teamName === 'CT' ? '#3b82f6' : '#eab308';
    return (
      <div style={{marginBottom: '2rem', background: '#18181b', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: '#1f1f23', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <span style={{fontSize: '1.5rem', fontWeight: '900', color: isWinner ? '#4ade80' : '#fff'}}>{score}</span>
            <h3 style={{margin: 0, color: '#fff', fontSize: '1.2rem'}}>Equipo {teamName}</h3>
          </div>
          <div style={{color: '#9ca3af', fontSize: '0.9rem'}}>
            Promedio del equipo <strong style={{color: '#fff'}}>-</strong>
          </div>
        </div>
        <div className="table-responsive">
          <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'center', whiteSpace: 'nowrap'}}>
            <thead>
              <tr style={{background: '#131315', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase'}}>
                <th style={{padding: '1rem', textAlign: 'left'}}>Jugador</th>
                <th style={{padding: '1rem'}}>Rango</th>
                <th style={{padding: '1rem'}}>Clasificación</th>
                <th style={{padding: '1rem'}}>K</th>
                <th style={{padding: '1rem'}}>D</th>
                <th style={{padding: '1rem'}}>A</th>
                <th style={{padding: '1rem'}}>DPR</th>
                <th style={{padding: '1rem'}}>K/D</th>
                <th style={{padding: '1rem'}}>K/R</th>
                <th style={{padding: '1rem'}}>HS</th>
                <th style={{padding: '1rem'}}>HS %</th>
                <th style={{padding: '1rem'}}>5k</th>
                <th style={{padding: '1rem'}}>4k</th>
                <th style={{padding: '1rem'}}>3k</th>
                <th style={{padding: '1rem'}}>2k</th>
                <th style={{padding: '1rem'}}>MVPs</th>
              </tr>
            </thead>
            <tbody>
              {players.length === 0 ? (
                <tr><td colSpan="16" style={{padding: '2rem', color: '#6b7280'}}>Esperando estadísticas del plugin...</td></tr>
              ) : (
                players.map(p => renderPlayerRow(p, teamColor))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div style={{background: '#09090b', minHeight: '100vh', paddingTop: '80px', fontFamily: 'Inter, sans-serif'}}>
      <div style={{maxWidth: '1400px', margin: '0 auto', padding: '2rem'}}>
        
        <div style={{marginBottom: '1rem'}}>
          <Link to="/partidas" style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#f97316', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem'}}>
            <ArrowLeft size={16} /> Volver al Emparejamiento
          </Link>
        </div>

        {/* HERO HEADER */}
        <div style={{
          position: 'relative',
          background: `linear-gradient(to right, rgba(20,20,22,0.95), rgba(20,20,22,0.8)), url('/assets/hero_bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '12px',
          padding: '3rem 2rem',
          border: '1px solid #f97316',
          marginBottom: '2rem',
          boxShadow: '0 10px 30px rgba(249,115,22,0.1)'
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', padding: '0.2rem 0.8rem', borderRadius: '20px', color: '#f97316', fontSize: '0.8rem', fontWeight: 'bold'}}>
              <PlaySquare size={14} /> Match Oficial
            </div>
            <div style={{display: 'flex', gap: '1rem', color: '#fff', fontWeight: 'bold', alignItems: 'center'}}>
              <MapLogo mapName={match.map_name} showName={true} />
              <span style={{color: '#6b7280'}}>•</span>
              <span>{new Date(match.match_date).toLocaleDateString('es-AR')}</span>
            </div>
          </div>

          <div className="match-hero-flex">
            <div className="match-hero-teams" style={{textAlign: 'right'}}>
              <div>
                {ctWon && <div style={{color: '#4ade80', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '0.5rem'}}>GANADOR</div>}
                <div style={{fontSize: '2rem', fontWeight: '900', color: '#fff'}}>Equipo CT</div>
              </div>
              <div style={{width: '60px', height: '60px', borderRadius: '50%', background: '#3b82f6', border: '3px solid rgba(255,255,255,0.1)'}}></div>
            </div>
            
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              <span className="team-score" style={{fontSize: '4rem', fontWeight: '900', color: ctWon ? '#4ade80' : '#fff', textShadow: '0 0 20px rgba(74,222,128,0.3)'}}>{match.team_ct_score}</span>
              <span style={{fontSize: '1.5rem', color: '#6b7280', fontWeight: 'bold'}}>VS</span>
              <span className="team-score" style={{fontSize: '4rem', fontWeight: '900', color: tWon ? '#4ade80' : '#fff', textShadow: '0 0 20px rgba(74,222,128,0.3)'}}>{match.team_t_score}</span>
            </div>

            <div className="match-hero-teams" style={{textAlign: 'left'}}>
              <div style={{width: '60px', height: '60px', borderRadius: '50%', background: '#eab308', border: '3px solid rgba(255,255,255,0.1)'}}></div>
              <div>
                {tWon && <div style={{color: '#4ade80', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '0.5rem'}}>GANADOR</div>}
                <div style={{fontSize: '2rem', fontWeight: '900', color: '#fff'}}>Equipo TR</div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS OVERVIEW TABS */}
        <div style={{display: 'flex', gap: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem', paddingBottom: '1rem'}}>
          <div style={{color: '#f97316', fontWeight: 'bold', borderBottom: '2px solid #f97316', paddingBottom: '1rem', marginBottom: '-1rem', cursor: 'pointer'}}>RESUMEN</div>
          <div style={{color: '#9ca3af', fontWeight: 'bold', cursor: 'pointer'}}>DUELOS</div>
          <div style={{color: '#9ca3af', fontWeight: 'bold', cursor: 'pointer'}}>UTILIDAD</div>
        </div>

        {/* MVP HIGHLIGHT SECTION */}
        {matchMvp && (
          <div className="match-mvp-grid">
            {/* MVP MAIN CARD */}
            <div style={{
              background: `linear-gradient(135deg, #18181b 0%, #09090b 100%)`,
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              padding: '2rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Background map faint */}
              <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: '50%', background: `url('/assets/hero_bg.jpg')`, backgroundSize: 'cover', opacity: 0.1, maskImage: 'linear-gradient(to left, black, transparent)'}}></div>
              
              <div style={{position: 'absolute', top: '1.5rem', right: '2rem', color: '#facc15', fontSize: '2rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                ★ MVP
              </div>

              <div style={{display: 'flex', gap: '2rem', zIndex: 1, width: '100%'}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'}}>
                  <div style={{width: '140px', height: '140px', borderRadius: '50%', background: matchMvp.team === 'CT' ? '#3b82f6' : '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '4rem', fontWeight: '900', border: '4px solid #f97316', boxShadow: '0 0 20px rgba(249,115,22,0.3)'}}>
                    {matchMvp.name.charAt(0).toUpperCase()}
                  </div>
                  <h2 style={{margin: 0, fontSize: '1.5rem', color: '#fff'}}>{matchMvp.name}</h2>
                </div>

                <div className="mvp-stats-grid">
                  <div>
                    <div style={{fontSize: '2.5rem', fontWeight: '900', color: '#4ade80', lineHeight: 1}}>{matchMvp.rating}</div>
                    <div style={{color: '#9ca3af', fontSize: '0.8rem', fontWeight: 'bold'}}>★ Rating</div>
                  </div>
                  <div>
                    <div style={{fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', lineHeight: 1.2}}>{matchMvp.dpr}</div>
                    <div style={{color: '#9ca3af', fontSize: '0.8rem', fontWeight: 'bold'}}>DPR</div>
                  </div>
                  <div>
                    <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#fff'}}>{matchMvp.kills}/{matchMvp.deaths}/{matchMvp.assists}</div>
                    <div style={{color: '#9ca3af', fontSize: '0.8rem', fontWeight: 'bold'}}>K/D/A</div>
                  </div>
                  <div>
                    <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#fff'}}>{matchMvp.hsPercent}%</div>
                    <div style={{color: '#9ca3af', fontSize: '0.8rem', fontWeight: 'bold'}}>% Disparos a la cabeza</div>
                  </div>
                </div>
              </div>
            </div>

            {/* NOTABLE PLAYERS STATS */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.8rem'}}>
              {[
                { label: 'Más asesinatos', value: topKills?.kills || 0, player: topKills },
                { label: 'Más daño', value: topDamage?.damage || 0, player: topDamage },
                { label: 'Mayor % de Headshots', value: `${topHs?.hsPercent || 0}%`, player: topHs },
                { label: 'Primeros kills', value: topFk?.first_kills || 0, player: topFk }
              ].map((stat, idx) => (
                <div key={idx} style={{background: '#18181b', borderRadius: '8px', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <div style={{width: '32px', height: '32px', borderRadius: '50%', background: stat.player?.team === 'CT' ? '#3b82f6' : '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold'}}>
                      {stat.player?.name.charAt(0).toUpperCase() || '?'}
                    </div>
                    <span style={{color: '#fff', fontWeight: 'bold'}}>{stat.player?.name || '-'}</span>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div style={{color: '#fff', fontSize: '1.2rem', fontWeight: '900'}}>{stat.value}</div>
                    <div style={{color: '#9ca3af', fontSize: '0.75rem'}}>{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCOREBOARDS */}
        {renderTeamTable(tPlayers, match.team_t_score, tWon, 'T')}
        {renderTeamTable(ctPlayers, match.team_ct_score, ctWon, 'CT')}

      </div>
    </div>
  );
}
