import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ProtectedRoute from '../components/ProtectedRoute';
import './Socios.css';

const Socios = () => {
  const { user, updateProfile, fetchProfile } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    email: user?.email || '',
    telefono: user?.telefono || '',
    nombreAlumno: user?.nombreAlumno || '',
    fichaTecnica: user?.fichaTecnica || ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      setEditFormData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || '',
        telefono: user.telefono || '',
        nombreAlumno: user.nombreAlumno || '',
        fichaTecnica: user.fichaTecnica || ''
      });
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statusRes, paymentsRes] = await Promise.all([
        api.get('/payments/status'),
        api.get('/payments/history')
      ]);
      setPaymentStatus(statusRes.data);
      setPayments(paymentsRes.data.payments);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    
    try {
      const result = await updateProfile(editFormData);
      if (result.success) {
        alert('Perfil actualizado exitosamente');
        setShowEditProfile(false);
        await fetchProfile(); // Actualizar los datos del usuario
      } else {
        alert(result.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      alert('Error al actualizar el perfil');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const getStatusBadge = () => {
    if (!paymentStatus) return null;

    if (paymentStatus.estaAlDia) {
      return <span className="status-badge status-ok">✅ Al día</span>;
    } else if (paymentStatus.estaVencido) {
      return <span className="status-badge status-vencido">⚠️ Vencido</span>;
    } else {
      return <span className="status-badge status-pendiente">⚠️ Con deuda</span>;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="socios-page">
        <div className="socios-container">
          <div className="socios-header">
            <h1>Área de Socios</h1>
            <p className="welcome-text">Bienvenido/a, <strong>{user?.nombre} {user?.apellido}</strong></p>
          </div>

          <div className="socios-grid">
            <div className="socios-main">
              <div className="status-card">
                <div className="card-header">
                  <h2>Estado de Cuota</h2>
                  {getStatusBadge()}
                </div>
                <div className="status-content">
                  {paymentStatus?.pagoMesActual && (
                    <div className="current-payment-info">
                      <div className="info-row">
                        <span className="info-label">Pago del mes actual:</span>
                        <span className="info-value">{monthNames[paymentStatus.pagoMesActual.mes - 1]} {paymentStatus.pagoMesActual.ano}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Monto:</span>
                        <span className="info-value amount">${paymentStatus.pagoMesActual.monto?.toLocaleString('es-AR')}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Método:</span>
                        <span className="payment-method payment-method-efectivo">
                          💰 Efectivo
                        </span>
                      </div>
                    </div>
                  )}
                  {paymentStatus?.ultimoPago && !paymentStatus?.pagoMesActual && (
                    <div className="last-payment-info">
                      <div className="info-row">
                        <span className="info-label">Último pago:</span>
                        <span className="info-value">{paymentStatus.ultimoPago.mes ? `${monthNames[paymentStatus.ultimoPago.mes - 1]} ${paymentStatus.ultimoPago.ano}` : 'N/A'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Monto:</span>
                        <span className="info-value amount">${paymentStatus.ultimoPago.monto?.toLocaleString('es-AR')}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="payment-card">
                <div className="card-header">
                  <h2>Pago de Cuota Mensual</h2>
                </div>

                <div className="payment-warning">
                  <div className="warning-icon">ℹ️</div>
                  <div className="warning-content">
                    <strong>Para registrar tu pago, contactá al administrador.</strong>
                    <br />
                    <span className="warning-detail">El administrador cargará tu pago manualmente y podrás ver el estado actualizado en esta página.</span>
                  </div>
                </div>
              </div>

              <div className="profile-card">
                <div className="card-header">
                  <h2>Mis Datos</h2>
                  <button
                    onClick={() => setShowEditProfile(!showEditProfile)}
                    className="btn-edit-profile"
                  >
                    {showEditProfile ? 'Cancelar' : 'Editar'}
                  </button>
                </div>
                
                {!showEditProfile ? (
                  <div className="profile-info">
                    <div className="info-row">
                      <span className="info-label">Nombre:</span>
                      <span className="info-value">{user?.nombre}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Apellido:</span>
                      <span className="info-value">{user?.apellido}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Email:</span>
                      <span className="info-value">{user?.email}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">DNI:</span>
                      <span className="info-value">{user?.dni}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Teléfono:</span>
                      <span className="info-value">{user?.telefono || 'No proporcionado'}</span>
                    </div>
                    {user?.rol === 'socio' && (
                      <div className="info-row">
                        <span className="info-label">Nombre del alumno:</span>
                        <span className="info-value">{user?.nombreAlumno || 'No indicado'}</span>
                      </div>
                    )}
                    {user?.rol === 'socio' && (
                      <div className="info-row">
                        <span className="info-label">Ficha técnica:</span>
                        <span className="info-value">
                          {user?.fichaTecnica && user.fichaTecnica.trim() !== ''
                            ? user.fichaTecnica
                            : 'No cargada'}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleEditProfile} className="profile-edit-form">
                    <div className="form-group">
                      <label htmlFor="edit-nombre">Nombre</label>
                      <input
                        type="text"
                        id="edit-nombre"
                        name="nombre"
                        value={editFormData.nombre}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-apellido">Apellido</label>
                      <input
                        type="text"
                        id="edit-apellido"
                        name="apellido"
                        value={editFormData.apellido}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-email">Email</label>
                      <input
                        type="email"
                        id="edit-email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-telefono">Teléfono</label>
                      <input
                        type="tel"
                        id="edit-telefono"
                        name="telefono"
                        value={editFormData.telefono}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    {user?.rol === 'socio' && (
                      <div className="form-group">
                        <label htmlFor="edit-nombreAlumno">Nombre del alumno / niño</label>
                        <input
                          type="text"
                          id="edit-nombreAlumno"
                          name="nombreAlumno"
                          value={editFormData.nombreAlumno}
                          onChange={handleEditFormChange}
                          placeholder="Nombre del niño que asiste al taller"
                        />
                      </div>
                    )}
                    {user?.rol === 'socio' && (
                      <div className="form-group">
                        <label htmlFor="edit-fichaTecnica">Ficha técnica del alumno</label>
                        <textarea
                          id="edit-fichaTecnica"
                          name="fichaTecnica"
                          value={editFormData.fichaTecnica}
                          onChange={handleEditFormChange}
                          placeholder="Alergias, necesidades específicas, observaciones importantes para el taller..."
                          rows={4}
                        />
                      </div>
                    )}
                    <div className="form-group">
                      <label>DNI</label>
                      <input
                        type="text"
                        value={user?.dni}
                        disabled
                        className="disabled-input"
                      />
                      <small className="form-hint">El DNI no se puede modificar</small>
                    </div>
                    <div className="form-actions">
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={savingProfile}
                      >
                        {savingProfile ? 'Guardando...' : 'Guardar Cambios'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            <div className="socios-sidebar">
              <div className="history-card">
                <div className="card-header">
                  <h2>Historial de Pagos</h2>
                  <span className="payment-count">{payments.length} pago{payments.length !== 1 ? 's' : ''}</span>
                </div>
                {payments.length === 0 ? (
                  <div className="empty-state">
                    <p>No hay pagos registrados</p>
                  </div>
                ) : (
                  <ul className="payments-list">
                    {payments.map((payment) => {
                      const monthName = payment.mes ? monthNames[payment.mes - 1] : '';

                      return (
                        <li key={payment.id} className="payment-item">
                          <div className="payment-item-header">
                            <div className="payment-date">
                              {payment.mes && payment.ano
                                ? `${monthName} ${payment.ano}`
                                : new Date(payment.createdAt).toLocaleDateString('es-AR')}
                            </div>
                            <span className={`payment-status payment-${payment.estado}`}>
                              {payment.estado}
                            </span>
                          </div>
                          <div className="payment-item-footer">
                            <span className="payment-amount">
                              ${payment.monto?.toLocaleString('es-AR')}
                            </span>
                            <span className="payment-method payment-method-efectivo">
                              💰 Efectivo
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Socios;

