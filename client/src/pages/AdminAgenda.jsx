import { useState, useEffect } from 'react';
import api from '../services/api';
import './AdminAgenda.css';

const TURNOS = [
  { value: 'mañana', label: 'Mañana' },
  { value: 'tarde', label: 'Tarde' }
];

const getDaysInMonth = (year, month) => {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay();
  const days = [];
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(d);
  return days;
};

const formatDateKey = (y, m, d) => {
  const mm = String(m + 1).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  return `${y}-${mm}-${dd}`;
};

const AdminAgenda = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTurno, setSelectedTurno] = useState('');
  const [nombreEscuela, setNombreEscuela] = useState('');
  const [contacto, setContacto] = useState('');
  const [visitas, setVisitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchVisitas = async () => {
    try {
      setLoading(true);
      const res = await api.get('/agenda-escuelas');
      setVisitas(res.data.visitas || []);
    } catch (err) {
      console.error(err);
      setVisitas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitas();
  }, []);

  const days = getDaysInMonth(year, month);
  const monthName = new Date(year, month).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const handleSelectDay = (day) => {
    if (!day) return;
    setSelectedDate({ year, month, day });
    setSelectedTurno('');
    setNombreEscuela('');
    setContacto('');
  };

  const visitasDelDia = selectedDate
    ? visitas.filter((v) => v.fecha === formatDateKey(selectedDate.year, selectedDate.month, selectedDate.day))
    : [];

  const turnosOcupadosDelDia = visitasDelDia.map((v) => v.turno);
  const turnosDisponibles = TURNOS.filter((t) => !turnosOcupadosDelDia.includes(t.value));

  const handleAgregar = async () => {
    if (!selectedDate || !selectedTurno || !nombreEscuela.trim()) {
      alert('Seleccioná día, turno (mañana o tarde) y nombre de la escuela.');
      return;
    }
    const fecha = formatDateKey(selectedDate.year, selectedDate.month, selectedDate.day);
    setSaving(true);
    try {
      await api.post('/agenda-escuelas', {
        fecha,
        turno: selectedTurno,
        escuela: nombreEscuela.trim(),
        contacto: contacto.trim() || undefined
      });
      await fetchVisitas();
      setNombreEscuela('');
      setContacto('');
      setSelectedTurno('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error al programar la visita');
    } finally {
      setSaving(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta visita programada?')) return;
    try {
      await api.delete(`/agenda-escuelas/${id}`);
      await fetchVisitas();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar');
    }
  };

  const isSelected = (day) =>
    selectedDate &&
    selectedDate.year === year &&
    selectedDate.month === month &&
    selectedDate.day === day;

  const hasVisits = (day) => {
    if (!day) return false;
    const key = formatDateKey(year, month, day);
    return visitas.some((v) => v.fecha === key);
  };

  const proximasVisitas = visitas.filter(
    (v) => v.fecha >= formatDateKey(today.getFullYear(), today.getMonth(), today.getDate())
  );

  if (loading) {
    return (
      <div className="admin-agenda">
        <div className="agenda-container"><div className="loading-spinner" /></div>
      </div>
    );
  }

  return (
    <div className="admin-agenda">
      <div className="agenda-container">
        <header className="agenda-header">
          <h1 className="agenda-title">Agenda de visitas al taller</h1>
          <p className="agenda-subtitle">
            Podés recibir hasta 2 escuelas por día: una por la mañana y otra por la tarde. Seleccioná el día y el turno para programar la visita.
          </p>
        </header>

        <div className="agenda-grid">
          <section className="agenda-calendar-card">
            <h2 className="agenda-card-title">Calendario</h2>
            <div className="calendar-nav">
              <button type="button" onClick={prevMonth} className="agenda-btn-nav" aria-label="Mes anterior">‹</button>
              <span className="calendar-month-name">{monthName}</span>
              <button type="button" onClick={nextMonth} className="agenda-btn-nav" aria-label="Mes siguiente">›</button>
            </div>
            <div className="calendar-weekdays">
              {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'].map((d) => (
                <span key={d} className="calendar-weekday">{d}</span>
              ))}
            </div>
            <div className="calendar-days">
              {days.map((day, i) => (
                <button
                  key={i}
                  type="button"
                  className={`calendar-day ${!day ? 'empty' : ''} ${isSelected(day) ? 'selected' : ''} ${hasVisits(day) ? 'has-visit' : ''}`}
                  onClick={() => handleSelectDay(day)}
                  disabled={!day}
                >
                  {day || ''}
                </button>
              ))}
            </div>
          </section>

          <section className="agenda-form-card">
            <h2 className="agenda-card-title">Programar visita</h2>
            {selectedDate ? (
              <>
                <p className="agenda-selected-date">
                  {new Date(selectedDate.year, selectedDate.month, selectedDate.day).toLocaleDateString('es-AR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <div className="agenda-form">
                  <label className="agenda-label">Turno</label>
                  <select
                    value={selectedTurno}
                    onChange={(e) => setSelectedTurno(e.target.value)}
                    className="agenda-select"
                  >
                    <option value="">Elegí mañana o tarde</option>
                    {TURNOS.map((t) => (
                      <option
                        key={t.value}
                        value={t.value}
                        disabled={turnosOcupadosDelDia.includes(t.value)}
                      >
                        {t.label}{turnosOcupadosDelDia.includes(t.value) ? ' (ocupado)' : ''}
                      </option>
                    ))}
                  </select>
                  <label className="agenda-label">Nombre de la escuela o institución</label>
                  <input
                    type="text"
                    value={nombreEscuela}
                    onChange={(e) => setNombreEscuela(e.target.value)}
                    placeholder="Ej: Escuela Primaria N° 12"
                    className="agenda-input"
                  />
                  <label className="agenda-label">Contacto (opcional)</label>
                  <input
                    type="text"
                    value={contacto}
                    onChange={(e) => setContacto(e.target.value)}
                    placeholder="Nombre o teléfono de contacto"
                    className="agenda-input"
                  />
                  <button type="button" onClick={handleAgregar} className="agenda-btn-add" disabled={saving}>
                    {saving ? 'Guardando...' : 'Agregar visita'}
                  </button>
                </div>
              </>
            ) : (
              <p className="agenda-hint">Seleccioná un día en el calendario para programar una visita.</p>
            )}
          </section>
        </div>

        <section className="agenda-list-card">
          <h2 className="agenda-card-title">
            {selectedDate ? 'Visitas de este día' : 'Próximas visitas'}
          </h2>
          {selectedDate && visitasDelDia.length === 0 && (
            <p className="agenda-empty">No hay visitas programadas para este día.</p>
          )}
          {!selectedDate && proximasVisitas.length === 0 && (
            <p className="agenda-empty">No hay visitas programadas.</p>
          )}
          <ul className="agenda-list">
            {(selectedDate ? visitasDelDia : proximasVisitas.slice(0, 30)).map((v) => (
              <li key={v.id} className="agenda-list-item">
                <div className="agenda-list-info">
                  <span className="agenda-list-fecha">
                    {new Date(v.fecha + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })} · {v.turno === 'mañana' ? 'Mañana' : 'Tarde'}
                  </span>
                  <strong className="agenda-list-escuela">{v.escuela}</strong>
                  {v.contacto && <span className="agenda-list-contacto">{v.contacto}</span>}
                </div>
                <button type="button" onClick={() => handleEliminar(v.id)} className="agenda-btn-delete" title="Eliminar">
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AdminAgenda;
