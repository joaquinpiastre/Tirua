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
              <h1 className="hero-title">Tirúa</h1>
              <p className="hero-subtitle">Taller creativo para niños.
                Proyectos educativos para escuelas y grupos.
              </p>
              <p className="hero-description">
                Niños, Arte y Naturaleza en un espacio exclusivo y proyectado para desarrollar actividades Educativas y Recreativas.
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
          <h2 className="section-title section-title-taller">Tirua es...</h2>
          <div className="home-cuadrantes">
            <div className="home-cuadrante home-cuadrante-espacio-ideal">
              <h3 className="home-cuadrante-title">El espacio ideal</h3>
              <ul className="home-cuadrante-lista">
                <li><span className="home-check" aria-hidden="true">✓</span> Naturaleza: parque, huerta y mariposario</li>
                <li><span className="home-check" aria-hidden="true">✓</span> Aulas amplias, cómodas y seguras</li>
                <li><span className="home-check" aria-hidden="true">✓</span> Equipamiento y amoblamiento adaptados para niños</li>
              </ul>
            </div>
            <div className="home-cuadrante home-cuadrante-experiencia">
              <h3 className="home-cuadrante-title">16 años de experiencia</h3>
              <p className="home-cuadrante-texto">
                Desarrollando actividades orientadas a crear un ámbito de conocimiento, aprendizaje y expresión a través del Arte.
              </p>
            </div>
            <div className="home-cuadrante home-cuadrante-propuestas">
              <h3 className="home-cuadrante-title">Propuestas únicas</h3>
              <ul className="home-cuadrante-lista">
                <li><span className="home-check" aria-hidden="true">✓</span> Talleres permanentes: abrimos las puertas a la creatividad, expresión, confianza, autoestima e interacción grupal.</li>
                <li><span className="home-check" aria-hidden="true">✓</span> Visitas: es un placer recibir a grupos de educación inicial, primaria, secundaria, terciaria y Centros de Educación Especial.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="home-gallery">
        <div className="container">
          <h2 className="section-title section-title-taller">Momentos...</h2>
          <p className="gallery-intro">Algunas fotos del espacio y de lo que hacemos</p>
          <div className="gallery-grid">
            <div className="gallery-item">
              <img src="/FOTOTALLER.png" alt="Foto del taller Tirùa" onLoad={(e) => e.target.closest('.gallery-item')?.classList.add('loaded')} onError={(e) => { e.target.style.display = 'none'; e.target.closest('.gallery-item')?.classList.remove('loaded'); }} />
              <div className="gallery-placeholder"><span>Foto del taller</span></div>
            </div>
            <div className="gallery-item">
              <img src="/ACTIVIDADES.jpeg" alt="Actividades con niños" onLoad={(e) => e.target.closest('.gallery-item')?.classList.add('loaded')} onError={(e) => { e.target.style.display = 'none'; e.target.closest('.gallery-item')?.classList.remove('loaded'); }} />
              <div className="gallery-placeholder"><span>Actividades</span></div>
            </div>
            <div className="gallery-item">
              <img src="/CREANDO.png" alt="Niños creando" onLoad={(e) => e.target.closest('.gallery-item')?.classList.add('loaded')} onError={(e) => { e.target.style.display = 'none'; e.target.closest('.gallery-item')?.classList.remove('loaded'); }} />
              <div className="gallery-placeholder"><span>Creando</span></div>
            </div>
          </div>
        </div>
      </section>

      <ReviewsSection />
    </div>
  );
};

export default Home;

