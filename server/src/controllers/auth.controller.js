import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import prisma from '../config/database.js';

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Error de validación',
        errors: errors.array() 
      });
    }

    const { nombre, apellido, email, password, dni, telefono } = req.body;

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET no está configurado en las variables de entorno');
      return res.status(500).json({ message: 'Error de configuración del servidor' });
    }

    // Normalizar email antes de verificar
    const normalizedEmail = email.trim().toLowerCase();

    // Verificar si el email ya existe
    const existingEmail = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingEmail) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Verificar si el DNI ya existe
    const normalizedDni = dni.trim();
    const existingDni = await prisma.user.findUnique({
      where: { dni: normalizedDni }
    });

    if (existingDni) {
      return res.status(400).json({ message: 'El DNI ya está registrado' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        dni: normalizedDni,
        telefono: (telefono && telefono.trim() !== '') ? telefono.trim() : null,
        rol: 'socio'
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

    // Generar token
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user,
      token
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    
    // Manejar errores específicos de Prisma
    if (error.code === 'P2002') {
      // Error de constraint único
      const field = error.meta?.target?.[0];
      if (field === 'email') {
        return res.status(400).json({ message: 'El email ya está registrado' });
      }
      if (field === 'dni') {
        return res.status(400).json({ message: 'El DNI ya está registrado' });
      }
      return res.status(400).json({ message: 'Ya existe un usuario con estos datos' });
    }
    
    // Error de conexión a la base de datos
    if (error.code === 'P1001' || error.message.includes('connect')) {
      return res.status(500).json({ 
        message: 'Error de conexión a la base de datos. Por favor, verifica la configuración.' 
      });
    }
    
    res.status(500).json({ 
      message: 'Error al registrar usuario', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
    });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Error de validación',
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET no está configurado en las variables de entorno');
      return res.status(500).json({ message: 'Error de configuración del servidor' });
    }

    // Normalizar email
    const normalizedEmail = email.trim().toLowerCase();

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        dni: user.dni,
        telefono: user.telefono,
        rol: user.rol,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    
    // Error de conexión a la base de datos
    if (error.code === 'P1001' || error.message.includes('connect') || error.message.includes('Can\'t reach database')) {
      return res.status(500).json({ 
        message: 'Error de conexión a la base de datos. Por favor, verifica la configuración.' 
      });
    }
    
    // Error de Prisma
    if (error.code && error.code.startsWith('P')) {
      return res.status(500).json({ 
        message: 'Error en la base de datos. Por favor, intenta nuevamente.' 
      });
    }
    
    res.status(500).json({ 
      message: 'Error al iniciar sesión', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
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

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ 
      message: 'Error al obtener perfil', 
      error: error.message 
    });
  }
};

