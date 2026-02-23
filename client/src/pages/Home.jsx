import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReviewsSection from '../components/ReviewsSection';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="hero-content-wrapper">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Tirùa</h1>
              <p className="hero-subtitle">Taller creativo para niñas, niños y escuelas</p>
              <p className="hero-description">
                Acá conectamos el arte con la naturaleza, la tecnología y la creatividad. 
                Actividades para jugar, crear y aprender, adaptadas por edad para que cada 
                uno explore a su manera.
              </p>
              <div className="hero-buttons">
                {!isAuthenticated && (
                  <Link to="/register" className="btn-primary btn-hero">
                    Inscribir a mi hijo/a
                  </Link>
                )}
                <Link to="/clases" className="btn-secondary btn-hero">
                  Ver Actividades
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <div className="ceramic-placeholder">
                <div className="ceramic-glow"></div>
                <img src="/Logo.jpg" alt="Tirùa Logo" className="logo-in-circle" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title section-title-taller">¿Por qué venir al taller?</h2>
          <div className="features-grid">
            <Link to="/escuelas" className="feature-card feature-card-link">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>Para chicos y escuelas</h3>
              <p>Paseo Pedagógico para escuelas: inicial, primaria, secundaria y más. Reservas por WhatsApp.</p>
              <span className="feature-card-cta">Ver Proyecto Escuelas 2026 →</span>
            </Link>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3>Un montón de actividades</h3>
              <p>Cerámica, huerta, mariposario, tecnología, música, cocina y más. Arte y naturaleza juntos.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
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

      <section className="home-gallery">
        <div className="container">
          <h2 className="section-title section-title-taller">Así es el taller</h2>
          <p className="gallery-intro">Algunas fotos del espacio y de lo que hacemos</p>
          <div className="gallery-grid">
            <div className="gallery-item">
              <img src="/fotos/taller-1.jpg" alt="Espacio del taller Tirùa" onLoad={(e) => e.target.closest('.gallery-item')?.classList.add('loaded')} onError={(e) => { e.target.style.display = 'none'; e.target.closest('.gallery-item')?.classList.remove('loaded'); }} />
              <div className="gallery-placeholder"><span>Foto del taller</span></div>
            </div>
            <div className="gallery-item">
              <img src="/fotos/taller-2.jpg" alt="Actividades con niños" onLoad={(e) => e.target.closest('.gallery-item')?.classList.add('loaded')} onError={(e) => { e.target.style.display = 'none'; e.target.closest('.gallery-item')?.classList.remove('loaded'); }} />
              <div className="gallery-placeholder"><span>Actividades</span></div>
            </div>
            <div className="gallery-item">
              <img src="/fotos/taller-3.jpg" alt="Niños creando" onLoad={(e) => e.target.closest('.gallery-item')?.classList.add('loaded')} onError={(e) => { e.target.style.display = 'none'; e.target.closest('.gallery-item')?.classList.remove('loaded'); }} />
              <div className="gallery-placeholder"><span>Creando</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="section-title-taller">Bienvenidos al taller</h2>
              <p className="about-description">
                En San Rafael, Mendoza, tenemos un espacio donde mezclamos arte, juego y aprendizaje. 
                Vienen chicos y escuelas a explorar, crear y pasarla bien.
              </p>
              <p className="about-description">
                Organizamos todo por edades en tres estaciones: Semillero (5-7), Laboratorio (8-11) 
                y Aprendíz (12-15). Grupos chicos para que cada uno tenga su lugar.
              </p>
              <Link to="/clases" className="btn-primary">
                Ver actividades
              </Link>
            </div>
            <div className="about-visual">
              <div className="about-card">
                <div className="card-content">
                  <span className="card-number">3</span>
                  <span className="card-label">Estaciones por edades</span>
                </div>
              </div>
              <div className="about-card">
                <div className="card-content">
                  <span className="card-number">15</span>
                  <span className="card-label">Niños máximo por grupo</span>
                </div>
              </div>
              <div className="about-card">
                <div className="card-content">
                  <span className="card-number">11</span>
                  <span className="card-label">Actividades diferentes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ReviewsSection />
    </div>
  );
};

export default Home;

