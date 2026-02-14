import prisma from '../config/database.js';

export const getMonthlyRevenue = async (req, res) => {
  try {
    const { year } = req.query;
    const targetYear = year ? parseInt(year) : new Date().getFullYear();

    const payments = await prisma.payment.findMany({
      where: {
        estado: 'aprobado',
        ano: targetYear
      },
      select: {
        mes: true,
        ano: true,
        monto: true,
        fechaPago: true,
        esManual: true,
        user: {
          select: {
            nombre: true,
            apellido: true,
            email: true
          }
        }
      },
      orderBy: [
        { mes: 'asc' },
        { fechaPago: 'asc' }
      ]
    });

    const monthlyData = {};
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    for (let i = 1; i <= 12; i++) {
      monthlyData[i] = {
        mes: i,
        mesNombre: monthNames[i - 1],
        total: 0,
        cantidadPagos: 0,
        pagos: []
      };
    }

    payments.forEach(payment => {
      if (payment.mes) {
        monthlyData[payment.mes].total += payment.monto;
        monthlyData[payment.mes].cantidadPagos += 1;
        monthlyData[payment.mes].pagos.push({
          id: payment.id,
          monto: payment.monto,
          fechaPago: payment.fechaPago,
          esManual: payment.esManual,
          usuario: `${payment.user.nombre} ${payment.user.apellido}`,
          email: payment.user.email
        });
      }
    });

    const monthlyArray = Object.values(monthlyData);
    const totalAnual = monthlyArray.reduce((sum, month) => sum + month.total, 0);
    const totalPagos = monthlyArray.reduce((sum, month) => sum + month.cantidadPagos, 0);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    let ingresosHastaAhora = 0;
    let pagosHastaAhora = 0;
    
    if (targetYear === currentYear) {
      for (let i = 1; i <= currentMonth; i++) {
        ingresosHastaAhora += monthlyData[i].total;
        pagosHastaAhora += monthlyData[i].cantidadPagos;
      }
    } else {
      ingresosHastaAhora = totalAnual;
      pagosHastaAhora = totalPagos;
    }

    res.json({
      año: targetYear,
      totalAnual,
      totalPagos,
      ingresosHastaAhora,
      pagosHastaAhora,
      mesActual: targetYear === currentYear ? currentMonth : null,
      meses: monthlyArray,
      resumen: {
        promedioMensual: totalAnual / 12,
        mejorMes: monthlyArray.reduce((max, month) => 
          month.total > max.total ? month : max, monthlyArray[0]
        ),
        peorMes: monthlyArray.reduce((min, month) => 
          month.total < min.total || min.total === 0 ? month : min, monthlyArray[0]
        )
      }
    });
  } catch (error) {
    console.error('Error al obtener ingresos mensuales:', error);
    res.status(500).json({ 
      message: 'Error al obtener ingresos mensuales', 
      error: error.message 
    });
  }
};

