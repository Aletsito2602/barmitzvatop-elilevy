import { createUserProfile, logActivity } from '../services/userService';
import { initializeCommunityData } from '../services/communityService';

export const initializeUserWithSampleData = async (user) => {
  try {
    console.log('Initializing user with sample data...');
    
    // Create user profile with sample data
    const userData = {
      name: user.displayName || 'Estudiante',
      email: user.email,
      birthDate: '2010-03-15', // Sample birth date for parasha calculation
      studyPlan: 'alef',
      profileImage: user.photoURL,
      preferences: {
        language: 'es',
        notifications: true,
        timezone: 'America/Panama'
      }
    };

    const profileResult = await createUserProfile(user.uid, userData);
    
    if (profileResult.success) {
      // Log initial activities
      const sampleActivities = [
        {
          type: 'user_joined',
          description: 'Se unió a la plataforma',
          content: 'Bienvenido a BarmitzvaTop'
        },
        {
          type: 'lesson_started',
          description: 'Comenzó su primera lección',
          content: 'Lección 1: Introducción al Hebreo'
        },
        {
          type: 'progress_updated',
          description: 'Actualizó su progreso',
          content: 'Progreso inicial registrado'
        }
      ];

      for (const activity of sampleActivities) {
        await logActivity(user.uid, activity);
      }

      console.log('User initialized successfully with sample data');
      return { success: true };
    }

    return profileResult;
  } catch (error) {
    console.error('Error initializing user:', error);
    return { success: false, error: error.message };
  }
};

export const initializeCommunityDataIfNeeded = async () => {
  try {
    console.log('Checking if community data needs initialization...');
    const result = await initializeCommunityData();
    console.log('Community data initialization result:', result);
    return result;
  } catch (error) {
    console.error('Error initializing community data:', error);
    return { success: false, error: error.message };
  }
};