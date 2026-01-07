import { supabase } from '../supabase/client';

// Initial check (mocking the old behavior)
export const initializeFirestoreRules = async () => {
  return { success: true, message: 'Supabase client initialized' };
};

// Obtener mensajes de un foro específico
export const getForumMessages = (category, callback) => {
  let channel = null;

  const fetchAndSubscribe = async () => {
    try {
      // 1. Initial Fetch
      const { data: initialMessages, error } = await supabase
        .from('forum_messages')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Transform for frontend
      const formattedMessages = initialMessages.map(msg => ({
        id: msg.id,
        userId: msg.user_id,
        userName: msg.user_name,
        category: msg.category,
        content: msg.content,
        timestamp: { toDate: () => new Date(msg.created_at) }, // Mock Firebase timestamp
        createdAt: msg.created_at
      }));

      callback(formattedMessages, null);

      // 2. Subscribe to new messages
      channel = supabase
        .channel(`forum-${category}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'forum_messages', filter: `category=eq.${category}` },
          (payload) => {
            const newMsg = payload.new;
            const formattedMsg = {
              id: newMsg.id,
              userId: newMsg.user_id,
              userName: newMsg.user_name,
              category: newMsg.category,
              content: newMsg.content,
              timestamp: { toDate: () => new Date(newMsg.created_at) },
              createdAt: newMsg.created_at
            };

            // We need to re-fetch or append. 
            // Since we don't have the full state here easily without managing it, 
            // simplistic approach implies callback might need to handle "updates" or we re-fetch.
            // But usually the callback expects the FULL list.
            // So let's re-fetch for simplicity or append if we could.
            // For now, let's just trigger a re-fetch of the whole list to be safe and consistent.

            supabase
              .from('forum_messages')
              .select('*')
              .eq('category', category)
              .order('created_at', { ascending: true })
              .then(({ data }) => {
                const updatedList = data.map(msg => ({
                  id: msg.id,
                  userId: msg.user_id,
                  userName: msg.user_name,
                  category: msg.category,
                  content: msg.content,
                  timestamp: { toDate: () => new Date(msg.created_at) },
                  createdAt: msg.created_at
                }));
                callback(updatedList, null);
              });
          }
        )
        .subscribe();

    } catch (error) {
      console.error('Error in forum listener:', error);
      const localMessages = getLocalForumMessages(category);
      callback(localMessages, error);
    }
  };

  fetchAndSubscribe();

  return () => {
    if (channel) {
      supabase.removeChannel(channel);
    }
  };
};

// Enviar mensaje al foro
export const sendForumMessage = async (category, content, userId, userName) => {
  try {
    if (!content.trim()) {
      throw new Error('El mensaje no puede estar vacío');
    }

    const { data, error } = await supabase
      .from('forum_messages')
      .insert({
        category,
        content: content.trim(),
        user_id: userId,
        user_name: userName,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    console.log('Message sent with ID: ', data.id);
    return { success: true, id: data.id };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: error.message };
  }
};

// Fallback usando localStorage cuando no esté disponible
const saveMessageToLocalStorage = (category, content, userId, userName) => {
  // Implementation same as before
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

export const getLocalForumMessages = (category) => {
  try {
    const messages = JSON.parse(localStorage.getItem('forumMessages') || '[]');
    return messages.filter(msg => msg.category === category);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

export const clearLocalMessages = () => {
  localStorage.removeItem('forumMessages');
};

export const checkDatabaseConnection = async () => {
  // Check for Supabase table existence
  const { error } = await supabase.from('forum_messages').select('count', { count: 'exact', head: true });
  if (error) {
    console.warn('Database check failed:', error.message);
    return { success: false, connected: false, error: error.message };
  }
  return { success: true, connected: true };
};

export const resetFirestore = async () => {
  // No-op for Supabase
  return { success: true };
};

// Obtener estadísticas de la comunidad
export const getCommunityStats = async () => {
  try {
    const { data: messages, error } = await supabase
      .from('forum_messages')
      .select('*');

    if (error) throw error;

    const stats = {
      totalMessages: messages.length,
      totalUsers: new Set(messages.map(msg => msg.user_id)).size,
      messagesGeneralCount: messages.filter(msg => msg.category === 'general').length,
      messagesStudentsCount: messages.filter(msg => msg.category === 'estudiantes').length,
      messagesAnnouncementsCount: messages.filter(msg => msg.category === 'anuncios').length,
      recentActivity: messages
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
        .map(msg => ({
          id: msg.id,
          userName: msg.user_name,
          category: msg.category,
          content: msg.content,
          timestamp: { toDate: () => new Date(msg.created_at) },
          createdAt: msg.created_at
        }))
    };

    // No live subscription in this simplified return, 
    // but the original returning a promise that resolves with an unsubscribe? 
    // We can simplify to just return data for now, or mock the structure.
    return { success: true, data: stats, unsubscribe: () => { } };

  } catch (error) {
    console.error('Error getting community stats:', error);
    // Fallback logic
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
      unsubscribe: () => { }
    };
  }
};

export const getActiveUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('forum_messages')
      .select('user_id, user_name, created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    const uniqueUsers = [...new Map(
      data.map(msg => [msg.user_id, {
        userId: msg.user_id,
        userName: msg.user_name,
        lastActive: new Date(msg.created_at)
      }])
    ).values()];

    return { success: true, data: uniqueUsers.slice(0, 10), unsubscribe: () => { } };
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
  checkDatabaseConnection,
  getCommunityStats,
  getActiveUsers
};