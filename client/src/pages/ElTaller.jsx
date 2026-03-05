import { Link } from 'react-router-dom';
import './ElTaller.css';

const ElTaller = () => {
  return (
    <div className="el-taller">
      <section className="taller-hero">
        <h1 className="page-title">Tirùa</h1>
        <p className="taller-subtitle">Como espacio creativo </p>
      </section>

      <section className="taller-content">
        <div className="container">
          <div className="taller-bienvenidos">
            <div className="taller-bienvenidos-content">
              <h2 className="taller-bienvenidos-title">Bienvenidos</h2>
              <p className="taller-bienvenidos-texto">
                Diseñamos y creamos un espacio para niños donde habita el Arte, con propuestas educativas y recreativas para experimentarlo.
              </p>
            </div>
          </div>

          <div className="taller-features-grid">
            <Link to="/escuelas" className="taller-feature-card taller-feature-card-link">
              <div className="taller-feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>Para chicos y escuelas</h3>
              <p>Paseo Pedagógico para escuelas: inicial, primaria, secundaria y más. Reservas por WhatsApp.</p>
              <span className="taller-feature-cta">Ver Proyecto Escuelas 2026 →</span>
            </Link>
            <div className="taller-feature-card">
              <div className="taller-feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3>Un montón de actividades</h3>
              <p>Cerámica, huerta, mariposario, tecnología, música, cocina y más. Arte y naturaleza juntos.</p>
            </div>
            <div className="taller-feature-card">
              <div className="taller-feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3>Un lugar cuidado</h3>
              <p>Grupos chicos (máx. 15), seguro y servicio de emergencia. Todo incluido.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ElTaller;



