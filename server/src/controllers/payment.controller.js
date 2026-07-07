import prisma from '../config/database.js';

export const getPayments = async (req, res) => {
  try {
    const userId = req.user.id;

    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: [{ ano: 'desc' }, { mes: 'desc' }]
    });

    res.json({ payments });
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    res.status(500).json({ message: 'Error al obtener pagos', error: error.message });
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: [{ ano: 'desc' }, { mes: 'desc' }]
    });

    const mesesPagados = new Set();
    const mesesPendientes = [];

    payments.forEach(payment => {
      if (payment.mes && payment.ano) {
        const key = `${payment.ano}-${payment.mes}`;
        if (payment.estado === 'aprobado') {
          mesesPagados.add(key);
        } else if (payment.estado === 'pendiente') {
          mesesPendientes.push({ mes: payment.mes, ano: payment.ano, paymentId: payment.id });
        }
      }
    });

    const pagoMesActual = payments.find(p =>
      p.estado === 'aprobado' &&
      p.mes === currentMonth &&
      p.ano === currentYear
    );

    const mesesAdeudados = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentYear, currentMonth - 1 - i, 1);
      const mes = date.getMonth() + 1;
      const ano = date.getFullYear();
      const key = `${ano}-${mes}`;

      if (!mesesPagados.has(key)) {
        mesesAdeudados.push({ mes, ano });
      }
    }

    const lastPayment = payments.find(p => p.estado === 'aprobado');

    let tieneDeuda = !pagoMesActual;
    let estaAlDia = !!pagoMesActual;
    let estaVencido = false;

    if (!estaAlDia && lastPayment && lastPayment.fechaPago) {
      const diasDesdeUltimoPago = Math.floor(
        (new Date() - new Date(lastPayment.fechaPago)) / (1000 * 60 * 60 * 24)
      );
      estaVencido = diasDesdeUltimoPago > 30;
    }

    res.json({
      tieneDeuda,
      estaAlDia,
      estaVencido,
      mesesPagados: Array.from(mesesPagados),
      mesesAdeudados,
      mesesPendientes,
      ultimoPago: lastPayment ? {
        id: lastPayment.id,
        monto: lastPayment.monto,
        estado: lastPayment.estado,
        mes: lastPayment.mes,
        ano: lastPayment.ano,
        fechaPago: lastPayment.fechaPago,
        createdAt: lastPayment.createdAt,
        esManual: lastPayment.esManual
      } : null,
      pagoMesActual: pagoMesActual ? {
        id: pagoMesActual.id,
        monto: pagoMesActual.monto,
        mes: pagoMesActual.mes,
        ano: pagoMesActual.ano,
        fechaPago: pagoMesActual.fechaPago,
        esManual: pagoMesActual.esManual
      } : null
    });
  } catch (error) {
    console.error('Error al obtener estado de pago:', error);
    res.status(500).json({ message: 'Error al obtener estado de pago', error: error.message });
  }
};
