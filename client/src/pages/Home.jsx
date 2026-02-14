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
              <p className="hero-subtitle">Taller de Cerámica Artesanal</p>
              <p className="hero-description">
                Un espacio donde la arcilla se transforma en arte, 
                donde cada pieza cuenta una historia única y lleva 
                consigo la esencia del trabajo artesanal.
              </p>
              <div className="hero-buttons">
                {!isAuthenticated && (
                  <Link to="/register" className="btn-primary btn-hero">
                    Sumarte al Taller
                  </Link>
                )}
                <Link to="/el-taller" className="btn-secondary btn-hero">
                  Conocer más
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
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3>Trabajo Artesanal</h3>
              <p>Cada pieza es única, creada con técnicas tradicionales y el cuidado de nuestras manos.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h3>Calidad Premium</h3>
              <p>Utilizamos los mejores materiales y procesos para garantizar la durabilidad de cada creación.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <h3>Pasión y Dedicación</h3>
              <p>Amamos lo que hacemos y eso se refleja en cada detalle de nuestras piezas.</p>
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
                En nuestro taller de cerámica ubicado en San Rafael, Mendoza, cada creación 
                es única. Trabajamos con técnicas tradicionales y modernas para dar vida a 
                piezas que reflejan la pasión y dedicación de cada artesano.
              </p>
              <p className="about-description">
                Creemos en el proceso lento y cuidadoso que transforma la arcilla en arte. 
                Cada pieza que sale de nuestro taller lleva consigo la esencia del trabajo 
                manual, la dedicación y el amor por la cerámica.
              </p>
              <Link to="/el-taller" className="btn-primary">
                Conocer nuestra historia
              </Link>
            </div>
            <div className="about-visual">
              <div className="about-card">
                <div className="card-content">
                  <span className="card-number">+100</span>
                  <span className="card-label">Piezas creadas</span>
                </div>
              </div>
              <div className="about-card">
                <div className="card-content">
                  <span className="card-number">100%</span>
                  <span className="card-label">Artesanal</span>
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

