import { body } from 'express-validator';

export const validateRegister = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  
  body('apellido')
    .trim()
    .notEmpty().withMessage('El apellido es requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('El email no es válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  
  body('dni')
    .trim()
    .notEmpty().withMessage('El DNI es requerido')
    .isLength({ min: 7, max: 10 }).withMessage('El DNI debe tener entre 7 y 10 caracteres'),
  
  body('telefono')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .custom((value) => {
      if (!value || value === '') {
        return true;
      }
      const phoneRegex = /^(\+?54)?\s?9?\s?(\d{2,4})\s?-?\s?(\d{6,8})$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        throw new Error('El teléfono no tiene un formato válido');
      }
      return true;
    }),
  body('nombreAlumno')
    .trim()
    .notEmpty().withMessage('El nombre del alumno es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre del alumno debe tener entre 2 y 100 caracteres')
];

// Validación para registro de maestro (solo admin). Sin nombreAlumno.
export const validateRegisterMaestro = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('apellido')
    .trim()
    .notEmpty().withMessage('El apellido es requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres'),
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('El email no es válido')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('dni')
    .trim()
    .notEmpty().withMessage('El DNI es requerido')
    .isLength({ min: 7, max: 10 }).withMessage('El DNI debe tener entre 7 y 10 caracteres'),
  body('telefono')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
];

export const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('El email no es válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
];



