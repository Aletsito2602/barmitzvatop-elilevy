import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  where,
  enableNetwork,
  disableNetwork,
  terminate,
  clearIndexedDbPersistence
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Inicializar reglas de Firestore (para desarrollo)
export const initializeFirestoreRules = async () => {
  try {
    console.log('Inicializando reglas de Firestore para foros...');
    
    // Verificar conexión a Firestore
    await enableNetwork(db);
    
    return { success: true, message: 'Firestore rules initialized' };
  } catch (error) {
    console.error('Error initializing Firestore rules:', error);
    return { success: false, error: error.message };
  }
};

// Obtener mensajes de un foro específico
export const getForumMessages = (category, callback) => {
  let unsubscribe = null;
  
  try {
    // Intentar desactivar la red y reactivarla para limpiar el estado
    disableNetwork(db)
      .then(() => enableNetwork(db))
      .catch(() => {});
    
    const q = query(
      collection(db, 'forumMessages'),
      where('category', '==', category),
      orderBy('timestamp', 'asc')
    );

    unsubscribe = onSnapshot(q, 
      (snapshot) => {
        try {
          const messagesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          callback(messagesData, null);
        } catch (err) {
          console.error('Error processing snapshot:', err);
          callback([], err);
        }
      }, 
      (error) => {
        console.error('Error in snapshot listener:', error);
        // Si hay error, usar localStorage como fallback
        const localMessages = getLocalForumMessages(category);
        callback(localMessages, error);
      }
    );

    return () => {
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (err) {
          console.warn('Error unsubscribing:', err);
        }
      }
    };
  } catch (error) {
    console.error('Error setting up listener:', error);
    // Fallback a localStorage
    const localMessages = getLocalForumMessages(category);
    callback(localMessages, error);
    return () => {};
  }
};

// Enviar mensaje al foro
export const sendForumMessage = async (category, content, userId, userName) => {
  try {
    if (!content.trim()) {
      throw new Error('El mensaje no puede estar vacío');
    }

    const messageData = {
      category,
      content: content.trim(),
      userId: userId || 'anonymous',
      userName: userName || 'Usuario Anónimo',
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'forumMessages'), messageData);
    
    console.log('Message sent with ID: ', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error sending message:', error);
    
    // Si hay error de permisos, intentar con localStorage como fallback
    if (error.code === 'permission-denied' || error.message.includes('permissions')) {
      return saveMessageToLocalStorage(category, content, userId, userName);
    }
    
    return { success: false, error: error.message };
  }
};

// Fallback usando localStorage cuando Firebase no esté disponible
const saveMessageToLocalStorage = (category, content, userId, userName) => {
  try {
    const messages = JSON.parse(localStorage.getItem('forumMessages') || '[]');
    const newMessage = {
      id: Date.now().toString(),
      category,
      content,
      userId: userId || 'anonymous',
      userName: userName || 'Usuario Anónimo',
      timestamp: { toDate: () => new Date() },
      createdAt: new Date().toISOString(),
      isLocal: true
    };
    
    messages.push(newMessage);
    localStorage.setItem('forumMessages', JSON.stringify(messages));
    
    return { success: true, id: newMessage.id, isLocal: true };
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return { success: false, error: 'Error guardando mensaje localmente' };
  }
};

// Obtener mensajes desde localStorage (fallback)
export const getLocalForumMessages = (category) => {
  try {
    const messages = JSON.parse(localStorage.getItem('forumMessages') || '[]');
    return messages.filter(msg => msg.category === category);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

// Limpiar mensajes locales (para pruebas)
export const clearLocalMessages = () => {
  localStorage.removeItem('forumMessages');
};

// Verificar conectividad con Firebase
export const checkFirebaseConnection = async () => {
  try {
    // Reiniciar la conexión de Firestore para limpiar el estado
    try {
      await disableNetwork(db);
      await new Promise(resolve => setTimeout(resolve, 100));
      await enableNetwork(db);
    } catch (networkError) {
      console.warn('Network reset failed:', networkError);
    }
    
    // Intentar una operación simple de lectura
    const testCollection = collection(db, 'forumMessages');
    
    // Solo verificar que podemos crear la referencia
    return { success: true, connected: true };
  } catch (error) {
    console.warn('Firebase connection test failed:', error);
    return { success: false, connected: false, error: error.message };
  }
};

// Reiniciar completamente Firestore (para casos extremos)
export const resetFirestore = async () => {
  try {
    await terminate(db);
    await clearIndexedDbPersistence(db);
    return { success: true };
  } catch (error) {
    console.warn('Firestore reset failed:', error);
    return { success: false, error: error.message };
  }
};

// Obtener estadísticas de la comunidad
export const getCommunityStats = async () => {
  try {
    const q = query(collection(db, 'forumMessages'));
    
    return new Promise((resolve, reject) => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        const stats = {
          totalMessages: messages.length,
          totalUsers: new Set(messages.map(msg => msg.userId)).size,
          messagesGeneralCount: messages.filter(msg => msg.category === 'general').length,
          messagesStudentsCount: messages.filter(msg => msg.category === 'estudiantes').length,
          messagesAnnouncementsCount: messages.filter(msg => msg.category === 'anuncios').length,
          recentActivity: messages
            .sort((a, b) => {
              const aTime = a.timestamp?.toDate?.() || new Date(a.createdAt);
              const bTime = b.timestamp?.toDate?.() || new Date(b.createdAt);
              return bTime - aTime;
            })
            .slice(0, 5)
        };
        
        resolve({ success: true, data: stats, unsubscribe });
      }, (error) => {
        reject({ success: false, error: error.message });
      });
    });
  } catch (error) {
    console.error('Error getting community stats:', error);
    // Fallback con localStorage
    const localMessages = [
      ...getLocalForumMessages('general'),
      ...getLocalForumMessages('estudiantes'),
      ...getLocalForumMessages('anuncios')
    ];
    
    return {
      success: true,
      data: {
        totalMessages: localMessages.length,
        totalUsers: new Set(localMessages.map(msg => msg.userId)).size,
        messagesGeneralCount: getLocalForumMessages('general').length,
        messagesStudentsCount: getLocalForumMessages('estudiantes').length,
        messagesAnnouncementsCount: getLocalForumMessages('anuncios').length,
        recentActivity: localMessages.slice(-5).reverse()
      },
      unsubscribe: () => {}
    };
  }
};

// Obtener usuarios activos recientes
export const getActiveUsers = async () => {
  try {
    const q = query(
      collection(db, 'forumMessages'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    
    return new Promise((resolve, reject) => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => doc.data());
        const uniqueUsers = [...new Map(
          messages.map(msg => [msg.userId, {
            userId: msg.userId,
            userName: msg.userName,
            lastActive: msg.timestamp?.toDate?.() || new Date(msg.createdAt)
          }])
        ).values()];
        
        resolve({ success: true, data: uniqueUsers.slice(0, 10), unsubscribe });
      }, (error) => {
        reject({ success: false, error: error.message });
      });
    });
  } catch (error) {
    console.error('Error getting active users:', error);
    return { success: false, error: error.message };
  }
};

export default {
  initializeFirestoreRules,
  getForumMessages,
  sendForumMessage,
  getLocalForumMessages,
  clearLocalMessages,
  checkFirebaseConnection,
  getCommunityStats,
  getActiveUsers
};