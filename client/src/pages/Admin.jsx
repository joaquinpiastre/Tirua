import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import AdminRoute from '../components/AdminRoute';
import MonthPicker from '../components/MonthPicker';
import './Admin.css';

const Admin = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [paymentToMark, setPaymentToMark] = useState(null);
  const [showMonthPickerForNew, setShowMonthPickerForNew] = useState(false);
  const [manualPaymentData, setManualPaymentData] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get(`/admin/users?search=${searchTerm}&status=${statusFilter}`);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      alert('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      setUserDetails(response.data.user);
    } catch (error) {
      console.error('Error al obtener detalles del usuario:', error);
      alert('Error al cargar detalles del usuario');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, statusFilter]);

  const handleMarkAsPaid = (paymentId, currentMes, currentAno) => {
    setPaymentToMark({ paymentId, currentMes, currentAno });
    setShowMonthPicker(true);
  };

  const handleMonthSelected = async (mes, ano) => {
    if (!paymentToMark) return;
    try {
      await api.post(`/admin/payments/${paymentToMark.paymentId}/mark-paid`, { mes, ano });
      alert('Pago marcado como aprobado exitosamente');
      fetchUserDetails(selectedUser.id);
      fetchUsers();
      setShowMonthPicker(false);
      setPaymentToMark(null);
    } catch (error) {
      console.error('Error al marcar pago:', error);
      alert(error.response?.data?.message || 'Error al marcar el pago');
    }
  };

  const handleCreateManualPayment = () => {
    setManualPaymentData({ userId: selectedUser.id });
    setShowMonthPickerForNew(true);
  };

  const handleMonthSelectedForNew = async (mes, ano) => {
    if (!manualPaymentData) return;
    const monto = prompt('Ingresa el monto (deja vacío para usar $5000):');
    const observaciones = prompt('Observaciones (opcional):');

    try {
      await api.post('/admin/payments/manual', {
        userId: manualPaymentData.userId,
        mes: parseInt(mes),
        ano: parseInt(ano),
        monto: monto ? parseFloat(monto) : undefined,
        observaciones: observaciones || undefined
      });
      alert('Pago manual creado exitosamente');
      fetchUserDetails(selectedUser.id);
      fetchUsers();
      setShowMonthPickerForNew(false);
      setManualPaymentData(null);
    } catch (error) {
      console.error('Error al crear pago manual:', error);
      alert(error.response?.data?.message || 'Error al crear el pago manual');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    const confirmMessage = `¿Estás seguro de que deseas eliminar al usuario "${userName}"?\n\nEsta acción eliminará:\n- El usuario\n- Todos sus pagos asociados\n\nEsta acción NO se puede deshacer.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    // Confirmación adicional
    const secondConfirm = window.confirm('Esta es tu última oportunidad. ¿Realmente deseas eliminar este usuario?');
    if (!secondConfirm) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      alert('Usuario eliminado exitosamente');
      
      // Si el usuario eliminado estaba seleccionado, cerrar el modal
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(null);
        setUserDetails(null);
      }
      
      // Refrescar la lista de usuarios y estadísticas
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert(error.response?.data?.message || 'Error al eliminar el usuario');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'al_dia':
        return <span className="status-badge status-ok">✅ Al día</span>;
      case 'con_deuda':
        return <span className="status-badge status-pendiente">⚠️ Con deuda</span>;
      case 'vencido':
        return <span className="status-badge status-vencido">⚠️ Vencido</span>;
      default:
        return <span className="status-badge status-pendiente">Sin pagos</span>;
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
    <AdminRoute>
      <div className="admin-page">
        <div className="container">
          <h1>Área de Administrador</h1>
          <p className="admin-welcome">Bienvenido/a, {user?.nombre} {user?.apellido}</p>

          {stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Usuarios</h3>
                <p className="stat-value">{stats.totalUsers}</p>
              </div>
              <div className="stat-card">
                <h3>Al Día</h3>
                <p className="stat-value stat-ok">{stats.alDia}</p>
              </div>
              <div className="stat-card">
                <h3>Con Deuda</h3>
                <p className="stat-value stat-pendiente">{stats.conDeuda}</p>
              </div>
              <div className="stat-card">
                <h3>Ingresos Totales</h3>
                <p className="stat-value">${stats.totalRevenue?.toLocaleString('es-AR')}</p>
              </div>
            </div>
          )}

          <div className="admin-controls">
            <input
              type="text"
              placeholder="Buscar por nombre, email o DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="todos">Todos</option>
              <option value="al_dia">Al día</option>
              <option value="con_deuda">Con deuda</option>
              <option value="vencido">Vencido</option>
              <option value="sin_pagos">Sin pagos</option>
            </select>
          </div>

          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>DNI</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.nombre} {user.apellido}</td>
                    <td>{user.email}</td>
                    <td>{user.dni}</td>
                    <td>{getStatusBadge(user.accountStatus)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            fetchUserDetails(user.id);
                          }}
                          className="btn-details"
                        >
                          Ver Detalles
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id, `${user.nombre} ${user.apellido}`)}
                          className="btn-delete"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedUser && userDetails && (
            <div className="user-details-modal">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Detalles de {userDetails.nombre} {userDetails.apellido}</h2>
                  <button onClick={() => setSelectedUser(null)} className="modal-close">×</button>
                </div>
                <div className="modal-body">
                  <div className="user-info">
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    <p><strong>DNI:</strong> {userDetails.dni}</p>
                    <p><strong>Teléfono:</strong> {userDetails.telefono || 'No proporcionado'}</p>
                    <p><strong>Estado:</strong> {getStatusBadge(userDetails.accountStatus)}</p>
                  </div>

                  <div className="payment-actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button onClick={handleCreateManualPayment} className="btn-primary">
                      Crear Pago Manual
                    </button>
                    <button
                      onClick={() => handleDeleteUser(userDetails.id, `${userDetails.nombre} ${userDetails.apellido}`)}
                      className="btn-delete"
                      style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
                    >
                      🗑️ Eliminar Usuario
                    </button>
                  </div>

                  <div className="payments-list">
                    <h3>Historial de Pagos</h3>
                    {userDetails.payments && userDetails.payments.length > 0 ? (
                      <ul>
                        {userDetails.payments.map((payment) => (
                          <li key={payment.id} className="payment-item">
                            <div className="payment-info">
                              <span>
                                {payment.mes && payment.ano
                                  ? `${new Date(payment.ano, payment.mes - 1).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}`
                                  : new Date(payment.createdAt).toLocaleDateString('es-AR')}
                              </span>
                              <span>${payment.monto?.toLocaleString('es-AR')}</span>
                              <span className={`payment-status payment-${payment.estado}`}>
                                {payment.estado}
                              </span>
                              <div className={`payment-method payment-method-${payment.metodoPago || (payment.esManual ? 'efectivo' : 'web')}`}>
                                {payment.metodoPago === 'efectivo' || payment.esManual ? '💰 Efectivo' : '🌐 Web'}
                              </div>
                              {payment.estado !== 'aprobado' && (
                                <button
                                  onClick={() => handleMarkAsPaid(payment.id, payment.mes, payment.ano)}
                                  className="btn-mark-paid"
                                >
                                  Marcar como Pagado
                                </button>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No hay pagos registrados</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {showMonthPicker && paymentToMark && (
            <MonthPicker
              onSelect={handleMonthSelected}
              onClose={() => {
                setShowMonthPicker(false);
                setPaymentToMark(null);
              }}
              currentMes={paymentToMark.currentMes}
              currentAno={paymentToMark.currentAno}
            />
          )}

          {showMonthPickerForNew && (
            <MonthPicker
              onSelect={handleMonthSelectedForNew}
              onClose={() => {
                setShowMonthPickerForNew(false);
                setManualPaymentData(null);
              }}
            />
          )}
        </div>
      </div>
    </AdminRoute>
  );
};

export default Admin;

