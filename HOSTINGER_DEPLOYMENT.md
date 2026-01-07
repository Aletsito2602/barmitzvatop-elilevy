# Guía de Despliegue en Hostinger (Apache)

Esta guía te ayudará a subir tu aplicación React con React Router a Hostinger y asegurar que todas las rutas funcionen correctamente.

## 📋 Requisitos Previos

- Cuenta de Hostinger con panel de control (hPanel)
- Acceso FTP o File Manager
- Node.js instalado localmente para hacer el build

## 🔧 Pasos para el Despliegue

### 1. Construir el Proyecto

Antes de subir los archivos, necesitas crear la versión de producción:

```bash
# Instalar dependencias (si aún no lo has hecho)
npm install

# Crear el build de producción
npm run build
```

Esto creará una carpeta `dist` con todos los archivos optimizados para producción.

### 2. Verificar el Contenido de la Carpeta dist

Después del build, verifica que la carpeta `dist` contenga:
- `index.html`
- Carpeta `assets/` (con archivos JS, CSS e imágenes)
- `.htaccess` (copiado desde la carpeta `public`)
- Otros archivos estáticos (favicon.png, logo.webp, etc.)

### 3. Subir Archivos a Hostinger

#### Opción A: Usando File Manager (Más Fácil)

1. **Accede a hPanel de Hostinger**
   - Inicia sesión en tu cuenta de Hostinger
   - Ve a la sección "Archivos" → "Administrador de archivos"

2. **Navega a la carpeta public_html**
   - Esta es la carpeta raíz de tu sitio web
   - Si tu dominio está en una subcarpeta, navega a ella

3. **Limpia la carpeta (si es necesario)**
   - Elimina cualquier archivo existente (como index.html por defecto)
   - ⚠️ Cuidado de no eliminar archivos importantes si ya tienes otros servicios

4. **Sube los archivos**
   - Selecciona todos los archivos de la carpeta `dist`
   - Arrastra y suelta en el File Manager, o usa el botón "Subir"
   - Asegúrate de que `.htaccess` también se suba (los archivos que empiezan con punto pueden estar ocultos)

#### Opción B: Usando FTP

1. **Obtén las credenciales FTP**
   - En hPanel, ve a "Archivos" → "Cuentas FTP"
   - Usa las credenciales existentes o crea una nueva cuenta

2. **Conecta con un cliente FTP**
   - Puedes usar FileZilla, Cyberduck, o cualquier cliente FTP
   - Host: Tu dominio o IP del servidor
   - Usuario: Tu usuario FTP
   - Contraseña: Tu contraseña FTP
   - Puerto: 21 (FTP) o 22 (SFTP)

3. **Sube los archivos**
   - Navega a la carpeta `public_html` (o la carpeta de tu dominio)
   - Sube todo el contenido de la carpeta `dist` (no la carpeta dist en sí)
   - Asegúrate de mantener la estructura de carpetas

### 4. Configurar el .htaccess

El archivo `.htaccess` ya está configurado correctamente en `public/`. Después del build, debe estar en la carpeta `dist/`. Este archivo es CRUCIAL para que React Router funcione.

**Verificación:**
- El archivo `.htaccess` debe estar en la raíz de `public_html` (mismo nivel que `index.html`)
- Si no lo ves, es posible que los archivos ocultos no se estén mostrando

**Para mostrar archivos ocultos en File Manager:**
- Haz clic en "Configuración" (icono de engranaje)
- Marca la opción "Mostrar archivos ocultos"

### 5. Configurar Variables de Entorno

Si tu aplicación usa variables de entorno (como Firebase), necesitas configurarlas en el build:

1. **Crear archivo .env.production** (localmente):
```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
# ... otras variables
```

2. **Reconstruir con las variables de producción:**
```bash
npm run build
```

⚠️ **IMPORTANTE**: Nunca subas archivos `.env` al servidor. Las variables ya están compiladas en el build.

### 6. Configuración Adicional en Hostinger

#### Forzar HTTPS

