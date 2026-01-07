# 📋 Checklist Rápido - Despliegue en Hostinger

## Antes de Construir

- [ ] Todas las variables de entorno están configuradas en `.env.production`
- [ ] Firebase y otras APIs tienen las URLs de producción correctas
- [ ] Código commiteado y guardado en Git (opcional pero recomendado)

## Construcción

```bash
# Ejecutar uno de estos comandos:
npm run build:hostinger
# o
npm run build
```

- [ ] Build ejecutado sin errores
- [ ] Carpeta `dist/` creada correctamente
- [ ] Archivo `.htaccess` está en `dist/`

## Subir a Hostinger

### Archivos que DEBEN estar en public_html:

```
public_html/
├── index.html
├── .htaccess         ⚠️ IMPORTANTE - Archivo oculto
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [otras imágenes y archivos]
├── favicon.png
├── logo.webp
└── [otros archivos estáticos]
```

- [ ] Todos los archivos de `dist/` subidos
- [ ] `.htaccess` está en la raíz (mismo nivel que index.html)
- [ ] Carpeta `assets/` con todos sus archivos
- [ ] Archivos estáticos (imágenes, favicon, etc.)

## Configuración del Servidor

- [ ] SSL habilitado (HTTPS)
- [ ] Dominio apuntando correctamente
- [ ] Permisos de archivos correctos (644 para archivos, 755 para carpetas)

## Pruebas Post-Despliegue

### Rutas a Probar:

- [ ] `https://tudominio.com/` - Página principal
- [ ] `https://tudominio.com/login` - Login
- [ ] `https://tudominio.com/register` - Registro
- [ ] `https://tudominio.com/dashboard` - Dashboard
- [ ] `https://tudominio.com/checkout` - Checkout

### Funcionalidad:

- [ ] Navegación entre páginas funciona
- [ ] Refresh (F5) en cualquier ruta funciona
- [ ] CSS y estilos cargan correctamente
- [ ] JavaScript funciona (botones, formularios, etc.)
- [ ] Imágenes cargan correctamente
- [ ] Firebase/APIs conectan correctamente
- [ ] No hay errores en consola del navegador (F12)

## Si algo falla:

### ❌ Error 404 en rutas
1. Verifica que `.htaccess` esté en la raíz de public_html
2. Muestra archivos ocultos en File Manager
3. Verifica el contenido del `.htaccess`

### ❌ CSS/JS no cargan
1. Verifica que la carpeta `assets/` se haya subido
2. Limpia caché del navegador (Ctrl+Shift+R)
3. Verifica rutas en la consola del navegador

### ❌ Error 500
1. Revisa los logs de error en hPanel
2. Verifica la sintaxis del `.htaccess`
3. Contacta soporte de Hostinger

## Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build:hostinger

# Previsualizar build localmente
npm run preview:build

# Linter
npm run lint
```

## URLs de Referencia

- **Panel de Hostinger**: https://hpanel.hostinger.com
- **File Manager**: hPanel → Archivos → Administrador de archivos
- **FTP**: hPanel → Archivos → Cuentas FTP
- **SSL**: hPanel → Seguridad → SSL
- **Logs**: hPanel → Archivos → Registros de errores

## Contactos de Emergencia

- **Soporte Hostinger**: https://www.hostinger.com/contact
- **Chat en vivo**: Disponible en hPanel
- **Base de conocimientos**: https://support.hostinger.com

---

## 🚀 Proceso Rápido (TL;DR)

```bash
# 1. Build
npm run build:hostinger

# 2. Subir todo el contenido de dist/ a public_html en Hostinger

# 3. Verificar que .htaccess esté presente

# 4. Probar las rutas
```

¡Listo! 🎉
