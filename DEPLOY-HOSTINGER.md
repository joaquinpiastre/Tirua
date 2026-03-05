# Guía para subir Tirúa a tu VPS (tallertirua.com)

Tu VPS ya tiene **ceramicasasanrafael.com**. Esta guía explica cómo agregar **tallertirua.com** en el mismo servidor: frontend (React), backend (Node.js) y subida con **WinSCP**.

---

## Resumen rápido

| Parte        | Dónde va en la VPS                    | Cómo se sube              |
|-------------|----------------------------------------|----------------------------|
| Frontend    | Carpeta web de tallertirua.com         | Build local + WinSCP       |
| Backend     | Carpeta propia (ej. `tallertirua-api`) | WinSCP + PM2 en el servidor |
| Base de datos | PostgreSQL (en la VPS o externa)    | Crear BD + `DATABASE_URL` en .env |

---

## 1. Estructura típica en la VPS

En muchos VPS las webs están en `/var/www/` o `/home/tu_usuario/`:

- **ceramicasasanrafael.com** → ya tenés algo como `/var/www/ceramicasasanrafael` o similar.
- **tallertirua.com** → conviene crear una carpeta solo para Tirúa.

Ejemplo de estructura:

```
/var/www/
  ceramicasasanrafael/    (o como ya lo tengas)
  tallertirua/            ← aquí va el FRONTEND (contenido de client/dist)
  tallertirua-api/        ← aquí va el BACKEND (código del server)
```

Si en tu VPS usás otro camino (por ejemplo dentro de `/home/usuario/`), usá el mismo criterio: una carpeta para la web de tallertirua y otra para la API.

---

## 2. Preparar el proyecto en tu PC

### 2.1 Frontend listo para producción

El frontend ya está configurado para usar la API en:

- **Archivo:** `client/.env.production`
- **Contenido:** `VITE_API_URL=https://tallertirua.com/api`

Así, cuando en la VPS configures el proxy de `/api` hacia Node, no tenés que cambiar nada más.

### 2.2 Build del frontend

En tu PC, en la carpeta del proyecto:

```bash
cd client
npm install
npm run build
```

Se genera la carpeta **`client/dist`**. Todo **el contenido** de esa carpeta (index.html, assets/, .htaccess) es lo que vas a subir a la carpeta web de tallertirua en la VPS.

### 2.3 Backend: qué subir (sin node_modules ni .env)

Subí por WinSCP:

- **Incluir:** `server/src/`, `server/prisma/`, `server/package.json`, `server/package-lock.json` (si existe).
- **No subir:** `node_modules`, archivo `.env` (el `.env` lo creás en el servidor con datos de producción).

---

## 3. Subir con WinSCP

### 3.1 Conectar

1. Abrí **WinSCP**.
2. **Protocolo:** SFTP.
3. **Host:** IP de tu VPS o dominio (ej. `ceramicasasanrafael.com` si apunta a la VPS).
4. **Puerto:** 22.
5. **Usuario y contraseña** (o clave SSH) del usuario con el que entrás a la VPS.

### 3.2 Subir el FRONTEND

1. En la VPS, entrá a la carpeta que vas a usar como raíz de **tallertirua.com** (ej. `/var/www/tallertirua`).
2. Subí **todo el contenido** de **`client/dist`** ahí:
   - `index.html`
   - carpeta `assets/`
   - `.htaccess` (si usás Apache; en Nginx no se usa).

### 3.3 Subir el BACKEND

1. En la VPS, entrá (o creá) la carpeta del backend (ej. `/var/www/tallertirua-api`).
2. Subí:
   - carpeta `src/`
   - carpeta `prisma/`
   - `package.json`
   - `package-lock.json`
   - **No** subas `node_modules` ni `.env`.

### 3.4 Crear el .env del backend en la VPS

En la misma carpeta donde está el `package.json` del backend (ej. `tallertirua-api`), creá un archivo **`.env`** con algo como:

```env
DATABASE_URL="postgresql://USUARIO:PASSWORD@localhost:5432/tirua?schema=public"
FRONTEND_URL=https://tallertirua.com
BACKEND_URL=https://tallertirua.com/api
PORT=5000
JWT_SECRET=una_clave_larga_y_aleatoria_muy_segura
MERCADOPAGO_ACCESS_TOKEN=tu_token_si_lo_usas
NODE_ENV=production
```

- **DATABASE_URL:** si PostgreSQL está en la misma VPS, usá `localhost`. Si usás una BD externa (Neon, Supabase, etc.), poné esa URL.
- **JWT_SECRET:** generalo en tu PC con:  
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

En WinSCP: clic derecho en la carpeta del backend → **Nuevo** → **Archivo** → nombre: `.env`, y pegá el contenido.

---

## 4. En la VPS: instalar dependencias y base de datos

Entrá por **SSH** a la VPS y ejecutá los comandos en la carpeta del **backend** (ej. `cd /var/www/tallertirua-api`):

```bash
npm install
npx prisma generate
npx prisma migrate deploy
```

Si la base de datos todavía no existe:

