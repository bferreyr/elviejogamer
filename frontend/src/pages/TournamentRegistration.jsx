import { useState } from 'react';
import { 
  Trophy, Users, Shield, Calendar, Sparkles, CheckCircle2, Swords, 
  AlertTriangle, CreditCard, MapPin, Clock, Upload, FileText, Check, 
  Copy, ArrowRight, UserCheck, MessageCircle, AlertCircle, ChevronDown, CheckSquare, Square
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TournamentRegistration() {
  // Form State
  const [formData, setFormData] = useState({
    // Sección 1 - Equipo
    team_name: '',
    team_tag: '',
    origin_city: '',
    instagram: '',
    
    // Sección 2 - Capitán
    captain_name: '',
    captain_nick: '',
    captain_phone: '',
    captain_email: '',
    captain_steam: '',
    captain_faceit: '',
    captain_discord: '',

    // Sección 3 - Roster (Titulares)
    p1_name: '', p1_nick: '', p1_steam: '', p1_faceit: '',
    p2_name: '', p2_nick: '', p2_steam: '', p2_faceit: '',
    p3_name: '', p3_nick: '', p3_steam: '', p3_faceit: '',
    p4_name: '', p4_nick: '', p4_steam: '', p4_faceit: '',
    p5_name: '', p5_nick: '', p5_steam: '', p5_faceit: '',

    // Suplentes
    has_substitutes: 'No', // 'No', 'Sí, 1 suplente', 'Sí, 2 suplentes'
    sub1_name: '', sub1_nick: '', sub1_steam: '', sub1_faceit: '',
    sub2_name: '', sub2_nick: '', sub2_steam: '', sub2_faceit: '',

    // Sección 4 - Disponibilidad & Presencial
    can_attend_lan: 'Sí', // 'Sí', 'No'
    travel_from: '',

    // Sección 5 - Pago
    payment_holder_name: '',
    payment_confirm_check: false,

    // Sección 6 - Reglamento y Condiciones
    accepted_rules: false,
    accepted_identity: false,
    accepted_fairplay: false,
    accepted_commitment: false,
    accepted_data_public: false,

    // Sección 7 - Comentarios
    comments: ''
  });

  // Estado para feedback de copia de datos bancarios
  const [copiedField, setCopiedField] = useState('');

  const handleCopy = (text, fieldName) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => {
        setCopiedField('');
      }, 2000);
    }
  };

  // Files
  const [logoFile, setLogoFile] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Helper para cambios en texto y radios
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manejo de archivo Logo
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Manejo de archivo Comprobante
  const handleReceiptChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
    }
  };

  // Autocompletar Jugador 1 con datos del Capitán
  const handleCopyCaptainToPlayer1 = () => {
    setFormData(prev => ({
      ...prev,
      p1_name: prev.captain_name,
      p1_nick: prev.captain_nick,
      p1_steam: prev.captain_steam,
      p1_faceit: prev.captain_faceit
    }));
  };

  // Validación y Envío del Formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validar comprobante
    if (!receiptFile) {
      setErrorMsg('Debes adjuntar el comprobante de pago de la transferencia bancaria.');
      window.scrollTo({ top: document.getElementById('seccion-pago')?.offsetTop - 100, behavior: 'smooth' });
      return;
    }

    // Validar casillas obligatorias de condiciones
    if (
      !formData.payment_confirm_check ||
      !formData.accepted_rules ||
      !formData.accepted_identity ||
      !formData.accepted_fairplay ||
      !formData.accepted_commitment ||
      !formData.accepted_data_public
    ) {
      setErrorMsg('Debes aceptar todas las casillas obligatorias de reglamento y confirmación.');
      return;
    }

    // Validar titulares
    const starters = [
      { name: formData.p1_name, nick: formData.p1_nick, steam: formData.p1_steam, faceit: formData.p1_faceit },
      { name: formData.p2_name, nick: formData.p2_nick, steam: formData.p2_steam, faceit: formData.p2_faceit },
      { name: formData.p3_name, nick: formData.p3_nick, steam: formData.p3_steam, faceit: formData.p3_faceit },
      { name: formData.p4_name, nick: formData.p4_nick, steam: formData.p4_steam, faceit: formData.p4_faceit },
      { name: formData.p5_name, nick: formData.p5_nick, steam: formData.p5_steam, faceit: formData.p5_faceit },
    ];

    const substitutes = [];
    if (formData.has_substitutes === 'Sí, 1 suplente' || formData.has_substitutes === 'Sí, 2 suplentes') {
      substitutes.push({
        name: formData.sub1_name,
        nick: formData.sub1_nick,
        steam: formData.sub1_steam,
        faceit: formData.sub1_faceit
      });
    }
    if (formData.has_substitutes === 'Sí, 2 suplentes') {
      substitutes.push({
        name: formData.sub2_name,
        nick: formData.sub2_nick,
        steam: formData.sub2_steam,
        faceit: formData.sub2_faceit
      });
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      // Equipos y Capitán
      data.append('team_name', formData.team_name);
      data.append('team_tag', formData.team_tag);
      data.append('origin_city', formData.origin_city);
      data.append('instagram', formData.instagram);
      data.append('captain_name', formData.captain_name);
      data.append('captain_nick', formData.captain_nick);
      data.append('captain_phone', formData.captain_phone);
      data.append('captain_email', formData.captain_email);
      data.append('captain_steam', formData.captain_steam);
      data.append('captain_faceit', formData.captain_faceit);
      data.append('captain_discord', formData.captain_discord);

      // Roster & Substitutes
      data.append('roster', JSON.stringify(starters));
      data.append('has_substitutes', formData.has_substitutes);
      data.append('substitutes', JSON.stringify(substitutes));

      // Disponibilidad & Presencial
      data.append('can_attend_lan', formData.can_attend_lan);
      data.append('travel_from', formData.travel_from);

      // Pago
      data.append('payment_holder_name', formData.payment_holder_name);

      // Condiciones
      data.append('accepted_rules', formData.accepted_rules);
      data.append('accepted_identity', formData.accepted_identity);
      data.append('accepted_fairplay', formData.accepted_fairplay);
      data.append('accepted_commitment', formData.accepted_commitment);
      data.append('accepted_data_public', formData.accepted_data_public);
      data.append('comments', formData.comments);

      // Archivos
      if (logoFile) data.append('logo', logoFile);
      if (receiptFile) data.append('receipt', receiptFile);

      const res = await fetch('/api/tournament/register', {
        method: 'POST',
        body: data
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMsg(json.error || 'Ocurrió un error al enviar el formulario. Intentá nuevamente.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error de conexión con el servidor. Verificá tu conexión a internet.');
    } finally {
      setSubmitting(false);
    }
  };

  // Render si ya fue enviado exitosamente
  if (submitted) {
    return (
      <div className="tournament-registration-page" style={{
        maxWidth: '850px',
        margin: '110px auto 70px',
        padding: '0 1.5rem',
        minHeight: '75vh'
      }}>
        <div style={{
          background: 'linear-gradient(145deg, #18181b 0%, #0d0d10 100%)',
          border: '2px solid rgba(74, 222, 128, 0.4)',
          borderRadius: '16px',
          padding: '3.5rem 2rem',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(74, 222, 128, 0.15)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(74, 222, 128, 0.12)',
            border: '2px solid #4ade80',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: '#4ade80',
            boxShadow: '0 0 30px rgba(74, 222, 128, 0.3)'
          }}>
            <CheckCircle2 size={44} />
          </div>

          <h1 style={{
            fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
            fontWeight: 900,
            color: '#fff',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            ¡Gracias por inscribir a tu equipo!
          </h1>

          <div style={{
            maxWidth: '680px',
            margin: '0 auto',
            color: '#d1d5db',
            fontSize: '1.05rem',
            lineHeight: 1.7,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <p>
              Recibimos los datos de inscripción para el torneo de <strong>Counter-Strike 2</strong> organizado por <strong>El Viejo Gamer</strong> y <strong>Nostalgia Gamers</strong>.
            </p>
            <p>
              La organización verificará los datos de los jugadores y el estado del pago.
            </p>
            <div style={{
              background: 'rgba(234, 179, 8, 0.1)',
              border: '1px solid rgba(234, 179, 8, 0.3)',
              borderRadius: '8px',
              padding: '1rem',
              color: '#facc15',
              fontSize: '0.95rem',
              fontWeight: 700
            }}>
              Recordá que completar este formulario no garantiza el cupo hasta recibir la confirmación oficial.
            </div>
            <p style={{
              fontSize: '1.3rem',
              fontWeight: 900,
              color: 'var(--primary)',
              marginTop: '1rem',
              letterSpacing: '1px'
            }}>
              ¡Nos vemos en el TORNEO!
            </p>
            <p style={{
              fontSize: '0.9rem',
              color: '#9ca3af',
              fontWeight: 800,
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              EL VIEJO GAMER × NOSTALGIA GAMERS
            </p>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="primary-btn" style={{ padding: '0.85rem 2rem' }}>
              Volver al Inicio
            </Link>
            <button 
              onClick={() => { setSubmitted(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="secondary-btn"
              style={{ padding: '0.85rem 1.5rem', borderRadius: '4px', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff', background: 'transparent', cursor: 'pointer' }}
            >
              Cargar otra inscripción
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tournament-registration-page" style={{
      maxWidth: '1100px',
      margin: '100px auto 60px',
      padding: '0 1.5rem',
      minHeight: '80vh'
    }}>
      {/* ========================================================
          MEGA BANNER: PREMIO $1.000.000 (GRADIENTE ANIMADO)
         ======================================================== */}
      <div style={{
        textAlign: 'center',
        padding: '3rem 1.5rem',
        background: 'linear-gradient(135deg, rgba(28, 12, 16, 0.95) 0%, rgba(14, 14, 18, 0.98) 50%, rgba(22, 12, 28, 0.95) 100%)',
        border: '2px solid rgba(245, 158, 11, 0.5)',
        borderRadius: '20px',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 50px rgba(245, 158, 11, 0.25)'
      }}>
        {/* Glow de fondo */}
        <div style={{
          position: 'absolute',
          top: '-70px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '200px',
          background: 'radial-gradient(ellipse, rgba(245, 158, 11, 0.35) 0%, rgba(229, 9, 20, 0.25) 50%, transparent 80%)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }} />

        {/* Shimmer superior en movimiento */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #ff4b4b, #f59e0b, #fbbf24, #ec4899, #ff4b4b)',
          backgroundSize: '200% 100%',
          animation: 'prizeGradientMove 3s linear infinite'
        }} />

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.6rem',
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.5)',
          color: '#fbbf24',
          padding: '0.45rem 1.4rem',
          borderRadius: '999px',
          fontSize: '0.85rem',
          fontWeight: 900,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginBottom: '0.8rem'
        }}>
          <Sparkles size={16} /> POZO OFICIAL EN PREMIOS <Sparkles size={16} />
        </div>

        {/* Cifra Gigante con Gradiente Animado en Movimiento Continuo */}
        <div className="prize-animated-gradient" style={{
          fontSize: 'clamp(4.2rem, 12vw, 8rem)',
          fontWeight: 950,
          letterSpacing: '-2px',
          lineHeight: 1,
          margin: '0.2rem 0',
          fontFamily: "'Outfit', sans-serif"
        }}>
          $1.000.000
        </div>

        <div style={{
          fontSize: 'clamp(1.25rem, 3.8vw, 2.2rem)',
          fontWeight: 900,
          letterSpacing: '3px',
          color: '#ffffff',
          textTransform: 'uppercase',
          marginBottom: '0.6rem',
          textShadow: '0 2px 15px rgba(0,0,0,0.9)'
        }}>
          UN MILLÓN DE PESOS EN PREMIOS
        </div>

        <p style={{
          color: '#e5e7eb',
          fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
          maxWidth: '720px',
          margin: '0 auto',
          fontWeight: 600,
          lineHeight: 1.5
        }}>
          ¡Inscribí a tu equipo en la <strong>COPA VIEJO GAMER</strong> y competí por el pozo más grande de la región!
        </p>
      </div>

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

        {/* Highlights */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          maxWidth: '960px',
          margin: '0 auto'
        }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.85rem', textAlign: 'left' }}>
            <div style={{ background: 'rgba(229, 9, 20, 0.15)', padding: '0.65rem', borderRadius: '8px', color: 'var(--primary)', flexShrink: 0 }}>
              <Users size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cupos</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>32 Equipos</div>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.85rem', textAlign: 'left' }}>
            <div style={{ background: 'rgba(229, 9, 20, 0.15)', padding: '0.65rem', borderRadius: '8px', color: 'var(--primary)', flexShrink: 0 }}>
              <Swords size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Modalidad</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>5 vs. 5 (Online/Presencial)</div>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.85rem', textAlign: 'left' }}>
            <div style={{ background: 'rgba(229, 9, 20, 0.15)', padding: '0.65rem', borderRadius: '8px', color: 'var(--primary)', flexShrink: 0 }}>
              <CreditCard size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Costo por equipo</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#4ade80' }}>AR$ 150.000</div>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.85rem', textAlign: 'left' }}>
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

      {/* ========================================================= */}
      {/* FORMULARIO DE INSCRIPCIÓN COMPLETO (7 SECCIONES)          */}
      {/* ========================================================= */}
      <form onSubmit={handleSubmit} style={{ marginTop: '2.5rem' }}>
        
        {/* Banner de Error si falta algo */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            color: '#fca5a5',
            padding: '1rem 1.5rem',
            borderRadius: '10px',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            fontSize: '0.95rem',
            fontWeight: 700
          }}>
            <AlertCircle size={22} color="#ef4444" style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECCIÓN 1: INFORMACIÓN DEL EQUIPO                            */}
        {/* ------------------------------------------------------------- */}
        <div className="form-section-card" style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionNumberBadge}>1</div>
            <div>
              <h2 style={sectionTitleStyle}>INFORMACIÓN DEL EQUIPO</h2>
              <p style={sectionSubtitleStyle}>Datos identificatorios oficiales de la escuadra</p>
            </div>
          </div>

          <div style={gridTwoColsStyle}>
            {/* 1. Nombre del equipo */}
            <div className="form-group">
              <label style={labelStyle}>
                1. Nombre del equipo <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <input
                type="text"
                name="team_name"
                required
                placeholder="Ej: Old School Gaming"
                value={formData.team_name}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* 2. TAG del equipo */}
            <div className="form-group">
              <label style={labelStyle}>
                2. TAG del equipo <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <input
                type="text"
                name="team_tag"
                required
                maxLength={8}
                placeholder="Ej: OSG"
                value={formData.team_tag}
                onChange={handleChange}
                style={inputStyle}
              />
              <span style={hintStyle}>Abreviatura que identificará al equipo en fixtures y transmisiones (máx. 8 caracteres).</span>
            </div>
          </div>

          <div style={gridTwoColsStyle}>
            {/* 3. Ciudad y provincia de origen */}
            <div className="form-group">
              <label style={labelStyle}>
                3. Ciudad y provincia de origen <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <input
                type="text"
                name="origin_city"
                required
                placeholder="Ej: Santa Fe Capital, Santa Fe"
                value={formData.origin_city}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* 4. Instagram del equipo */}
            <div className="form-group">
              <label style={labelStyle}>
                4. Instagram del equipo <span style={{ color: '#9ca3af', fontWeight: 'normal' }}>(Opcional)</span>
              </label>
              <input
                type="text"
                name="instagram"
                placeholder="Ej: @elviejo.gamer"
                value={formData.instagram}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          {/* 5. Logo del equipo */}
          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label style={labelStyle}>
              5. Logo del equipo <span style={{ color: '#9ca3af', fontWeight: 'normal' }}>(Opcional - Formato PNG o JPG)</span>
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
              background: 'rgba(0,0,0,0.3)',
              border: '1px dashed rgba(255,255,255,0.15)',
              borderRadius: '8px',
              padding: '1.2rem'
            }}>
              <input
                type="file"
                id="team-logo-input"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleLogoChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="team-logo-input" style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                padding: '0.65rem 1.25rem',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 700
              }}>
                <Upload size={16} /> {logoFile ? 'Cambiar archivo' : 'Seleccionar logo'}
              </label>

              {logoPreview && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <img src={logoPreview} alt="Logo Preview" style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '6px', background: '#000', border: '1px solid rgba(255,255,255,0.1)' }} />
                  <span style={{ fontSize: '0.85rem', color: '#4ade80', fontWeight: 600 }}>{logoFile.name}</span>
                </div>
              )}

              {!logoPreview && (
                <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>El logo podrá utilizarse en fixtures, transmisiones y publicaciones oficiales.</span>
              )}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECCIÓN 2: DATOS DEL CAPITÁN                                 */}
        {/* ------------------------------------------------------------- */}
        <div className="form-section-card" style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionNumberBadge}>2</div>
            <div>
              <h2 style={sectionTitleStyle}>DATOS DEL CAPITÁN</h2>
              <p style={sectionSubtitleStyle}>Responsable del equipo y contacto directo con la organización</p>
            </div>
          </div>

          <div style={gridTwoColsStyle}>
            {/* 6. Nombre y apellido */}
            <div className="form-group">
              <label style={labelStyle}>
                6. Nombre y apellido del Capitán <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <input
                type="text"
                name="captain_name"
                required
                placeholder="Ej: Lucas Pérez"
                value={formData.captain_name}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* 7. Nickname en CS2 */}
            <div className="form-group">
              <label style={labelStyle}>
                7. Nickname en CS2 <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <input
                type="text"
                name="captain_nick"
                required
                placeholder="Ej: luc4s"
                value={formData.captain_nick}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={gridTwoColsStyle}>
            {/* 8. WhatsApp de contacto */}
            <div className="form-group">
              <label style={labelStyle}>
                8. WhatsApp de contacto <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <input
                type="tel"
                name="captain_phone"
                required
                placeholder="Ej: +54 9 342 1234567"
                value={formData.captain_phone}
                onChange={handleChange}
                style={inputStyle}
              />
              <span style={hintStyle}>Incluir código de país y código de área.</span>
            </div>

            {/* 9. Correo electrónico */}
            <div className="form-group">
              <label style={labelStyle}>
                9. Correo electrónico <span style={{ color: '#9ca3af', fontWeight: 'normal' }}>(Opcional)</span>
              </label>
              <input
                type="email"
                name="captain_email"
                placeholder="capitan@equipo.com"
                value={formData.captain_email}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={gridTwoColsStyle}>
            {/* 10. Perfil de Steam */}
            <div className="form-group">
              <label style={labelStyle}>
                10. Perfil de Steam del Capitán <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <input
                type="url"
                name="captain_steam"
                required
                placeholder="https://steamcommunity.com/id/..."
                value={formData.captain_steam}
                onChange={handleChange}
                style={inputStyle}
              />
              <span style={hintStyle}>Ingresar el enlace completo al perfil.</span>
            </div>

            {/* 11. Perfil de FACEIT */}
            <div className="form-group">
              <label style={labelStyle}>
                11. Perfil de FACEIT del Capitán <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <input
                type="url"
                name="captain_faceit"
                required
                placeholder="https://www.faceit.com/es/players/..."
                value={formData.captain_faceit}
                onChange={handleChange}
                style={inputStyle}
              />
              <span style={hintStyle}>Ingresar el enlace completo al perfil.</span>
            </div>
          </div>

          {/* 12. Usuario de Discord */}
          <div className="form-group">
            <label style={labelStyle}>
              12. Usuario de Discord <span style={{ color: '#9ca3af', fontWeight: 'normal' }}>(Opcional)</span>
            </label>
            <input
              type="text"
              name="captain_discord"
              placeholder="Ej: lucas_gamer#1234"
              value={formData.captain_discord}
              onChange={handleChange}
              style={{ ...inputStyle, maxWidth: '500px' }}
            />
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECCIÓN 3: PLANTILLA DE JUGADORES                             */}
        {/* ------------------------------------------------------------- */}
        <div className="form-section-card" style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionNumberBadge}>3</div>
            <div>
              <h2 style={sectionTitleStyle}>PLANTILLA DE JUGADORES</h2>
              <p style={sectionSubtitleStyle}>
                Cada jugador titular deberá contar con una cuenta de Steam y una cuenta de FACEIT que cumplan los requisitos del torneo.
              </p>
            </div>
          </div>

          {/* 13. Jugador Titular 1 (Capitán) */}
          <div style={playerCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.6rem' }}>
              <div style={playerTitleStyle}>
                <span style={playerBadgeStyle}>1</span> Jugador Titular 1 (Capitán) <span style={{ color: 'var(--primary)' }}>*</span>
              </div>
              <button
                type="button"
                onClick={handleCopyCaptainToPlayer1}
                style={{
                  background: 'rgba(229, 9, 20, 0.12)',
                  border: '1px solid rgba(229, 9, 20, 0.4)',
                  color: '#fff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  padding: '0.35rem 0.8rem',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer'
                }}
              >
                <Copy size={13} /> Copiar datos del Capitán
              </button>
            </div>

            <div style={gridTwoColsStyle}>
              <div>
                <label style={labelStyle}>Nombre y Apellido *</label>
                <input type="text" name="p1_name" required value={formData.p1_name} onChange={handleChange} placeholder="Ej: Lucas Pérez" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Nickname *</label>
                <input type="text" name="p1_nick" required value={formData.p1_nick} onChange={handleChange} placeholder="Ej: luc4s" style={inputStyle} />
              </div>
            </div>
            <div style={gridTwoColsStyle}>
              <div>
                <label style={labelStyle}>URL del perfil de Steam *</label>
                <input type="url" name="p1_steam" required value={formData.p1_steam} onChange={handleChange} placeholder="https://steamcommunity.com/id/..." style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>URL del perfil de FACEIT *</label>
                <input type="url" name="p1_faceit" required value={formData.p1_faceit} onChange={handleChange} placeholder="https://www.faceit.com/es/players/..." style={inputStyle} />
              </div>
            </div>
          </div>

          {/* 14. Jugador Titular 2 */}
          <div style={playerCardStyle}>
            <div style={playerTitleStyle}>
              <span style={playerBadgeStyle}>2</span> Jugador Titular 2 <span style={{ color: 'var(--primary)' }}>*</span>
            </div>
            <div style={gridTwoColsStyle}>
              <div>
                <label style={labelStyle}>Nombre y Apellido *</label>
                <input type="text" name="p2_name" required value={formData.p2_name} onChange={handleChange} placeholder="Nombre y Apellido" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Nickname *</label>
                <input type="text" name="p2_nick" required value={formData.p2_nick} onChange={handleChange} placeholder="Nickname en CS2" style={inputStyle} />
              </div>
            </div>
            <div style={gridTwoColsStyle}>
              <div>
                <label style={labelStyle}>URL del perfil de Steam *</label>
                <input type="url" name="p2_steam" required value={formData.p2_steam} onChange={handleChange} placeholder="https://steamcommunity.com/id/..." style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>URL del perfil de FACEIT *</label>
                <input type="url" name="p2_faceit" required value={formData.p2_faceit} onChange={handleChange} placeholder="https://www.faceit.com/es/players/..." style={inputStyle} />
              </div>
            </div>
          </div>

          {/* 15. Jugador Titular 3 */}
          <div style={playerCardStyle}>
            <div style={playerTitleStyle}>
              <span style={playerBadgeStyle}>3</span> Jugador Titular 3 <span style={{ color: 'var(--primary)' }}>*</span>
            </div>
            <div style={gridTwoColsStyle}>
              <div>
                <label style={labelStyle}>Nombre y Apellido *</label>
                <input type="text" name="p3_name" required value={formData.p3_name} onChange={handleChange} placeholder="Nombre y Apellido" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Nickname *</label>
                <input type="text" name="p3_nick" required value={formData.p3_nick} onChange={handleChange} placeholder="Nickname en CS2" style={inputStyle} />
              </div>
            </div>
            <div style={gridTwoColsStyle}>
              <div>
                <label style={labelStyle}>URL del perfil de Steam *</label>
                <input type="url" name="p3_steam" required value={formData.p3_steam} onChange={handleChange} placeholder="https://steamcommunity.com/id/..." style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>URL del perfil de FACEIT *</label>
                <input type="url" name="p3_faceit" required value={formData.p3_faceit} onChange={handleChange} placeholder="https://www.faceit.com/es/players/..." style={inputStyle} />
              </div>
            </div>
          </div>

          {/* 16. Jugador Titular 4 */}
          <div style={playerCardStyle}>
            <div style={playerTitleStyle}>
              <span style={playerBadgeStyle}>4</span> Jugador Titular 4 <span style={{ color: 'var(--primary)' }}>*</span>
            </div>
            <div style={gridTwoColsStyle}>
              <div>
                <label style={labelStyle}>Nombre y Apellido *</label>
                <input type="text" name="p4_name" required value={formData.p4_name} onChange={handleChange} placeholder="Nombre y Apellido" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Nickname *</label>
                <input type="text" name="p4_nick" required value={formData.p4_nick} onChange={handleChange} placeholder="Nickname en CS2" style={inputStyle} />
              </div>
            </div>
            <div style={gridTwoColsStyle}>
              <div>
                <label style={labelStyle}>URL del perfil de Steam *</label>
                <input type="url" name="p4_steam" required value={formData.p4_steam} onChange={handleChange} placeholder="https://steamcommunity.com/id/..." style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>URL del perfil de FACEIT *</label>
                <input type="url" name="p4_faceit" required value={formData.p4_faceit} onChange={handleChange} placeholder="https://www.faceit.com/es/players/..." style={inputStyle} />
              </div>
            </div>
          </div>

          {/* 17. Jugador Titular 5 */}
          <div style={playerCardStyle}>
            <div style={playerTitleStyle}>
              <span style={playerBadgeStyle}>5</span> Jugador Titular 5 <span style={{ color: 'var(--primary)' }}>*</span>
            </div>
            <div style={gridTwoColsStyle}>
              <div>
                <label style={labelStyle}>Nombre y Apellido *</label>
                <input type="text" name="p5_name" required value={formData.p5_name} onChange={handleChange} placeholder="Nombre y Apellido" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Nickname *</label>
                <input type="text" name="p5_nick" required value={formData.p5_nick} onChange={handleChange} placeholder="Nickname en CS2" style={inputStyle} />
              </div>
            </div>
            <div style={gridTwoColsStyle}>
              <div>
                <label style={labelStyle}>URL del perfil de Steam *</label>
                <input type="url" name="p5_steam" required value={formData.p5_steam} onChange={handleChange} placeholder="https://steamcommunity.com/id/..." style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>URL del perfil de FACEIT *</label>
                <input type="url" name="p5_faceit" required value={formData.p5_faceit} onChange={handleChange} placeholder="https://www.faceit.com/es/players/..." style={inputStyle} />
              </div>
            </div>
          </div>

          {/* 18. ¿El equipo inscribirá suplentes? */}
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px' }}>
            <label style={{ ...labelStyle, fontSize: '1.05rem', marginBottom: '1rem', display: 'block' }}>
              18. ¿El equipo inscribirá suplentes? <span style={{ color: 'var(--primary)' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {['No', 'Sí, 1 suplente', 'Sí, 2 suplentes'].map(op => (
                <label key={op} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  cursor: 'pointer',
                  padding: '0.6rem 1.1rem',
                  borderRadius: '8px',
                  background: formData.has_substitutes === op ? 'rgba(229, 9, 20, 0.15)' : 'rgba(0,0,0,0.3)',
                  border: formData.has_substitutes === op ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontWeight: 700
                }}>
                  <input
                    type="radio"
                    name="has_substitutes"
                    value={op}
                    checked={formData.has_substitutes === op}
                    onChange={handleChange}
                  />
                  <span>{op}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 19. Jugador Suplente 1 */}
          {(formData.has_substitutes === 'Sí, 1 suplente' || formData.has_substitutes === 'Sí, 2 suplentes') && (
            <div style={{ ...playerCardStyle, marginTop: '1.5rem', borderLeftColor: '#fbbf24' }}>
              <div style={playerTitleStyle}>
                <span style={{ ...playerBadgeStyle, background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24' }}>S1</span> Jugador Suplente 1 <span style={{ color: 'var(--primary)' }}>*</span>
              </div>
              <div style={gridTwoColsStyle}>
                <div>
                  <label style={labelStyle}>Nombre y Apellido *</label>
                  <input type="text" name="sub1_name" required value={formData.sub1_name} onChange={handleChange} placeholder="Nombre y Apellido" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Nickname *</label>
                  <input type="text" name="sub1_nick" required value={formData.sub1_nick} onChange={handleChange} placeholder="Nickname en CS2" style={inputStyle} />
                </div>
              </div>
              <div style={gridTwoColsStyle}>
                <div>
                  <label style={labelStyle}>URL del perfil de Steam *</label>
                  <input type="url" name="sub1_steam" required value={formData.sub1_steam} onChange={handleChange} placeholder="https://steamcommunity.com/id/..." style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>URL del perfil de FACEIT *</label>
                  <input type="url" name="sub1_faceit" required value={formData.sub1_faceit} onChange={handleChange} placeholder="https://www.faceit.com/es/players/..." style={inputStyle} />
                </div>
              </div>
            </div>
          )}

          {/* 20. Jugador Suplente 2 */}
          {formData.has_substitutes === 'Sí, 2 suplentes' && (
            <div style={{ ...playerCardStyle, marginTop: '1.5rem', borderLeftColor: '#fbbf24' }}>
              <div style={playerTitleStyle}>
                <span style={{ ...playerBadgeStyle, background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24' }}>S2</span> Jugador Suplente 2 <span style={{ color: 'var(--primary)' }}>*</span>
              </div>
              <div style={gridTwoColsStyle}>
                <div>
                  <label style={labelStyle}>Nombre y Apellido *</label>
                  <input type="text" name="sub2_name" required value={formData.sub2_name} onChange={handleChange} placeholder="Nombre y Apellido" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Nickname *</label>
                  <input type="text" name="sub2_nick" required value={formData.sub2_nick} onChange={handleChange} placeholder="Nickname en CS2" style={inputStyle} />
                </div>
              </div>
              <div style={gridTwoColsStyle}>
                <div>
                  <label style={labelStyle}>URL del perfil de Steam *</label>
                  <input type="url" name="sub2_steam" required value={formData.sub2_steam} onChange={handleChange} placeholder="https://steamcommunity.com/id/..." style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>URL del perfil de FACEIT *</label>
                  <input type="url" name="sub2_faceit" required value={formData.sub2_faceit} onChange={handleChange} placeholder="https://www.faceit.com/es/players/..." style={inputStyle} />
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '1.2rem', color: '#9ca3af', fontSize: '0.85rem', fontStyle: 'italic' }}>
            * Nota: Los suplentes deberán quedar registrados antes del cierre de inscripciones. Las sustituciones durante el torneo estarán sujetas al reglamento oficial.
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECCIÓN 4: DISPONIBILIDAD Y FASE PRESENCIAL                   */}
        {/* ------------------------------------------------------------- */}
        <div className="form-section-card" style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionNumberBadge}>4</div>
            <div>
              <h2 style={sectionTitleStyle}>DISPONIBILIDAD Y FASE PRESENCIAL</h2>
              <p style={sectionSubtitleStyle}>Compromiso de asistencia a la fase final en Santa Fe Capital</p>
            </div>
          </div>

          {/* 21. Asistencia presencial */}
          <div className="form-group" style={{ marginBottom: '1.8rem' }}>
            <label style={{ ...labelStyle, fontSize: '1rem', marginBottom: '0.8rem', display: 'block' }}>
              21. ¿El equipo dispone de 5 jugadores que puedan asistir presencialmente a Santa Fe Capital si clasifican? <span style={{ color: 'var(--primary)' }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {['Sí', 'No'].map(val => (
                <label key={val} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  cursor: 'pointer',
                  padding: '0.6rem 1.4rem',
                  borderRadius: '8px',
                  background: formData.can_attend_lan === val ? 'rgba(229, 9, 20, 0.15)' : 'rgba(0,0,0,0.3)',
                  border: formData.can_attend_lan === val ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontWeight: 700
                }}>
                  <input
                    type="radio"
                    name="can_attend_lan"
                    value={val}
                    checked={formData.can_attend_lan === val}
                    onChange={handleChange}
                  />
                  <span>{val}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 22. Localidad de viaje */}
          <div className="form-group">
            <label style={labelStyle}>
              22. ¿Desde qué localidad viajaría el equipo? <span style={{ color: 'var(--primary)' }}>*</span>
            </label>
            <input
              type="text"
              name="travel_from"
              required
              placeholder="Ej: Rosario, Córdoba, Buenos Aires, Santa Fe, etc."
              value={formData.travel_from}
              onChange={handleChange}
              style={{ ...inputStyle, maxWidth: '500px' }}
            />
            <span style={hintStyle}>En caso afirmativo, la organización informará los requisitos de autorización para participar, especialmente en la fase presencial.</span>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECCIÓN 5: INSCRIPCIÓN Y PAGO                                 */}
        {/* ------------------------------------------------------------- */}
        <div id="seccion-pago" className="form-section-card" style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionNumberBadge}>5</div>
            <div>
              <h2 style={sectionTitleStyle}>INSCRIPCIÓN Y PAGO</h2>
              <p style={sectionSubtitleStyle}>Validación de la tarifa de inscripción de la escuadra</p>
            </div>
          </div>

          {/* 23 y 24: Resumen de pago descriptivo */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.2rem',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            padding: '1.5rem',
            marginBottom: '1.8rem'
          }}>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                23. Importe de inscripción por equipo
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#4ade80' }}>
                AR$ 150.000
              </div>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Costo total por la escuadra completa</div>
            </div>

            <div>
              <div style={{ color: '#9ca3af', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                24. Medio de pago
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={22} color="var(--primary)" /> TRANSFERENCIA
              </div>
              <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Transferencia bancaria o billetera virtual</div>
            </div>
          </div>

          {/* DATOS BANCARIOS OFICIALES PARA LA TRANSFERENCIA */}
          <div style={{
            background: 'linear-gradient(145deg, rgba(245, 158, 11, 0.08) 0%, rgba(229, 9, 20, 0.05) 100%)',
            border: '2px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '14px',
            padding: '1.6rem',
            marginBottom: '1.8rem',
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ background: '#f59e0b', color: '#000', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}>
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff', fontWeight: 900, textTransform: 'uppercase' }}>
                    DATOS DE LA CUENTA PARA TRANSFERIR
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                    Realizá la transferencia por <strong>AR$ 150.000</strong> a la siguiente cuenta bancaria oficial:
                  </div>
                </div>
              </div>
              <span style={{ background: 'rgba(255, 115, 0, 0.2)', color: '#ff8800', border: '1px solid rgba(255, 115, 0, 0.4)', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800 }}>
                NARANJA X
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1rem',
              marginBottom: '1.2rem'
            }}>
              {/* Alias */}
              <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>
                    ALIAS DE TRANSFERENCIA
                  </span>
                  <strong style={{ fontSize: '1.25rem', color: '#f59e0b', letterSpacing: '0.5px', fontFamily: 'monospace' }}>
                    COPA.VIEJOGAMER
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('COPA.VIEJOGAMER', 'alias')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.45rem 0.85rem',
                    background: copiedField === 'alias' ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)',
                    color: copiedField === 'alias' ? '#22c55e' : '#fff',
                    border: copiedField === 'alias' ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {copiedField === 'alias' ? <><Check size={14} /> ¡Copiado!</> : <><Copy size={14} /> Copiar</>}
                </button>
              </div>

              {/* Cuenta */}
              <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>
                    NÚMERO DE CUENTA
                  </span>
                  <strong style={{ fontSize: '1.2rem', color: '#fff', letterSpacing: '0.5px', fontFamily: 'monospace' }}>
                    1838155882
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('1838155882', 'cuenta')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.45rem 0.85rem',
                    background: copiedField === 'cuenta' ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)',
                    color: copiedField === 'cuenta' ? '#22c55e' : '#fff',
                    border: copiedField === 'cuenta' ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {copiedField === 'cuenta' ? <><Check size={14} /> ¡Copiado!</> : <><Copy size={14} /> Copiar</>}
                </button>
              </div>

              {/* Titular */}
              <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>
                  NOMBRE DEL TITULAR
                </span>
                <strong style={{ fontSize: '1.05rem', color: '#fff' }}>
                  Mariano Ernesto Ponce Zavalla
                </strong>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.2rem' }}>
                  Destinatario verificado
                </div>
              </div>

              {/* CUIL / CUIT */}
              <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>
                    CUIL / CUIT DEL TITULAR
                  </span>
                  <strong style={{ fontSize: '1.15rem', color: '#fff', fontFamily: 'monospace' }}>
                    20362662975
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('20362662975', 'cuit')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.45rem 0.85rem',
                    background: copiedField === 'cuit' ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)',
                    color: copiedField === 'cuit' ? '#22c55e' : '#fff',
                    border: copiedField === 'cuit' ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {copiedField === 'cuit' ? <><Check size={14} /> ¡Copiado!</> : <><Copy size={14} /> Copiar</>}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '8px', padding: '0.8rem 1rem', fontSize: '0.85rem', color: '#86efac' }}>
              <CheckCircle2 size={18} color="#22c55e" style={{ flexShrink: 0 }} />
              <span>
                <strong>Importante:</strong> Transferí exactamente <strong>AR$ 150.000</strong>. Una vez realizada la transferencia, subí el comprobante debajo para que la organización valide el cupo de tu equipo.
              </span>
            </div>
          </div>

          {/* 25. Titular del pago */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>
              25. Nombre y apellido del titular que realiza el pago <span style={{ color: 'var(--primary)' }}>*</span>
            </label>
            <input
              type="text"
              name="payment_holder_name"
              required
              placeholder="Nombre y Apellido según figura en el comprobante bancario"
              value={formData.payment_holder_name}
              onChange={handleChange}
              style={{ ...inputStyle, maxWidth: '600px' }}
            />
          </div>

          {/* 26. Comprobante de pago */}
          <div className="form-group" style={{ marginBottom: '1.8rem' }}>
            <label style={labelStyle}>
              26. Comprobante de pago <span style={{ color: 'var(--primary)' }}>*</span>
            </label>
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              border: receiptFile ? '1px solid #4ade80' : '1px dashed rgba(229, 9, 20, 0.4)',
              borderRadius: '10px',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.2rem',
              flexWrap: 'wrap'
            }}>
              <input
                type="file"
                id="receipt-file-input"
                accept="application/pdf, image/png, image/jpeg, image/jpg"
                onChange={handleReceiptChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="receipt-file-input" style={{
                background: 'var(--primary)',
                color: '#fff',
                padding: '0.75rem 1.4rem',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 800,
                textTransform: 'uppercase'
              }}>
                <Upload size={16} /> {receiptFile ? 'Cambiar comprobante' : 'Subir Comprobante'}
              </label>

              {receiptFile ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#4ade80', fontWeight: 700 }}>
                  <FileText size={20} />
                  <span>{receiptFile.name} ({(receiptFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              ) : (
                <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                  Formatos permitidos: <strong>PDF, JPG o PNG</strong>. El comprobante es requerido para validar tu solicitud.
                </div>
              )}
            </div>
          </div>

          {/* 27. Casilla de Confirmación de Cupo */}
          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem',
            cursor: 'pointer',
            padding: '1.2rem',
            background: 'rgba(234, 179, 8, 0.08)',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            borderRadius: '10px'
          }}>
            <input
              type="checkbox"
              name="payment_confirm_check"
              checked={formData.payment_confirm_check}
              onChange={handleChange}
              required
              style={{ marginTop: '0.2rem', width: '18px', height: '18px', accentColor: 'var(--primary)' }}
            />
            <span style={{ fontSize: '0.92rem', color: '#e5e7eb', lineHeight: 1.5 }}>
              27. <strong>Confirmación:</strong> Entiendo que el cupo del equipo solo estará confirmado cuando la organización valide la inscripción y el pago correspondiente. <span style={{ color: 'var(--primary)' }}>*</span>
            </span>
          </label>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECCIÓN 6: REGLAMENTO Y CONDICIONES                           */}
        {/* ------------------------------------------------------------- */}
        <div className="form-section-card" style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionNumberBadge}>6</div>
            <div>
              <h2 style={sectionTitleStyle}>REGLAMENTO Y CONDICIONES</h2>
              <p style={sectionSubtitleStyle}>Aceptación obligatoria de los términos competitivos</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* 28. Aceptación del reglamento */}
            <label style={checkboxRowStyle}>
              <input
                type="checkbox"
                name="accepted_rules"
                checked={formData.accepted_rules}
                onChange={handleChange}
                required
                style={checkboxInputStyle}
              />
              <span style={checkboxTextStyle}>
                28. <strong>Aceptación del reglamento:</strong> Declaro haber leído y aceptado el reglamento oficial del torneo. <span style={{ color: 'var(--primary)' }}>*</span>
              </span>
            </label>

            {/* 29. Identidad de los jugadores */}
            <label style={checkboxRowStyle}>
              <input
                type="checkbox"
                name="accepted_identity"
                checked={formData.accepted_identity}
                onChange={handleChange}
                required
                style={checkboxInputStyle}
              />
              <span style={checkboxTextStyle}>
                29. <strong>Identidad de los jugadores:</strong> Confirmo que los jugadores y cuentas registrados corresponden a integrantes reales de mi equipo y que no se utilizarán cuentas de terceros. <span style={{ color: 'var(--primary)' }}>*</span>
              </span>
            </label>

            {/* 30. Juego limpio */}
            <label style={checkboxRowStyle}>
              <input
                type="checkbox"
                name="accepted_fairplay"
                checked={formData.accepted_fairplay}
                onChange={handleChange}
                required
                style={checkboxInputStyle}
              />
              <span style={checkboxTextStyle}>
                30. <strong>Juego limpio:</strong> Aceptamos las normas de juego limpio, las verificaciones de la organización y las sanciones previstas en el reglamento por trampas, suplantación de identidad u otras infracciones. <span style={{ color: 'var(--primary)' }}>*</span>
              </span>
            </label>

            {/* 31. Compromiso de participación */}
            <label style={checkboxRowStyle}>
              <input
                type="checkbox"
                name="accepted_commitment"
                checked={formData.accepted_commitment}
                onChange={handleChange}
                required
                style={checkboxInputStyle}
              />
              <span style={checkboxTextStyle}>
                31. <strong>Compromiso de participación:</strong> Confirmo que el equipo conoce el formato de competencia y se compromete a participar en la fase presencial en caso de clasificar, conforme a las fechas y condiciones oficiales. <span style={{ color: 'var(--primary)' }}>*</span>
              </span>
            </label>

            {/* 32. Difusión de datos públicos */}
            <label style={checkboxRowStyle}>
              <input
                type="checkbox"
                name="accepted_data_public"
                checked={formData.accepted_data_public}
                onChange={handleChange}
                required
                style={checkboxInputStyle}
              />
              <span style={checkboxTextStyle}>
                32. <strong>Difusión de datos públicos del equipo:</strong> Autorizo la publicación de nombres del equipo, TAG, nicknames, resultados y estadísticas competitivas en fixtures, redes sociales y transmisiones oficiales. <span style={{ color: 'var(--primary)' }}>*</span>
              </span>
            </label>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SECCIÓN 7: CONFIRMACIÓN FINAL & COMENTARIOS                  */}
        {/* ------------------------------------------------------------- */}
        <div className="form-section-card" style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <div style={sectionNumberBadge}>7</div>
            <div>
              <h2 style={sectionTitleStyle}>CONFIRMACIÓN FINAL</h2>
              <p style={sectionSubtitleStyle}>Mensajes o dudas previas para la organización</p>
            </div>
          </div>

          {/* 34. Comentarios opcionales */}
          <div className="form-group">
            <label style={labelStyle}>
              34. ¿Querés dejar algún comentario para la organización? <span style={{ color: '#9ca3af', fontWeight: 'normal' }}>(Opcional)</span>
            </label>
            <textarea
              name="comments"
              rows={4}
              placeholder="Escribí aquí cualquier aclaración, consulta o información adicional para El Viejo Gamer y Nostalgia Gamers..."
              value={formData.comments}
              onChange={handleChange}
              style={{
                ...inputStyle,
                resize: 'vertical',
                minHeight: '100px',
                lineHeight: 1.5
              }}
            />
          </div>

          {/* Botón de Envío */}
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <button
              type="submit"
              disabled={submitting}
              className="primary-btn glow-btn"
              style={{
                padding: '1.1rem 3rem',
                fontSize: '1.05rem',
                fontWeight: 900,
                letterSpacing: '1px',
                margin: '0 auto',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                borderRadius: '8px'
              }}
            >
              {submitting ? (
                <>
                  <div style={{ width: '20px', height: '20px', border: '3px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  <span>Enviando Inscripción...</span>
                </>
              ) : (
                <>
                  <Check size={20} />
                  <span>ENVIAR INSCRIPCIÓN OFICIAL</span>
                </>
              )}
            </button>

            <p style={{ marginTop: '1rem', color: '#9ca3af', fontSize: '0.85rem' }}>
              Al enviar, se enviarán todos los datos del equipo y el comprobante de transferencia a la administración.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

// Estilos Reutilizables
const sectionCardStyle = {
  background: '#121214',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  padding: '2.2rem',
  marginBottom: '2rem',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
};

const sectionHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  paddingBottom: '1.25rem',
  marginBottom: '1.8rem'
};

const sectionNumberBadge = {
  width: '38px',
  height: '38px',
  borderRadius: '50%',
  background: 'rgba(229, 9, 20, 0.2)',
  border: '2px solid var(--primary)',
  color: '#fff',
  fontWeight: 900,
  fontSize: '1.1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};

const sectionTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: 900,
  margin: 0,
  color: '#fff',
  letterSpacing: '1px'
};

const sectionSubtitleStyle = {
  fontSize: '0.88rem',
  color: '#9ca3af',
  margin: '0.2rem 0 0'
};

const gridTwoColsStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1.25rem',
  marginBottom: '1.25rem'
};

