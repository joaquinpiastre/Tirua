import { useState, useEffect } from 'react';
import api from '../services/api';
import './AdminClases.css';

const AdminClases = () => {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClase, setSelectedClase] = useState(null);
  const [claseDetail, setClaseDetail] = useState(null);
  const [asistenciaFecha, setAsistenciaFecha] = useState('');
  const [asistencias, setAsistencias] = useState([]);

  useEffect(() => {
    fetchClases();
  }, []);

  const fetchClases = async () => {
    try {
      const res = await api.get('/clases');
      setClases(res.data.clases || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openClase = async (clase) => {
    setSelectedClase(clase);
    setClaseDetail(null);
    setAsistenciaFecha('');
    setAsistencias([]);
    try {
      const res = await api.get(`/clases/${clase.id}`);
      setClaseDetail(res.data.clase);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAsistencia = async () => {
    if (!selectedClase || !asistenciaFecha) return;
    try {
      const res = await api.get(`/clases/${selectedClase.id}/asistencia?fecha=${asistenciaFecha}`);
      setAsistencias(res.data.asistencias || []);
    } catch (err) {
      console.error(err);
      setAsistencias([]);
    }
  };

  useEffect(() => {
    if (asistenciaFecha && selectedClase) loadAsistencia();
  }, [asistenciaFecha, selectedClase]);

  const formatFecha = (d) => d ? new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

  if (loading) {
    return (
      <div className="admin-clases loading-container">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="admin-clases">
      <h1>Clases (vista administrador)</h1>
      <p className="admin-welcome">Todas las clases y asistencias. Los maestros gestionan sus propias clases en "Mis Clases".</p>

      <div className="clases-list">
        {clases.length === 0 ? (
          <p>No hay clases creadas.</p>
        ) : (
          <div className="clases-grid">
            {clases.map((c) => (
              <div key={c.id} className="clase-card" onClick={() => openClase(c)}>
                <h3>{c.nombre}</h3>
                <p>Maestro: {c.maestro?.nombre} {c.maestro?.apellido}</p>
                <p>{c._count?.alumnos ?? 0} alumnos</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedClase && claseDetail && (
        <div className="clase-detail-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{claseDetail.nombre}</h2>
              <button type="button" className="modal-close" onClick={() => setSelectedClase(null)}>×</button>
            </div>
            <div className="modal-body">
              <p><strong>Maestro:</strong> {claseDetail.maestro?.nombre} {claseDetail.maestro?.apellido}</p>
              <h3>Alumnos de la clase</h3>
              <ul className="alumnos-list">
                {(claseDetail.alumnos || []).map((a) => (
                  <li key={a.id}>
                    {a.nombreAlumno || `${a.nombre} ${a.apellido}`} <span className="email-small">{a.email}</span>
                  </li>
                ))}
              </ul>
              <h3>Asistencia por fecha</h3>
              <div className="asistencia-controls">
                <input
                  type="date"
                  value={asistenciaFecha}
                  onChange={(e) => setAsistenciaFecha(e.target.value)}
                />
              </div>
              {asistenciaFecha && (
                <ul className="asistencia-list">
                  {asistencias.length === 0 ? (
                    <li>Sin asistencia registrada para esta fecha.</li>
                  ) : (
                    asistencias.map((a) => (
                      <li key={a.id}>{a.user?.nombreAlumno || `${a.user?.nombre} ${a.user?.apellido}`}</li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClases;
