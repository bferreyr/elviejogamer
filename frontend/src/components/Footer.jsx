export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-logo">
          <img src="/assets/logo.jpg" alt="El Viejo Gamer" />
          <span>EL VIEJO GAMER</span>
        </div>
        <div className="footer-social">
          <a href="https://www.instagram.com/elviejo.gamer" target="_blank" rel="noreferrer" style={{color: 'white', textDecoration: 'none'}}>
            Instagram
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 El Viejo Gamer. Todos los derechos reservados. Santa Fe Capital, Argentina.</p>
        <p>Powered by Nostalgia Gamers.</p>
      </div>
    </footer>
  );
}
