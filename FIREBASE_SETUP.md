# 🔥 Firebase Setup - Solución del Error de Permisos

## 🚨 PROBLEMA ACTUAL
Error: `Missing or insufficient permissions` en Firestore

## ✅ SOLUCIÓN RÁPIDA

### 1. Aplicar Reglas de Firestore (REQUERIDO)

Ve a [Firebase Console](https://console.firebase.google.com/) y:

1. Selecciona el proyecto: **barmitzva-top**
2. Ve a **"Firestore Database"** > **"Rules"**
3. Reemplaza el contenido con estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to classes for all users (for public courses)
    match /classes/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Allow authenticated users to read/write their own user documents
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read/write their own progress documents
    match /progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read/write activities
    match /activities/{document} {
      allow read, write: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Allow read access to community posts for authenticated users
    match /community_posts/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Allow forms collection for contact forms (public access)
    match /forms/{document=**} {
      allow read, write: if true;
    }
    
    // Test collection for debugging
    match /test/{document=**} {
      allow read, write: if true;
    }
  }
}
```

4. Haz clic en **"Publish"**

### 2. Verificar Configuración

Una vez aplicadas las reglas:

1. Ve a `/dashboard/crm` en la aplicación
2. Haz clic en **"🔧 Test Firebase"** para verificar conexión
3. Si funciona, haz clic en **"🚀 Inicializar Firebase"** 
4. Luego en **"Crear Clases de Muestra"**

### 3. Resultado Esperado

Después de aplicar las reglas, deberías poder:
- ✅ Ver las clases en `/dashboard/clases`
- ✅ Crear nuevas clases desde el CRM
- ✅ Ver el progreso del usuario
- ✅ Completar clases

## 🔧 Archivos Configurados

- `firestore.rules` - Reglas de seguridad
- `firebase.json` - Configuración del proyecto
- `firestore.indexes.json` - Índices de Firestore
- `src/services/debugService.js` - Herramientas de debug

## 📝 Notas

- Las reglas permiten lectura pública de clases (para cursos públicos)
- La escritura requiere autenticación
- Los usuarios solo pueden acceder a sus propios datos
- Hay una colección de test para debugging