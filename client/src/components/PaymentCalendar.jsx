import { useState } from 'react';
import './PaymentCalendar.css';

const PaymentCalendar = ({ onSelectMonths, selectedMonths = [] }) => {
  const [selected, setSelected] = useState(selectedMonths);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handleMonthClick = (mes, ano) => {
    const key = `${ano}-${mes}`;
    const isSelected = selected.some(m => m.mes === mes && m.ano === ano);
    
    let newSelected;
    if (isSelected) {
      newSelected = selected.filter(m => !(m.mes === mes && m.ano === ano));
    } else {
      newSelected = [...selected, { mes, ano }];
    }
    
    setSelected(newSelected);
    if (onSelectMonths) {
      onSelectMonths(newSelected);
    }
  };

  const isMonthSelected = (mes, ano) => {
    return selected.some(m => m.mes === mes && m.ano === ano);
  };

  const today = new Date();
  const currentMonthNum = today.getMonth() + 1;
  const currentYearNum = today.getFullYear();

  const renderCalendar = () => {
    const months = [];
    const currentDate = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Calcular el mes de inicio (2 meses atrás)
    const startDate = new Date(currentDate);
    startDate.setMonth(startDate.getMonth() - 2);
    
    // Calcular el mes de fin (1 año adelante)
    const endDate = new Date(currentDate);
    endDate.setMonth(endDate.getMonth() + 12);
    
    // Generar todos los meses en el rango
    const tempDate = new Date(startDate);
    while (tempDate <= endDate) {
      months.push({
        mes: tempDate.getMonth() + 1,
        ano: tempDate.getFullYear()
      });
      tempDate.setMonth(tempDate.getMonth() + 1);
    }
    
    return months;
  };

  const months = renderCalendar();

  // Agrupar meses por año para mejor organización
  const monthsByYear = months.reduce((acc, month) => {
    if (!acc[month.ano]) {
      acc[month.ano] = [];
    }
    acc[month.ano].push(month);
    return acc;
  }, {});

  return (
    <div className="payment-calendar">
      <div className="calendar-header">
        <h3>Selecciona los meses a pagar</h3>
        <p className="calendar-subtitle">Desde 2 meses atrás hasta 1 año adelante</p>
      </div>

      <div className="calendar-years-container">
        {Object.keys(monthsByYear).sort().map(year => {
          const yearMonths = monthsByYear[year];
          const isCurrentYear = parseInt(year) === currentYearNum;
          
          return (
            <div key={year} className="calendar-year-group">
              <h4 className={`year-title ${isCurrentYear ? 'current-year' : ''}`}>
                {year} {isCurrentYear && '(Año actual)'}
              </h4>
              <div className="calendar-months">
                {yearMonths.map(({ mes, ano }) => {
                  const isSelected = isMonthSelected(mes, ano);
                  const isCurrentMonth = mes === currentMonthNum && ano === currentYearNum;
                  const isPastMonth = ano < currentYearNum || (ano === currentYearNum && mes < currentMonthNum);
                  
                  return (
                    <button
                      key={`${ano}-${mes}`}
                      className={`calendar-month ${isSelected ? 'selected' : ''} ${isCurrentMonth ? 'current-month' : ''} ${isPastMonth ? 'past-month' : ''}`}
                      onClick={() => handleMonthClick(mes, ano)}
                    >
                      <div className="month-name">{monthNames[mes - 1]}</div>
                      {isCurrentMonth && <div className="current-indicator">Mes actual</div>}
                      {isSelected && <div className="month-check">✓</div>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div className="selected-summary">
          <p>Meses seleccionados: {selected.length}</p>
          <button 
            onClick={() => {
              setSelected([]);
              if (onSelectMonths) onSelectMonths([]);
            }}
            className="btn-clear"
          >
            Limpiar selección
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentCalendar;