- **PostgreSQL en la misma VPS:** creá la base y el usuario (por ejemplo `tirua`) y usá esa conexión en `DATABASE_URL`.
- **PostgreSQL externa:** creá el proyecto en Neon/Supabase/Railway y usá la URL que te den en `DATABASE_URL`.

---

## 5. Ejecutar el backend con PM2

En la VPS, en la carpeta del backend:

```bash
# Si no tenés PM2 instalado (una sola vez):
npm install -g pm2

# Iniciar la API (ajustá la ruta si es distinta):
cd /var/www/tallertirua-api
pm2 start src/index.js --name tirua-api

# Para que arranque al reiniciar el servidor:
pm2 save
pm2 startup
```

El backend debe quedar escuchando en el **puerto** que pusiste en `.env` (ej. 5000). Ese puerto es el que usarás en el proxy del servidor web.

---

## 6. Configurar el servidor web para tallertirua.com

Tenés que:

1. Hacer que **tallertirua.com** apunte a la carpeta del frontend.
2. Hacer que las peticiones a **tallertirua.com/api** se reenvíen al proceso Node (puerto 5000).

### Si usás **Nginx**

Creá un archivo de sitio, por ejemplo `/etc/nginx/sites-available/tallertirua.com` (o en `conf.d/`, según tu distribución):

```nginx
server {
    listen 80;
    server_name tallertirua.com www.tallertirua.com;

    root /var/www/tallertirua;
    index index.html;

    # React Router: todas las rutas a index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API → Node.js (puerto donde corre tu backend)
    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Habilitar el sitio y recargar Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/tallertirua.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Ajustá `root` y el puerto de `proxy_pass` si usás otras rutas o otro puerto.

### Si usás **Apache**

Habilitar módulos de proxy:

```bash
sudo a2enmod rewrite proxy proxy_http
sudo systemctl restart apache2
```

Creá un VirtualHost, por ejemplo en `/etc/apache2/sites-available/tallertirua.com.conf`:

```apache
<VirtualHost *:80>
    ServerName tallertirua.com
    ServerAlias www.tallertirua.com
    DocumentRoot /var/www/tallertirua

    <Directory /var/www/tallertirua>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ProxyPreserveHost On
    ProxyPass /api http://127.0.0.1:5000/api
    ProxyPassReverse /api http://127.0.0.1:5000/api
</VirtualHost>
```

Habilitar sitio y recargar:

```bash
sudo a2ensite tallertirua.com.conf
sudo systemctl reload apache2
```

El `.htaccess` que ya está en `client/public` (y se copia al build) se usa para que las rutas de React vayan a `index.html`; con `AllowOverride All` Apache lo leerá.

---

## 7. DNS y SSL (HTTPS)

- **DNS:** En donde gestiones el dominio tallertirua.com, creá un registro **A** (o CNAME si te lo piden) apuntando a la **IP de tu VPS** (la misma que usa ceramicasasanrafael.com).
- **SSL:** En la VPS podés usar **Certbot** para Let's Encrypt:

```bash
sudo certbot --nginx -d tallertirua.com -d www.tallertirua.com
# o con Apache:
sudo certbot --apache -d tallertirua.com -d www.tallertirua.com
```

Certbot suele configurar el redirect a HTTPS y el certificado automáticamente.

---

## 8. Resumen de URLs y archivos

- **Frontend:** `https://tallertirua.com` → contenido de `client/dist` en la carpeta web de tallertirua.
- **API:** `https://tallertirua.com/api` → proxy al Node.js (PM2) en el puerto que definiste (ej. 5000).
- **Mismo VPS:** ceramicasasanrafael.com sigue igual; solo agregaste un nuevo sitio (y opcionalmente una nueva base PostgreSQL para Tirúa).

---

## 9. Checklist final

- [ ] Build del frontend: `cd client && npm run build`
- [ ] Contenido de `client/dist` subido a la carpeta web de tallertirua (WinSCP)
- [ ] Backend subido a su carpeta (WinSCP), sin `node_modules` y sin `.env` local
- [ ] Archivo `.env` creado en la carpeta del backend en la VPS
- [ ] En la VPS: `npm install`, `npx prisma generate`, `npx prisma migrate deploy` en la carpeta del backend
- [ ] PM2 iniciado: `pm2 start src/index.js --name tirua-api` y `pm2 save` / `pm2 startup`
- [ ] Nginx o Apache configurado para tallertirua.com y proxy `/api` al puerto del Node
- [ ] DNS de tallertirua.com apuntando a la IP de la VPS
- [ ] SSL con Certbot para tallertirua.com
- [ ] Probar https://tallertirua.com y que login/registro y páginas que usan API funcionen

---

## 10. Archivos del proyecto ya preparados para producción

- **`client/.env.production`** – `VITE_API_URL=https://tallertirua.com/api`
- **`client/public/.htaccess`** – Para Apache + React Router (Nginx usa `try_files` en la config de arriba).
- **`server/.env.example`** – Referencia de variables para el `.env` del servidor.
- **`client/vite.config.js`** – Base `/` en producción.

Con esto podés tener **ceramicasasanrafael.com** y **tallertirua.com** en la misma VPS, subiendo el frontend y el backend con WinSCP y dejando la API corriendo con PM2.
