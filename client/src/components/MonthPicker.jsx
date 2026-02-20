import { useState } from 'react';
import './MonthPicker.css';

const MonthPicker = ({ onSelect, onClose, currentMes = null, currentAno = null }) => {
  const [selectedYear, setSelectedYear] = useState(currentAno || new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentMes || new Date().getMonth() + 1);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const years = [];
  
  for (let year = 2020; year <= currentYear + 1; year++) {
    years.push(year);
  }

  const handleConfirm = () => {
    if (onSelect) {
      onSelect(selectedMonth, selectedYear);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="month-picker-overlay" onClick={onClose}>
      <div className="month-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="month-picker-header">
          <h3>Selecciona el mes y año del pago</h3>
          <button className="month-picker-close" onClick={onClose}>×</button>
        </div>
        
        <div className="month-picker-content">
          <div className="year-selector">
            <label>Año:</label>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="year-select"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="months-grid">
            {monthNames.map((monthName, index) => {
              const monthNumber = index + 1;
              const isSelected = monthNumber === selectedMonth;
              
              return (
                <button
                  key={monthNumber}
                  className={`month-button ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedMonth(monthNumber)}
                >
                  {monthName}
                </button>
              );
            })}
          </div>
        </div>

        <div className="month-picker-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-confirm" onClick={handleConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonthPicker;



