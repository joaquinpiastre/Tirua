import { Link } from 'react-router-dom';
import './ElTaller.css';

const ElTaller = () => {
  return (
    <div className="el-taller">
      <section className="taller-hero">
        <h1 className="page-title">El Taller</h1>
        <p className="taller-subtitle">Un espacio creativo para chicos y escuelas</p>
      </section>

      <section className="taller-content">
        <div className="container">
          <div className="taller-section taller-section-with-photo">
            <div className="taller-section-text">
              <h2 className="taller-section-title">¿Qué es Tirùa?</h2>
              <p>
                Este espacio nace en 2008. Es nuestro taller en San Rafael, Mendoza, donde juntamos arte, juego y aprendizaje: 
                un lugar donde los chicos exploran, crean y se divierten con un montón de actividades.
              </p>
            </div>
            <div className="taller-section-photo">
              <div className="taller-photo-wrap">
                <img src="/fotos/el-taller-espacio.jpg" alt="Espacio del taller" onLoad={(e) => e.target.closest('.taller-photo-wrap')?.classList.add('loaded')} onError={(e) => { e.target.style.display = 'none'; e.target.closest('.taller-photo-wrap')?.classList.remove('loaded'); }} />
                <div className="taller-photo-placeholder"><span>Foto del espacio</span></div>
              </div>
            </div>
          </div>

          <div className="taller-section">
            <h2 className="taller-section-title">Cómo lo hacemos</h2>
            <p>
              Creemos que se aprende haciendo y jugando. Por eso cada actividad está pensada para 
              que desarrollen creatividad, manos a la obra y vínculo con la naturaleza, mientras 
              se divierten y conocen a otros chicos.
            </p>
          </div>

          <div className="taller-section taller-section-with-photo">
            <div className="taller-section-photo">
              <div className="taller-photo-wrap">
                <img src="/fotos/el-taller-escuelas.jpg" alt="Escuelas en el taller" onLoad={(e) => e.target.closest('.taller-photo-wrap')?.classList.add('loaded')} onError={(e) => { e.target.style.display = 'none'; e.target.closest('.taller-photo-wrap')?.classList.remove('loaded'); }} />
                <div className="taller-photo-placeholder"><span>Escuelas en el taller</span></div>
              </div>
            </div>
            <div className="taller-section-text">
              <h2 className="taller-section-title">Para escuelas</h2>
              <p>
                Recibimos a escuelas de educación inicial, primaria, secundaria, terciaria, 
                Centros de Educación Especial y grupos familiares o de adultos. La modalidad es 
                <strong> Paseo Pedagógico</strong>: una jornada con dos proyectos (pintura y modelado), 
                recreo al aire libre y actividades que articulan con el Programa Nacional. Armamos un espacio 
                seguro con seguro y Servicio de Emergencias.
              </p>
              <Link to="/escuelas" className="taller-link-escuelas">
                Ver Proyecto Escuelas 2026 y reservar →
              </Link>
            </div>
          </div>

          <div className="taller-section">
            <h2 className="taller-section-title">Nuestra forma de trabajar</h2>
            <p>
              Cada chico es distinto y lo tenemos en cuenta. Adaptamos todo por edades y trabajamos 
              con grupos chicos (máximo 15 por estación) para poder acompañar bien a cada uno y 
              que el ambiente sea cuidado para todos.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ElTaller;



