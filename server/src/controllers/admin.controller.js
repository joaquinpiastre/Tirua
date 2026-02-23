import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import prisma from '../config/database.js';

export const getAllUsers = async (req, res) => {
  try {
    const { search, status } = req.query;

    let whereClause = {
      rol: 'socio'
    };

    if (search) {
      whereClause.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { apellido: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { dni: { contains: search, mode: 'insensitive' } },
        { nombreAlumno: { contains: search, mode: 'insensitive' } }
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const usersWithStatus = users.map(user => {
      // Buscar todos los pagos aprobados ordenados por fecha
      const approvedPayments = user.payments
        .filter(p => p.estado === 'aprobado' && p.mes && p.ano)
        .sort((a, b) => {
          if (a.ano !== b.ano) return b.ano - a.ano;
          return b.mes - a.mes;
        });

      // Buscar pago del mes actual
      const pagoMesActual = approvedPayments.find(p => 
        p.mes === currentMonth && 
        p.ano === currentYear
      );

      // Obtener el último pago aprobado (el más reciente)
      const lastPayment = approvedPayments[0] || user.payments[0];
      
      let accountStatus = 'sin_pagos';
      let isUpToDate = false;
      let isOverdue = false;

      // Si tiene pago del mes actual, está al día
      if (pagoMesActual) {
        accountStatus = 'al_dia';
        isUpToDate = true;
      } else if (lastPayment && lastPayment.estado === 'aprobado') {
        // Si tiene un pago aprobado pero no del mes actual
        if (lastPayment.mes && lastPayment.ano) {
          // Verificar si el último pago es de un mes anterior al actual
          const lastPaymentDate = new Date(lastPayment.ano, lastPayment.mes - 1, 1);
          const currentDateStart = new Date(currentYear, currentMonth - 1, 1);
          
          // Si el último pago es de un mes anterior, está con deuda
          if (lastPaymentDate < currentDateStart) {
            // Verificar si pasaron más de 30 días desde el último pago
            if (lastPayment.fechaPago) {
              const daysSincePayment = Math.floor(
                (new Date() - new Date(lastPayment.fechaPago)) / (1000 * 60 * 60 * 24)
              );
              if (daysSincePayment > 30) {
                accountStatus = 'vencido';
                isOverdue = true;
              } else {
                accountStatus = 'con_deuda';
              }
            } else {
              // Si no tiene fechaPago, usar la fecha del mes del pago
              const daysSincePayment = Math.floor(
                (new Date() - lastPaymentDate) / (1000 * 60 * 60 * 24)
              );
              if (daysSincePayment > 30) {
                accountStatus = 'vencido';
                isOverdue = true;
              } else {
                accountStatus = 'con_deuda';
              }
            }
          } else {
            // Si el último pago es del mes actual o futuro, está al día
            accountStatus = 'al_dia';
            isUpToDate = true;
          }
        } else {
          // Si el pago no tiene mes/ano, usar fechaPago
          if (lastPayment.fechaPago) {
            const daysSincePayment = Math.floor(
              (new Date() - new Date(lastPayment.fechaPago)) / (1000 * 60 * 60 * 24)
            );
            if (daysSincePayment > 30) {
              accountStatus = 'vencido';
              isOverdue = true;
            } else if (daysSincePayment <= 30) {
              accountStatus = 'con_deuda';
            }
          } else {
            accountStatus = 'con_deuda';
          }
        }
      } else if (lastPayment && lastPayment.estado === 'pendiente') {
        accountStatus = 'con_deuda';
      } else if (lastPayment) {
        accountStatus = 'con_deuda';
      }

      if (status && status !== 'todos') {
        if (status === 'al_dia' && accountStatus !== 'al_dia') return null;
        if (status === 'con_deuda' && accountStatus !== 'con_deuda' && accountStatus !== 'vencido') return null;
        if (status === 'vencido' && accountStatus !== 'vencido') return null;
        if (status === 'sin_pagos' && accountStatus !== 'sin_pagos') return null;
      }

      return {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        dni: user.dni,
        telefono: user.telefono,
        nombreAlumno: user.nombreAlumno,
        createdAt: user.createdAt,
        accountStatus,
        isUpToDate,
        isOverdue,
        lastPayment: lastPayment ? {
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
      };
    }).filter(user => user !== null);

    res.json({ users: usersWithStatus });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Buscar todos los pagos aprobados ordenados por fecha
    const approvedPayments = user.payments
      .filter(p => p.estado === 'aprobado' && p.mes && p.ano)
      .sort((a, b) => {
        if (a.ano !== b.ano) return b.ano - a.ano;
        return b.mes - a.mes;
      });

    // Buscar pago del mes actual
    const pagoMesActual = approvedPayments.find(p => 
      p.mes === currentMonth && 
      p.ano === currentYear
    );

    // Obtener el último pago aprobado (el más reciente)
    const lastPayment = approvedPayments[0] || user.payments[0];
    
    let accountStatus = 'sin_pagos';
    let isUpToDate = false;
    let isOverdue = false;

    // Si tiene pago del mes actual, está al día
    if (pagoMesActual) {
      accountStatus = 'al_dia';
      isUpToDate = true;
    } else if (lastPayment && lastPayment.estado === 'aprobado') {
      // Si tiene un pago aprobado pero no del mes actual
      if (lastPayment.mes && lastPayment.ano) {
        // Verificar si el último pago es de un mes anterior al actual
        const lastPaymentDate = new Date(lastPayment.ano, lastPayment.mes - 1, 1);
        const currentDateStart = new Date(currentYear, currentMonth - 1, 1);
        
        // Si el último pago es de un mes anterior, está con deuda
        if (lastPaymentDate < currentDateStart) {
          // Verificar si pasaron más de 30 días desde el último pago
          if (lastPayment.fechaPago) {
            const daysSincePayment = Math.floor(
              (new Date() - new Date(lastPayment.fechaPago)) / (1000 * 60 * 60 * 24)
            );
            if (daysSincePayment > 30) {
              accountStatus = 'vencido';
              isOverdue = true;
            } else {
              accountStatus = 'con_deuda';
            }
          } else {
            // Si no tiene fechaPago, usar la fecha del mes del pago
            const daysSincePayment = Math.floor(
              (new Date() - lastPaymentDate) / (1000 * 60 * 60 * 24)
            );
            if (daysSincePayment > 30) {
              accountStatus = 'vencido';
              isOverdue = true;
            } else {
              accountStatus = 'con_deuda';
            }
          }
        } else {
          // Si el último pago es del mes actual o futuro, está al día
          accountStatus = 'al_dia';
          isUpToDate = true;
        }
      } else {
        // Si el pago no tiene mes/ano, usar fechaPago
        if (lastPayment.fechaPago) {
          const daysSincePayment = Math.floor(
            (new Date() - new Date(lastPayment.fechaPago)) / (1000 * 60 * 60 * 24)
          );
          if (daysSincePayment > 30) {
            accountStatus = 'vencido';
            isOverdue = true;
          } else if (daysSincePayment <= 30) {
            accountStatus = 'con_deuda';
          }
        } else {
          accountStatus = 'con_deuda';
        }
      }
    } else if (lastPayment && lastPayment.estado === 'pendiente') {
      accountStatus = 'con_deuda';
    } else if (lastPayment) {
      accountStatus = 'con_deuda';
    }

    res.json({
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        dni: user.dni,
        telefono: user.telefono,
        rol: user.rol,
        nombreAlumno: user.nombreAlumno,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        accountStatus,
        isUpToDate,
        isOverdue,
        pagoMesActual: pagoMesActual ? {
          id: pagoMesActual.id,
          monto: pagoMesActual.monto,
          mes: pagoMesActual.mes,
          ano: pagoMesActual.ano,
          fechaPago: pagoMesActual.fechaPago,
          esManual: pagoMesActual.esManual,
          metodoPago: pagoMesActual.esManual ? 'efectivo' : (pagoMesActual.mpPaymentId ? 'web' : 'desconocido')
        } : null,
        payments: user.payments.map(p => ({
          ...p,
          metodoPago: p.esManual ? 'efectivo' : (p.mpPaymentId ? 'web' : 'desconocido')
        }))
      }
    });
  } catch (error) {
    console.error('Error al obtener detalles del usuario:', error);
    res.status(500).json({ message: 'Error al obtener detalles del usuario', error: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count({
      where: { rol: 'socio' }
    });

    const usersWithPayments = await prisma.user.findMany({
      where: { rol: 'socio' },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    let alDia = 0;
    let conDeuda = 0;
    let vencidos = 0;
    let sinPagos = 0;

    usersWithPayments.forEach(user => {
      // Buscar todos los pagos aprobados ordenados por fecha
      const approvedPayments = user.payments
        .filter(p => p.estado === 'aprobado' && p.mes && p.ano)
        .sort((a, b) => {
          if (a.ano !== b.ano) return b.ano - a.ano;
          return b.mes - a.mes;
        });

      // Buscar pago del mes actual
      const pagoMesActual = approvedPayments.find(p => 
        p.mes === currentMonth && 
        p.ano === currentYear
      );

      const lastPayment = approvedPayments[0] || user.payments[0];

      if (!lastPayment || (!lastPayment.mes && !lastPayment.ano && !lastPayment.fechaPago)) {
        sinPagos++;
      } else if (pagoMesActual) {
        alDia++;
      } else if (lastPayment && lastPayment.estado === 'aprobado') {
        if (lastPayment.mes && lastPayment.ano) {
          // Verificar si el último pago es de un mes anterior al actual
          const lastPaymentDate = new Date(lastPayment.ano, lastPayment.mes - 1, 1);
          const currentDateStart = new Date(currentYear, currentMonth - 1, 1);
          
          if (lastPaymentDate < currentDateStart) {
            // Verificar si pasaron más de 30 días
            if (lastPayment.fechaPago) {
              const daysSincePayment = Math.floor(
                (new Date() - new Date(lastPayment.fechaPago)) / (1000 * 60 * 60 * 24)
              );
              if (daysSincePayment > 30) {
                vencidos++;
              } else {
                conDeuda++;
              }
            } else {
              const daysSincePayment = Math.floor(
                (new Date() - lastPaymentDate) / (1000 * 60 * 60 * 24)
              );
              if (daysSincePayment > 30) {
                vencidos++;
              } else {
                conDeuda++;
              }
            }
          } else {
            // Si el último pago es del mes actual o futuro, está al día
            alDia++;
          }
        } else if (lastPayment.fechaPago) {
          const daysSincePayment = Math.floor(
            (new Date() - new Date(lastPayment.fechaPago)) / (1000 * 60 * 60 * 24)
          );
          if (daysSincePayment > 30) {
            vencidos++;
          } else {
            conDeuda++;
          }
        } else {
          conDeuda++;
        }
      } else {
        conDeuda++;
      }
    });

    const totalPayments = await prisma.payment.count({
      where: { estado: 'aprobado' }
    });

    const totalRevenue = await prisma.payment.aggregate({
      where: { estado: 'aprobado' },
      _sum: { monto: true }
    });

    res.json({
      stats: {
        totalUsers,
        alDia,
        conDeuda,
        vencidos,
        sinPagos,
        totalPayments,
        totalRevenue: totalRevenue._sum.monto || 0
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
};

export const markPaymentAsPaid = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { observaciones, mes, ano } = req.body;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { user: true }
    });

    if (!payment) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    let paymentMonth = mes ? parseInt(mes) : payment.mes;
    let paymentYear = ano ? parseInt(ano) : payment.ano;

    const currentDate = new Date();
    if (!paymentMonth || !paymentYear) {
      paymentMonth = currentDate.getMonth() + 1;
      paymentYear = currentDate.getFullYear();
    }

    const existingPayment = await prisma.payment.findFirst({
      where: {
        userId: payment.userId,
        mes: paymentMonth,
        ano: paymentYear,
        estado: 'aprobado',
        id: { not: paymentId }
      }
    });

    if (existingPayment) {
      return res.status(400).json({ 
        message: `Ya existe un pago aprobado para ${paymentMonth}/${paymentYear}. Por favor, verifica los datos.` 
      });
    }

    const updateData = {
      estado: 'aprobado',
      fechaPago: new Date(),
      esManual: true,
      observaciones: observaciones || null
    };

    if (!payment.mes || !payment.ano || mes || ano) {
      updateData.mes = paymentMonth;
      updateData.ano = paymentYear;
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: updateData
    });

    res.json({
      message: 'Pago marcado como aprobado exitosamente',
      payment: updatedPayment
    });
  } catch (error) {
    console.error('Error al marcar pago como aprobado:', error);
    
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        message: 'Ya existe un pago para este mes/año. Por favor, verifica los datos.' 
      });
    }
    
    res.status(500).json({ 
      message: 'Error al marcar pago como aprobado', 
      error: error.message 
    });
  }
};

export const createManualPayment = async (req, res) => {
  try {
    const { userId, monto, mes, ano, observaciones } = req.body;

    if (!userId || !mes || !ano) {
      return res.status(400).json({ 
        message: 'userId, mes y año son requeridos' 
      });
    }

    const existingPayment = await prisma.payment.findFirst({
      where: {
        userId,
        mes: parseInt(mes),
        ano: parseInt(ano)
      }
    });

    if (existingPayment && existingPayment.estado === 'aprobado') {
      return res.status(400).json({ 
        message: `Ya existe un pago aprobado para ${mes}/${ano}` 
      });
    }

    const payment = await prisma.payment.create({
      data: {
        userId,
        monto: monto || 5000,
        estado: 'aprobado',
        mes: parseInt(mes),
        ano: parseInt(ano),
        fechaPago: new Date(),
        esManual: true,
        observaciones: observaciones || null
      }
    });

    res.json({
      message: 'Pago manual creado exitosamente',
      payment
    });
  } catch (error) {
    console.error('Error al crear pago manual:', error);
    
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        message: 'Ya existe un pago para este mes/año' 
      });
    }
    
    res.status(500).json({ 
      message: 'Error al crear pago manual', 
      error: error.message 
    });
  }
};

