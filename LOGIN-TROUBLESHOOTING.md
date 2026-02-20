# Solución de Problemas - Inicio de Sesión

Si estás teniendo problemas al iniciar sesión, sigue estos pasos para diagnosticar y solucionar el error.

## 🔍 Diagnóstico Rápido

### 1. Verificar que el servidor esté corriendo

Abre una terminal y verifica que el servidor esté activo:

```bash
# En la carpeta raíz del proyecto
npm run dev
```

O verifica manualmente:
```bash
# Terminal 1 - Servidor
cd server
npm run dev

# Terminal 2 - Cliente
cd client
npm run dev
```

### 2. Verificar la conexión a la base de datos

Asegúrate de que:
- PostgreSQL esté corriendo
- La base de datos `tirua_db` exista
- El archivo `.env` en `server/` tenga la configuración correcta

**Verificar conexión:**
```bash
cd server
node -e "require('dotenv').config(); const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.\$connect().then(() => { console.log('✅ Base de datos conectada'); process.exit(0); }).catch((e) => { console.error('❌ Error:', e.message); process.exit(1); });"
```

### 3. Verificar que el usuario exista

Abre Prisma Studio para verificar que el usuario esté registrado:

```bash
cd server
npm run prisma:studio
```

Busca tu usuario por email y verifica que exista.

## 🐛 Errores Comunes y Soluciones

### Error: "Email o contraseña incorrectos"

**Causas posibles:**
1. El email no está registrado
2. La contraseña es incorrecta
3. El email tiene mayúsculas/minúsculas diferentes

**Solución:**
1. Verifica que el email sea exactamente el mismo que usaste al registrarte
2. Verifica que la contraseña sea correcta (sin espacios al inicio o final)
3. Intenta copiar y pegar el email para evitar errores de tipeo
4. Si olvidaste la contraseña, necesitarás registrarte nuevamente o usar Prisma Studio para cambiar la contraseña

**Cambiar contraseña desde Prisma Studio:**
1. Abre Prisma Studio: `cd server && npm run prisma:studio`
2. Busca tu usuario
3. Edita el campo `password` (necesitarás hashearlo primero con bcrypt)

### Error: "Error de conexión a la base de datos"

**Causas posibles:**
1. PostgreSQL no está corriendo
2. La URL de conexión en `.env` es incorrecta
3. La contraseña es incorrecta
4. El puerto está bloqueado

**Solución:**
1. Verifica que PostgreSQL esté corriendo:
   - **Windows:** Servicios → PostgreSQL
   - **macOS:** `brew services list`
   - **Linux:** `sudo systemctl status postgresql`

2. Verifica la URL en `server/.env`:
   ```env
   DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/tirua_db?schema=public"
   ```

3. Prueba conectarte manualmente:
   ```bash
   psql -U postgres -d tirua_db
   ```

### Error: "Network Error" o "ECONNREFUSED"

**Causa:** El servidor backend no está corriendo o no es accesible.

**Solución:**
1. Verifica que el servidor esté corriendo en el puerto 5000
2. Verifica la URL en `client/src/services/api.js`:
   ```javascript
   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
   ```
3. Verifica que no haya un firewall bloqueando la conexión
4. Verifica los logs del servidor para ver si hay errores

### Error: "Error de validación"

**Causas posibles:**
- Email inválido
- Campos vacíos

**Solución:**
- Asegúrate de que el email tenga un formato válido (ejemplo@dominio.com)
- Completa todos los campos requeridos

### Error: "JWT_SECRET no está configurado"

**Causa:** Falta la variable `JWT_SECRET` en el archivo `.env`.

**Solución:**
Agrega en `server/.env`:
```env
JWT_SECRET="tu_secreto_jwt_muy_seguro_aqui"
```

### Error: "Error de configuración del servidor"

**Causa:** Faltan variables de entorno necesarias.

**Solución:**
Verifica que `server/.env` tenga al menos:
```env
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/tirua_db?schema=public"
JWT_SECRET="tu_secreto_jwt_muy_seguro_aqui"
```

### Error: "Token inválido" o "Token expirado"

**Causa:** El token almacenado en el navegador es inválido o expiró.

**Solución:**
1. Limpia el localStorage del navegador:
   - Abre las herramientas de desarrollador (F12)
   - Ve a "Application" → "Local Storage"
   - Elimina las entradas `token` y `user`
2. Intenta iniciar sesión nuevamente

### Error: "Usuario no encontrado"

**Causa:** El usuario fue eliminado de la base de datos o el token hace referencia a un usuario que ya no existe.

**Solución:**
1. Limpia el localStorage (ver arriba)
2. Verifica que el usuario exista en la base de datos usando Prisma Studio
3. Si el usuario no existe, regístrate nuevamente

## 📋 Checklist de Verificación

Antes de reportar un error, verifica:

- [ ] El servidor backend está corriendo (puerto 5000)
- [ ] El cliente frontend está corriendo (puerto 5173)
- [ ] PostgreSQL está corriendo
- [ ] La base de datos `tirua_db` existe
- [ ] El usuario existe en la base de datos
- [ ] El email y contraseña son correctos
- [ ] El archivo `server/.env` existe y tiene todas las variables
- [ ] `JWT_SECRET` está configurado en `.env`
- [ ] `DATABASE_URL` está correctamente configurado
- [ ] No hay errores en la consola del servidor
- [ ] No hay errores en la consola del navegador (F12)
- [ ] El localStorage no tiene tokens inválidos

## 🔧 Comandos de Diagnóstico

### Ver logs del servidor
```bash
cd server
npm run dev
# Los errores aparecerán en la consola
```

### Ver logs del cliente
Abre las herramientas de desarrollador del navegador (F12) y ve a la pestaña "Console"

### Verificar usuarios en la base de datos
```bash
cd server
npx prisma studio
# Busca tu usuario por email
```

### Limpiar localStorage
```javascript
// En la consola del navegador (F12)
localStorage.clear();
```

### Probar conexión a la API
```bash
# Desde la terminal
curl http://localhost:5000/api/health
# Debería responder: {"status":"ok","message":"Tirùa API is running"}
```

## 🔐 Recuperar Contraseña

Si olvidaste tu contraseña, actualmente no hay un sistema de recuperación. Opciones:

1. **Registrarse nuevamente** (si el email no está en uso)
2. **Cambiar contraseña manualmente** desde Prisma Studio:
   ```bash
   cd server
   npm run prisma:studio
   # Edita el usuario y cambia la contraseña
   # Necesitarás hashearla con bcrypt primero
   ```

## 🆘 Resetear Todo (Último Recurso)

Si nada funciona:

1. **Limpia el localStorage del navegador**
2. **Verifica la configuración de la base de datos**
3. **Reinicia el servidor**

```bash
# Detén el servidor (Ctrl+C)
# Luego reinícialo
cd server
npm run dev
```

## 📞 Obtener Ayuda

Si el problema persiste:

1. **Revisa los logs del servidor** - Copia el error completo
2. **Revisa la consola del navegador** - F12 → Console
3. **Verifica la configuración** - Revisa `server/.env`
4. **Documenta el error** - Anota:
   - El mensaje de error exacto
   - Qué estabas haciendo cuando ocurrió
   - Los pasos para reproducirlo
   - Si el usuario existe en la base de datos



