import { useState, useEffect, useCallback } from 'react';
import { subscribeToChatRoom, sendMessage, getChatRoomInfo } from '../services/chatService';

export const useChatRoom = (roomId, user) => {
  const [messages, setMessages] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!roomId) return;

    setLoading(true);
    let unsubscribe = () => {};

    const fetchRoomData = async () => {
      try {
        // Fetch room info
        const infoResult = await getChatRoomInfo(roomId);
        if (infoResult.success) {
          setRoomInfo(infoResult.data);
        } else {
          throw new Error(infoResult.error || 'Could not fetch room info');
        }

        // Subscribe to messages
        unsubscribe = subscribeToChatRoom(roomId, (newMessages) => {
          setMessages(newMessages);
          setLoading(false);
        });

      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRoomData();

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [roomId]);

  const postMessage = useCallback(async (messageText) => {
    if (!user || !user.uid || !messageText.trim()) {
      return { success: false, error: 'User not authenticated or message is empty' };
    }

    const result = await sendMessage(roomId, user.uid, messageText);
    return result;
  }, [roomId, user]);

  return {
    messages,
    roomInfo,
    loading,
    error,
    postMessage
  };
}; 