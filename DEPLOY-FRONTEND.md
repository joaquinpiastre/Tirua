# 🚀 Guía de Deploy del Frontend - Tirùa

Esta guía te ayudará a generar los archivos estáticos del frontend para subirlos a cualquier servidor web estático.

## 📋 Requisitos Previos

- Node.js instalado (versión 16 o superior)
- npm o yarn instalado

## 🔧 Paso 1: Configurar Variables de Entorno

1. En la carpeta `client`, crea un archivo `.env.production` (ya está creado como ejemplo)
2. Si vas a conectar con un backend más adelante, edita el archivo y agrega:
   ```
   VITE_API_URL=https://tu-backend.com/api
   ```
3. Si solo quieres mostrar el frontend sin backend, déjalo vacío o comenta la línea

## 🏗️ Paso 2: Construir el Frontend

1. Abre una terminal en la raíz del proyecto
2. Navega a la carpeta `client`:
   ```bash
   cd client
   ```
3. Instala las dependencias (si no lo has hecho):
   ```bash
   npm install
   ```
4. Construye el proyecto para producción:
   ```bash
   npm run build
   ```

Esto generará una carpeta `dist` dentro de `client` con todos los archivos estáticos listos para subir.

## 📁 Paso 3: Archivos Generados

Después del build, encontrarás en `client/dist`:
- `index.html` - Página principal
- `assets/` - CSS, JS y otros recursos
- `Logo.jpg` - Logo del sitio

## 🌐 Paso 4: Subir a un Servidor Estático

### Opción A: Netlify (Recomendado - Gratis)

1. Ve a [netlify.com](https://www.netlify.com) y crea una cuenta
2. Arrastra la carpeta `client/dist` a la zona de deploy de Netlify
3. ¡Listo! Tu sitio estará online en segundos

### Opción B: Vercel (Recomendado - Gratis)

1. Ve a [vercel.com](https://www.vercel.com) y crea una cuenta
2. Instala Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. En la carpeta `client`, ejecuta:
   ```bash
   vercel --prod
   ```
4. Sigue las instrucciones en pantalla

### Opción C: GitHub Pages

1. Crea un repositorio en GitHub
2. Sube la carpeta `client/dist` al repositorio
3. Ve a Settings > Pages
4. Selecciona la rama `main` y la carpeta `/dist`
5. Tu sitio estará en `https://tu-usuario.github.io/tu-repo`

### Opción D: Servidor Web Tradicional (cPanel, FTP, etc.)

1. Sube TODO el contenido de la carpeta `client/dist` a la carpeta `public_html` o `www` de tu servidor
2. Asegúrate de que `index.html` esté en la raíz
3. ¡Listo!

## ⚙️ Configuración para Rutas (SPA)

Si usas un servidor que no soporta SPA (Single Page Application), necesitas configurar:

### Para Apache (.htaccess)

Crea un archivo `.htaccess` en la carpeta `dist` con:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Para Nginx

En tu configuración de Nginx:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 🧪 Paso 5: Probar Localmente

Antes de subir, puedes probar el build localmente:

```bash
cd client
npm run preview
```

Esto iniciará un servidor local en `http://localhost:4173` para que veas cómo se verá en producción.

## 📝 Notas Importantes

1. **Sin Backend**: Si solo subes el frontend, las funcionalidades que requieren backend (login, registro, pagos, etc.) no funcionarán. Solo se mostrará la parte visual.

2. **Rutas**: Asegúrate de configurar el servidor para que todas las rutas redirijan a `index.html` (ver configuración SPA arriba).

3. **Actualizaciones**: Cada vez que hagas cambios, ejecuta `npm run build` nuevamente y sube la nueva carpeta `dist`.

4. **Variables de Entorno**: Las variables de entorno deben comenzar con `VITE_` para que Vite las incluya en el build.

## 🔄 Actualizar el Sitio

Cada vez que quieras actualizar el sitio:

1. Haz los cambios en el código
2. Ejecuta `npm run build` en la carpeta `client`
3. Sube la nueva carpeta `dist` a tu servidor

## ❓ Problemas Comunes

### Las rutas no funcionan (404)
- Asegúrate de configurar el servidor para SPA (ver arriba)

### Los estilos no se cargan
- Verifica que la carpeta `assets` se haya subido correctamente
- Asegúrate de que las rutas sean relativas (ya configurado en `vite.config.js`)

### El logo no aparece
- Verifica que `Logo.jpg` esté en la carpeta `public` antes del build

## 📞 Soporte

Si tienes problemas, revisa:
- La consola del navegador (F12)
- Los logs del servidor
- Que todos los archivos se hayan subido correctamente

