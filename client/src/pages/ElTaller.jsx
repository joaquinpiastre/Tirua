import './ElTaller.css';

const ElTaller = () => {
  return (
    <div className="el-taller">
      <section className="taller-hero">
        <h1>El Taller</h1>
        <p className="taller-subtitle">Un espacio creativo para niños y escuelas</p>
      </section>

      <section className="taller-content">
        <div className="container">
          <div className="taller-section">
            <h2>¿Qué es Tirùa?</h2>
            <p>
              Tirùa es un taller creativo ubicado en San Rafael, Mendoza, Argentina, 
              especialmente diseñado para niños y escuelas. Conectamos el arte con múltiples 
              actividades recreativas y educativas, creando un espacio donde los más pequeños 
              pueden explorar, crear y aprender de manera divertida.
            </p>
          </div>

          <div className="taller-section">
            <h2>Nuestra Filosofía</h2>
            <p>
              Creemos en el aprendizaje a través de la experiencia y el juego. Cada actividad 
              está diseñada para que los niños desarrollen su creatividad, habilidades manuales 
              y conexión con la naturaleza, mientras se divierten y hacen nuevos amigos.
            </p>
          </div>

          <div className="taller-section">
            <h2>Para Escuelas</h2>
            <p>
              Estamos abocados especialmente a que las escuelas lleven a sus niños al taller. 
              Ofrecemos un espacio seguro, educativo y recreativo donde los estudiantes pueden 
              participar en actividades variadas que complementan su formación académica con 
              experiencias prácticas y creativas.
            </p>
          </div>

          <div className="taller-section">
            <h2>Nuestro Compromiso</h2>
            <p>
              En Tirùa, cada niño es único y valioso. Adaptamos nuestras actividades por edades 
              para asegurar que cada experiencia sea apropiada y enriquecedora. Trabajamos con 
              grupos reducidos (máximo 15 niños por estación) para garantizar atención personalizada 
              y un ambiente seguro para todos.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ElTaller;



