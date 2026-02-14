import './Contacto.css';

const Contacto = () => {
  return (
    <div className="contacto">
      <section className="contacto-hero">
        <div className="hero-pattern-contact"></div>
        <div className="hero-content-contact">
          <h1>Contacto</h1>
          <p className="contacto-subtitle">Estamos aquí para ayudarte</p>
        </div>
      </section>

      <section className="contacto-content">
        <div className="container">
          <div className="contact-compact-grid">
            <div className="contact-info-compact">
              <div className="contact-card-compact">
                <div className="card-icon-compact">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div className="card-content-compact">
                  <h3>Email</h3>
                  <a href="mailto:tiruarte@hotmail.com" className="contact-link-compact">
                    tiruarte@hotmail.com
                  </a>
                </div>
              </div>

              <a
                href="https://www.facebook.com/TallerDeCeramicaTirua?locale=es_LA"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card-compact"
              >
                <div className="card-icon-compact">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div className="card-content-compact">
                  <h3>Facebook</h3>
                  <span className="contact-link-compact">
                    @TallerDeCeramicaTirua
                  </span>
                </div>
              </a>

              <a
                href="https://www.instagram.com/tiruataller/"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card-compact"
              >
                <div className="card-icon-compact">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div className="card-content-compact">
                  <h3>Instagram</h3>
                  <span className="contact-link-compact">
                    @tiruataller
                  </span>
                </div>
              </a>
            </div>

            <div className="map-section-compact">
              <div className="map-header-compact">
                <h2>Nuestra Ubicación</h2>
                <p className="location-text-compact">San Rafael, Mendoza, Argentina</p>
              </div>
              <div className="map-container-compact">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.938303071647!2d-68.38102479999999!3d-34.605721599999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967909ab151dbb9b%3A0x6bef83e8e86f8735!2sTIRUA%20ARTE%20Y%20CERAMICA!5e0!3m2!1ses!2sar!4v1771020697235!5m2!1ses!2sar"
                  width="100%"
                  height="350"
                  style={{ border: 0, borderRadius: '12px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de Tirùa Taller de Cerámica - San Rafael, Mendoza"
                ></iframe>
                <a
                  href="https://maps.app.goo.gl/L1NtgDbLsosWZZc69"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-link-compact"
                >
                  Abrir en Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contacto;

