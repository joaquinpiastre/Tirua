# Solución: "No se pudo conectar al servidor"

Esta guía te ayudará a solucionar el error "No se pudo conectar al servidor. Verifica que el servidor esté corriendo."

## 🔍 Diagnóstico Rápido

### Paso 1: Verificar que el servidor esté corriendo

Abre una terminal y ejecuta:

```bash
# Opción 1: Desde la raíz del proyecto
npm run dev

# Opción 2: Manualmente en dos terminales
# Terminal 1 - Servidor
cd server
npm run dev

# Terminal 2 - Cliente
cd client
npm run dev
```

**¿Qué deberías ver?**

**En el servidor (Terminal 1):**
```
🚀 Server running on port 5000
```

**En el cliente (Terminal 2):**
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Paso 2: Probar la conexión manualmente

Abre tu navegador o usa curl:

```bash
# En el navegador, ve a:
http://localhost:5000/api/health

# O desde la terminal:
curl http://localhost:5000/api/health
```

**Respuesta esperada:**
```json
{"status":"ok","message":"Tirùa API is running"}
```

Si esto no funciona, el servidor NO está corriendo correctamente.

## 🐛 Soluciones por Problema

### Problema 1: El servidor no inicia

**Síntomas:**
- No ves el mensaje "🚀 Server running on port 5000"
- Hay errores en la consola del servidor

**Soluciones:**

1. **Verifica que las dependencias estén instaladas:**
   ```bash
   cd server
   npm install
   ```

2. **Verifica que el puerto 5000 esté libre:**
   ```bash
   # Windows PowerShell
   netstat -ano | findstr :5000
   
   # macOS/Linux
   lsof -i :5000
   ```
   
   Si hay algo usando el puerto, detén ese proceso o cambia el puerto en `server/.env`:
   ```env
   PORT=5001
   ```
   Y actualiza `client/src/services/api.js`:
   ```javascript
   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
   ```

3. **Verifica que la base de datos esté configurada:**
   - Asegúrate de tener un archivo `server/.env` con `DATABASE_URL`
   - Verifica que PostgreSQL esté corriendo

4. **Revisa los errores en la consola:**
   - Copia el error completo
   - Los errores más comunes son:
     - Base de datos no conectada
     - Variables de entorno faltantes
     - Dependencias no instaladas

### Problema 2: El servidor inicia pero el cliente no se conecta

**Síntomas:**
- El servidor muestra "🚀 Server running on port 5000"
- Pero el cliente muestra "No se pudo conectar al servidor"

**Soluciones:**

1. **Verifica la URL en el cliente:**
   
   Abre `client/src/services/api.js` y verifica:
   ```javascript
   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
   ```
   
   Debe coincidir con el puerto del servidor.

2. **Verifica CORS:**
   
   En `server/src/index.js`, verifica:
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'http://localhost:5173',
     credentials: true
   }));
   ```
   
   El puerto debe coincidir con el puerto del cliente (normalmente 5173 para Vite).

3. **Crea un archivo `.env` en el cliente (opcional):**
   
   Crea `client/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   
   Luego reinicia el servidor de desarrollo del cliente.

4. **Verifica el firewall:**
   - Asegúrate de que el firewall no esté bloqueando el puerto 5000
   - En Windows, puede que necesites permitir Node.js en el firewall

### Problema 3: Error "ECONNREFUSED" o "Network Error"

**Síntomas:**
- Error en la consola del navegador: "Failed to fetch" o "Network Error"
- El servidor parece estar corriendo pero no responde

**Soluciones:**

1. **Verifica que ambos servidores estén corriendo:**
   - Servidor backend: puerto 5000
   - Cliente frontend: puerto 5173

2. **Reinicia ambos servidores:**
   ```bash
   # Detén ambos (Ctrl+C)
   # Luego reinicia
   npm run dev
   ```

3. **Verifica que no haya errores en la consola del servidor:**
   - Busca errores de conexión a la base de datos
   - Busca errores de variables de entorno

4. **Prueba la conexión directamente:**
   ```bash
   # Desde otra terminal
   curl http://localhost:5000/api/health
   ```
   
   Si esto funciona pero el cliente no, es un problema de CORS o configuración del cliente.

### Problema 4: El servidor se detiene inmediatamente

**Síntomas:**
- El servidor inicia pero se cierra inmediatamente
- Hay errores de sintaxis o módulos no encontrados

