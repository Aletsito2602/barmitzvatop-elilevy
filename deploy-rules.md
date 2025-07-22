# Instrucciones para Desplegar Reglas de Firebase

## Problema
Los foros de la comunidad están fallando porque las reglas de Firebase Firestore no permiten las operaciones de lectura y escritura.

## Solución
Necesitas desplegar las reglas de Firebase que están en el archivo `firestore.rules`.

## Pasos para solucionar:

### 1. Instalar Firebase CLI (si no lo tienes)
```bash
npm install -g firebase-tools
```

### 2. Inicializar Firebase en el proyecto
```bash
firebase login
firebase init firestore
```

### 3. Desplegar las reglas
```bash
firebase deploy --only firestore:rules
```

### 4. Verificar que las reglas se aplicaron
Ve a la consola de Firebase → Firestore Database → Rules y verifica que las reglas estén activas.

## Reglas Actuales
Las reglas en `firestore.rules` permiten:
- Lectura y escritura completa para desarrollo
- Operaciones específicas para mensajes de foro
- Operaciones para todas las colecciones necesarias

## Fallback Implementado
Mientras tanto, la aplicación usa localStorage como fallback cuando Firebase no está disponible, por lo que los foros funcionarán en modo offline.

## Resultado Esperado
Una vez desplegadas las reglas, los foros funcionarán en tiempo real con Firebase y no habrá más errores de permisos.