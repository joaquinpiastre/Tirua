import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './AdminMaestros.css';

const AdminMaestros = () => {
  const { user } = useAuth();
  const [maestros, setMaestros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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
    fetchMaestros();
  }, []);

  const fetchMaestros = async () => {
    try {
      const res = await api.get('/admin/maestros');
      setMaestros(res.data.maestros || []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar maestros');
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
      setSuccess('Maestro registrado. Puede iniciar sesión con su email y contraseña.');
      setFormData({ nombre: '', apellido: '', email: '', password: '', dni: '', telefono: '' });
      setShowForm(false);
      fetchMaestros();
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
      <h1>Maestros</h1>
      <p className="admin-welcome">Solo el administrador puede registrar maestros. Los maestros pueden crear clases y tomar asistencia.</p>

      <div className="admin-maestros-actions">
        <button type="button" className="btn-primary" onClick={() => { setShowForm(!showForm); setError(''); setSuccess(''); }}>
          {showForm ? 'Cancelar' : 'Registrar nuevo maestro'}
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
          <button type="submit" className="btn-primary">Registrar maestro</button>
        </form>
      )}

      <div className="maestros-table-container">
        <table className="maestros-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>DNI</th>
              <th>Clases</th>
            </tr>
          </thead>
          <tbody>
            {maestros.length === 0 ? (
              <tr><td colSpan={4}>No hay maestros registrados.</td></tr>
            ) : (
              maestros.map((m) => (
                <tr key={m.id}>
                  <td>{m.nombre} {m.apellido}</td>
                  <td>{m.email}</td>
                  <td>{m.dni}</td>
                  <td>{m._count?.clasesComoMaestro ?? 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMaestros;
