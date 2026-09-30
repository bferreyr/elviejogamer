import { ChevronRight, Monitor, Users, Zap, Cast, Cpu, MonitorPlay, Keyboard, Headset, Armchair, Wifi, Server, Cctv, MessageCircle } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="glitch-wrapper">
            <h1 className="glitch" data-text="QUE NO TE LA CUENTEN">QUE NO TE LA CUENTEN</h1>
          </div>
          <p className="subtitle">El primer LAN Room exclusivo de Santa Fe Capital. 5v5, Bootcamps y la mejor experiencia esports.</p>
          <div className="hero-actions">
            <a href="#reservas" className="primary-btn">
              <span>Reservar Ahora</span>
              <ChevronRight />
            </a>
            <a href="https://www.instagram.com/elviejo.gamer" target="_blank" rel="noreferrer" className="secondary-btn">
              Ver Instagram
            </a>
          </div>
        </div>
      </header>

      {/* Experiencia Section */}
      <section id="experiencia" className="features">
        <div className="section-header">
          <h2>VIVÍ LA <span className="text-gradient">EXPERIENCIA</span></h2>
          <p>Diseñado por y para gamers. Todo lo que necesitas para tu equipo.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon-wrapper"><Monitor /></div>
            <h3>Setups</h3>
            <p>10 PCs de última generación preparadas para darte los máximos FPS en tus juegos competitivos favoritos.</p>
          </div>
          <div className="feature-card">
            <div className="icon-wrapper"><Users /></div>
            <h3>Sala 5v5 Exclusiva</h3>
            <p>Espacio optimizado para equipos y amigos. Comunicación perfecta y ambiente libre de distracciones.</p>
          </div>
          <div className="feature-card">
            <div className="icon-wrapper"><Zap /></div>
            <h3>Esports Bootcamps</h3>
            <p>El entorno ideal para entrenar con tu team antes de un torneo. Concéntrate solo en ganar.</p>
          </div>
          <div className="feature-card">
            <div className="icon-wrapper"><Cast /></div>
            <h3>Streaming</h3>
            <p>El lugar está preparado con una sala para que puedas streamear tus partidos.</p>
          </div>
        </div>
      </section>

      {/* Banner Info */}
      <section className="info-banner">
        <div className="info-content">
          <div className="info-item">
            <h2>ZONA CENTRO</h2>
            <p>Santa Fe Capital</p>
          </div>
          <div className="divider"></div>
          <div className="info-item">
            <h2>2 HS MÍNIMO</h2>
            <p>Por equipo para reservas</p>
          </div>
          <div className="divider"></div>
          <div className="info-item">
            <h2>10 PCs</h2>
            <p>Listas para jugar</p>
          </div>
        </div>
      </section>

      {/* Setup Section */}
      <section id="setup" className="setup-section">
        <div className="section-header">
          <h2>NUESTRO <span className="text-gradient">SETUP</span></h2>
          <p>Hardware de primer nivel para que rindas al máximo en cada partida.</p>
        </div>
        <div className="interactive-pc">
          <img src="/assets/pc_inside.jpg" alt="Interior de la PC El Viejo Gamer" className="pc-image" />
          <div className="hotspot" style={{top: '40%', left: '41%'}}>
            <div className="hotspot-pulse"></div>
            <div className="hotspot-content">
              <h5>Procesador & Refri</h5>
              <p>AMD Ryzen 5 5600G con Refrigeracion por Aire.</p>
            </div>
          </div>
          <div className="hotspot" style={{top: '65%', left: '43%'}}>
            <div className="hotspot-pulse"></div>
            <div className="hotspot-content">
              <h5>Placa de Video</h5>
              <p>NVIDIA GeForce RTX 1660 para exprimir al máximo tus FPS.</p>
            </div>
          </div>
          <div className="hotspot" style={{top: '37%', left: '49%'}}>
            <div className="hotspot-pulse"></div>
            <div className="hotspot-content">
              <h5>Memoria RAM</h5>
              <p>16GB a 3200MHz. Latencia Ultra Baja.</p>
            </div>
          </div>
          <div className="hotspot" style={{top: '85%', left: '35%'}}>
            <div className="hotspot-pulse"></div>
            <div className="hotspot-content">
              <h5>Fuente de Energía</h5>
              <p>650W Certificada 80 Plus lista para aguantar largas jornadas de juego.</p>
            </div>
          </div>
        </div>
        <div className="setup-grid">
          <div className="setup-item">
            <Cpu />
            <h4>PC's Competitivas</h4>
            <p>Equipos armados para mantener +300 FPS estables en juegos como CS2, Valorant y LoL.</p>
          </div>
          <div className="setup-item">
            <MonitorPlay />
            <h4>Monitores 144Hz+</h4>
            <p>Monitores de alta tasa de refresco para no perderte ni un solo frame en la acción.</p>
          </div>
          <div className="setup-item">
            <Keyboard />
            <h4>Periféricos</h4>
            <p>Teclado y Mouse incluídos. Se recomienda traer los propios</p>
          </div>
          <div className="setup-item">
            <Headset />
            <h4>Audio Inmersivo</h4>
            <p>Lugar precisamente diseñado para tener la mejor comunicación en equipo.</p>
          </div>
          <div className="setup-item">
            <Armchair />
            <h4>Sillas Gamers</h4>
            <p>Sillas ergonómicas preparadas para darte soporte en bootcamps largas.</p>
          </div>
          <div className="setup-item">
            <Wifi />
            <h4>Fibra Óptica</h4>
            <p>Conexión de ultra baja latencia dedicada, cero packet loss y ping estable.</p>
          </div>
          <div className="setup-item">
            <Server />
            <h4>Servidores LAN</h4>
            <p>Contamos con servidores para jugar LAN a CS2</p>
          </div>
          <div className="setup-item">
            <Cctv />
            <h4>Grabamos tus partidas</h4>
            <p>Contamos con HLTV para que puedas revivir tus mejores momentos</p>
          </div>
        </div>
      </section>

      {/* Reservas Section */}
      <section id="reservas" className="booking">
        <div className="booking-container">
          <div className="booking-content">
            <h2>¿QUÉ ESPERÁS PARA VIVIR LA EXPERIENCIA?</h2>
            <p>Asegurá tu puesto y el de tu equipo hoy mismo. Requerimos una seña del 50% para confirmar la reserva.</p>
            <div className="booking-steps">
              <div className="step">
                <div className="step-number">1</div>
                <p>Escribinos por WhatsApp indicando fecha y hora.</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <p>Aboná el 50% de seña para asegurar el lugar.</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <p>Vení con tu equipo y rompanla.</p>
              </div>
            </div>
            <a href="https://wa.me/5493425900075" className="primary-btn glow-btn" target="_blank" rel="noreferrer">
              <MessageCircle /> Reservar por WhatsApp
            </a>
          </div>
          <div className="booking-image">
            <div className="glow-orb"></div>
            <img src="/assets/logo.jpg" alt="Logo El Viejo Gamer" className="floating-logo" />
          </div>
        </div>
      </section>
    </>
  );
}
