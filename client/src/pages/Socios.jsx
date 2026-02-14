import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import PaymentCalendar from '../components/PaymentCalendar';
import ProtectedRoute from '../components/ProtectedRoute';
import './Socios.css';

const Socios = () => {
  const { user, updateProfile, fetchProfile } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [payments, setPayments] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    email: user?.email || '',
    telefono: user?.telefono || ''
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
        telefono: user.telefono || ''
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

  const calculateAmount = (mes, ano) => {
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth() + 1;
    const todayYear = today.getFullYear();
    const baseAmount = 5000;
    
    // Si estamos pagando un mes pasado o el mes actual después del día 10, aplicar 20% de aumento
    if (ano < todayYear || (ano === todayYear && mes < todayMonth)) {
      // Mes pasado: siempre con aumento
      return baseAmount * 1.2;
    } else if (ano === todayYear && mes === todayMonth && todayDay > 10) {
      // Mes actual pero después del día 10: con aumento
      return baseAmount * 1.2;
    }
    
    return baseAmount;
  };

  const handlePayMonths = async () => {
    if (selectedMonths.length === 0) {
      alert('Por favor, selecciona al menos un mes');
      return;
    }

    setProcessingPayment(true);
    try {
      // Calcular montos con aumento si corresponde
      const paymentsWithAmounts = selectedMonths.map(({ mes, ano }) => ({
        mes,
        ano,
        monto: calculateAmount(mes, ano)
      }));

      const response = await api.post('/payments/create-multiple', {
        meses: selectedMonths,
        monto: 5000 // Monto base, el cálculo del aumento se hace en el backend si es necesario
      });

      if (response.data.payments && response.data.payments.length > 0) {
        const firstPayment = response.data.payments[0];
        if (firstPayment.initPoint) {
          window.location.href = firstPayment.initPoint;
        } else {
          alert('Error al generar el link de pago');
        }
      } else {
        alert('Error al procesar el pago');
      }
    } catch (error) {
      console.error('Error al procesar pago:', error);
      alert(error.response?.data?.message || 'Error al procesar el pago');
    } finally {
      setProcessingPayment(false);
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
                        <span className={`payment-method payment-method-${paymentStatus.pagoMesActual.metodoPago}`}>
                          {paymentStatus.pagoMesActual.metodoPago === 'efectivo' ? '💰 Efectivo' : '🌐 Web'}
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
                  <h2>Pagar Cuota Mensual</h2>
                  <p className="card-description">Selecciona uno o más meses para pagar</p>
                </div>
                
                <div className="payment-warning">
                  <div className="warning-icon">⚠️</div>
                  <div className="warning-content">
                    <strong>Importante:</strong> Si pagas después del día 10 de cada mes, la cuota aumenta un 20%.
                    <br />
                    <span className="warning-detail">Cuota base: $5.000 | Con recargo (después del 10): $6.000</span>
                  </div>
                </div>

                <PaymentCalendar 
                  onSelectMonths={setSelectedMonths}
                  selectedMonths={selectedMonths}
                />
                
                {selectedMonths.length > 0 && (
                  <div className="payment-summary">
                    {selectedMonths.map(({ mes, ano }) => {
                      const amount = calculateAmount(mes, ano);
                      const hasIncrease = amount > 5000;
                      return (
                        <div key={`${ano}-${mes}`} className="month-summary-item">
                          <span>{monthNames[mes - 1]} {ano}:</span>
                          <span className={hasIncrease ? 'amount-with-increase' : ''}>
                            ${amount.toLocaleString('es-AR')}
                            {hasIncrease && <span className="increase-badge">+20%</span>}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="payment-actions">
                  <button
                    onClick={handlePayMonths}
                    className="btn-primary btn-pay"
                    disabled={processingPayment || selectedMonths.length === 0}
                  >
                    {processingPayment ? 'Procesando...' : `Pagar ${selectedMonths.length} mes${selectedMonths.length !== 1 ? 'es' : ''}`}
                  </button>
                  {selectedMonths.length > 0 && (
                    <p className="payment-total">
                      Total: ${selectedMonths.reduce((sum, { mes, ano }) => sum + calculateAmount(mes, ano), 0).toLocaleString('es-AR')}
                    </p>
                  )}
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
                      const metodoPago = payment.esManual ? 'efectivo' : (payment.mpPaymentId ? 'web' : 'desconocido');
                      
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
                            <span className={`payment-method payment-method-${metodoPago}`}>
                              {metodoPago === 'efectivo' ? '💰 Efectivo' : '🌐 Web'}
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

