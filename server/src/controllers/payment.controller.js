import prisma from '../config/database.js';
import { createPaymentPreference, processWebhook } from '../services/mercadoPago.service.js';

const calculatePaymentAmount = (mes, ano) => {
  const today = new Date();
  const paymentDate = new Date(ano, mes - 1, 10); // Día 10 del mes a pagar
  const baseAmount = 5000;
  
  // Si hoy es después del día 10 del mes a pagar, aplicar 20% de aumento
  if (today > paymentDate) {
    return baseAmount * 1.2; // 20% de aumento
  }
  
  return baseAmount;
};

export const createPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { monto, mes, ano } = req.body;

    const currentDate = new Date();
    const paymentMonth = mes || currentDate.getMonth() + 1;
    const paymentYear = ano || currentDate.getFullYear();

    if (paymentMonth < 1 || paymentMonth > 12) {
      return res.status(400).json({ message: 'Mes inválido (debe ser entre 1 y 12)' });
    }

    // Verificar si ya existe un pago para ese mes/año
    const existingPayment = await prisma.payment.findFirst({
      where: {
        userId,
        mes: paymentMonth,
        ano: paymentYear
      }
    });

    if (existingPayment && existingPayment.estado === 'aprobado') {
      return res.status(400).json({ 
        message: `Ya existe un pago aprobado para ${paymentMonth}/${paymentYear}` 
      });
    }

    // Calcular el monto con aumento si corresponde
    const calculatedAmount = calculatePaymentAmount(paymentMonth, paymentYear);

    let payment;
    if (existingPayment) {
      // Actualizar el monto si el pago ya existe pero no está aprobado
      if (existingPayment.estado !== 'aprobado') {
        payment = await prisma.payment.update({
          where: { id: existingPayment.id },
          data: { monto: calculatedAmount }
        });
      } else {
        payment = existingPayment;
      }
    } else {
      payment = await prisma.payment.create({
        data: {
          userId,
          monto: calculatedAmount,
          estado: 'pendiente',
          mes: paymentMonth,
          ano: paymentYear
        }
      });
    }

    // Obtener usuario para crear preferencia
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        nombre: true,
        apellido: true,
        email: true
      }
    });

    // Crear preferencia de Mercado Pago
    const preference = await createPaymentPreference(payment, user);

    // Actualizar pago con preference ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: { mpPreferenceId: preference.id }
    });

    res.json({
      message: 'Preferencia de pago creada',
      initPoint: preference.initPoint || preference.sandboxInitPoint,
      paymentId: payment.id
    });
  } catch (error) {
    console.error('Error al crear pago:', error);
    res.status(500).json({ 
      message: 'Error al crear pago', 
      error: error.message 
    });
  }
};

export const createMultiplePayments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { meses, monto } = req.body;

    if (!meses || !Array.isArray(meses) || meses.length === 0) {
      return res.status(400).json({ message: 'Debes seleccionar al menos un mes' });
    }

    const payments = [];
    const errors = [];

    for (const { mes, ano } of meses) {
      try {
        const existingPayment = await prisma.payment.findFirst({
          where: {
            userId,
            mes,
            ano,
            estado: 'aprobado'
          }
        });

        if (existingPayment) {
          errors.push({ mes, ano, error: 'Ya existe un pago aprobado' });
          continue;
        }

        // Calcular el monto con aumento si corresponde
        const calculatedAmount = calculatePaymentAmount(mes, ano);

        let payment = await prisma.payment.findFirst({
          where: {
            userId,
            mes,
            ano
          }
        });

        if (!payment) {
          payment = await prisma.payment.create({
            data: {
              userId,
              monto: calculatedAmount,
              estado: 'pendiente',
              mes,
              ano
            }
          });
        } else {
          // Actualizar el monto si el pago ya existe pero no está aprobado
          if (payment.estado !== 'aprobado') {
            payment = await prisma.payment.update({
              where: { id: payment.id },
              data: { monto: calculatedAmount }
            });
          }
        }

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { nombre: true, apellido: true, email: true }
        });

        const preference = await createPaymentPreference(payment, user);

        await prisma.payment.update({
          where: { id: payment.id },
          data: { mpPreferenceId: preference.id }
        });

        payments.push({
          paymentId: payment.id,
          mes,
          ano,
          initPoint: preference.initPoint || preference.sandboxInitPoint
        });
      } catch (error) {
        errors.push({ mes, ano, error: error.message });
      }
    }

    res.json({
      message: `${payments.length} preferencia(s) de pago creada(s)`,
      payments,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error al crear múltiples pagos:', error);
    res.status(500).json({ message: 'Error al crear pagos', error: error.message });
  }
};

export const getPayments = async (req, res) => {
  try {
    const userId = req.user.id;

    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: [{ ano: 'desc' }, { mes: 'desc' }]
    });

    const paymentsWithMethod = payments.map(payment => ({
      ...payment,
      metodoPago: payment.esManual ? 'efectivo' : (payment.mpPaymentId ? 'web' : 'desconocido')
    }));

    res.json({ payments: paymentsWithMethod });
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

    const mesActualKey = `${currentYear}-${currentMonth}`;
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
        esManual: lastPayment.esManual,
        metodoPago: lastPayment.esManual ? 'efectivo' : (lastPayment.mpPaymentId ? 'web' : 'desconocido')
      } : null,
      pagoMesActual: pagoMesActual ? {
        id: pagoMesActual.id,
        monto: pagoMesActual.monto,
        mes: pagoMesActual.mes,
        ano: pagoMesActual.ano,
        fechaPago: pagoMesActual.fechaPago,
        esManual: pagoMesActual.esManual,
        metodoPago: pagoMesActual.esManual ? 'efectivo' : (pagoMesActual.mpPaymentId ? 'web' : 'desconocido')
      } : null
    });
  } catch (error) {
    console.error('Error al obtener estado de pago:', error);
    res.status(500).json({ message: 'Error al obtener estado de pago', error: error.message });
  }
};

export const handleWebhook = async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentInfo = await processWebhook({ type, data });
      
      if (paymentInfo) {
        // Buscar pago por external_reference o mpPaymentId
        const payment = await prisma.payment.findFirst({
          where: {
            OR: [
              { mpPaymentId: paymentInfo.paymentId },
              { mpPreferenceId: data.id?.toString() }
            ]
          }
        });

        if (payment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              estado: paymentInfo.status === 'approved' ? 'aprobado' : 'pendiente',
              mpPaymentId: paymentInfo.paymentId,
              mpStatus: paymentInfo.status,
              fechaPago: paymentInfo.status === 'approved' ? new Date() : null
            }
          });
        }
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error al procesar webhook:', error);
    res.status(500).json({ message: 'Error al procesar webhook', error: error.message });
  }
};

