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
              <p className="hero-subtitle">Taller Creativo para Niños y Escuelas</p>
              <p className="hero-description">
                Un espacio donde los niños conectan el arte con la naturaleza, 
                la tecnología y la creatividad. Actividades recreativas y educativas 
                adaptadas por edades para que cada niño explore y descubra sus pasiones.
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
          <h2 className="section-title">¿Por qué elegir Tirùa?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>Para Niños y Escuelas</h3>
              <p>Especialmente diseñado para que las escuelas traigan a sus estudiantes. Actividades adaptadas por edades.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3>Múltiples Actividades</h3>
              <p>Cerámica, huerta, mariposario, tecnología, música, cocina y más. Conectamos el arte con la naturaleza.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3>Ambiente Seguro</h3>
              <p>Grupos reducidos (máximo 15 niños), seguro incluido y servicio de emergencia. Todo incluido en la cuota.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Bienvenidos a Tirùa</h2>
              <p className="about-description">
                En nuestro taller creativo ubicado en San Rafael, Mendoza, conectamos el arte 
                con múltiples actividades recreativas y educativas. Especialmente diseñado para 
                niños y escuelas, ofrecemos un espacio seguro donde los más pequeños pueden 
                explorar, crear y aprender.
              </p>
              <p className="about-description">
                Adaptamos nuestras actividades por edades en tres estaciones: Semillero (5-7 años), 
                Laboratorio (8-11 años) y Aprendíz (12-15 años). Cada grupo tiene cupos limitados 
                para garantizar atención personalizada y un ambiente seguro para todos.
              </p>
              <Link to="/clases" className="btn-primary">
                Ver nuestras actividades
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

