import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getUserProfile, getUserProgress, getUserActivities, calculatePersonalParasha } from '../services/userService';

export const useUser = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [userActivities, setUserActivities] = useState([]);
  const [personalParasha, setPersonalParasha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log('🔍 useUser: fetchUserData called with user:', user);
      
      if (!user?.uid) {
        console.log('❌ useUser: No user UID found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('📥 useUser: Fetching data for UID:', user.uid);
        
        // Fetch user profile
        const profileResult = await getUserProfile(user.uid);
        console.log('👤 useUser: Profile result:', profileResult);
        if (profileResult.success) {
          setUserProfile(profileResult.data);
          console.log('✅ useUser: Profile set:', profileResult.data);
          
          // Calculate personal parasha if birth date exists
          if (profileResult.data.birthDate) {
            const parasha = calculatePersonalParasha(profileResult.data.birthDate);
            setPersonalParasha(parasha);
          }
        } else {
          console.log('❌ useUser: Profile fetch failed:', profileResult.error);
        }

        // Fetch user progress
        const progressResult = await getUserProgress(user.uid);
        console.log('📊 useUser: Progress result:', progressResult);
        if (progressResult.success) {
          setUserProgress(progressResult.data);
          console.log('✅ useUser: Progress set:', progressResult.data);
        } else {
          console.log('❌ useUser: Progress fetch failed:', progressResult.error);
        }

        // Fetch user activities
        const activitiesResult = await getUserActivities(user.uid, 5);
        console.log('📋 useUser: Activities result:', activitiesResult);
        if (activitiesResult.success) {
          setUserActivities(activitiesResult.data);
        }

      } catch (err) {
        console.error('💥 useUser: Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const refreshUserData = async () => {
    if (user?.uid) {
      const profileResult = await getUserProfile(user.uid);
      if (profileResult.success) {
        setUserProfile(profileResult.data);
      }
      
      const progressResult = await getUserProgress(user.uid);
      if (progressResult.success) {
        setUserProgress(progressResult.data);
      }
    }
  };

  return {
    userProfile,
    userProgress,
    userActivities,
    personalParasha,
    loading,
    error,
    refreshUserData,
    refreshUser: refreshUserData
  };
};