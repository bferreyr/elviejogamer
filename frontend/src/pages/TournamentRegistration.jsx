import { Trophy, Users, Shield, Calendar, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TournamentRegistration() {
  return (
    <div className="tournament-registration-page" style={{
      maxWidth: '1100px',
      margin: '110px auto 60px',
      padding: '0 1.5rem',
      minHeight: '80vh'
    }}>
      {/* Hero Header */}
      <div style={{
        textAlign: 'center',
        padding: '3rem 1.5rem',
        background: 'radial-gradient(ellipse at top, rgba(229, 9, 20, 0.18) 0%, rgba(18, 18, 18, 0.95) 70%)',
        border: '1px solid rgba(229, 9, 20, 0.3)',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(229, 9, 20, 0.15)'
      }}>
        {/* Subtle decorative glow */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '280px',
          height: '140px',
          background: 'var(--primary)',
          filter: 'blur(90px)',
          opacity: 0.35,
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(229, 9, 20, 0.15)',
          border: '1px solid rgba(229, 9, 20, 0.4)',
          color: '#ff4b4b',
          padding: '0.35rem 0.9rem',
          borderRadius: '999px',
          fontSize: '0.8rem',
          fontWeight: '700',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginBottom: '1.2rem'
        }}>
          <Trophy size={15} /> Torneo Oficial
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          fontWeight: 900,
          letterSpacing: '2px',
          lineHeight: 1.15,
          marginBottom: '0.8rem'
        }}>
          COPA <span className="text-gradient">VIEJO GAMER</span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-muted)',
          maxWidth: '680px',
          margin: '0 auto 2rem',
          lineHeight: 1.6
        }}>
          Formulario de Inscripción para la competencia más picante de la comunidad.
          Asegurá el cupo de tu escuadra y demostrá quién manda en el server.
        </p>

        {/* Tournament Highlights Pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'center',
          marginTop: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            color: '#e5e7eb'
          }}>
            <Users size={16} color="var(--primary)" />
            <span>Modalidad <strong>5v5</strong></span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            color: '#e5e7eb'
          }}>
            <Shield size={16} color="var(--primary)" />
            <span>Servidores <strong>128 Tickrate</strong></span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            color: '#e5e7eb'
          }}>
            <Sparkles size={16} color="var(--primary)" />
            <span>Premios & <strong>Transmisión</strong></span>
          </div>
        </div>
      </div>

      {/* Form Container Placeholder */}
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
              Completá los campos requeridos para postular a tu equipo.
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

        {/* Temporary friendly placeholder while user passes requirements */}
        <div style={{
          textAlign: 'center',
          padding: '3rem 1.5rem',
          background: 'rgba(25, 25, 30, 0.6)',
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
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#fff' }}>
            ¡Ruta y página preparadas con éxito!
          </h3>
          <p style={{ color: '#9ca3af', maxWidth: '520px', margin: '0 auto 1.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
            El botón en el menú de navegación y el acceso a la Copa Viejo Gamer ya están vinculados.
            Pasame la lista de campos y requerimientos para armar el formulario completo.
          </p>
        </div>
      </div>
    </div>
  );
}
