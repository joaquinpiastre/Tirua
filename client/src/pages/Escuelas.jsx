import './Escuelas.css';

const Escuelas = () => {
  const objetivos = [
    'Estimular los sentidos, la imaginación y la creatividad.',
    'Promover la autoexpresión.',
    'Desarrollar la interacción lúdica grupal.',
    'Generar confianza y autoestima mediante la espontaneidad natural.',
    'Fomentar la apreciación artística para comprender, valorar y disfrutar el arte.',
    'Crear conciencia sobre la importancia de tratar a nuestro planeta con respeto, apreciar la diversidad de vida y asumir la responsabilidad de cuidarlo.'
  ];

  const propuestas = [
    {
      id: 'mariposario',
      titulo: 'Aprendemos el ciclo / Visitamos el Mariposario',
      subtitulo: 'Articulamos con el Programa Nacional de Repoblación de Mariposas',
      actividades: [
        'Actividad I: Pintamos una oruga con efecto bajo la luz negra.',
        'Actividad II: Modelamos en arcilla el ciclo replicado en yeso.'
      ],
      edades: '2, 3, 4, 5 y más años',
      referencia: 'Valor de acceso según propuesta vigente. Todos los materiales incluidos.'
    },
    {
      id: 'primeros-pobladores',
      titulo: 'Primeros Pobladores',
      subtitulo: 'Piezas encontradas por arqueólogos hechas por los primeros habitantes de Mendoza',
      actividades: [
        'Actividad I: Elaboramos a mano una réplica de un amuleto con símbolos cargados de significados según la vida en esos tiempos.',
        'Actividad II: Pintamos la pieza.'
      ],
      edades: 'Todas las edades',
      referencia: 'Incluye: pieza de cerámica + pinturas + arcilla + cocción + Servicio de Emergencias Médicas.'
    },
    {
      id: 'mayo-patria',
      titulo: 'Mayo: mes de la Patria',
      subtitulo: null,
      actividades: [
        'Actividad I: Pintamos con colores patrios nuestra bandera Argentina.',
        'Actividad II: Modelamos con arcilla un mate esmaltado, listo para usar.'
      ],
      edades: '2, 3, 4, 5 y más años',
      referencia: 'Incluye: Mate de cerámica esmaltado + pinturas + 1 kg de arcilla + cocción + Servicio de Emergencia Médica.'
    },
    {
      id: 'familiar',
      titulo: 'Propuesta familiar',
      subtitulo: 'Invitamos a un familiar para compartir esta actividad',
      actividades: [
        'Actividad I: Modelamos con arcilla una bandejita que luego de cocinada puede utilizarse para servir y compartir en familia.',
        'Actividad II: Pintamos una casita de pajaritos para dar cobijo y observar cómo la naturaleza nos muestra que también forman su familia, se cuidan y crecen.'
      ],
      edades: null,
      referencia: 'Incluye: 1 casita de cerámica por niño y acompañante + pinturas + 1 kg de arcilla + engobes + horneada + cobertura de Servicio de Emergencia.'
    },
    {
      id: 'musica-plantas',
      titulo: 'Música de las Plantas',
      subtitulo: '"Valoramos la vida en todas sus formas"',
      actividades: [
        'A través de un dispositivo muy especial podemos escuchar los sonidos de la naturaleza. Sintonizamos el pulso de la planta convertido en notas musicales.',
        'Actividad I: Pintamos una maceta de cerámica.',
        'Actividad II: Modelamos en arcilla una flor cuya utilidad es tutor o bebedero de aves.'
      ],
      edades: null,
      referencia: 'Incluye: experiencia interactiva + arcilla + cocción de la pieza + Servicio de Emergencias.'
    },
    {
      id: 'reciclamos',
      titulo: 'Nosotros también reciclamos',
      subtitulo: 'Conectamos el arte con nuestro propio mariposario',
      actividades: [
        'Aprendemos el ciclo de las mariposas y las conocemos personalmente: cómo son, cómo nacen, cómo se alimentan.',
        'Primera actividad: Pintamos una maceta para recordar este momento.',
        'Segunda actividad: Conocemos qué es la cerámica, cómo está presente en nuestro día a día y cómo hace cientos de años los juguetes también eran de arcilla. Creamos nuestro propio balancín, un juguete reciclado.'
      ],
      edades: null,
      referencia: 'Incluye todos los materiales + Servicio de Emergencia.'
    }
  ];

  return (
    <div className="escuelas">
      <section className="escuelas-hero">
        <h1>Proyecto Escuelas 2026</h1>
        <p className="escuelas-subtitle">Paseo Pedagógico · Un encuentro interactivo a través del Arte</p>
      </section>

      <section className="escuelas-content">
        <div className="container">
          <div className="escuelas-origen">
            <h2>Este espacio nace en 2008</h2>
            <p>
              Desde entonces desarrollamos actividades orientadas a crear un ámbito de conocimiento,
              aprendizaje y expresión a través del Arte. Así surgen propuestas destinadas a la educación:
              inicial, primaria, secundaria, terciaria, Centros de Educación Especial, y grupos familiares o de adultos.
            </p>
            <p className="escuelas-invita">Es un placer invitarlos a nuestros talleres.</p>
          </div>

          <div className="escuelas-objetivos">
            <h2>Objetivos</h2>
            <ul>
              {objetivos.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </div>

          <div className="escuelas-modalidad">
            <h2>Modalidad: Paseo Pedagógico</h2>
            <p>
              En este encuentro interactivo a través del mundo del Arte, exploramos desde la historia,
              la biología, la ecología hasta las matemáticas y la filosofía.
            </p>
            <div className="dinamica-momentos">
              <h3>Dinámica y momentos</h3>
              <p>
                Recibimos el grupo en nuestro taller, donde comienza la jornada con actividades rotativas:
                son 2 proyectos, uno de pintura y otro de modelado. Hay un tiempo de recreo al aire libre,
                en un espacio acogedor que permite al grupo fortalecer vínculos de compañerismo como parte del aprendizaje.
              </p>
            </div>
          </div>

          <div className="escuelas-propuestas">
            <h2>Propuestas 2026</h2>
            <p className="consultar-precio">
              Consultar el precio actualizado antes de reservar. El valor de acceso varía según la propuesta elegida.
            </p>
            {propuestas.map((prop) => (
              <article key={prop.id} className="propuesta-card">
                <h3>{prop.titulo}</h3>
                {prop.subtitulo && <p className="propuesta-subtitulo">{prop.subtitulo}</p>}
                <ul className="propuesta-actividades">
                  {prop.actividades.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
                {prop.edades && (
                  <p className="propuesta-edades"><strong>Actividad adaptada a:</strong> {prop.edades}</p>
                )}
                <p className="propuesta-incluye">{prop.referencia}</p>
              </article>
            ))}
          </div>

          <div className="escuelas-coordinacion">
            <h2>Coordinación previa</h2>
            <ul className="coordinacion-lista">
              <li>Acompañantes no pagan, excepto en la propuesta familiar.</li>
              <li>Contamos con habilitación, seguro y Servicio de Emergencias.</li>
              <li>De acuerdo a la propuesta resulta el valor de acceso; las opciones son claras y definidas (no se superponen contenidos).</li>
              <li>Consultar el precio actualizado antes de reservar.</li>
              <li><strong>Reservas únicamente por WhatsApp:</strong></li>
            </ul>
            <a
              href="https://wa.me/542604318857"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              Reservar por WhatsApp · 2604 318857
            </a>
          </div>

          <div className="escuelas-contacto-final">
            <p>
              Para más información, <a href="/contacto">contáctanos</a> o escribinos por WhatsApp.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Escuelas;
