import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const [horasResumen, setHorasResumen] = useState({ totalPyp: 0, totalDocente: 0, registros: [] });
  const [showHorasForm, setShowHorasForm] = useState(false);
  const [horasForm, setHorasForm] = useState({ tipo: 'docente', horas: '', fecha: new Date().toISOString().slice(0, 10) });
  const [savingHoras, setSavingHoras] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const DIA_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getHorasPorDia = (registros) => {
    const porDia = {};
    (registros || []).forEach((r) => {
      const d = new Date(r.fecha);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!porDia[key]) porDia[key] = { total: 0, pyp: 0, docente: 0 };
      porDia[key].total += r.horas;
      if (r.tipo === 'pyp') porDia[key].pyp += r.horas; else porDia[key].docente += r.horas;
    });
    return porDia;
  };

  const getHorasPorMes = (registros) => {
    const porMes = {};
    (registros || []).forEach((r) => {
      const d = new Date(r.fecha);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!porMes[key]) porMes[key] = { year: d.getFullYear(), month: d.getMonth(), total: 0, pyp: 0, docente: 0 };
      porMes[key].total += r.horas;
      if (r.tipo === 'pyp') porMes[key].pyp += r.horas; else porMes[key].docente += r.horas;
    });
    return Object.values(porMes).sort((a, b) => (a.year !== b.year ? b.year - a.year : b.month - a.month));
  };

  const horasPorDia = getHorasPorDia(horasResumen.registros);
  const horasPorMes = getHorasPorMes(horasResumen.registros);

  const getDiasDelMes = (year, month) => {
    const first = new Date(year, month - 1, 1);
    const last = new Date(year, month, 0);
    const startPad = first.getDay();
    const days = last.getDate();
    const cells = [];
    for (let i = 0; i < startPad; i++) cells.push(null);
    for (let d = 1; d <= days; d++) cells.push(d);
    return cells;
  };

  useEffect(() => {
    fetchClases();
    fetchHoras();
  }, []);

  const fetchHoras = async () => {
    try {
      const res = await api.get('/profe/horas');
      setHorasResumen({ ...res.data.resumen, registros: res.data.registros || [] });
    } catch {
      setHorasResumen({ totalPyp: 0, totalDocente: 0, registros: [] });
    }
  };

  const handleAddHoras = async (e) => {
    e.preventDefault();
    const h = parseFloat(horasForm.horas);
    if (isNaN(h) || h <= 0) {
      alert('Ingresá una cantidad de horas válida.');
      return;
    }
    setSavingHoras(true);
    try {
      await api.post('/profe/horas', {
        tipo: horasForm.tipo,
        horas: h,
        fecha: horasForm.fecha || undefined
      });
      setHorasForm({ tipo: 'docente', horas: '', fecha: new Date().toISOString().slice(0, 10) });
      setShowHorasForm(false);
      fetchHoras();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al cargar horas');
    } finally {
      setSavingHoras(false);
    }
  };

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
        <p className="maestro-welcome">Hola, {user?.nombre}. Aquí puedes crear clases, agregar alumnos, tomar asistencia y cargar tus horas trabajadas (se paga por hora).</p>

        <div className="maestro-actions">
          <button type="button" className="btn-primary" onClick={() => setShowNewClase(!showNewClase)}>
            {showNewClase ? 'Cancelar' : 'Crear nueva clase'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => { setShowHorasForm(!showHorasForm); }} style={{ marginLeft: '0.5rem' }}>
            {showHorasForm ? 'Cancelar' : 'Agregar horas trabajadas'}
          </button>
          <Link to="/maestro/agenda" className="btn-agenda-escuelas">
            Agenda escuelas
          </Link>
        </div>

        {showHorasForm && (
          <form onSubmit={handleAddHoras} className="maestro-new-clase-form maestro-horas-form">
            <select
              value={horasForm.tipo}
              onChange={(e) => setHorasForm({ ...horasForm, tipo: e.target.value })}
              required
            >
              <option value="pyp">Horas PYP</option>
              <option value="docente">Horas docente</option>
            </select>
            <input
              type="number"
              step="0.5"
              min="0.5"
              placeholder="Cantidad de horas"
              value={horasForm.horas}
              onChange={(e) => setHorasForm({ ...horasForm, horas: e.target.value })}
              required
            />
            <input
              type="date"
              value={horasForm.fecha}
              onChange={(e) => setHorasForm({ ...horasForm, fecha: e.target.value })}
            />
            <button type="submit" className="btn-primary" disabled={savingHoras}>
              {savingHoras ? 'Guardando...' : 'Agregar'}
            </button>
          </form>
        )}

        <div className="maestro-horas-resumen">
          <strong>Total horas:</strong> PYP: {horasResumen.totalPyp?.toFixed(1) ?? '0'} h — Docente: {horasResumen.totalDocente?.toFixed(1) ?? '0'} h — <strong>Total: {(horasResumen.totalPyp + horasResumen.totalDocente).toFixed(1)} h</strong>
        </div>

        <section className="horas-calendar-section">
          <h3>Calendario de horas trabajadas</h3>
          <div className="horas-calendar-nav">
            <button type="button" onClick={() => { if (calendarMonth === 1) { setCalendarYear(calendarYear - 1); setCalendarMonth(12); } else setCalendarMonth(calendarMonth - 1); }}>‹</button>
            <span>{MESES[calendarMonth - 1]} {calendarYear}</span>
            <button type="button" onClick={() => { if (calendarMonth === 12) { setCalendarYear(calendarYear + 1); setCalendarMonth(1); } else setCalendarMonth(calendarMonth + 1); }}>›</button>
          </div>
          <div className="horas-calendar-grid">
            {DIA_SEMANA.map((d) => (
              <div key={d} className="horas-calendar-dow">{d}</div>
            ))}
            {getDiasDelMes(calendarYear, calendarMonth).map((day, idx) => {
              if (day === null) return <div key={`e-${idx}`} className="horas-calendar-cell empty" />;
              const key = `${calendarYear}-${String(calendarMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const h = horasPorDia[key];
              return (
                <div key={key} className={`horas-calendar-cell ${h ? 'has-hours' : ''}`}>
                  <span className="horas-cell-day">{day}</span>
                  {h && <span className="horas-cell-value">{h.total.toFixed(1)} h</span>}
                </div>
              );
            })}
          </div>
        </section>

        <section className="horas-por-mes-section">
          <h3>Resumen por mes</h3>
          {horasPorMes.length === 0 ? (
            <p className="horas-por-mes-empty">Aún no hay horas cargadas.</p>
          ) : (
            <ul className="horas-por-mes-list">
              {horasPorMes.map((m) => (
                <li key={`${m.year}-${m.month}`}>
                  <strong>{MESES[m.month]} {m.year}:</strong> {m.total.toFixed(1)} h total
                  {(m.pyp > 0 || m.docente > 0) && (
                    <span className="horas-mes-detalle"> — PYP: {m.pyp.toFixed(1)} h, Docente: {m.docente.toFixed(1)} h</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

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
