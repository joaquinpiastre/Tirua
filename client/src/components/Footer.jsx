import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Tirùa</h3>
            <p>Taller de Cerámica Artesanal</p>
            <p>San Rafael, Mendoza, Argentina</p>
          </div>
          
          <div className="footer-section">
            <h3>Contacto</h3>
            <p>
              <a href="mailto:tiruarte@hotmail.com">tiruarte@hotmail.com</a>
            </p>
          </div>
          
          <div className="footer-section">
            <h3>Redes Sociales</h3>
            <div className="footer-social">
              <a
                href="https://www.facebook.com/TallerDeCeramicaTirua?locale=es_LA"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/tiruataller/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Tirùa. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



