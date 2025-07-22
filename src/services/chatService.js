import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp,
  doc,
  getDoc,
  where
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Chat Room Types
export const CHAT_ROOMS = {
  NUEVOS: 'estudiantes_nuevos',
  GRADUADOS: 'estudiantes_graduados'
};

// Send message to chat room
export const sendMessage = async (roomId, userId, message) => {
  try {
    // Get user info
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.exists() ? userSnap.data() : {};

    const messagesRef = collection(db, 'chat_rooms', roomId, 'messages');
    const messageData = {
      userId,
      userName: userData.name || userData.email || 'Usuario Anónimo',
      userImage: userData.profileImage || null,
      message: message.trim(),
      timestamp: serverTimestamp(),
      isActive: true
    };

    const docRef = await addDoc(messagesRef, messageData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: error.message };
  }
};

// Subscribe to chat room messages
export const subscribeToChatRoom = (roomId, callback, limitCount = 50) => {
  try {
    const messagesRef = collection(db, 'chat_rooms', roomId, 'messages');
    const q = query(
      messagesRef,
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Reverse to show newest at bottom (like WhatsApp)
      callback(messages.reverse());
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to chat room:', error);
    return null;
  }
};

// Get chat room info and stats
export const getChatRoomInfo = async (roomId) => {
  try {
    const messagesRef = collection(db, 'chat_rooms', roomId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
    
    // For now, we'll return basic info
    // In the future, we could store room metadata in a separate document
    const roomNames = {
      [CHAT_ROOMS.NUEVOS]: 'Estudiantes Nuevos',
      [CHAT_ROOMS.GRADUADOS]: 'Estudiantes Graduados'
    };

    const roomDescriptions = {
      [CHAT_ROOMS.NUEVOS]: 'Espacio para estudiantes que están comenzando su preparación',
      [CHAT_ROOMS.GRADUADOS]: 'Comunidad de estudiantes que ya completaron su Bar Mitzvá'
    };

    return {
      success: true,
      data: {
        id: roomId,
        name: roomNames[roomId] || 'Sala de Chat',
        description: roomDescriptions[roomId] || 'Sala de conversación',
        isActive: true
      }
    };
  } catch (error) {
    console.error('Error getting chat room info:', error);
    return { success: false, error: error.message };
  }
};

// Determine which chat room a user should join based on their status
export const getUserChatRoom = (userProfile) => {
  // Check if user has completed Bar Mitzvah
  if (userProfile?.barMitzvahCompleted === true) {
    return CHAT_ROOMS.GRADUADOS;
  }
  
  // Check if user has completed all 24 lessons (alternative way to determine graduation)
  if (userProfile?.progress?.lessonsCompleted >= 24) {
    return CHAT_ROOMS.GRADUADOS;
  }
  
  // Default to new students room
  return CHAT_ROOMS.NUEVOS;
};

// Get available chat rooms for a user
export const getAvailableChatRooms = (userProfile) => {
  const rooms = [];
  
  // Everyone can access the new students room
  rooms.push({
    id: CHAT_ROOMS.NUEVOS,
    name: 'Estudiantes Nuevos',
    description: 'Espacio para estudiantes que están comenzando',
    icon: '📚',
    isDefault: true
  });
  
  // Only graduated students can access the graduates room
  if (userProfile?.barMitzvahCompleted === true || userProfile?.progress?.lessonsCompleted >= 24) {
    rooms.push({
      id: CHAT_ROOMS.GRADUADOS,
      name: 'Estudiantes Graduados', 
      description: 'Comunidad de graduados del Bar Mitzvá',
      icon: '🎓',
      isDefault: false
    });
  }
  
  return rooms;
}; 