**Soluciones:**

1. **Verifica que todas las dependencias estén instaladas:**
   ```bash
   cd server
   npm install
   ```

2. **Verifica que Prisma esté generado:**
   ```bash
   cd server
   npm run prisma:generate
   ```

3. **Revisa los errores en la consola:**
   - Los errores más comunes:
     - `Cannot find module` → Falta instalar dependencias
     - `SyntaxError` → Error en el código
     - `DATABASE_URL is not defined` → Falta archivo `.env`

## 📋 Checklist Completo

Antes de reportar un problema, verifica:

- [ ] **Servidor backend:**
  - [ ] Está corriendo en el puerto 5000 (o el configurado)
  - [ ] Muestra el mensaje "🚀 Server running on port XXXX"
  - [ ] No hay errores en la consola del servidor
  - [ ] Responde a `http://localhost:5000/api/health`

- [ ] **Cliente frontend:**
  - [ ] Está corriendo en el puerto 5173 (o el configurado)
  - [ ] Muestra "ready in XXX ms"
  - [ ] No hay errores en la consola del navegador
  - [ ] La URL en `api.js` es correcta

- [ ] **Configuración:**
  - [ ] Existe `server/.env` con `DATABASE_URL` y `JWT_SECRET`
  - [ ] PostgreSQL está corriendo
  - [ ] Las dependencias están instaladas (`npm install` en ambas carpetas)
  - [ ] Prisma está generado (`npm run prisma:generate`)

- [ ] **Red:**
  - [ ] El firewall no está bloqueando los puertos
  - [ ] No hay otros procesos usando los puertos
  - [ ] CORS está configurado correctamente

## 🔧 Comandos de Diagnóstico

### Verificar que el servidor esté corriendo
```bash
# Windows PowerShell
Get-Process -Name node -ErrorAction SilentlyContinue

# macOS/Linux
ps aux | grep node
```

### Verificar qué está usando el puerto 5000
```bash
# Windows PowerShell
netstat -ano | findstr :5000

# macOS/Linux
lsof -i :5000
```

### Probar la API directamente
```bash
# Health check
curl http://localhost:5000/api/health

# Debería responder: {"status":"ok","message":"Tirùa API is running"}
```

### Ver logs del servidor en tiempo real
```bash
cd server
npm run dev
# Todos los errores aparecerán aquí
```

### Ver logs del cliente en tiempo real
Abre las herramientas de desarrollador del navegador (F12) → Console

## 🚀 Solución Rápida (Paso a Paso)

Si nada funciona, sigue estos pasos en orden:

1. **Detén todos los procesos:**
   ```bash
   # Presiona Ctrl+C en todas las terminales
   ```

2. **Instala dependencias:**
   ```bash
   # Desde la raíz
   npm run install:all
   ```

3. **Verifica la base de datos:**
   ```bash
   cd server
   npm run prisma:generate
   ```

4. **Inicia el servidor:**
   ```bash
   # Desde la raíz
   npm run dev
   ```

5. **Verifica que ambos estén corriendo:**
   - Servidor: http://localhost:5000/api/health
   - Cliente: http://localhost:5173

6. **Prueba el login/registro nuevamente**

## 🆘 Si Nada Funciona

1. **Revisa los logs completos:**
   - Consola del servidor (terminal donde corre `npm run dev`)
   - Consola del navegador (F12 → Console)
   - Copia todos los errores

2. **Verifica la configuración:**
   - `server/.env` existe y tiene todas las variables
   - `server/src/index.js` está correcto
   - `client/src/services/api.js` tiene la URL correcta

3. **Prueba con comandos manuales:**
   ```bash
   # Terminal 1
   cd server
   npm run dev
   
   # Terminal 2 (en otra ventana)
   cd client
   npm run dev
   ```

4. **Documenta el problema:**
   - Qué error exacto aparece
   - En qué momento ocurre
   - Qué pasos seguiste antes del error
   - Capturas de pantalla de los errores

## 📞 Información para Obtener Ayuda

Si necesitas ayuda adicional, proporciona:

1. **Mensaje de error exacto** (copiado completo)
2. **Logs del servidor** (últimas 20 líneas)
3. **Logs del navegador** (F12 → Console)
4. **Configuración:**
   - Puerto del servidor
   - Puerto del cliente
   - Versión de Node.js (`node --version`)
   - Sistema operativo



