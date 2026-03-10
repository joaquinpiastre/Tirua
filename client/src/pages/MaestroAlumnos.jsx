import { useEffect, useState } from 'react';
import api from '../services/api';
import './AdminMaestros.css';

const MaestroAlumnos = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const res = await api.get('/profe/alumnos');
        setAlumnos(res.data.alumnos || []);
      } catch (err) {
        console.error('Error al cargar alumnos:', err);
        setAlumnos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAlumnos();
  }, []);

  if (loading) {
    return (
      <div className="admin-maestros loading-container">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="admin-maestros">
      <h1>Alumnos</h1>
      <p className="admin-welcome">
        Aquí podés ver los datos principales de los alumnos inscriptos (contacto, nombre del alumno y ficha técnica).
      </p>

      <div className="maestros-table-container">
        <table className="maestros-table">
          <thead>
            <tr>
              <th>Nombre tutor</th>
              <th>Alumno</th>
              <th>Email</th>
              <th>DNI</th>
              <th>Teléfono</th>
              <th>Ficha técnica</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.length === 0 ? (
              <tr>
                <td colSpan={6}>No hay alumnos registrados.</td>
              </tr>
            ) : (
              alumnos.map((a) => (
                <tr key={a.id}>
                  <td>{a.nombre} {a.apellido}</td>
                  <td>{a.nombreAlumno || '—'}</td>
                  <td>{a.email}</td>
                  <td>{a.dni}</td>
                  <td>{a.telefono || 'No indicado'}</td>
                  <td style={{ maxWidth: '260px', whiteSpace: 'pre-wrap' }}>
                    {a.fichaTecnica && a.fichaTecnica.trim() !== ''
                      ? a.fichaTecnica
                      : 'Sin ficha técnica'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaestroAlumnos;

