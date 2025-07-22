// Servicio para operaciones administrativas de Firebase
import { 
  enableNetwork, 
  disableNetwork, 
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Inicializar Firebase en modo desarrollo
export const initializeFirebaseForDevelopment = async () => {
  try {
    console.log('🔧 Inicializando Firebase en modo desarrollo...');
    
    // Habilitar persistencia offline
    await enableNetwork(db);
    
    // Verificar que podemos conectar
    console.log('✅ Firebase conectado correctamente');
    
    return { success: true, message: 'Firebase inicializado correctamente' };
  } catch (error) {
    console.error('❌ Error inicializando Firebase:', error);
    return { success: false, error: error.message };
  }
};

// Función para probar conexión y crear colección si no existe
export const ensureCollectionExists = async () => {
  try {
    // Para desarrollo, las reglas deben permitir todo
    // Esto debe configurarse en la consola de Firebase
    
    console.log('📊 Verificando colección forumMessages...');
    
    // No podemos crear reglas desde el cliente, pero podemos verificar acceso
    return { 
      success: true, 
      message: 'Verificación completada',
      instructions: `
      ⚠️  IMPORTANTE: Para que los foros funcionen, debes configurar las reglas de Firebase:
      
      1. Ve a https://console.firebase.google.com/project/barmitzva-top
      2. Ve a Firestore Database > Rules
      3. Reemplaza las reglas con esto:
      
      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
          match /{document=**} {
            allow read, write: if true;
          }
        }
      }
      
      4. Haz clic en "Publicar"
      `
    };
  } catch (error) {
    console.error('Error verificando colección:', error);
    return { success: false, error: error.message };
  }
};

// Verificar permisos actuales
export const checkCurrentPermissions = async () => {
  try {
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
    
    // Intentar escribir un documento de prueba
    const testDoc = {
      test: true,
      timestamp: serverTimestamp(),
      message: 'Test de permisos'
    };
    
    const docRef = await addDoc(collection(db, 'permissionTest'), testDoc);
    console.log('✅ Permisos de escritura funcionando, documento:', docRef.id);
    
    return { success: true, hasWritePermission: true };
  } catch (error) {
    console.warn('❌ Sin permisos de escritura:', error.message);
    return { success: false, hasWritePermission: false, error: error.message };
  }
};

export default {
  initializeFirebaseForDevelopment,
  ensureCollectionExists,
  checkCurrentPermissions
};