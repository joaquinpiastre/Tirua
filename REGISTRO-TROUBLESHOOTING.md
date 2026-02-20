# Solución de Problemas - Registro de Usuarios

Si estás teniendo problemas al registrarte, sigue estos pasos para diagnosticar y solucionar el error.

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

### 3. Verificar las migraciones

Asegúrate de que las tablas estén creadas:

```bash
cd server
npx prisma migrate status
```

Si hay migraciones pendientes:
```bash
npx prisma migrate dev
```

## 🐛 Errores Comunes y Soluciones

### Error: "Error al registrarse" (genérico)

**Causas posibles:**
1. El servidor no está corriendo
2. La base de datos no está conectada
3. Faltan variables de entorno

**Solución:**
1. Verifica que el servidor esté corriendo en el puerto 5000
2. Revisa la consola del servidor para ver el error específico
3. Verifica el archivo `server/.env`

### Error: "El email ya está registrado"

**Causa:** Ya existe un usuario con ese email.

**Solución:**
- Usa un email diferente
- O elimina el usuario existente desde Prisma Studio:
  ```bash
  cd server
  npm run prisma:studio
  ```

### Error: "El DNI ya está registrado"

**Causa:** Ya existe un usuario con ese DNI.

**Solución:**
- Verifica que no hayas intentado registrarte antes
- O elimina el usuario existente desde Prisma Studio

### Error: "Error de validación"

**Causas posibles:**
- Nombre o apellido muy cortos (mínimo 2 caracteres)
- Email inválido
- Contraseña muy corta (mínimo 6 caracteres)
- DNI con formato incorrecto (7-10 caracteres)
- Teléfono con formato incorrecto (si se proporciona)

**Solución:**
- Revisa los mensajes de error específicos que aparecen
- Asegúrate de completar todos los campos requeridos correctamente

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

### Error: "JWT_SECRET no está configurado"

**Causa:** Falta la variable `JWT_SECRET` en el archivo `.env`.

**Solución:**
Agrega en `server/.env`:
```env
JWT_SECRET="tu_secreto_jwt_muy_seguro_aqui"
```

### Error: "Cannot read property 'trim' of undefined"

**Causa:** Algún campo requerido no se está enviando correctamente.

**Solución:**
- Verifica que todos los campos del formulario estén completos
- Revisa la consola del navegador (F12) para ver qué datos se están enviando

## 📋 Checklist de Verificación

Antes de reportar un error, verifica:

- [ ] El servidor backend está corriendo (puerto 5000)
- [ ] El cliente frontend está corriendo (puerto 5173)
- [ ] PostgreSQL está corriendo
- [ ] La base de datos `tirua_db` existe
- [ ] Las migraciones están aplicadas (`npx prisma migrate dev`)
- [ ] El archivo `server/.env` existe y tiene todas las variables
- [ ] `JWT_SECRET` está configurado en `.env`
- [ ] `DATABASE_URL` está correctamente configurado
- [ ] No hay errores en la consola del servidor
- [ ] No hay errores en la consola del navegador (F12)

## 🔧 Comandos de Diagnóstico

### Ver logs del servidor
```bash
cd server
npm run dev
# Los errores aparecerán en la consola
```

### Ver logs del cliente
Abre las herramientas de desarrollador del navegador (F12) y ve a la pestaña "Console"

### Verificar estado de Prisma
```bash
cd server
npx prisma migrate status
npx prisma generate
```

### Probar conexión a la base de datos
```bash
cd server
npx prisma studio
# Si se abre correctamente, la conexión funciona
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

## 🆘 Resetear Todo (Último Recurso)

Si nada funciona, puedes resetear la base de datos:

```bash
cd server
npx prisma migrate reset
# Esto borrará todos los datos y recreará las tablas
```

**⚠️ ADVERTENCIA:** Esto eliminará todos los usuarios y pagos existentes.



