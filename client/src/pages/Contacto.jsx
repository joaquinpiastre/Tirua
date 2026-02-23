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
              <a
                href="https://wa.me/542604318857"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card-compact contact-card-whatsapp"
              >
                <div className="card-icon-compact">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div className="card-content-compact">
                  <h3>WhatsApp (reservas escuelas)</h3>
                  <span className="contact-link-compact">
                    2604 318857
                  </span>
                  <p className="contact-card-note">Reservas para visitas de escuelas únicamente por WhatsApp</p>
                </div>
              </a>

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

