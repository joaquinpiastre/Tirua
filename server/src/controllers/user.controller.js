import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';

export const updateProfile = async (req, res) => {
  try {
    const { nombre, apellido, email, telefono } = req.body;
    const userId = req.user.id;

    // Verificar si el email ya está en uso por otro usuario
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() }
      });

      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: 'El email ya está en uso' });
      }
    }

    // Actualizar perfil
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(nombre && { nombre: nombre.trim() }),
        ...(apellido && { apellido: apellido.trim() }),
        ...(email && { email: email.trim().toLowerCase() }),
        ...(telefono !== undefined && { 
          telefono: (telefono && telefono.trim() !== '') ? telefono.trim() : null 
        })
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

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ 
      message: 'Error al actualizar perfil', 
      error: error.message 
    });
  }
};



