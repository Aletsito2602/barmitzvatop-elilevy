import { supabase } from '../supabase/client';

// Chat Room Types
export const CHAT_ROOMS = {
  NUEVOS: 'estudiantes_nuevos',
  GRADUADOS: 'estudiantes_graduados'
};

// Send message to chat room
export const sendMessage = async (roomId, userId, message) => {
  try {
    // Get user info from profiles using Supabase join later if needed, 
    // but here we just need to insert. 
    // Best practice: don't store redundant user info if possible, referencing userId is enough.
    // But for simplicity and frontend compatibility, we might fetch it or just rely on backend join.
    // The current frontend expects 'userName' and 'userImage' in the message data possibly?
    // Let's check the previous code... it fetched user info and stored it.
    // We can do the same.

    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('full_name, avatar_url, email')
      .eq('id', userId)
      .single();

    const userName = userData ? (userData.full_name || userData.email) : 'Usuario Anónimo';
    const userImage = userData?.avatar_url || null;

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        room_id: roomId,
        user_id: userId,
        user_name: userName,
        user_image: userImage,
        message: message.trim(),
        is_active: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: error.message };
  }
};

// Subscribe to chat room messages
export const subscribeToChatRoom = (roomId, callback, limitCount = 50) => {
  let channel = null;

  const fetchAndSubscribe = async () => {
    try {
      // 1. Initial Fetch
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false })
        .limit(limitCount);

      if (error) throw error;

      // Format for frontend
      const formatMsg = (msg) => ({
        id: msg.id,
        userId: msg.user_id,
        userName: msg.user_name,
        userImage: msg.user_image,
        message: msg.message,
        timestamp: { toDate: () => new Date(msg.created_at) }, // Mock
        isActive: msg.is_active
      });

      // Front end expects reverse chronological (oldest top? or newest bottom?)
      // Original code said: "Reverse to show newest at bottom"
      const initialMessages = data.map(formatMsg).reverse();
      callback(initialMessages);

      // 2. Subscribe
      channel = supabase
        .channel(`chat-${roomId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${roomId}` },
          (payload) => {
            // On new message, we could append.
            // But strictly respecting the callback pattern of "full list" or "update"
            // Easier to just fetch again or append safely.
            // Assuming callback can handle list update.
            // Or better, just append the new message if the callback is set state.
            // But original code returned the FULL list every snapshot. 
            // So let's re-fetch for consistency? Or append.
            // If we re-fetch we use valid limit.

            supabase
              .from('chat_messages')
              .select('*')
              .eq('room_id', roomId)
              .order('created_at', { ascending: false })
              .limit(limitCount)
              .then(({ data: newData }) => {
                const newMessages = newData.map(formatMsg).reverse();
                callback(newMessages);
              });
          }
        )
        .subscribe();

    } catch (error) {
      console.error('Error in chat listener:', error);
    }
  };

  fetchAndSubscribe();

  // Return unsubscribe function
  return () => {
    if (channel) {
      supabase.removeChannel(channel);
    }
  };
};

// Get chat room info and stats
export const getChatRoomInfo = async (roomId) => {
  try {
    // Current implementation is static mainly
    const roomNames = {
      [CHAT_ROOMS.NUEVOS]: 'Estudiantes Nuevos',
      [CHAT_ROOMS.GRADUADOS]: 'Estudiantes Graduados'
    };

    const roomDescriptions = {
      [CHAT_ROOMS.NUEVOS]: 'Espacio para estudiantes que están comenzando su preparación',
      [CHAT_ROOMS.GRADUADOS]: 'Comunidad de estudiantes que ya completaron su Barmitzva'
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
  // Check if user has completed Barmitzva (or check stats directly from Supabase if profile lacks it)
  // Assuming userProfile object has necessary info
  if (userProfile?.barmitzvaCompleted === true) {
    return CHAT_ROOMS.GRADUADOS;
  }

  if (userProfile?.progress?.lessonsCompleted >= 24) {
    return CHAT_ROOMS.GRADUADOS;
  }

  return CHAT_ROOMS.NUEVOS;
};

// Get available chat rooms for a user
export const getAvailableChatRooms = (userProfile) => {
  const rooms = [];

  rooms.push({
    id: CHAT_ROOMS.NUEVOS,
    name: 'Estudiantes Nuevos',
    description: 'Espacio para estudiantes que están comenzando',
    icon: '📚',
    isDefault: true
  });

  if (userProfile?.barmitzvaCompleted === true || userProfile?.progress?.lessonsCompleted >= 24) {
    rooms.push({
      id: CHAT_ROOMS.GRADUADOS,
      name: 'Estudiantes Graduados',
      description: 'Comunidad de graduados del Barmitzva',
      icon: '🎓',
      isDefault: false
    });
  }

  return rooms;
};