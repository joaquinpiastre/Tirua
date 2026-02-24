import { Link } from 'react-router-dom';
import './Clases.css';

const Clases = () => {
  const actividades = [
    { 
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
          <path d="M3 12h18M12 3v18"/>
        </svg>
      ), 
      name: 'Actividades Recreativas',
      descripcion: 'El contacto permanente con la naturaleza permite que cada recreo sea la oportunidad perfecta para explorar, imaginar y crear por iniciativa propia'
    },
    { 
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
          <path d="M8 12c0 2.21 1.79 4 4 4s4-1.79 4-4"/>
          <path d="M12 8v4M8 8h8"/>
        </svg>
      ), 
      name: 'Mariposario',
      descripcion: 'Conocer y proteger el ciclo de la vida de una mariposa es sólo el principio  para crear conciencia sobre la importancia del respeto a la diversidad de vida que habita nuestro planeta.'
    },
    { 
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          <path d="M3 12h18"/>
          <circle cx="12" cy="12" r="2"/>
        </svg>
      ), 
      name: 'Huerta',
      descripcion: 'Ser testigos del proceso de crecimiento y asumir la responsabilidad de cuidado es algo que todo niño debería experimentar'
    },
    { 
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      ), 
      name: 'Cerámica',
      descripcion: 'Ser paciente y respetar los procesos, comportamientos y tiempo de cada material es necesario para comprender que en la vida sucede lo mismo.'
    },
    { 
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
      ), 
      name: 'Carpintería',
      descripcion: 'Construir conociendo herramientas y sus usos. Armar, desarmar y volver a intentarlo. Adquirir estas habilidades como concepto aplicable a lo cotidiano.'
    },
    { 
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3h18v18H3z"/>
          <path d="M12 8v8M8 12h8"/>
          <circle cx="6" cy="6" r="1"/>
          <circle cx="18" cy="6" r="1"/>
          <circle cx="6" cy="18" r="1"/>
          <circle cx="18" cy="18" r="1"/>
        </svg>
      ), 
      name: 'Reciclado',
      descripcion: '"Resurgir de los restos" Este concepto es trasladado al juego y la creación para demostrar el "tesoro escondido" que puede renacer de lo que a veces consideramos descartado.'
    },
    { 
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24"/>
        </svg>
      ), 
      name: 'Pintura y dibujo',
      descripcion: 'Exploración de técnicas básicas: Colores, texturas, formas y figuras. Uso de materiales y herramientas artísticas.'
    },
    { 
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="7.5 4.21 12 6.81 16.5 4.21"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      ), 
      name: 'Tejido',
      descripcion: 'Como experiencia complementaria de atención y concentración'
    },
    { 
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
          <circle cx="12" cy="10" r="2"/>
        </svg>
      ), 
      name: 'Tecnología',
      descripcion: 'Como complemento de creaciones propias'
    },
    { 
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
          <path d="M9 12h6"/>
        </svg>
      ), 
      name: 'Música',
      descripcion: 'También podemos crear sonidos!'
    },
    { 
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
          <circle cx="12" cy="12" r="2"/>
          <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6"/>
        </svg>
      ), 
      name: 'Cocina',
      descripcion: 'El arte se sienta a la mesa con recetas simples pero cargadas de sabores como: instrucciones, paciencia, compañerismo orden y limpieza.'
    }
  ];

  const estaciones = [
    {
      nombre: 'Estación Semillero',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
          <circle cx="12" cy="12" r="2"/>
          <path d="M12 6v6M6 12h12"/>
          <path d="M8 8l8 8M16 8l-8 8"/>
        </svg>
      ),
      edad: '5 a 7 años',
      descripcion: 'Actividades adaptadas para los más pequeños, enfocadas en exploración sensorial y creatividad básica.'
    },
    {
      nombre: 'Estación Laboratorio',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44L2.5 13.5a2.5 2.5 0 0 1 0-3.96L7.04 2.44A2.5 2.5 0 0 1 9.5 2z"/>
          <path d="M14 13h7a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-7"/>
          <circle cx="12" cy="12" r="2"/>
        </svg>
      ),
      edad: '8 a 11 años',
      descripcion: 'Experimentos y proyectos más complejos que fomentan el aprendizaje práctico y la curiosidad.'
    },
    {
      nombre: 'Estación Aprendíz',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
        </svg>
      ),
      edad: '12 a 15 años',
      descripcion: 'Proyectos avanzados que desarrollan habilidades técnicas y creativas más especializadas.'
    }
  ];

  return (
    <div className="clases">
      <section className="clases-hero">
        <h1>Nuestras Actividades</h1>
        <p className="clases-subtitle">Conectamos el Arte con múltiples experiencias</p>
      </section>

      <section className="clases-content">
        <div className="container">
          <div className="clases-escuelas-banner">
            <p>
              <strong>¿Sos escuela o institución?</strong> Tenemos el <strong>Paseo Pedagógico</strong> con propuestas para inicial, primaria, secundaria, terciaria y más. Reservas por WhatsApp.
            </p>
            <Link to="/escuelas" className="clases-link-escuelas">Ver Proyecto Escuelas 2026 → Consultá la disponibilidad en el calendario</Link>
          </div>
          <div className="clases-intro">
            <h2>El arte como conexion autentica</h2>
            <p>
            Autoconocimiento, Expresión e Interacción Grupal en cada clase y en cada proyecto.
            </p>
          </div>

          <div className="actividades-grid">
            {actividades.map((actividad, index) => (
              <div key={index} className="actividad-card">
                <div className="actividad-icon-wrapper">
                  {actividad.icon}
                </div>
                <h3>{actividad.name}</h3>
                <p className="actividad-descripcion">{actividad.descripcion || ''}</p>
              </div>
            ))}
          </div>

          <div className="estaciones-section">
            <h2 className="section-title">Adaptamos las actividades por edades:</h2>
            <div className="estaciones-grid">
              {estaciones.map((estacion, index) => (
                <div key={index} className="estacion-card">
                  <div className="estacion-header">
                    <div className="estacion-icon-wrapper">
                      {estacion.icon}
                    </div>
                    <h3>{estacion.nombre}</h3>
                  </div>
                  <div className="estacion-edad">
                    <strong>De {estacion.edad}</strong>
                  </div>
                  <p className="estacion-descripcion">{estacion.descripcion}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="info-dinamica">
            <h2 className="section-title">Nuestra dinámica</h2>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon-wrapper">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h3>Cupo máximo</h3>
                <p>15 niños por estación (aula)</p>
              </div>
              <div className="info-item">
                <div className="info-icon-wrapper">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <h3>Duración</h3>
                <p>1 vez por semana</p>
                <p>2 horas 30 minutos</p>
              </div>
            </div>
          </div>

          <div className="inscripcion-section">
            <h2 className="section-title">Información de Inscripción</h2>
            <div className="inscripcion-content">
              <div className="inscripcion-card destacado">
                <div className="inscripcion-icon-wrapper">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h3>Inscripción</h3>
                <p className="precio">$20.000</p>
                <p className="descripcion">Un paso para asegurar tu lugar</p>
                <p className="advertencia">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Sin inscripción previa, no podemos garantizar el ingreso.
                </p>
              </div>
              <div className="inscripcion-card">
                <h3>Cuota Mensual</h3>
                <p className="descripcion">Del 1 al 10 de cada mes</p>
                <p className="incluye">Incluye:</p>
                <ul>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Todos los materiales
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Seguro
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Servicio de Emergencia
                  </li>
                </ul>
              </div>
            </div>
            <div className="cupos-info">
              <p className="cupos-limitados">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: 'inline-block', verticalAlign: 'middle', marginRight: '8px'}}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                Cupos limitados
              </p>
              <p className="fecha-inicio">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display: 'inline-block', verticalAlign: 'middle', marginRight: '8px'}}>
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                Comenzamos el 6 o 7 de marzo según tu grupo
              </p>
            </div>
          </div>

          <div className="recordatorio-section">
            <div className="recordatorio-card">
              <div className="recordatorio-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <h3>Recordatorio importante</h3>
              <p>Traer ropita para ensuciar y colación</p>
              <p className="mensaje-final">¡Nos vemos muy pronto!</p>
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