El `.htaccess` ya incluye redirección a HTTPS. Adicionalmente, en hPanel:
1. Ve a "Seguridad" → "SSL"
2. Activa el SSL para tu dominio (Let's Encrypt es gratis)
3. Fuerza HTTPS desde el panel si está disponible

#### Configurar el Dominio

Si despliegas en un subdominio o subcarpeta:

1. **Para subcarpeta** (ej: tudominio.com/app):
   - Sube los archivos a `public_html/app/`
   - Edita `.htaccess` y cambia `RewriteBase /` por `RewriteBase /app/`
   - En `vite.config.js`, cambia `base: '/'` por `base: '/app/'`
   - Reconstruye: `npm run build`

2. **Para subdominio** (ej: app.tudominio.com):
   - Crea el subdominio en hPanel
   - Sube los archivos a la carpeta del subdominio
   - No necesitas cambiar el `RewriteBase`

## 🧪 Verificación

Después del despliegue, prueba lo siguiente:

1. **Página principal**: Accede a tu dominio (ej: https://tudominio.com)
2. **Rutas directas**: Prueba acceder directamente a:
   - `https://tudominio.com/login`
   - `https://tudominio.com/register`
   - `https://tudominio.com/dashboard`
   
3. **Navegación**: Navega entre las páginas usando los links de tu sitio
4. **Refresh**: En cualquier ruta, presiona F5 o Ctrl+R para recargar

✅ Si todas las rutas funcionan correctamente (no muestran 404), ¡el despliegue fue exitoso!

## 🐛 Solución de Problemas Comunes

### Error 404 en rutas

**Problema**: Al acceder directamente a una ruta (ej: /dashboard) obtienes error 404.

**Soluciones**:
1. Verifica que `.htaccess` esté en la carpeta correcta
2. Asegúrate de que `.htaccess` se haya subido correctamente
3. Verifica que el módulo `mod_rewrite` esté habilitado (Hostinger lo tiene por defecto)
4. Revisa que el `RewriteBase` sea correcto si estás en una subcarpeta

### Archivos CSS/JS no cargan

**Problema**: La página carga pero sin estilos o funcionalidad.

**Soluciones**:
1. Verifica que la carpeta `assets/` se haya subido correctamente
2. Abre la consola del navegador (F12) y revisa errores de red
3. Comprueba que el `base` en `vite.config.js` sea correcto
4. Limpia la caché del navegador (Ctrl+Shift+R)

### Error 500 Internal Server Error

**Problema**: El servidor responde con error 500.

**Soluciones**:
1. Revisa la sintaxis del `.htaccess`
2. Verifica los logs de error en hPanel → "Archivos" → "Registros de errores"
3. Comenta temporalmente secciones del `.htaccess` para encontrar el problema
4. Contacta con soporte de Hostinger si persiste

### Las rutas funcionan pero muestran contenido incorrecto

**Problema**: Las rutas cargan pero no muestran la página correcta.

**Soluciones**:
1. Verifica tu configuración de React Router en `App.jsx`
2. Asegúrate de que `BrowserRouter` esté configurado correctamente
3. Limpia la caché del navegador
4. Verifica que no haya conflictos en las rutas

## 📝 Checklist de Despliegue

Antes de dar por terminado el despliegue, verifica:

- [ ] Build ejecutado correctamente (`npm run build`)
- [ ] Todos los archivos de `dist/` subidos a `public_html`
- [ ] Archivo `.htaccess` presente en la raíz
- [ ] SSL configurado y funcionando
- [ ] Todas las rutas accesibles directamente
- [ ] Navegación entre páginas funciona
- [ ] Refresh en cualquier página funciona
- [ ] CSS y JavaScript cargan correctamente
- [ ] Imágenes y assets cargan correctamente
- [ ] Formularios y funcionalidad interactiva funcionan
- [ ] Firebase/API conexiones funcionan (si aplica)

## 🔄 Actualizaciones Futuras

Para actualizar el sitio después de hacer cambios:

1. Realiza tus cambios en el código
2. Ejecuta `npm run build` localmente
3. Sube solo los archivos que cambiaron (o todos para estar seguro)
4. Limpia la caché del navegador si es necesario

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de error en hPanel
2. Verifica la consola del navegador (F12)
3. Contacta con soporte de Hostinger
4. Revisa la documentación de React Router y Vite

## 🎉 ¡Felicidades!

Si has seguido todos los pasos, tu aplicación React debería estar funcionando perfectamente en Hostinger con todas las rutas operativas.
