import './ElTaller.css';

const ElTaller = () => {
  return (
    <div className="el-taller">
      <section className="taller-hero">
        <h1>El Taller</h1>
        <p className="taller-subtitle">Nuestra historia y filosofía</p>
      </section>

      <section className="taller-content">
        <div className="container">
          <div className="taller-section">
            <h2>¿Qué es Tirùa?</h2>
            <p>
              Tirùa es un taller de cerámica artesanal ubicado en San Rafael, Mendoza, Argentina. 
              Nos dedicamos a la creación de piezas únicas, donde cada trabajo refleja la pasión 
              y el cuidado del proceso artesanal.
            </p>
          </div>

          <div className="taller-section">
            <h2>Nuestra Filosofía</h2>
            <p>
              Creemos en el trabajo manual, en el proceso lento y cuidadoso que transforma la arcilla 
              en arte. Cada pieza que sale de nuestro taller lleva consigo la esencia del trabajo 
              artesanal, la dedicación y el amor por la cerámica.
            </p>
          </div>

          <div className="taller-section">
            <h2>Trabajo Manual</h2>
            <p>
              En Tirùa, cada pieza es única. No utilizamos moldes en serie, sino que trabajamos 
              cada creación de manera individual, dando forma a la arcilla con nuestras propias manos, 
              creando piezas que cuentan historias y transmiten emociones.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ElTaller;

