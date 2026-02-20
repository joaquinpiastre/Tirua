# Proyecto Tirua

## ⚠️ IMPORTANTE: Cómo evitar perder archivos

### Problema: ¿Por qué se perdieron los archivos?

Los archivos pueden perderse por varias razones:
1. **No había control de versiones (Git)** - Ahora está configurado ✅
2. **No se guardaron los archivos** - Asegúrate de guardar (Ctrl+S)
3. **Cambios no fueron guardados en Git** - Sigue las instrucciones abajo

### ✅ Solución: Usar Git para guardar cambios

**Git ya está configurado en tu proyecto.** Ahora sigue estos pasos:

#### 1. Guardar cambios regularmente (Commits)

Cada vez que hagas cambios importantes, ejecuta:

```bash
# Ver qué archivos cambiaron
git status

# Agregar todos los archivos modificados
git add .

# Guardar los cambios con un mensaje descriptivo
git commit -m "Descripción de lo que hiciste"

# Ver el historial de cambios guardados
git log --oneline
```

#### 2. Ver cambios guardados

```bash
# Ver todos los commits guardados
git log

# Ver qué archivos están guardados
git ls-files
```

#### 3. Recuperar archivos si se pierden

```bash
# Ver todos los commits
git log --oneline

# Restaurar archivos desde un commit anterior
git checkout <hash-del-commit> -- <nombre-archivo>

# O restaurar todo desde el último commit
git checkout .
```

### 📋 Comandos Git esenciales

```bash
# Ver estado actual
git status

# Agregar archivos
git add .                    # Todos los archivos
git add nombre-archivo.js    # Un archivo específico

# Guardar cambios
git commit -m "Mensaje descriptivo"

# Ver historial
git log --oneline

# Ver diferencias
git diff
```

### 🔄 Flujo de trabajo recomendado

1. **Hacer cambios** en tu código
2. **Guardar archivos** (Ctrl+S)
3. **Verificar cambios**: `git status`
4. **Agregar cambios**: `git add .`
5. **Guardar en Git**: `git commit -m "Descripción"`
6. **Repetir** cuando hagas más cambios

### 💾 Backup adicional (Recomendado)

Para mayor seguridad, también puedes:
- Hacer copias de seguridad manuales en otra carpeta
- Usar un servicio de respaldo en la nube (Dropbox, Google Drive, etc.)
- Configurar un repositorio remoto (GitHub, GitLab) para respaldo en la nube

---

## 🚀 Iniciar el proyecto

```bash
# Instalar dependencias
npm install

# Ejecutar cliente y servidor
npm run dev

# O solo el cliente
npm run dev --workspace=client

# O solo el servidor
npm run dev --workspace=server
```

## 📁 Estructura del proyecto

```
tirua/
├── client/          # Frontend (React + Vite)
├── server/          # Backend (Express + Prisma)
└── package.json     # Configuración del monorepo
```

"# Tirua" 