export const getMaestros = async (req, res) => {
  try {
    const maestros = await prisma.user.findMany({
      where: { rol: 'maestro' },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        dni: true,
        telefono: true,
        createdAt: true,
        _count: { select: { clasesComoMaestro: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ maestros });
  } catch (error) {
    console.error('Error al obtener maestros:', error);
    res.status(500).json({ message: 'Error al obtener maestros', error: error.message });
  }
};

export const registerMaestro = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Error de validación', errors: errors.array() });
    }
    const { nombre, apellido, email, password, dni, telefono } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();
    const normalizedDni = (dni || '').trim();

    const existingEmail = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });
    if (existingEmail) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    const existingDni = await prisma.user.findUnique({
      where: { dni: normalizedDni }
    });
    if (existingDni) {
      return res.status(400).json({ message: 'El DNI ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const maestro = await prisma.user.create({
      data: {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        dni: normalizedDni,
        telefono: (telefono && telefono.trim() !== '') ? telefono.trim() : null,
        rol: 'maestro'
      },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        dni: true,
        telefono: true,
        rol: true,
        createdAt: true
      }
    });
    res.status(201).json({
      message: 'Maestro registrado correctamente. Puede iniciar sesión con su email y contraseña.',
      maestro
    });
  } catch (error) {
    console.error('Error al registrar maestro:', error);
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      if (field === 'email') return res.status(400).json({ message: 'El email ya está registrado' });
      if (field === 'dni') return res.status(400).json({ message: 'El DNI ya está registrado' });
    }
    res.status(500).json({ message: 'Error al registrar maestro', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        payments: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // No permitir eliminar administradores
    if (user.rol === 'admin') {
      return res.status(403).json({ 
        message: 'No se puede eliminar un usuario administrador' 
      });
    }

    // No permitir que un administrador se elimine a sí mismo
    if (user.id === req.user.id) {
      return res.status(403).json({ 
        message: 'No puedes eliminar tu propia cuenta' 
      });
    }

    // Eliminar primero los pagos asociados (cascada manual)
    await prisma.payment.deleteMany({
      where: { userId: userId }
    });

    // Eliminar el usuario
    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({
      message: 'Usuario eliminado exitosamente',
      deletedUser: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }
    
    res.status(500).json({ 
      message: 'Error al eliminar usuario', 
      error: error.message 
    });
  }
};

