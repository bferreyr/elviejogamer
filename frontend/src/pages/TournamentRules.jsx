import { useState, useEffect } from 'react';
import { 
  FileText, ShieldCheck, Trophy, Swords, Users, Monitor, 
  MapPin, AlertTriangle, Scale, Clock, Headphones, Tv, Award,
  ChevronRight, ArrowRight, ExternalLink, Download, CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TournamentRules() {
  useEffect(() => {
    document.title = 'Reglamento Copa Viejo Gamer | El Viejo Gamer';
  }, []);

  const [activeSection, setActiveSection] = useState('sec-1');

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const sections = [
    { id: 'sec-1', number: '1', title: 'Presentación', icon: Trophy },
    { id: 'sec-2', number: '2', title: 'Estructura general del torneo', icon: Swords },
    { id: 'sec-3', number: '3', title: 'Composición de los equipos', icon: Users },
    { id: 'sec-4', number: '4', title: 'Inscripción', icon: FileText },
    { id: 'sec-5', number: '5', title: 'Plataforma de juego online', icon: Monitor },
    { id: 'sec-6', number: '6', title: 'Map Pool', icon: MapPin },
    { id: 'sec-7', number: '7', title: 'Sistema de veto', icon: Scale },
    { id: 'sec-8', number: '8', title: 'Elección de lados', icon: Swords },
    { id: 'sec-9', number: '9', title: 'Horarios, puntualidad y Walkover', icon: Clock },
    { id: 'sec-10', number: '10', title: 'Pausas técnicas, desconexiones y contingencias', icon: AlertTriangle },
    { id: 'sec-11', number: '11', title: 'Fair Play y Anti-Cheat', icon: ShieldCheck },
    { id: 'sec-12', number: '12', title: 'Cuentas e identidad competitiva', icon: Users },
    { id: 'sec-13', number: '13', title: 'Fase presencial', icon: MapPin },
    { id: 'sec-14', number: '14', title: 'Periféricos', icon: Headphones },
    { id: 'sec-15', number: '15', title: 'Streaming y cobertura', icon: Tv },
    { id: 'sec-16', number: '16', title: 'Conducta y sanciones', icon: AlertTriangle },
    { id: 'sec-17', number: '17', title: 'Premios', icon: Award },
    { id: 'sec-18', number: '18', title: 'Administración y decisiones', icon: ShieldCheck },
    { id: 'sec-19', number: '19', title: 'Modificaciones del reglamento', icon: FileText },
    { id: 'sec-20', number: '20', title: 'Aceptación', icon: CheckCircle2 }
  ];

  return (
    <div className="tournament-rules-page" style={{
      maxWidth: '1200px',
      margin: '100px auto 60px',
      padding: '0 1.5rem',
      color: '#e5e7eb'
    }}>
      {/* HEADER HERO */}
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        padding: '2.5rem 1.5rem',
        background: 'radial-gradient(ellipse at top, rgba(229, 9, 20, 0.15) 0%, rgba(18, 18, 20, 0.8) 70%, transparent 100%)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* Badges */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
          marginBottom: '1.2rem'
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'rgba(229, 9, 20, 0.15)',
            border: '1px solid rgba(229, 9, 20, 0.45)',
            color: '#ff4b4b',
            padding: '0.35rem 0.9rem',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: '800',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            <FileText size={14} /> REGLAMENTO GENERAL
          </span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#e5e7eb',
            padding: '0.35rem 0.9rem',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: '700',
            letterSpacing: '0.5px'
          }}>
            <span>COPA VIEJO GAMER • Santa Fe Capital</span>
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
          fontWeight: 900,
          letterSpacing: '1.5px',
          lineHeight: 1.15,
          marginBottom: '1rem',
          textTransform: 'uppercase'
        }}>
          REGLAMENTO OFICIAL – <span className="text-gradient">COPA VIEJO GAMER</span>
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text-muted)',
          maxWidth: '750px',
          margin: '0 auto 1.8rem',
          lineHeight: 1.6
        }}>
          Bases y condiciones de la competencia Counter-Strike 2. Todos los participantes deben conocer y respetar estas normativas para garantizar una competencia justa, ordenada y profesional.
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <Link
            to="/torneo/inscripcion"
            className="cta-btn"
            style={{
              padding: '0.75rem 1.6rem',
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none'
            }}
          >
            <Trophy size={18} /> Inscribir a mi equipo <ArrowRight size={16} />
          </Link>
          <button
            onClick={() => window.print()}
            className="secondary-btn"
            style={{
              padding: '0.75rem 1.4rem',
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              borderRadius: '4px'
            }}
          >
            <Download size={16} /> Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      {/* LAYOUT: SIDEBAR INDEX + CONTENT */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '2.5rem',
        alignItems: 'start'
      }} className="rules-layout">

        {/* SIDEBAR DE NAVEGACIÓN */}
        <aside style={{
          position: 'sticky',
          top: '90px',
          background: '#121215',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '1.2rem',
          maxHeight: 'calc(100vh - 120px)',
          overflowY: 'auto'
        }} className="rules-sidebar">
          <div style={{
            fontSize: '0.82rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--primary)',
            marginBottom: '0.85rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <FileText size={14} /> Índice del Reglamento
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            {sections.map(sec => {
              const Icon = sec.icon;
              const isSelected = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.55rem 0.65rem',
                    background: isSelected ? 'rgba(229, 9, 20, 0.15)' : 'transparent',
                    border: 'none',
                    borderLeft: isSelected ? '3px solid var(--primary)' : '3px solid transparent',
                    color: isSelected ? '#fff' : '#9ca3af',
                    borderRadius: '0 6px 6px 0',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 700 : 500,
                    transition: 'all 0.15s ease',
                    lineHeight: 1.3
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.color = '#9ca3af';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <span style={{ 
                    color: isSelected ? 'var(--primary)' : '#6b7280', 
                    fontWeight: 800, 
                    minWidth: '18px' 
                  }}>
                    {sec.number}.
                  </span>
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {sec.title}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <div style={{ minWidth: 0 }}>

          {/* 1. Presentación */}
          <section id="sec-1" className="rule-card">
            <div className="rule-card-header">
              <span className="rule-num">1</span>
              <h2>Presentación</h2>
            </div>
            <div className="rule-card-body">
              <p>
                <strong>COPA VIEJO GAMER</strong> nace como una competencia de Counter-Strike 2 que combina una primera etapa online con una instancia final presencial en la ciudad de Santa Fe Capital. El objetivo es reunir equipos en una competencia organizada, competitiva y accesible, generando además una jornada presencial para jugadores, espectadores, comunidades gamers, creadores de contenido y marcas.
              </p>
              <p style={{ marginTop: '0.8rem' }}>
                La competencia será organizada conjuntamente por <strong>El Viejo Gamer</strong>.
              </p>
            </div>
          </section>

          {/* 2. Estructura general del torneo */}
          <section id="sec-2" className="rule-card">
            <div className="rule-card-header">
              <span className="rule-num">2</span>
              <h2>Estructura general del torneo</h2>
            </div>
            <div className="rule-card-body">
              <p style={{ marginBottom: '1.2rem' }}>
                El torneo tendrá un cupo objetivo de <strong>32 equipos</strong> y se dividirá en dos etapas: fase online y finales presenciales.
              </p>

              <div className="table-responsive" style={{
                background: '#0d0d10',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
                marginBottom: '1.2rem'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <th style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--primary)' }}>Etapa</th>
                      <th style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--primary)' }}>Equipos</th>
                      <th style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--primary)' }}>Modalidad</th>
                      <th style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--primary)' }}>Formato</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '0.8rem 1rem', fontWeight: 700 }}>Ronda de 32</td>
                      <td style={{ padding: '0.8rem 1rem', color: '#9ca3af' }}>32</td>
                      <td style={{ padding: '0.8rem 1rem' }}><span className="badge-online">Online</span></td>
                      <td style={{ padding: '0.8rem 1rem', color: '#f3f4f6' }}>BO3 - Eliminación directa</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '0.8rem 1rem', fontWeight: 700 }}>Octavos de final</td>
                      <td style={{ padding: '0.8rem 1rem', color: '#9ca3af' }}>16</td>
                      <td style={{ padding: '0.8rem 1rem' }}><span className="badge-online">Online</span></td>
                      <td style={{ padding: '0.8rem 1rem', color: '#f3f4f6' }}>BO3 - Eliminación directa</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '0.8rem 1rem', fontWeight: 700 }}>Cuartos de final</td>
                      <td style={{ padding: '0.8rem 1rem', color: '#9ca3af' }}>8</td>
                      <td style={{ padding: '0.8rem 1rem' }}><span className="badge-online">Online</span></td>
                      <td style={{ padding: '0.8rem 1rem', color: '#f3f4f6' }}>BO3 - Eliminación directa</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', background: 'rgba(234, 179, 8, 0.04)' }}>
                      <td style={{ padding: '0.8rem 1rem', fontWeight: 700, color: '#facc15' }}>Semifinal #1</td>
                      <td style={{ padding: '0.8rem 1rem', color: '#9ca3af' }}>2</td>
                      <td style={{ padding: '0.8rem 1rem' }}><span className="badge-lan">Presencial (LAN)</span></td>
                      <td style={{ padding: '0.8rem 1rem', color: '#f3f4f6' }}>BO3</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', background: 'rgba(234, 179, 8, 0.04)' }}>
                      <td style={{ padding: '0.8rem 1rem', fontWeight: 700, color: '#facc15' }}>Semifinal #2</td>
                      <td style={{ padding: '0.8rem 1rem', color: '#9ca3af' }}>2</td>
                      <td style={{ padding: '0.8rem 1rem' }}><span className="badge-lan">Presencial (LAN)</span></td>
                      <td style={{ padding: '0.8rem 1rem', color: '#f3f4f6' }}>BO3</td>
                    </tr>
                    <tr style={{ background: 'rgba(229, 9, 20, 0.08)' }}>
                      <td style={{ padding: '0.8rem 1rem', fontWeight: 800, color: '#ff4b4b' }}>Gran Final</td>
                      <td style={{ padding: '0.8rem 1rem', color: '#9ca3af' }}>2</td>
                      <td style={{ padding: '0.8rem 1rem' }}><span className="badge-lan">Presencial (LAN)</span></td>
                      <td style={{ padding: '0.8rem 1rem', fontWeight: 800, color: '#fff' }}>BO5</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{
                background: 'rgba(229, 9, 20, 0.08)',
                borderLeft: '4px solid var(--primary)',
                padding: '0.9rem 1.1rem',
                borderRadius: '0 8px 8px 0',
                fontSize: '0.92rem'
              }}>
                <strong>Importante:</strong> Los cuatro ganadores de Cuartos de Final clasificarán a la instancia presencial en Santa Fe Capital. Las dos semifinales se disputarán de manera consecutiva y sus ganadores avanzarán a la Gran Final.
              </div>
            </div>
          </section>

          {/* 3. Composición de los equipos */}
          <section id="sec-3" className="rule-card">
            <div className="rule-card-header">
              <span className="rule-num">3</span>
              <h2>Composición de los equipos</h2>
            </div>
            <div className="rule-card-body">
              <ul className="rule-bullet-list">
                <li>Cada equipo deberá registrar <strong>5 jugadores titulares</strong> y podrá registrar hasta <strong>2 suplentes</strong>.</li>
                <li>Uno de los integrantes deberá ser designado como <strong>capitán</strong> y será el contacto oficial con la administración.</li>
                <li>El plantel podrá estar compuesto por entre <strong>5 y 7 jugadores en total</strong>.</li>
                <li>No podrán incorporarse jugadores externos una vez iniciado el torneo, salvo autorización excepcional y debidamente justificada de la organización.</li>
              </ul>
            </div>
          </section>

          {/* 4. Inscripción */}
          <section id="sec-4" className="rule-card">
            <div className="rule-card-header">
              <span className="rule-num">4</span>
              <h2>Inscripción</h2>
            </div>
            <div className="rule-card-body">
              <p>La participación será mediante <strong>inscripción paga</strong>. El valor, medios de pago y fechas de apertura y cierre serán anunciados oficialmente.</p>
              <p style={{ marginTop: '0.8rem' }}>
                La inscripción quedará confirmada una vez completado el registro, abonado el importe correspondiente, declarado el roster y aceptado el reglamento.
              </p>
              <p style={{ marginTop: '0.8rem' }}>
                <strong>El pago de la inscripción implica la aceptación absoluta de las bases y condiciones de la competencia.</strong>
              </p>
            </div>
          </section>

          {/* 5. Plataforma de juego online */}
          <section id="sec-5" className="rule-card">
            <div className="rule-card-header">
              <span className="rule-num">5</span>
              <h2>Plataforma de juego online</h2>
            </div>
            <div className="rule-card-body">
              <p>La plataforma principal prevista para la etapa online será <strong>FACEIT</strong>.</p>
              <p style={{ marginTop: '0.8rem' }}>
                Los participantes deberán disponer de una cuenta válida y cumplir los requisitos técnicos y de seguridad exigidos por la plataforma, incluido <strong>FACEIT Anti-Cheat</strong> cuando corresponda.
              </p>
            </div>
          </section>

          {/* 6. Map Pool */}
          <section id="sec-6" className="rule-card">
            <div className="rule-card-header">
              <span className="rule-num">6</span>
              <h2>Map Pool</h2>
            </div>
            <div className="rule-card-body">
              <p>
                Se utilizará el <strong>map pool competitivo oficial de Counter-Strike 2</strong> vigente al comienzo de la competencia (Active Duty Pool de Valve).
              </p>
              <p style={{ marginTop: '0.8rem' }}>
                La organización publicará el listado definitivo antes del inicio del torneo. Una vez comenzada la competencia, el pool permanecerá sin modificaciones salvo causa extraordinaria o actualización crítica obligatoria del juego.
              </p>
            </div>
          </section>

          {/* 7. Sistema de veto */}
          <section id="sec-7" className="rule-card">
            <div className="rule-card-header">
              <span className="rule-num">7</span>
              <h2>Sistema de veto</h2>
            </div>
            <div className="rule-card-body">

              {/* 7.1 BO3 Online */}
              <div className="veto-subbox">
                <h3 className="veto-subbox-title">7.1 BO3 – Fase online</h3>
                <ol className="veto-steps">
                  <li><span>1.</span> Equipo A elimina un mapa.</li>
                  <li><span>2.</span> Equipo B elimina un mapa.</li>
                  <li><span>3.</span> Equipo A selecciona el primer mapa.</li>
                  <li><span>4.</span> Equipo B selecciona el segundo mapa.</li>
                  <li><span>5.</span> Equipo A elimina un mapa.</li>
                  <li><span>6.</span> Equipo B elimina un mapa.</li>
                  <li><span>7.</span> El mapa restante será el decider.</li>
                </ol>
                <div className="veto-note">
                  * Cuando FACEIT gestione automáticamente el veto, prevalecerá la configuración establecida para la competencia en la plataforma.
                </div>
              </div>

              {/* 7.2 BO3 LAN */}
              <div className="veto-subbox" style={{ marginTop: '1.2rem' }}>
                <h3 className="veto-subbox-title">7.2 BO3 – Semifinales presenciales</h3>
                <ol className="veto-steps">
                  <li><span>1.</span> Equipo A elimina un mapa.</li>
                  <li><span>2.</span> Equipo B elimina un mapa.</li>
                  <li><span>3.</span> Equipo A selecciona el primer mapa.</li>
                  <li><span>4.</span> Equipo B selecciona el segundo mapa.</li>
                  <li><span>5.</span> Equipo A elimina un mapa.</li>
                  <li><span>6.</span> Equipo B elimina un mapa.</li>
                  <li><span>7.</span> El mapa restante será el decider.</li>
                </ol>
                <div className="veto-note">
                  La serie termina cuando un equipo obtiene dos (2) mapas ganados.
                </div>
              </div>

              {/* 7.3 BO5 Gran Final */}
              <div className="veto-subbox" style={{ marginTop: '1.2rem', borderColor: 'rgba(229, 9, 20, 0.35)', background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.08) 0%, rgba(20, 20, 24, 0.95) 100%)' }}>
                <h3 className="veto-subbox-title" style={{ color: '#ff4b4b' }}>7.3 BO5 – Gran Final presencial</h3>
                <ol className="veto-steps">
                  <li><span>1.</span> Equipo A elimina un mapa.</li>
                  <li><span>2.</span> Equipo B elimina un mapa.</li>
                  <li><span>3.</span> Equipo A selecciona un mapa.</li>
                  <li><span>4.</span> Equipo B selecciona un mapa.</li>
                  <li><span>5.</span> Equipo A selecciona un mapa.</li>
                  <li><span>6.</span> Equipo B selecciona un mapa.</li>
                  <li><span>7.</span> El mapa restante será el quinto mapa.</li>
                </ol>
                <div className="veto-note">
                  La serie termina cuando un equipo obtiene tres (3) mapas ganados.
                </div>
              </div>

            </div>
          </section>

          {/* 8. Elección de lados */}
          <section id="sec-8" className="rule-card">
            <div className="rule-card-header">
              <span className="rule-num">8</span>
              <h2>Elección de lados</h2>
            </div>
            <div className="rule-card-body">
              <p>
                La organización podrá utilizar <strong>Knife Round</strong> para determinar la elección del lado inicial. El ganador del Knife Round elegirá el bando de comienzo (CT o T).
              </p>
              <p style={{ marginTop: '0.8rem' }}>
                En partidas administradas íntegramente por FACEIT podrá utilizarse el procedimiento configurado por la plataforma.
              </p>
            </div>
          </section>

          {/* 9. Horarios, puntualidad y Walkover */}
          <section id="sec-9" className="rule-card">
            <div className="rule-card-header">
              <span className="rule-num">9</span>
              <h2>Horarios, puntualidad y Walkover</h2>
            </div>
            <div className="rule-card-body">
              <p>
                Los equipos deberán estar listos antes del horario oficial establecido. Se fija una <strong>tolerancia máxima de 15 minutos</strong> desde el horario programado del match.
              </p>
              <p style={{ marginTop: '0.8rem' }}>
                Superado ese plazo sin justificación, la administración podrá declarar <strong>Walkover (WO)</strong> y otorgar la victoria oficial al equipo presente.
              </p>
              <p style={{ marginTop: '0.8rem' }}>
                Situaciones excepcionales comprobables podrán ser evaluadas por la administración. El capitán deberá comunicar cualquier inconveniente de manera inmediata.
              </p>
            </div>
          </section>

          {/* 10. Pausas técnicas, desconexiones y contingencias */}
          <section id="sec-10" className="rule-card">
            <div className="rule-card-header">
              <span className="rule-num">10</span>
              <h2>Pausas técnicas, desconexiones y contingencias</h2>
            </div>
            <div className="rule-card-body">
              <p style={{ fontStyle: 'italic', color: '#9ca3af', marginBottom: '1.2rem' }}>
                Estas reglas buscan resolver incidentes técnicos sin otorgar ventajas indebidas y preservando, en la medida de lo posible, el estado competitivo de la partida.
              </p>

              <div className="contingency-block">
                <h4>10.1 Pausas técnicas</h4>
                <ul className="rule-bullet-list">
                  <li>Una pausa técnica podrá solicitarse ante fallas de conexión, periféricos, PC, audio, servidor u otro inconveniente que impida competir normalmente.</li>
                  <li>La pausa deberá solicitarse por los mecanismos habilitados por FACEIT o comunicarse inmediatamente al administrador cuando se utilicen servidores propios.</li>
                  <li>Durante una pausa técnica los jugadores no deberán utilizar el tiempo para recibir información externa, revisar transmisiones ni obtener ventajas competitivas.</li>
                  <li>La administración podrá limitar la duración o cantidad de pausas cuando detecte abuso o demoras injustificadas.</li>
                  <li>En la instancia presencial, ninguna PC, periférico o conexión deberá manipularse sin conocimiento del staff técnico.</li>
                </ul>
              </div>

              <div className="contingency-block">
                <h4>10.2 Desconexión de un jugador</h4>
                <ul className="rule-bullet-list">
                  <li>Si un jugador se desconecta, el equipo deberá informar inmediatamente al administrador y utilizar la pausa técnica disponible cuando el sistema lo permita.</li>
                  <li>Si la ronda ya se encuentra en desarrollo, la partida no se reiniciará automáticamente por una desconexión individual.</li>
                  <li>La administración evaluará el momento de la desconexión, el estado de la ronda y las posibilidades técnicas de restauración antes de adoptar una decisión.</li>
                  <li>El jugador deberá intentar reconectarse utilizando la misma cuenta registrada. No podrá ser reemplazado por una persona no incluida en el roster.</li>
                </ul>
              </div>

              <div className="contingency-block">
                <h4>10.3 Restauración de rondas</h4>
                <ul className="rule-bullet-list">
                  <li>La restauración de una ronda solo podrá ser autorizada por un administrador.</li>
                  <li>Podrá considerarse cuando exista una falla técnica verificable del servidor, plataforma o infraestructura y la restauración sea técnicamente posible.</li>
                  <li>No se restaurarán rondas únicamente por errores de juego, decisiones tácticas, fallas atribuibles a una configuración personal evitable o desacuerdo con el resultado de una ronda.</li>
                  <li>Cuando la plataforma o servidor disponga de backups válidos, la administración podrá restaurar el estado de la partida al punto que considere competitivo y técnicamente adecuado.</li>
                  <li>Si no fuera posible determinar un estado confiable, la administración decidirá entre continuar, reiniciar el mapa o reprogramar el encuentro según la gravedad del incidente.</li>
                </ul>
              </div>

              <div className="contingency-block">
                <h4>10.4 Crash del servidor o plataforma</h4>
                <ul className="rule-bullet-list">
                  <li>Ante un crash general del servidor, caída de FACEIT o falla de infraestructura que afecte a ambos equipos, los participantes deberán esperar instrucciones y no abandonar definitivamente la serie.</li>
                  <li>Se intentará recuperar la partida desde el backup más reciente que conserve un estado válido.</li>
                  <li>Si la recuperación no fuera técnicamente posible, la administración podrá ordenar el reinicio del mapa o la reprogramación.</li>
                  <li>Las decisiones considerarán el marcador, el momento de la falla, la información disponible y la integridad competitiva.</li>
                </ul>
              </div>

              <div className="contingency-block">
                <h4>10.5 Abandono de partida o serie</h4>
                <ul className="rule-bullet-list">
                  <li>Un equipo no podrá abandonar unilateralmente una partida oficial sin autorización de la administración.</li>
                  <li>El abandono voluntario, la negativa injustificada a continuar o la desconexión deliberada del equipo podrá considerarse forfeiture y derivar en derrota del mapa o de la serie.</li>
                  <li>Si un equipo comunica formalmente que no continuará, la organización podrá otorgar la victoria al rival.</li>
                </ul>
              </div>

              <div className="contingency-block">
                <h4>10.6 Sustituciones entre mapas</h4>
                <ul className="rule-bullet-list">
                  <li>En series BO3 y BO5 se permitirán sustituciones entre mapas utilizando exclusivamente jugadores suplentes registrados previamente.</li>
                  <li>El cambio deberá informarse al administrador antes de iniciar el siguiente mapa.</li>
                  <li>No se permitirán sustituciones durante una ronda en curso ni el ingreso de jugadores no registrados.</li>
                  <li>Ante una emergencia técnica o personal durante un mapa, la administración determinará si corresponde esperar, continuar con los jugadores disponibles cuando reglamentariamente sea posible, o adoptar otra medida excepcional.</li>
                </ul>
              </div>

              <div className="contingency-block">
                <h4>10.7 Overtime</h4>
                <p>
                  Si un mapa termina empatado al finalizar el tiempo reglamentario (12-12), se disputará <strong>overtime conforme a la configuración competitiva vigente</strong> del servidor o plataforma utilizada (MR3 con $10,000 iniciales o el estándar FACEIT/Valve). Los overtimes continuarán hasta que exista un ganador definitivo del mapa. <strong>No habrá empates en ningún partido eliminatorio.</strong>
                </p>
              </div>

              <div className="contingency-block">
                <h4>10.8 Autoridad ante incidentes</h4>
                <p>
                  Los equipos no podrán acordar por cuenta propia reinicios, restauraciones, resultados o reprogramaciones que modifiquen una partida oficial. Toda resolución deberá ser validada por la administración del torneo.
                </p>
              </div>

            </div>
          </section>

          {/* 11. Fair Play y Anti-Cheat */}
          <section id="sec-11" className="rule-card">
            <div className="rule-card-header">
              <span className="rule-num">11</span>
              <h2>Fair Play y Anti-Cheat</h2>
            </div>
            <div className="rule-card-body">
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <strong style={{ color: '#ef4444' }}>PROHIBICIÓN ABSOLUTA:</strong> Está estrictamente prohibido utilizar cheats, wallhack, aimbot, triggerbot, scripts ilegales, software de terceros que otorgue ventajas competitivas indebidas, explotación intencional de bugs del juego o cualquier herramienta vetada por Valve, FACEIT o la organización.
              </div>
              <p>
                Cuando se utilice FACEIT, los jugadores deberán tener activo y actualizado obligatoriamente el <strong>FACEIT Anti-Cheat</strong>.
              </p>
              <p style={{ marginTop: '0.8rem' }}>
                La utilización comprobada de software ilegal o trampas producirá la <strong>descalificación inmediata del jugador y del equipo</strong>, además del veto permanente en futuros torneos y el informe correspondiente ante las plataformas pertinentes.
              </p>
            </div>
          </section>

          {/* 12. Cuentas e identidad competitiva */}
          <section id="sec-12" className="rule-card">
            <div className="rule-card-header">
              <span className="rule-num">12</span>
              <h2>Cuentas e identidad competitiva</h2>
            </div>
            <div className="rule-card-body">
              <ul className="rule-bullet-list">
                <li>Cada participante deberá competir exclusivamente con las cuentas de Steam y FACEIT declaradas durante la inscripción.</li>
                <li>Está prohibido prestar cuentas, suplantar jugadores (smurfing / ringer), utilizar cuentas ajenas, incorporar jugadores no registrados o emplear cuentas alternativas para evadir sanciones previas.</li>
                <li>La organización se reserva el derecho de solicitar verificaciones razonables de identidad competitiva en cualquier momento del torneo.</li>
              </ul>
            </div>
          </section>

          {/* 13. Fase presencial */}
          <section id="sec-13" className="rule-card">
            <div className="rule-card-header">
              <span className="rule-num">13</span>
              <h2>Fase presencial</h2>
            </div>
            <div className="rule-card-body">
              <p>
                Los cuatro (4) equipos clasificados deberán presentarse en la sede indicada por la organización en la ciudad de Santa Fe Capital (<strong>Círculo Italiano</strong>, Hipólito Yrigoyen 2451).
              </p>
              <p style={{ marginTop: '0.8rem' }}>
                Se dispondrá inicialmente de <strong>10 PCs de competición de alto rendimiento</strong>, cinco para cada equipo en juego. Las semifinales se disputarán consecutivamente: Semifinal #1, Semifinal #2 y luego la Gran Final.
              </p>
              <p style={{ marginTop: '0.8rem' }}>
                La jornada presencial tendrá una duración estimada de <strong>10 a 12 horas</strong>, incluyendo acreditaciones de planteles, preparación técnica, partidos, pausas, acciones de sponsors y entrega de premios.
              </p>
              <p style={{ marginTop: '0.8rem', color: '#9ca3af' }}>
                Las especificaciones definitivas del equipamiento técnico serán comunicadas con suficiente antelación a los clasificados.
              </p>
            </div>
          </section>

          {/* 14. Periféricos */}
          <section id="sec-14" className="rule-card">
            <div className="rule-card-header">
              <span className="rule-num">14</span>
              <h2>Periféricos</h2>
            </div>
            <div className="rule-card-body">
              <p>
                Las condiciones definitivas para mouse, teclado, auriculares, in-ears, mousepad y otros periféricos serán comunicadas antes de la fase presencial.
              </p>
              <p style={{ marginTop: '0.8rem' }}>
                La organización podrá autorizar periféricos personales compatibles con la infraestructura del evento. Los jugadores deberán presentarse con anticipación suficiente para su correcta configuración, instalación de drivers homologados y validación por parte del staff técnico.
              </p>
            </div>
          </section>

          {/* 15. Streaming y cobertura */}
          <section id="sec-15" className="rule-card">
            <div className="rule-card-header">
              <span className="rule-num">15</span>
              <h2>Streaming y cobertura</h2>
            </div>
            <div className="rule-card-body">
              <p>
                La organización podrá transmitir las partidas mediante plataformas de streaming y redes sociales, contando con casters oficiales, observers, entrevistas, cámaras en vivo, fotografía profesional, clips, repeticiones y menciones de sponsors.
              </p>
              <p style={{ marginTop: '0.8rem' }}>
                La participación en el torneo implica que los jugadores podrán aparecer en el material audiovisual generado para la difusión, cobertura y promoción del evento, sujeto a las normativas legales aplicables.
              </p>
            </div>
          </section>

          {/* 16. Conducta y sanciones */}
          <section id="sec-16" className="rule-card">
            <div className="rule-card-header">
              <span className="rule-num">16</span>
              <h2>Conducta y sanciones</h2>
            </div>
            <div className="rule-card-body">
              <p>
                Todos los participantes deberán mantener un comportamiento ético y respetuoso hacia rivales, administradores, árbitros, casters, personal técnico, espectadores, sponsors y autoridades de la sede.
              </p>
              <p style={{ marginTop: '0.8rem' }}>
                No serán toleradas actitudes antideportivas, amenazas, agresiones verbales o físicas, comentarios discriminatorios o de odio, hostigamiento, sabotaje ni conductas orientadas a entorpecer deliberadamente la competencia o dañar el equipamiento.
              </p>
              <p style={{ marginTop: '0.8rem' }}>
                Según la gravedad del hecho, las sanciones aplicables por la organización podrán incluir:
              </p>
              <ul className="rule-bullet-list" style={{ marginTop: '0.5rem' }}>
                <li>Advertencia formal (warning).</li>
                <li>Pérdida de rondas o del veto de mapas.</li>
                <li>Pérdida por descalificación del mapa o del partido.</li>
                <li>Descalificación directa de todo el equipo de la Copa.</li>
                <li>Suspensión temporal o definitiva para futuras ediciones.</li>
              </ul>
            </div>
          </section>

          {/* 17. Premios */}
          <section id="sec-17" className="rule-card">
            <div className="rule-card-header">
              <span className="rule-num">17</span>
              <h2>Premios</h2>
            </div>
            <div className="rule-card-body">
              <p>El esquema definitivo del prize pool será anunciado antes del comienzo de la competencia.</p>
              <p style={{ marginTop: '0.8rem' }}>
                Los premios podrán incluir dinero en efectivo, hardware gaming, productos y beneficios de marcas patrocinadoras, trofeos para los campeones y medallas oficiales. La distribución, montos y modalidades de entrega serán publicados en los canales oficiales.
              </p>
            </div>
          </section>

          {/* 18. Administración y decisiones */}
          <section id="sec-18" className="rule-card">
            <div className="rule-card-header">
              <span className="rule-num">18</span>
              <h2>Administración y decisiones</h2>
            </div>
            <div className="rule-card-body">
              <p>
                La administración de <strong>COPA VIEJO GAMER</strong> será la máxima autoridad responsable de interpretar y hacer cumplir este reglamento.
              </p>
              <p style={{ marginTop: '0.8rem' }}>
                Ante situaciones no contempladas explícitamente en este documento, las resoluciones tomadas por los administradores buscarán preservar la integridad competitiva, la igualdad de condiciones entre equipos, la continuidad del evento y el fair play.
              </p>
              <p style={{ marginTop: '0.8rem' }}>
                Las resoluciones oficiales serán definitivas e inapelables.
              </p>
            </div>
          </section>

          {/* 19. Modificaciones del reglamento */}
          <section id="sec-19" className="rule-card">
            <div className="rule-card-header">
              <span className="rule-num">19</span>
              <h2>Modificaciones del reglamento</h2>
            </div>
            <div className="rule-card-body">
              <p>
                La organización se reserva el derecho de realizar las adecuaciones o modificaciones necesarias por cuestiones técnicas imprevistas, organizativas, requerimientos de la sede, seguridad o situaciones de fuerza mayor.
              </p>
              <p style={{ marginTop: '0.8rem' }}>
                Cualquier modificación relevante será debidamente comunicada a los capitanes de equipo a través de los canales de comunicación oficiales.
              </p>
            </div>
          </section>

          {/* 20. Aceptación */}
          <section id="sec-20" className="rule-card" style={{
            borderColor: 'rgba(74, 222, 128, 0.4)',
            background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.08) 0%, rgba(18, 18, 20, 0.95) 100%)'
          }}>
            <div className="rule-card-header">
              <span className="rule-num" style={{ background: '#4ade80', color: '#052e16' }}>20</span>
              <h2 style={{ color: '#4ade80' }}>Aceptación</h2>
            </div>
            <div className="rule-card-body">
              <p style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f3f4f6' }}>
                La inscripción y participación en <strong>COPA VIEJO GAMER</strong> implica que tanto los jugadores como el cuerpo técnico de cada equipo conocen, comprenden y aceptan en su totalidad el presente reglamento general.
              </p>
              <p style={{ marginTop: '0.8rem', color: '#9ca3af' }}>
                El desconocimiento de cualquiera de las reglas aquí expuestas no exime en ningún caso de su estricto cumplimiento.
              </p>

              <div style={{
                marginTop: '1.5rem',
                paddingTop: '1.2rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#9ca3af', display: 'block' }}>¿Listo para competir?</span>
                  <span style={{ fontWeight: 800, color: '#fff' }}>Completá el registro de tu equipo antes del cierre de cupos.</span>
                </div>
                <Link
                  to="/torneo/inscripcion"
                  className="cta-btn"
                  style={{
                    padding: '0.65rem 1.4rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}
                >
                  <Trophy size={16} /> Ir a la Inscripción <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </section>

          {/* Footer note */}
          <div style={{
            textAlign: 'center',
            padding: '2rem 1rem',
            color: '#6b7280',
            fontSize: '0.82rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            marginTop: '2rem'
          }}>
            COPA VIEJO GAMER | REGLAMENTO GENERAL • El Viejo Gamer • Santa Fe Capital
          </div>

        </div>
      </div>
    </div>
  );
}