const labelStyle = {
  display: 'block',
  fontSize: '0.88rem',
  fontWeight: 800,
  color: '#e5e7eb',
  marginBottom: '0.5rem',
  letterSpacing: '0.3px'
};

const inputStyle = {
  width: '100%',
  padding: '0.85rem 1rem',
  background: 'rgba(0, 0, 0, 0.45)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '0.92rem',
  outline: 'none',
  transition: 'border-color 0.2s ease',
  boxSizing: 'border-box'
};

const hintStyle = {
  display: 'block',
  fontSize: '0.78rem',
  color: '#9ca3af',
  marginTop: '0.35rem',
  lineHeight: 1.4
};

const playerCardStyle = {
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.07)',
  borderLeft: '4px solid var(--primary)',
  borderRadius: '10px',
  padding: '1.5rem',
  marginBottom: '1.25rem'
};

const playerTitleStyle = {
  fontSize: '1rem',
  fontWeight: 800,
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

const playerBadgeStyle = {
  background: 'rgba(229, 9, 20, 0.2)',
  color: 'var(--primary)',
  padding: '0.2rem 0.55rem',
  borderRadius: '4px',
  fontSize: '0.8rem',
  fontWeight: 900
};

const checkboxRowStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.85rem',
  cursor: 'pointer',
  padding: '0.9rem',
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '8px',
  transition: 'background 0.2s ease'
};

const checkboxInputStyle = {
  marginTop: '0.2rem',
  width: '18px',
  height: '18px',
  accentColor: 'var(--primary)',
  flexShrink: 0
};

const checkboxTextStyle = {
  fontSize: '0.9rem',
  color: '#e5e7eb',
  lineHeight: 1.5
};
