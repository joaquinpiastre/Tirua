# 🚀 Inicio Rápido - Tirùa

Guía rápida para iniciar el proyecto desde cero.

## ⚡ Inicio en 3 Pasos

### 1. Instalar Dependencias

```bash
# Desde la raíz del proyecto
npm run install:all
```

Esto instalará las dependencias de:
- La raíz del proyecto
- El cliente (React)
- El servidor (Node.js)

### 2. Configurar Base de Datos

1. Crea el archivo `server/.env`:
   ```env
   DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/tirua_db?schema=public"
   JWT_SECRET="tu_secreto_jwt_muy_seguro_aqui"
   PORT=5000
   FRONTEND_URL="http://localhost:5173"
   BACKEND_URL="http://localhost:5000"
   ```

2. Crea la base de datos (ver `DATABASE-SETUP.md`)

3. Ejecuta las migraciones:
   ```bash
   cd server
   npm run prisma:generate
   npx prisma migrate dev
   ```

### 3. Iniciar el Proyecto

```bash
# Desde la raíz del proyecto
npm run dev
```

Esto iniciará:
- **Servidor backend** en http://localhost:5000
- **Cliente frontend** en http://localhost:5173

## ✅ Verificar que Todo Funciona

1. **Servidor backend:**
   - Abre: http://localhost:5000/api/health
   - Deberías ver: `{"status":"ok","message":"Tirùa API is running"}`

2. **Cliente frontend:**
   - Abre: http://localhost:5173
   - Deberías ver la página de inicio de Tirùa

3. **Probar registro:**
   - Ve a http://localhost:5173/register
   - Completa el formulario
   - Deberías poder registrarte exitosamente

## 🐛 Problemas Comunes

### "No se pudo conectar al servidor"
→ Ver `SERVIDOR-CONEXION.md`

### "Error de conexión a la base de datos"
→ Ver `DATABASE-SETUP.md`

### "Error al registrarse" o "Error al iniciar sesión"
→ Ver `REGISTRO-TROUBLESHOOTING.md` o `LOGIN-TROUBLESHOOTING.md`

## 📚 Documentación Completa

- `DATABASE-SETUP.md` - Configurar la base de datos
- `SERVIDOR-CONEXION.md` - Solucionar problemas de conexión
- `REGISTRO-TROUBLESHOOTING.md` - Problemas con registro
- `LOGIN-TROUBLESHOOTING.md` - Problemas con login

## 🎯 Próximos Pasos

1. Registra tu primer usuario
2. Crea un usuario administrador (ver `ADMIN-SETUP.md` si existe)
3. Configura Mercado Pago (agrega `MERCADOPAGO_ACCESS_TOKEN` en `server/.env`)

