export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-logo">
          <img src="/assets/logo.jpg" alt="El Viejo Gamer" />
          <span>EL VIEJO GAMER</span>
        </div>
        <div className="footer-social">
          <a href="https://www.instagram.com/elviejo.gamer" target="_blank" rel="noreferrer" style={{color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
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
