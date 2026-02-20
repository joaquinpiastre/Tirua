import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  options: { timeout: 5000 }
});

const preference = new Preference(client);

export const createPaymentPreference = async (payment, user) => {
  try {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const monthName = payment.mes ? monthNames[payment.mes - 1] : '';
    const description = payment.mes && payment.ano 
      ? `Cuota ${monthName} ${payment.ano} - Tirùa`
      : `Cuota mensual - Tirùa`;

    const preferenceData = {
      items: [
        {
          title: description,
          quantity: 1,
          unit_price: payment.monto,
          currency_id: 'ARS'
        }
      ],
      payer: {
        name: user.nombre,
        surname: user.apellido,
        email: user.email
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/socios/pago-exitoso`,
        failure: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/socios/pago-error`,
        pending: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/socios/pago-pendiente`
      },
      auto_return: 'approved',
      external_reference: payment.id,
      notification_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/webhook`,
      statement_descriptor: 'TIRUA TALLER'
    };

    const response = await preference.create({ body: preferenceData });

    return {
      id: response.id,
      initPoint: response.init_point,
      sandboxInitPoint: response.sandbox_init_point
    };
  } catch (error) {
    console.error('Error al crear preferencia de Mercado Pago:', error);
    throw error;
  }
};

export const processWebhook = async (paymentData) => {
  try {
    const { type, data } = paymentData;

    if (type === 'payment') {
      const paymentId = data.id;
      // Aquí podrías hacer una llamada a la API de Mercado Pago para obtener los detalles del pago
      // Por ahora, retornamos la información básica
      return {
        paymentId: paymentId.toString(),
        status: 'approved' // En producción, deberías verificar el estado real
      };
    }

    return null;
  } catch (error) {
    console.error('Error al procesar webhook:', error);
    throw error;
  }
};



