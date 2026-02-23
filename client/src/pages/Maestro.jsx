import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Maestro.css';

const Maestro = () => {
  const { user } = useAuth();
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClase, setSelectedClase] = useState(null);
  const [claseDetail, setClaseDetail] = useState(null);
  const [newClaseNombre, setNewClaseNombre] = useState('');
  const [showNewClase, setShowNewClase] = useState(false);
  const [searchAlumno, setSearchAlumno] = useState('');
  const [sociosSearch, setSociosSearch] = useState([]);
  const [asistenciaFecha, setAsistenciaFecha] = useState(new Date().toISOString().slice(0, 10));
  const [asistenciasHoy, setAsistenciasHoy] = useState([]);
  const [presentes, setPresentes] = useState(new Set());
  const [savingAsistencia, setSavingAsistencia] = useState(false);

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
    setSociosSearch([]);
    setSearchAlumno('');
    setPresentes(new Set());
    setAsistenciasHoy([]);
    try {
      const res = await api.get(`/clases/${clase.id}`);
      setClaseDetail(res.data.clase);
      loadAsistenciaForDate(clase.id, asistenciaFecha);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAsistenciaForDate = async (claseId, fecha) => {
    if (!fecha) return;
    try {
      const res = await api.get(`/clases/${claseId}/asistencia?fecha=${fecha}`);
      setAsistenciasHoy(res.data.asistencias || []);
      setPresentes(new Set((res.data.asistencias || []).map((a) => a.user?.id).filter(Boolean)));
    } catch {
      setAsistenciasHoy([]);
      setPresentes(new Set());
    }
  };

  useEffect(() => {
    if (selectedClase && claseDetail && asistenciaFecha) {
      loadAsistenciaForDate(selectedClase.id, asistenciaFecha);
    }
  }, [asistenciaFecha, selectedClase?.id]);

  const handleCreateClase = async (e) => {
    e.preventDefault();
    if (!newClaseNombre.trim()) return;
    try {
      await api.post('/clases', { nombre: newClaseNombre.trim() });
      setNewClaseNombre('');
      setShowNewClase(false);
      fetchClases();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al crear la clase');
    }
  };

  const searchSocios = async () => {
    if (!searchAlumno.trim() || searchAlumno.length < 2) {
      setSociosSearch([]);
      return;
    }
    try {
      const res = await api.get(`/clases/socios-search?q=${encodeURIComponent(searchAlumno)}`);
      setSociosSearch(res.data.socios || []);
    } catch {
      setSociosSearch([]);
    }
  };

  useEffect(() => {
    const t = setTimeout(searchSocios, 300);
    return () => clearTimeout(t);
  }, [searchAlumno]);

  const addAlumnoToClase = async (userId) => {
    if (!selectedClase) return;
    try {
      await api.post(`/clases/${selectedClase.id}/alumnos`, { userId });
      const res = await api.get(`/clases/${selectedClase.id}`);
      setClaseDetail(res.data.clase);
      setSearchAlumno('');
      setSociosSearch([]);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al agregar');
    }
  };

  const removeAlumno = async (userId) => {
    if (!selectedClase) return;
    try {
      await api.delete(`/clases/${selectedClase.id}/alumnos/${userId}`);
      const res = await api.get(`/clases/${selectedClase.id}`);
      setClaseDetail(res.data.clase);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al quitar');
    }
  };

  const togglePresente = (userId) => {
    setPresentes((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const guardarAsistencia = async () => {
    if (!selectedClase) return;
    setSavingAsistencia(true);
    try {
      await api.post(`/clases/${selectedClase.id}/asistencia`, {
        fecha: asistenciaFecha,
        userIds: Array.from(presentes)
      });
      await loadAsistenciaForDate(selectedClase.id, asistenciaFecha);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al guardar asistencia');
    } finally {
      setSavingAsistencia(false);
    }
  };

  const alumnos = claseDetail?.alumnos || [];
  const displayName = (a) => a.nombreAlumno || `${a.nombre} ${a.apellido}`;

  if (loading) {
    return (
      <div className="maestro-page loading-container">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="maestro-page">
      <div className="maestro-container">
        <h1>Mis Clases</h1>
        <p className="maestro-welcome">Hola, {user?.nombre}. Aquí puedes crear clases, agregar alumnos y tomar asistencia.</p>

        <div className="maestro-actions">
          <button type="button" className="btn-primary" onClick={() => setShowNewClase(!showNewClase)}>
            {showNewClase ? 'Cancelar' : 'Crear nueva clase'}
          </button>
        </div>

        {showNewClase && (
          <form onSubmit={handleCreateClase} className="maestro-new-clase-form">
            <input
              type="text"
              placeholder="Nombre de la clase"
              value={newClaseNombre}
              onChange={(e) => setNewClaseNombre(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary">Crear</button>
          </form>
        )}

        <div className="clases-list">
          {clases.length === 0 ? (
            <p>No tenés clases aún. Creá una con el botón de arriba.</p>
          ) : (
            <div className="clases-grid">
              {clases.map((c) => (
                <div key={c.id} className="clase-card" onClick={() => openClase(c)}>
                  <h3>{c.nombre}</h3>
                  <p>{c._count?.alumnos ?? 0} alumnos</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedClase && claseDetail && (
          <div className="clase-detail-panel">
            <div className="clase-detail-header">
              <h2>{claseDetail.nombre}</h2>
              <button type="button" className="btn-close" onClick={() => setSelectedClase(null)}>Cerrar</button>
            </div>

            <div className="clase-detail-section">
              <h3>Agregar alumno</h3>
              <p className="hint">Buscar por nombre del alumno o del tutor</p>
              <input
                type="text"
                placeholder="Buscar..."
                value={searchAlumno}
                onChange={(e) => setSearchAlumno(e.target.value)}
                className="search-input"
              />
              {sociosSearch.length > 0 && (
                <ul className="socios-search-list">
                  {sociosSearch
                    .filter((s) => !alumnos.some((a) => a.id === s.id))
                    .map((s) => (
                      <li key={s.id}>
                        <span>{s.nombreAlumno || `${s.nombre} ${s.apellido}`}</span>
                        <button type="button" className="btn-add" onClick={() => addAlumnoToClase(s.id)}>Agregar</button>
                      </li>
                    ))}
                </ul>
              )}
            </div>

            <div className="clase-detail-section">
              <h3>Alumnos de la clase</h3>
              <ul className="alumnos-list">
                {alumnos.length === 0 ? (
                  <li>Ningún alumno en esta clase.</li>
                ) : (
                  alumnos.map((a) => (
                    <li key={a.id}>
                      {displayName(a)}
                      <button type="button" className="btn-remove" onClick={() => removeAlumno(a.id)}>Quitar</button>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="clase-detail-section asistencia-section">
              <h3>Tomar asistencia</h3>
              <div className="asistencia-fecha">
                <label>Fecha:</label>
                <input
                  type="date"
                  value={asistenciaFecha}
                  onChange={(e) => setAsistenciaFecha(e.target.value)}
                />
              </div>
              <p className="hint">Marcá quiénes asistieron y guardá.</p>
              <ul className="asistencia-list">
                {alumnos.length === 0 ? (
                  <li>Agregá alumnos primero.</li>
                ) : (
                  alumnos.map((a) => (
                    <li key={a.id}>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={presentes.has(a.id)}
                          onChange={() => togglePresente(a.id)}
                        />
                        {displayName(a)}
                      </label>
                    </li>
                  ))
                )}
              </ul>
              {alumnos.length > 0 && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={guardarAsistencia}
                  disabled={savingAsistencia}
                >
                  {savingAsistencia ? 'Guardando...' : 'Guardar asistencia'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Maestro;
