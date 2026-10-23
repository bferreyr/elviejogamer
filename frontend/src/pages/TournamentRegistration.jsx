import { Trophy, Users, Shield, Calendar, Sparkles, CheckCircle2, Swords, AlertTriangle, CreditCard, MapPin, Clock, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TournamentRegistration() {
  return (
    <div className="tournament-registration-page" style={{
      maxWidth: '1200px',
      margin: '100px auto 60px',
      padding: '0 1.5rem',
      minHeight: '80vh'
    }}>
      {/* Hero Header */}
      <div style={{
        textAlign: 'center',
        padding: '3.5rem 1.5rem',
        background: 'radial-gradient(ellipse at top, rgba(229, 9, 20, 0.22) 0%, rgba(14, 14, 16, 0.98) 75%)',
        border: '1px solid rgba(229, 9, 20, 0.35)',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(229, 9, 20, 0.2)'
      }}>
        {/* Glow orb */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '320px',
          height: '160px',
          background: 'var(--primary)',
          filter: 'blur(100px)',
          opacity: 0.4,
          pointerEvents: 'none'
        }} />

        {/* Badges superiores */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.6rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{
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
            <Trophy size={14} /> TORNEO OFICIAL CS2
          </div>
          <div style={{
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
            <span>Organizan: <strong>El Viejo Gamer</strong> × <strong>Nostalgia Gamers</strong></span>
          </div>
        </div>

        {/* Título Principal */}
        <h1 style={{
          fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)',
          fontWeight: 900,
          letterSpacing: '2px',
          lineHeight: 1.15,
          marginBottom: '1rem',
          textTransform: 'uppercase'
        }}>
          INSCRIPCIÓN OFICIAL – <span className="text-gradient">COPA VIEJO GAMER</span>
        </h1>

        {/* Bajada */}
        <p style={{
          fontSize: '1.2rem',
          fontWeight: 700,
          color: '#fff',
          maxWidth: '750px',
          margin: '0 auto 0.75rem',
          lineHeight: 1.4
        }}>
          ¡Llegó el momento de demostrar quién manda en el servidor!
        </p>

        <p style={{
          fontSize: '1.05rem',
          color: 'var(--text-muted)',
          maxWidth: '780px',
          margin: '0 auto 2.2rem',
          lineHeight: 1.6
        }}>
          Abrimos las inscripciones para nuestro torneo de <strong>Counter-Strike 2</strong>, que reunirá a los equipos en una competencia con fase clasificatoria online y una gran definición presencial en Santa Fe Capital.
        </p>

        {/* Quick Highlights Pills */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          maxWidth: '960px',
          margin: '0 auto'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            textAlign: 'left'
          }}>
            <div style={{ background: 'rgba(229, 9, 20, 0.15)', padding: '0.65rem', borderRadius: '8px', color: 'var(--primary)', flexShrink: 0 }}>
              <Users size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cupos</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>32 Equipos</div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            textAlign: 'left'
          }}>
            <div style={{ background: 'rgba(229, 9, 20, 0.15)', padding: '0.65rem', borderRadius: '8px', color: 'var(--primary)', flexShrink: 0 }}>
              <Swords size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Modalidad</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>5 vs. 5 (Online/Presencial)</div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            textAlign: 'left'
          }}>
            <div style={{ background: 'rgba(229, 9, 20, 0.15)', padding: '0.65rem', borderRadius: '8px', color: 'var(--primary)', flexShrink: 0 }}>
              <CreditCard size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Costo por equipo</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#4ade80' }}>AR$ 150.000</div>
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            textAlign: 'left'
          }}>
            <div style={{ background: 'rgba(229, 9, 20, 0.15)', padding: '0.65rem', borderRadius: '8px', color: 'var(--primary)', flexShrink: 0 }}>
              <Calendar size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Gran Final Presencial</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>21 / 02 / 2027</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cartel de Advertencia IMPORTANTE */}
      <div style={{
        marginTop: '2rem',
        background: 'linear-gradient(90deg, rgba(234, 179, 8, 0.12) 0%, rgba(20, 20, 22, 0.9) 100%)',
        border: '1px solid rgba(234, 179, 8, 0.45)',
        borderLeft: '5px solid #eab308',
        borderRadius: '12px',
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{
          background: 'rgba(234, 179, 8, 0.2)',
          color: '#facc15',
          padding: '0.6rem',
          borderRadius: '8px',
          flexShrink: 0,
          marginTop: '0.1rem'
        }}>
          <AlertTriangle size={24} />
        </div>
        <div>
          <h3 style={{ margin: '0 0 0.35rem', color: '#facc15', fontSize: '1.05rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            IMPORTANTE – CONDICIONES DE INSCRIPCIÓN
          </h3>
          <p style={{ margin: 0, color: '#e5e7eb', fontSize: '0.95rem', lineHeight: 1.6 }}>
            La inscripción debe realizarla <strong>únicamente el capitán del equipo</strong>. Completar este formulario <strong>no garantiza el cupo</strong> hasta que la organización confirme el registro y el pago correspondiente.
          </p>
        </div>
      </div>

      {/* Bloque Detallado de Información del Torneo */}
      <div style={{
        marginTop: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Card 1: Formato y Competencia */}
        <div style={{
          background: 'rgba(18, 18, 20, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.85rem' }}>
            <Swords size={20} color="var(--primary)" />
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>FORMATO & COMPETENCIA</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.92rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', paddingBottom: '0.6rem' }}>
              <span style={{ color: '#9ca3af' }}>Modalidad de juego:</span>
              <strong style={{ color: '#fff' }}>5 vs. 5</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', paddingBottom: '0.6rem' }}>
              <span style={{ color: '#9ca3af' }}>Plantilla permitida:</span>
              <strong style={{ color: '#fff' }}>5 titulares + hasta 2 suplentes</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', paddingBottom: '0.6rem' }}>
              <span style={{ color: '#9ca3af' }}>Plataforma online:</span>
              <span style={{
                background: '#ff5500',
                color: '#fff',
                fontSize: '0.78rem',
                fontWeight: 900,
                padding: '0.15rem 0.55rem',
                borderRadius: '4px',
                letterSpacing: '0.5px'
              }}>FACEIT</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', paddingBottom: '0.6rem' }}>
              <span style={{ color: '#9ca3af' }}>Fase clasificatoria:</span>
              <strong style={{ color: '#fff' }}>Eliminación directa, BO3</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', paddingBottom: '0.6rem' }}>
              <span style={{ color: '#9ca3af' }}>Clasifican a presencial:</span>
              <strong style={{ color: '#4ade80' }}>4 equipos</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', paddingBottom: '0.6rem' }}>
              <span style={{ color: '#9ca3af' }}>Semifinales presenciales:</span>
              <strong style={{ color: '#fff' }}>BO3</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9ca3af' }}>Gran final presencial:</span>
              <strong style={{ color: 'var(--primary)' }}>BO5</strong>
            </div>
          </div>
        </div>

        {/* Card 2: Fechas, Cupos y Sede */}
        <div style={{
          background: 'rgba(18, 18, 20, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.85rem' }}>
            <Calendar size={20} color="var(--primary)" />
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>CALENDARIO & CUPOS</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.92rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', paddingBottom: '0.6rem' }}>
              <span style={{ color: '#9ca3af' }}>Cupos disponibles:</span>
              <span style={{ color: '#fff', fontWeight: 800 }}>32 equipos</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', paddingBottom: '0.6rem' }}>
              <span style={{ color: '#9ca3af' }}>Límite de inscripción:</span>
              <strong style={{ color: '#f87171' }}>05 / 02 / 2027</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', paddingBottom: '0.6rem' }}>
              <span style={{ color: '#9ca3af' }}>Fase presencial:</span>
              <strong style={{ color: '#60a5fa' }}>21 / 02 / 2027</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', paddingBottom: '0.6rem' }}>
              <span style={{ color: '#9ca3af' }}>Sede de la final:</span>
              <span style={{ color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={14} color="var(--primary)" /> Santa Fe Capital
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', paddingBottom: '0.6rem' }}>
              <span style={{ color: '#9ca3af' }}>Inscripción:</span>
              <span style={{ color: '#fbbf24', fontWeight: 800 }}>Paga</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9ca3af' }}>Costo por equipo:</span>
              <strong style={{ color: '#4ade80', fontSize: '1.05rem' }}>AR$ 150.000</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor del Formulario (Aguardando los campos) */}
      <div style={{
        marginTop: '2.5rem',
        background: '#121214',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '2.5rem 2rem',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '1.2rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ color: 'var(--primary)' }}>#</span> Formulario de Inscripción
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.3rem 0 0' }}>
              Postulación exclusiva para el capitán del equipo.
            </p>
          </div>
          <div style={{
            background: 'rgba(74, 222, 128, 0.1)',
            border: '1px solid rgba(74, 222, 128, 0.3)',
            color: '#4ade80',
            fontSize: '0.8rem',
            fontWeight: 700,
            padding: '0.35rem 0.8rem',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <CheckCircle2 size={14} /> Sistema de Registro Activo
          </div>
        </div>

        {/* Placeholder interactivo esperando los campos */}
        <div style={{
          textAlign: 'center',
          padding: '3rem 1.5rem',
          background: 'rgba(25, 25, 30, 0.5)',
          border: '1px dashed rgba(229, 9, 20, 0.4)',
          borderRadius: '12px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(229, 9, 20, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.2rem',
            color: 'var(--primary)',
            boxShadow: '0 0 20px rgba(229, 9, 20, 0.2)'
          }}>
            <Trophy size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff', fontWeight: 800 }}>
            Toda la información del torneo ha sido cargada con éxito
          </h3>
          <p style={{ color: '#9ca3af', maxWidth: '580px', margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Pasame la lista de campos que tiene que tener el formulario (por ejemplo: nombre del equipo, datos del capitán, jugadores titulares, suplentes, comprobante de pago, etc.) y lo implementamos inmediatamente.
          </p>
        </div>
      </div>
    </div>
  );
}
