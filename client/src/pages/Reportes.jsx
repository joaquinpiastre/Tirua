import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import AdminRoute from '../components/AdminRoute';
import './Reportes.css';

const Reportes = () => {
  const { user } = useAuth();
  const [monthlyData, setMonthlyData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    fetchData();
  }, [selectedYear]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/reports/monthly?year=${selectedYear}`);
      setMonthlyData(response.data);
    } catch (error) {
      console.error('Error al obtener reportes:', error);
      alert('Error al cargar los reportes: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const openModal = (month) => {
    setSelectedMonth(month);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMonth(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!monthlyData) {
    return (
      <div className="reportes-page">
        <div className="container">
          <p>No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <AdminRoute>
      <div className="reportes-page">
        <div className="container">
          <h1>Reportes Mensuales</h1>
          <p className="reportes-welcome">Bienvenido/a, {user?.nombre} {user?.apellido}</p>

          <div className="year-selector">
            <label>Año:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="year-select"
            >
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
            </select>
          </div>

          <div className="monthly-stats">
            <div className="stat-item highlight-current-revenue">
              <span className="stat-label">Ingresos hasta el momento ({new Date().getMonth() + 1}/{selectedYear}):</span>
              <span className="stat-value">{formatCurrency(monthlyData.ingresosHastaAhora)}</span>
            </div>
          </div>

          <div className="monthly-table-container">
            <table className="monthly-table">
              <thead>
                <tr>
                  <th>Mes</th>
                  <th>Total</th>
                  <th>Cantidad de Pagos</th>
                  <th>Promedio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.meses.map((month) => (
                  <tr key={month.mes}>
                    <td>{month.mesNombre}</td>
                    <td>{formatCurrency(month.total)}</td>
                    <td>{month.cantidadPagos}</td>
                    <td>{formatCurrency(month.total / (month.cantidadPagos || 1))}</td>
                    <td>
                      <button
                        onClick={() => openModal(month)}
                        className="btn-details"
                      >
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showModal && selectedMonth && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Detalles de {selectedMonth.mesNombre} {selectedYear}</h2>
                  <button className="modal-close" onClick={closeModal}>×</button>
                </div>
                <div className="modal-body">
                  <div className="modal-summary">
                    <div className="summary-item">
                      <span className="summary-label">Total:</span>
                      <span className="summary-value">{formatCurrency(selectedMonth.total)}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Cantidad de Pagos:</span>
                      <span className="summary-value">{selectedMonth.cantidadPagos}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Promedio:</span>
                      <span className="summary-value">
                        {formatCurrency(selectedMonth.total / (selectedMonth.cantidadPagos || 1))}
                      </span>
                    </div>
                  </div>
                  <div className="payments-details-list">
                    <h3>Personas que Pagaron</h3>
                    {selectedMonth.pagos.map((pago) => (
                      <div key={pago.id} className="payment-detail-item">
                        <div className="payment-detail-info">
                          <div className="payment-detail-user">
                            <strong>{pago.usuario}</strong>
                            <span className="payment-detail-email">{pago.email}</span>
                          </div>
                          <div className="payment-detail-amount">
                            {formatCurrency(pago.monto)}
                          </div>
                          <div className="payment-detail-date">
                            {new Date(pago.fechaPago).toLocaleDateString('es-AR')}
                          </div>
                          <div className={`payment-method payment-method-${pago.esManual ? 'efectivo' : 'web'}`}>
                            {pago.esManual ? '💰 Efectivo' : '🌐 Web'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminRoute>
  );
};

export default Reportes;

