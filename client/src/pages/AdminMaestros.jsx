import { useState, useEffect } from 'react';
import { Fragment } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './AdminMaestros.css';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const getHorasPorMesFromRegistros = (registros) => {
  if (!Array.isArray(registros)) return [];
  const porMes = {};
  registros.forEach((r) => {
    const d = new Date(r.fecha);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!porMes[key]) porMes[key] = { year: d.getFullYear(), month: d.getMonth(), total: 0, pyp: 0, docente: 0 };
    porMes[key].total += r.horas;
    if (r.tipo === 'pyp') porMes[key].pyp += r.horas; else porMes[key].docente += r.horas;
  });
  return Object.values(porMes).sort((a, b) => (a.year !== b.year ? b.year - a.year : b.month - a.month));
};

const AdminMaestros = () => {
  const { user } = useAuth();
  const [profes, setProfes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedProfeId, setExpandedProfeId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    dni: '',
    telefono: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfes();
  }, []);

  const fetchProfes = async () => {
    try {
      const res = await api.get('/admin/maestros');
      setProfes(res.data.maestros || []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar profes');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/admin/maestros/register', formData);
      setSuccess('Profe registrado. Puede iniciar sesión con su email y contraseña.');
      setFormData({ nombre: '', apellido: '', email: '', password: '', dni: '', telefono: '' });
      setShowForm(false);
      fetchProfes();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Error al registrar';
      setError(msg);
    }
  };

  if (loading) {
    return (
      <div className="admin-maestros loading-container">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="admin-maestros">
      <h1>Profes</h1>
      <p className="admin-welcome">Solo el administrador puede registrar profes. Los profes pueden crear clases, tomar asistencia y cargar horas trabajadas (PYP y docente).</p>

      <div className="admin-maestros-actions">
        <button type="button" className="btn-primary" onClick={() => { setShowForm(!showForm); setError(''); setSuccess(''); }}>
          {showForm ? 'Cancelar' : 'Registrar nuevo profe'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-maestros-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <input name="apellido" value={formData.apellido} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>DNI</label>
              <input name="dni" value={formData.dni} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Teléfono (opcional)</label>
              <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className="btn-primary">Registrar profe</button>
        </form>
      )}

      <div className="maestros-table-container">
        <table className="maestros-table maestros-table-horas">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>DNI</th>
              <th>Clases</th>
              <th>Horas PYP</th>
              <th>Horas docente</th>
              <th>Total horas</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {profes.length === 0 ? (
              <tr><td colSpan={8}>No hay profes registrados.</td></tr>
            ) : (
              profes.map((m) => {
                const totalH = (typeof m.horasPyp === 'number' ? m.horasPyp : 0) + (typeof m.horasDocente === 'number' ? m.horasDocente : 0);
                const porMes = getHorasPorMesFromRegistros(m.registrosHoras);
                const isExpanded = expandedProfeId === m.id;
                return (
                  <Fragment key={m.id}>
                    <tr>
                      <td>{m.nombre} {m.apellido}</td>
                      <td>{m.email}</td>
                      <td>{m.dni}</td>
                      <td>{m._count?.clasesComoMaestro ?? 0}</td>
                      <td>{typeof m.horasPyp === 'number' ? m.horasPyp.toFixed(1) : '0'}</td>
                      <td>{typeof m.horasDocente === 'number' ? m.horasDocente.toFixed(1) : '0'}</td>
                      <td className="total-horas-cell"><strong>{totalH.toFixed(1)} h</strong></td>
                      <td>
                        <button
                          type="button"
                          className="btn-ver-horas-mes"
                          onClick={() => setExpandedProfeId(isExpanded ? null : m.id)}
                        >
                          {isExpanded ? 'Ocultar' : 'Ver por mes'}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${m.id}-detalle`} className="profe-horas-detalle-row">
                        <td colSpan={8}>
                          <div className="profe-horas-por-mes">
                            <strong>Horas trabajadas por mes</strong>
                            {porMes.length === 0 ? (
                              <p>Sin horas cargadas.</p>
                            ) : (
                              <ul>
                                {porMes.map((mes) => (
                                  <li key={`${mes.year}-${mes.month}`}>
                                    {MESES[mes.month]} {mes.year}: {mes.total.toFixed(1)} h total
                                    {(mes.pyp > 0 || mes.docente > 0) && (
                                      <span> — PYP: {mes.pyp.toFixed(1)} h, Docente: {mes.docente.toFixed(1)} h</span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMaestros;
