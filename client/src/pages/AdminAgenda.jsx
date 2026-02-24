import { useState, useEffect } from 'react';
import './AdminAgenda.css';

const STORAGE_KEY = 'tirua_agenda_escuelas';

const HORARIOS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

const getVisitasFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveVisitasToStorage = (visitas) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(visitas));
};

const getDaysInMonth = (year, month) => {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay();
  const days = [];
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(d);
  return days;
};

const AdminAgenda = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [nombreEscuela, setNombreEscuela] = useState('');
  const [contacto, setContacto] = useState('');
  const [visitas, setVisitas] = useState(getVisitasFromStorage);

  useEffect(() => {
    saveVisitasToStorage(visitas);
  }, [visitas]);

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

  const formatDateKey = (y, m, d) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  const handleSelectDay = (day) => {
    if (!day) return;
    setSelectedDate({ year, month, day });
    setSelectedTime('');
    setNombreEscuela('');
    setContacto('');
  };

  const visitasDelDia = selectedDate
    ? visitas.filter(
        (v) =>
          v.fecha === formatDateKey(selectedDate.year, selectedDate.month, selectedDate.day)
      )
    : [];

  const handleAgregar = () => {
    if (!selectedDate || !selectedTime.trim() || !nombreEscuela.trim()) {
      alert('Seleccioná día, hora y nombre de la escuela.');
      return;
    }
    const fecha = formatDateKey(selectedDate.year, selectedDate.month, selectedDate.day);
    const nueva = {
      id: Date.now(),
      fecha,
      hora: selectedTime.trim(),
      escuela: nombreEscuela.trim(),
      contacto: contacto.trim() || null
    };
    setVisitas((prev) => [...prev, nueva].sort((a, b) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora)));
    setNombreEscuela('');
    setContacto('');
    setSelectedTime('');
  };

  const handleEliminar = (id) => {
    if (window.confirm('¿Eliminar esta visita programada?')) {
      setVisitas((prev) => prev.filter((v) => v.id !== id));
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

  return (
    <div className="admin-agenda">
      <div className="agenda-container">
        <header className="agenda-header">
          <h1 className="agenda-title">Agenda de visitas al taller</h1>
          <p className="agenda-subtitle">
            Seleccioná el día y la hora para programar la visita de una escuela al taller.
          </p>
        </header>

        <div className="agenda-grid">
          <section className="agenda-calendar-card">
            <h2 className="agenda-card-title">Calendario</h2>
            <div className="calendar-nav">
              <button type="button" onClick={prevMonth} className="agenda-btn-nav" aria-label="Mes anterior">
                ‹
              </button>
              <span className="calendar-month-name">{monthName}</span>
              <button type="button" onClick={nextMonth} className="agenda-btn-nav" aria-label="Mes siguiente">
                ›
              </button>
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
                  <label className="agenda-label">Hora</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="agenda-select"
                  >
                    <option value="">Elegí la hora</option>
                    {HORARIOS.map((h) => (
                      <option key={h} value={h}>{h}</option>
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
                  <button type="button" onClick={handleAgregar} className="agenda-btn-add">
                    Agregar visita
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
          {!selectedDate && visitas.filter((v) => v.fecha >= formatDateKey(today.getFullYear(), today.getMonth(), today.getDate())).length === 0 && (
            <p className="agenda-empty">No hay visitas programadas.</p>
          )}
          <ul className="agenda-list">
            {(selectedDate ? visitasDelDia : visitas.filter((v) => v.fecha >= formatDateKey(today.getFullYear(), today.getMonth(), today.getDate())).slice(0, 20)).map((v) => (
              <li key={v.id} className="agenda-list-item">
                <div className="agenda-list-info">
                  <span className="agenda-list-fecha">
                    {new Date(v.fecha + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })} · {v.hora}
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
