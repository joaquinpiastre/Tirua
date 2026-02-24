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
          <div className="taller-section taller-section-with-photo">
            <div className="taller-section-text">
              <h2 className="taller-section-title">Bienvenidos</h2>
              <p>
              Diseñamos y creamos un espacio para niños donde habita el Arte con propuestas educativas y recreativas para experimentarlo
              </p>
            </div>
            <div className="taller-section-photo">
              <div className="taller-photo-wrap">
                <img src="/fotos/el-taller-espacio.jpg" alt="Espacio del taller" onLoad={(e) => e.target.closest('.taller-photo-wrap')?.classList.add('loaded')} onError={(e) => { e.target.style.display = 'none'; e.target.closest('.taller-photo-wrap')?.classList.remove('loaded'); }} />
                <div className="taller-photo-placeholder"><span>Foto del espacio</span></div>
              </div>
            </div>
          </div>

          <div className="taller-cuadrantes">
            <div className="taller-cuadrante">
              <h2 className="taller-cuadrante-title">El espacio ideal</h2>
              <ul className="taller-cuadrante-lista">
                <li><span className="taller-check" aria-hidden="true">✓</span> Naturaleza: parque, huerta y mariposario</li>
                <li><span className="taller-check" aria-hidden="true">✓</span> Aulas amplias, cómodas y seguras</li>
                <li><span className="taller-check" aria-hidden="true">✓</span> Equipamiento y amoblamiento adaptados para niños</li>
              </ul>
            </div>

            <div className="taller-cuadrante">
              <h2 className="taller-cuadrante-title">16 años de experiencia</h2>
              <p className="taller-cuadrante-texto">
                Desarrollando actividades orientadas a crear un ámbito de conocimiento, aprendizaje y expresión a través del Arte.
              </p>
            </div>

            <div className="taller-cuadrante">
              <h2 className="taller-cuadrante-title">Propuestas únicas</h2>
              <ul className="taller-cuadrante-lista">
                <li><span className="taller-check" aria-hidden="true">✓</span> Talleres permanentes: abrimos las puertas a la creatividad, expresión, confianza, autoestima e interacción grupal.</li>
                <li><span className="taller-check" aria-hidden="true">✓</span> Visitas: es un placer recibir a grupos de educación inicial, primaria, secundaria, terciaria y Centros de Educación Especial.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ElTaller;



