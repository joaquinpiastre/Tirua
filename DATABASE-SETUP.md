# Guía de Configuración de Base de Datos - Tirùa

Esta guía te ayudará a configurar y ejecutar la base de datos PostgreSQL para el proyecto Tirùa.

## Requisitos Previos

1. **PostgreSQL instalado** (versión 12 o superior)
   - Descarga desde: https://www.postgresql.org/download/
   - O usa un servicio en la nube como:
     - [Supabase](https://supabase.com) (gratis)
     - [Railway](https://railway.app) (gratis con límites)
     - [Render](https://render.com) (gratis con límites)

2. **Node.js y npm** instalados

## Opción 1: Base de Datos Local (PostgreSQL en tu computadora)

### Paso 1: Instalar PostgreSQL

**Windows:**
1. Descarga el instalador desde https://www.postgresql.org/download/windows/
2. Ejecuta el instalador y sigue las instrucciones
3. Durante la instalación, anota la contraseña del usuario `postgres`
4. Asegúrate de que el servicio PostgreSQL esté corriendo

**macOS:**
```bash
# Usando Homebrew
brew install postgresql@14
brew services start postgresql@14
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Paso 2: Crear la Base de Datos

1. Abre pgAdmin o la terminal de PostgreSQL

**Usando pgAdmin:**
1. Abre pgAdmin
2. Conéctate al servidor (usualmente `localhost`)
3. Click derecho en "Databases" → "Create" → "Database"
4. Nombre: `tirua_db`
5. Click en "Save"

**Usando Terminal (psql):**
```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE tirua_db;

# Salir
\q
```

### Paso 3: Configurar Variables de Entorno

1. Ve a la carpeta `server`
2. Crea un archivo `.env` (si no existe)
3. Agrega la siguiente configuración:

```env
# Base de Datos
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/tirua_db?schema=public"

# JWT
JWT_SECRET="tu_secreto_jwt_muy_seguro_aqui_cambiar_en_produccion"

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN="tu_token_de_mercado_pago"

# URLs
FRONTEND_URL="http://localhost:5173"
BACKEND_URL="http://localhost:5000"

# Puerto del servidor
PORT=5000
```

**⚠️ IMPORTANTE:** 
- Reemplaza `TU_CONTRASEÑA` con la contraseña que configuraste para el usuario `postgres`
- Reemplaza `tu_secreto_jwt_muy_seguro_aqui_cambiar_en_produccion` con una cadena aleatoria segura
- Reemplaza `tu_token_de_mercado_pago` con tu token de acceso de Mercado Pago

### Paso 4: Ejecutar Migraciones

1. Abre una terminal en la carpeta `server`
2. Ejecuta los siguientes comandos:

```bash
# Generar el cliente de Prisma
npm run prisma:generate

# Ejecutar las migraciones (crea las tablas)
npx prisma migrate dev

# (Opcional) Abrir Prisma Studio para ver los datos
npm run prisma:studio
```

## Opción 2: Base de Datos en la Nube (Recomendado para desarrollo)

### Usando Supabase (Gratis)

1. Ve a https://supabase.com
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Ve a "Settings" → "Database"
5. Copia la "Connection string" (URI)
6. Úsala en tu archivo `.env`:

```env
DATABASE_URL="postgresql://postgres:[TU-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### Usando Railway (Gratis)

1. Ve a https://railway.app
2. Crea una cuenta
3. Crea un nuevo proyecto
4. Agrega un servicio PostgreSQL
5. Copia la "DATABASE_URL" de las variables de entorno
6. Úsala en tu archivo `.env`

## Verificar que la Base de Datos Funciona

### Verificar Conexión

1. En la terminal, dentro de la carpeta `server`:
```bash
node -e "require('dotenv').config(); const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.$connect().then(() => { console.log('✅ Conexión exitosa a la base de datos'); process.exit(0); }).catch((e) => { console.error('❌ Error:', e.message); process.exit(1); });"
```

### Ver Datos con Prisma Studio

```bash
cd server
npm run prisma:studio
```

Esto abrirá una interfaz web en http://localhost:5555 donde podrás ver y editar los datos.

## Comandos Útiles

```bash
# Generar cliente de Prisma (después de cambiar schema.prisma)
npm run prisma:generate

# Crear una nueva migración
npx prisma migrate dev --name nombre_de_la_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Resetear la base de datos (⚠️ CUIDADO: borra todos los datos)
npx prisma migrate reset

# Ver el estado de las migraciones
npx prisma migrate status

# Abrir Prisma Studio
npm run prisma:studio
```

## Solución de Problemas

### Error: "Can't reach database server"

- Verifica que PostgreSQL esté corriendo
- Verifica que la URL de conexión sea correcta
- Verifica que el puerto (5432 por defecto) esté abierto

### Error: "database does not exist"

- Asegúrate de haber creado la base de datos
- Verifica el nombre de la base de datos en `DATABASE_URL`

### Error: "password authentication failed"

- Verifica que la contraseña en `.env` sea correcta
- Si olvidaste la contraseña, puedes resetearla en pgAdmin

### Error: "relation already exists"

- Esto significa que las tablas ya existen
- Puedes usar `npx prisma migrate reset` para empezar de nuevo (⚠️ borra datos)
- O simplemente continúa, las migraciones son idempotentes

## Estructura de la Base de Datos

Después de ejecutar las migraciones, tendrás las siguientes tablas:

- **users**: Almacena información de usuarios (socios y administradores)
- **payments**: Almacena información de pagos mensuales

## Próximos Pasos

Una vez que la base de datos esté configurada:

1. Ejecuta el servidor: `npm run dev` (desde la raíz del proyecto)
2. Crea tu primer usuario administrador (ver `ADMIN-SETUP.md`)
3. ¡Listo para usar!

## Soporte

Si tienes problemas, verifica:
- Los logs del servidor
- Los logs de Prisma
- La documentación oficial de Prisma: https://www.prisma.io/docs

