import './Clases.css';

const Clases = () => {
  return (
    <div className="clases">
      <section className="clases-hero">
        <h1>Clases</h1>
        <p className="clases-subtitle">Aprende el arte de la cerámica</p>
      </section>

      <section className="clases-content">
        <div className="container">
          <div className="clases-intro">
            <h2>Nuestras Clases</h2>
            <p>
              En Tirùa ofrecemos clases para todos los niveles, desde principiantes hasta 
              ceramistas avanzados. Aprende técnicas tradicionales y modernas en un ambiente 
              cálido y artesanal.
            </p>
          </div>

          <div className="clases-info">
            <div className="info-card">
              <h3>Nivel Inicial</h3>
              <p>Perfecto para quienes se inician en el mundo de la cerámica</p>
            </div>
            <div className="info-card">
              <h3>Nivel Intermedio</h3>
              <p>Para quienes ya tienen conocimientos básicos y quieren profundizar</p>
            </div>
            <div className="info-card">
              <h3>Nivel Avanzado</h3>
              <p>Técnicas avanzadas y proyectos personalizados</p>
            </div>
          </div>

          <div className="contact-info">
            <p>
              Para más información sobre horarios y disponibilidad, 
              <a href="/contacto"> contáctanos</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Clases;

