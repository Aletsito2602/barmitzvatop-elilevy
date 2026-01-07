# 🚀 Inicio Rápido - Desplegar en Hostinger

## ⏱️ 5 Minutos para Desplegar

### 1️⃣ Construir el Proyecto (2 minutos)

```bash
npm run build:hostinger
```

✅ Esto creará una carpeta `dist/` con todos los archivos optimizados.

---

### 2️⃣ Subir a Hostinger (2 minutos)

#### Opción A: File Manager (Recomendado para principiantes)

1. Ve a [https://hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Click en **"Archivos"** → **"Administrador de archivos"**
3. Navega a la carpeta `public_html`
4. **IMPORTANTE**: Habilita "Mostrar archivos ocultos" (icono de engranaje)
5. Arrastra TODO el contenido de tu carpeta `dist/` local
6. Espera a que termine la carga

#### Opción B: FTP (Para usuarios avanzados)

1. Obtén tus credenciales FTP en hPanel → Archivos → Cuentas FTP
2. Conecta con FileZilla o tu cliente FTP favorito
3. Sube todo el contenido de `dist/` a `public_html`

---

### 3️⃣ Verificar (1 minuto)

Abre tu navegador y prueba:

- ✅ `https://tudominio.com/`
- ✅ `https://tudominio.com/login`
- ✅ `https://tudominio.com/dashboard`

Si todas las páginas cargan correctamente, ¡felicidades! 🎉

---

## 🆘 Algo salió mal?

### El .htaccess no se subió

**Síntoma**: Error 404 en las rutas

**Solución**:
1. En File Manager, click en el icono de engranaje (⚙️)
2. Marca "Mostrar archivos ocultos"
3. Verifica que `.htaccess` esté en la raíz de `public_html`
4. Si no está, súbelo manualmente desde `dist/.htaccess`

### Los estilos no cargan

**Síntoma**: Página sin CSS

**Solución**:
1. Verifica que la carpeta `assets/` se haya subido completamente
2. Presiona Ctrl+Shift+R para limpiar caché
3. Revisa la consola del navegador (F12) para ver qué archivos faltan

### Error 500

**Síntoma**: Internal Server Error

**Solución**:
1. Ve a hPanel → Archivos → Registros de errores
2. Lee el último error
3. Contacta con soporte de Hostinger si no puedes resolverlo

---

## 📋 Checklist Express

Antes de subir:
- [ ] `npm run build:hostinger` ejecutado
- [ ] Carpeta `dist/` creada
- [ ] `.htaccess` está en `dist/`

Al subir:
- [ ] Archivos ocultos visibles en File Manager
- [ ] Todo el contenido de `dist/` subido a `public_html`
- [ ] `.htaccess` está en la raíz

Después de subir:
- [ ] Rutas principales probadas
- [ ] No hay errores 404
- [ ] CSS y JS cargan correctamente

---

## 🎓 ¿Primera vez con Hostinger?

### Acceso Inicial
1. Revisa tu email de Hostinger con las credenciales
2. Ve a [hpanel.hostinger.com](https://hpanel.hostinger.com)
3. Inicia sesión

### SSL Gratis
1. En hPanel, ve a "Seguridad" → "SSL"
2. Activa SSL para tu dominio (Let's Encrypt - Gratis)
3. Espera 5-10 minutos para que se active

### Configurar Dominio
- Si es dominio nuevo, apunta los nameservers a Hostinger
- Si es subdominio, créalo en hPanel → "Dominios"

---

## 🔄 Actualizaciones Futuras

Cuando hagas cambios en el código:

```bash
# 1. Construir
npm run build:hostinger

# 2. Subir archivos nuevos a Hostinger
# (Solo los que cambiaron, o todos para estar seguro)

# 3. Limpiar caché del navegador
# Ctrl+Shift+R
```

---

## 📚 Documentación Completa

Si necesitas más detalles, consulta:

- **Guía Detallada**: `HOSTINGER_DEPLOYMENT.md`
- **Checklist Completo**: `DEPLOY_CHECKLIST.md`
- **Resumen de Cambios**: `RESUMEN_CAMBIOS.md`

---

## 💡 Tips Pro

1. **Usar subdominios para testing**: Crea `test.tudominio.com` para probar antes de producción
2. **Backups**: Descarga tu `public_html` antes de actualizar
3. **Git**: Mantén todo en Git para control de versiones
4. **Variables de entorno**: Nunca subas archivos `.env` al servidor

---

## 🎯 Objetivo Cumplido

Después de seguir esta guía, tu aplicación React con React Router estará funcionando perfectamente en Hostinger con Apache, con todas las rutas operativas y optimizada para producción.

**¿Problemas?** Revisa `HOSTINGER_DEPLOYMENT.md` para solución de problemas detallada.

**¿Todo funciona?** ¡Felicidades! 🎉 Ya puedes compartir tu sitio.
